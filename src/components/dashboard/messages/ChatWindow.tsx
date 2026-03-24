"use client";

import { useSocket } from "@/app/Providers";
import { Attachment, Message as MessageType } from "@/generated/prisma/browser";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ConversationWithMessagesAndUsers } from "./ConversationList";
import Message from "./Message";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, RefreshCw, ArrowDown } from "lucide-react";

interface LocalMessageType extends MessageType {
  optimisticId?: string;
  status?: "pending" | "sent" | "seen";
  attachments?: Attachment[];
}

interface ChatWindowProps {
  conversation: ConversationWithMessagesAndUsers;
  onlineUsers: string[];
  onBack?: () => void;
  isMobile?: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  onlineUsers,
  onBack,
  isMobile = false,
}) => {
  const [messages, setMessages] = useState<LocalMessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const socketContext = useSocket();
  const socket = socketContext?.socket;

  // Scroll to bottom function
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Check if user is at bottom of messages
  const checkIsAtBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    return distanceFromBottom <= 100; // 100px threshold
  }, []);

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    setScrollPosition(scrollTop);
    setIsAtBottom(checkIsAtBottom());

    // Load more messages when near top
    if (scrollTop < 100 && hasMoreMessages && !loadingMore) {
      loadMoreMessages();
    }
  }, [hasMoreMessages, loadingMore, checkIsAtBottom]);

  // Load more messages for infinite scroll
  const loadMoreMessages = useCallback(async () => {
    if (!socket || loadingMore || !hasMoreMessages) return;

    setLoadingMore(true);
    const oldestMessage = messages[0];

    socket.emit("getMoreMessages", {
      conversationId: conversation.id,
      before: oldestMessage?.createdAt,
    });

    socket.once("moreMessages", (newMessages: MessageType[]) => {
      if (newMessages.length === 0) {
        setHasMoreMessages(false);
      } else {
        setMessages((prev) => {
          const combined = [
            ...newMessages.map((msg) => ({ ...msg, status: "sent" as const })),
            ...prev,
          ];
          // Remove duplicates
          return combined.filter(
            (msg, index, self) =>
              index ===
              self.findIndex(
                (m) =>
                  (m.id && m.id === msg.id) ||
                  (m.optimisticId && m.optimisticId === msg.optimisticId)
              )
          );
        });
      }
      setLoadingMore(false);
    });

    socket.once("moreMessagesError", () => {
      setLoadingMore(false);
    });
  }, [socket, conversation.id, messages, loadingMore, hasMoreMessages]);

  // Main socket effects
  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    // Reset states when conversation changes
    setMessages([]);
    setLoading(true);
    setHasMoreMessages(true);
    setTypingUsers(new Set());

    // Join the conversation room
    socket.emit("joinConversation", conversation.id);

    // Fetch initial messages
    socket.emit("getMessages", conversation.id);

    socket.on("messages", (fetchedMessages: MessageType[]) => {
      setMessages((prevMessages) => {
        const messagesMap = new Map<string, LocalMessageType>();
        prevMessages.forEach((msg) => {
          if (msg.id) messagesMap.set(msg.id, msg);
          if (msg.optimisticId) messagesMap.set(msg.optimisticId, msg);
        });

        fetchedMessages.forEach((fetchedMsg) => {
          const fetchedLocalMsg: LocalMessageType = {
            ...fetchedMsg,
            status: "sent",
          };

          const matchingOptimistic = prevMessages.find(
            (prevMsg) =>
              prevMsg.status === "pending" &&
              prevMsg.senderId === fetchedMsg.senderId &&
              prevMsg.content === fetchedMsg.content
          );

          if (matchingOptimistic && matchingOptimistic.optimisticId) {
            messagesMap.set(matchingOptimistic.optimisticId, {
              ...fetchedLocalMsg,
              optimisticId: matchingOptimistic.optimisticId,
            });
          } else {
            messagesMap.set(fetchedMsg.id, fetchedLocalMsg);
          }
        });

        const finalMessages = Array.from(messagesMap.values()).filter((msg) => {
          if (msg.status !== "pending") return true;
          return !fetchedMessages.some(
            (fetchedMsg) => fetchedMsg.id === msg.id
          );
        });

        return finalMessages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      setLoading(false);

      // Small delay to ensure DOM is updated before scrolling
      setTimeout(() => scrollToBottom("auto"), 100);
    });

    socket.on("receiveMessage", (message: MessageType) => {
      if (message.senderId === session?.user?.id) {
        return;
      }

      setMessages((prevMessages) => {
        if (prevMessages.some((m) => m.id === message.id)) {
          return prevMessages;
        }
        const newMessages = [...prevMessages, { ...message, status: "sent" }];

        // Auto-scroll if user is near bottom
        if (isAtBottom) {
          setTimeout(() => scrollToBottom("smooth"), 100);
        }

        return newMessages;
      });
    });

    socket.on("messageSent", (confirmedMessage: LocalMessageType) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.optimisticId === confirmedMessage.tempId
            ? {
                ...confirmedMessage,
                status: "sent",
                optimisticId: msg.optimisticId,
              }
            : msg
        )
      );

      // Auto-scroll after message is sent
      if (isAtBottom) {
        setTimeout(() => scrollToBottom("smooth"), 100);
      }
    });

    // Typing indicators
    socket.on("typing", ({ userId: typingUserId }) => {
      if (typingUserId !== session?.user?.id) {
        setTypingUsers((prev) => new Set(prev).add(typingUserId));
      }
    });

    socket.on("stopTyping", ({ userId: typingUserId }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(typingUserId);
        return newSet;
      });
    });

    return () => {
      socket.off("messages");
      socket.off("receiveMessage");
      socket.off("messageSent");
      socket.off("typing");
      socket.off("stopTyping");
      socket.emit("leaveConversation", conversation.id);
    };
  }, [socket, conversation.id, session?.user?.id, scrollToBottom, isAtBottom]);

  // Mark messages as seen
  useEffect(() => {
    if (socket && conversation.id && session?.user?.id) {
      socket.emit("messageSeen", {
        conversationId: conversation.id,
        userId: session.user.id,
      });
    }
  }, [socket, conversation.id, session?.user?.id, messages]);

  // Scroll to bottom on initial load and new messages
  useEffect(() => {
    if (!loading && messages.length > 0) {
      scrollToBottom("auto");
    }
  }, [loading, messages.length, scrollToBottom]);

  const handleSendMessage = (message: LocalMessageType) => {
    setMessages((prevMessages) => [...prevMessages, message]);

    // Auto-scroll after sending message
    if (isAtBottom) {
      setTimeout(() => scrollToBottom("smooth"), 100);
    }
  };

  // Scroll to bottom button handler
  const handleScrollToBottom = () => {
    scrollToBottom("smooth");
  };

  // Retry loading messages
  const handleRetryLoad = () => {
    if (!socket) return;

    setLoading(true);
    socket.emit("getMessages", conversation.id);
  };

  return (
    <div className="h-full flex flex-col bg-card relative">
      {/* Enhanced Chat Header with Mobile Back Button */}
      <div className="border-b border-cb-border bg-card/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="flex items-center p-3 sm:p-4">
          {isMobile && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 sm:mr-3 flex-shrink-0 p-2 hover:bg-surface rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="flex-1 min-w-0">
            <ChatHeader
              conversation={conversation}
              onlineUsers={onlineUsers}
              isMobile={isMobile}
            />
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 bg-ink/50 relative scroll-smooth"
        onScroll={handleScroll}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(var(--muted) 1px, transparent 1px)', backgroundSize: '24px 24px', backgroundAttachment: 'local' }}>
        </div>

        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin"></div>
            <p className="text-cream-dim text-sm font-medium animate-pulse">
              Loading messages...
            </p>
          </div>
        ) : messages.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full text-center p-6 relative z-10">
            <div className="w-20 h-20 bg-card rounded-3xl shadow-lg flex items-center justify-center mb-6 ring-1 ring-cb-border rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-4xl">✨</span>
            </div>
            <h3 className="text-xl font-bold text-cream mb-2">
              No messages yet
            </h3>
            <p className="text-cream-dim text-sm max-w-xs leading-relaxed">
              This is the start of a new conversation. Send a message to get things rolling!
            </p>
          </div>
        ) : (
          // Messages List
          <div className="space-y-6 sm:space-y-8 relative z-10 pb-4">
            {/* Load More Indicator */}
            {loadingMore && (
              <div className="flex justify-center py-4">
                <div className="bg-card px-4 py-1.5 rounded-full shadow-sm border border-cb-border flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-gold animate-spin" />
                  <span className="text-xs font-medium text-cream-dim">Loading older messages...</span>
                </div>
              </div>
            )}

            {/* Messages */}
            <AnimatePresence initial={false}>
              {messages.map((message, index) => {
                // Check if previous message was from same sender to group them visually
                const isSequence = index > 0 && messages[index - 1].senderId === message.senderId;
                const showAvatar = !isSequence || message.senderId !== session?.user?.id;
                
                return (
                  <motion.div
                    key={message.optimisticId || message.id}
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut"
                    }}
                    className={`${
                      message.senderId === session?.user?.id
                        ? "pr-1 sm:pr-2"
                        : "pl-1 sm:pl-2"
                    } ${isSequence ? "mt-1" : "mt-4"}`}
                  >
                    <Message
                      message={{ ...message, status: message.status || "sent" }}
                      isOwnMessage={message.senderId === session?.user?.id}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Scroll anchor */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}

        {/* Error State */}
        {!loading && messages.length === 0 && socket && (
          <div className="flex flex-col items-center justify-center h-full space-y-4 relative z-10">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center ring-1 ring-destructive/30">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-cream-dim text-sm font-medium">
              Failed to load messages
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryLoad}
              className="flex items-center gap-2 hover:bg-surface"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      <AnimatePresence>
        {!isAtBottom && !loading && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute bottom-24 right-6 z-30"
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={handleScrollToBottom}
              className="rounded-full h-10 w-10 shadow-lg bg-card border border-cb-border text-gold hover:bg-surface transition-all hover:scale-110"
            >
              <ArrowDown className="w-5 h-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Typing Indicator */}
      <AnimatePresence>
        {typingUsers.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-[80px] left-4 z-20"
          >
            <div className="px-4 py-2 bg-card/90 backdrop-blur-sm border border-cb-border rounded-full shadow-lg flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDuration: '0.6s' }}></div>
                <div
                  className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s", animationDuration: '0.6s' }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s", animationDuration: '0.6s' }}
                ></div>
              </div>
              <p className="text-xs font-medium text-cream-dim">
                {Array.from(typingUsers)
                  .map((userId) => {
                    const typingUser = conversation.users.find(
                      (user) => user.id === userId
                    );
                    return typingUser
                      ? typingUser.name || typingUser.email
                      : "Someone";
                  })
                  .slice(0, 2)
                  .join(", ")}
                {typingUsers.size > 2 ? ` and ${typingUsers.size - 2} others` : ""} is typing...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input */}
      <div className="border-t border-cb-border bg-card p-4 relative z-20 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <MessageInput
          conversationId={conversation.id}
          onSendMessage={handleSendMessage}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
