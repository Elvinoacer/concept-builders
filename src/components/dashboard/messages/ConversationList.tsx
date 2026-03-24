"use client";

import { useSocket } from "@/app/Providers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Conversation, Message, User } from "@/generated/prisma/browser";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NewConversationModal from "./NewConversationModal";

export interface ConversationWithMessagesAndUsers extends Conversation {
  messages: Message[];
  users: User[];
}

interface ConversationListProps {
  onSelectConversation: (
    conversation: ConversationWithMessagesAndUsers
  ) => void;
  onlineUsers: string[];
  selectedConversation?: ConversationWithMessagesAndUsers | null;
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  onlineUsers,
  selectedConversation,
}) => {
  const [conversations, setConversations] = useState<
    ConversationWithMessagesAndUsers[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const socketContext = useSocket();
  const socket = socketContext?.socket;

  const filteredConversations = conversations.filter((conversation) => {
    if (!searchQuery.trim()) return true;

    const otherUser = conversation.users?.find(
      (user) => user.email !== session?.user?.email
    );

    return (
      otherUser?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.messages[0]?.content
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    socket.emit("getConversations", session.user.id);

    socket.on(
      "conversations",
      (fetchedConversations: ConversationWithMessagesAndUsers[]) => {
        setConversations(fetchedConversations);
        setLoading(false);
      }
    );

    socket.on(
      "newConversation",
      (newConversation: ConversationWithMessagesAndUsers) => {
        setConversations((prev) => [newConversation, ...prev]);
      }
    );

    socket.on("messageReceived", (message: Message) => {
      setConversations((prev) => {
        let conversationFound = false;
        const updatedConversations = prev.map((conv) => {
          if (conv.id === message.conversationId) {
            conversationFound = true;
            const currentMessages = Array.isArray(conv.messages)
              ? conv.messages
              : [];
            return { ...conv, messages: [...currentMessages, message] };
          }
          return conv;
        });

        if (!conversationFound) {
          console.warn(
            "Received message for unknown conversation:",
            message.conversationId
          );
          return updatedConversations;
        }

        const conversationToMove = updatedConversations.find(
          (conv) => conv.id === message.conversationId
        );
        if (conversationToMove) {
          return [
            conversationToMove,
            ...updatedConversations.filter(
              (conv) => conv.id !== message.conversationId
            ),
          ];
        }
        return updatedConversations;
      });
    });

    return () => {
      socket.off("conversations");
      socket.off("newConversation");
      socket.off("messageReceived");
    };
  }, [socket, session?.user?.id]);

  useEffect(() => {
    if (selectedConversation) {
      setConversations((prev) => {
        const existingIndex = prev.findIndex(
          (conv) => conv.id === selectedConversation.id
        );

        if (existingIndex !== -1) {
          const updated = [...prev];
          const [movedConversation] = updated.splice(existingIndex, 1);
          return [movedConversation, ...updated];
        }
        return prev;
      });
    }
  }, [selectedConversation]);

  const handleConversationCreated = (
    newConversation: ConversationWithMessagesAndUsers
  ) => {
    setConversations((prev) => [newConversation, ...prev]);
    onSelectConversation(newConversation);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getLastMessagePreview = (
    conversation: ConversationWithMessagesAndUsers
  ) => {
    if (!conversation.messages || conversation.messages.length === 0) {
      return "No messages yet";
    }
    const lastMessage = conversation.messages[0];
    if (!lastMessage?.content) return "No messages yet";

    return lastMessage.content.length > 60
      ? lastMessage.content.substring(0, 60) + "..."
      : lastMessage.content;
  };

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-4 border-b border-cb-border flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-cream">
            Messages
          </h2>
          <NewConversationModal
            onConversationCreated={handleConversationCreated}
          />
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-muted text-lg">
              search
            </span>
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface border border-cb-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent text-cream placeholder-muted"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-cream-dim text-sm">
              Loading conversations...
            </p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-muted text-2xl">
                chat
              </span>
            </div>
            <p className="text-cream-dim text-lg font-medium mb-2">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
            <p className="text-muted text-sm max-w-xs">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start a new conversation to begin messaging"}
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto h-full styled-scrollbar">
            <AnimatePresence>
              {filteredConversations.map((conversation, index) => {
                const otherUser = conversation.users?.find(
                  (user) => user.email !== session?.user?.email
                );

                return (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    onClick={() => onSelectConversation(conversation)}
                    className={`p-3 border-b border-cb-border hover:bg-surface cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? "bg-gold/10 border-l-4 border-l-gold"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar with Online Status */}
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-12 h-12 sm:w-14 sm:h-14">
                          <Image
                            src={
                              otherUser?.image || "/images/default-avatar.png"
                            }
                            alt={otherUser?.name || "User Avatar"}
                            fill
                            className="rounded-full object-cover"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                            sizes="(max-width: 640px) 48px, 56px"
                          />
                          <AvatarFallback className="text-sm font-medium bg-gold text-ink">
                            {otherUser?.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {otherUser && onlineUsers.includes(otherUser.id) && (
                          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 border-2 border-card"></span>
                        )}
                      </div>

                      {/* Conversation Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-semibold text-cream text-sm sm:text-base truncate">
                            {otherUser?.name || "Unknown User"}
                          </h3>
                          {conversation.messages && conversation.messages[0]?.createdAt && (
                            <p className="text-xs text-cream-dim flex-shrink-0 whitespace-nowrap">
                              {formatTime(conversation.messages[0].createdAt)}
                            </p>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-cream-dim truncate leading-tight">
                          {getLastMessagePreview(conversation)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
