"use client";

import { useSocket } from "@/app/Providers";
import { Attachment, Message as MessageType } from "@/generated/prisma";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { ConversationWithMessagesAndUsers } from "./ConversationList";
import Message from "./Message";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, RefreshCw } from "lucide-react";

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
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Enhanced Chat Header with Mobile Back Button */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <div className="flex items-center p-3 sm:p-4">
          {isMobile && onBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 sm:mr-3 flex-shrink-0 p-2"
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
        className="flex-1 overflow-y-auto p-3 sm:p-4 bg-gray-50 dark:bg-gray-900/30"
        onScroll={handleScroll}
      >
        {loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Loading messages...
            </p>
          </div>
        ) : messages.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No messages yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
              Start the conversation by sending the first message.
            </p>
          </div>
        ) : (
          // Messages List
          <div className="space-y-3 sm:space-y-4">
            {/* Load More Indicator */}
            {loadingMore && (
              <div className="flex justify-center py-2">
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              </div>
            )}

            {/* Messages */}
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.optimisticId || message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: Math.min(index * 0.03, 0.5),
                  }}
                  className={`${
                    message.senderId === session?.user?.id
                      ? "pr-2 sm:pr-4"
                      : "pl-2 sm:pl-4"
                  }`}
                >
                  <Message
                    message={{ ...message, status: message.status || "sent" }}
                    isOwnMessage={message.senderId === session?.user?.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Error State */}
        {!loading && messages.length === 0 && socket && (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Failed to load messages
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryLoad}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Scroll to Bottom Button */}
      {!isAtBottom && !loading && messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={handleScrollToBottom}
            className="rounded-full shadow-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
          >
            <span className="text-xs">↓</span>
          </Button>
        </motion.div>
      )}

      {/* Typing Indicator */}
      {typingUsers.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800"
        >
          <div className="flex items-center gap-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              {Array.from(typingUsers)
                .map((userId) => {
                  const typingUser = conversation.users.find(
                    (user) => user.id === userId
                  );
                  return typingUser
                    ? `${typingUser.name || typingUser.email} is typing...`
                    : "";
                })
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>
        </motion.div>
      )}

      {/* Message Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4">
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
