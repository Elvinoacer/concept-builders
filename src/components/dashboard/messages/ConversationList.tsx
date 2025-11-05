"use client";

import { useSocket } from "@/app/Providers"; // Import the useSocket hook
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Conversation, Message, User } from "@/generated/prisma";
import Image from "next/image";

interface ConversationWithMessagesAndUsers extends Conversation {
  messages: Message[];
  users: User[];
}
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import NewConversationModal from "./NewConversationModal";

interface ConversationListProps {
  onSelectConversation: (conversation: ConversationWithMessagesAndUsers) => void;
  onlineUsers: string[];
  selectedConversation?: ConversationWithMessagesAndUsers | null; // New prop
}

const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  onlineUsers,
  selectedConversation, // Destructure the new prop
}) => {
  const [conversations, setConversations] = useState<ConversationWithMessagesAndUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const socketContext = useSocket(); // Get the socket context
  const socket = socketContext?.socket;

  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    socket.emit("getConversations", session.user.id);

    socket.on("conversations", (fetchedConversations: ConversationWithMessagesAndUsers[]) => {
      setConversations(fetchedConversations);
      setLoading(false);
    });

    socket.on("newConversation", (newConversation: ConversationWithMessagesAndUsers) => {
      setConversations((prev) => [newConversation, ...prev]);
    });

    socket.on("messageReceived", (message: Message) => {
      setConversations((prev) => {
        let conversationFound = false;
        const updatedConversations = prev.map((conv) => {
          if (conv.id === message.conversationId) {
            conversationFound = true;
            // Append the new message to the existing messages array
            // Ensure messages is an array, even if it was previously just [latestMessage]
            const currentMessages = Array.isArray(conv.messages) ? conv.messages : [];
            return { ...conv, messages: [...currentMessages, message] };
          }
          return conv;
        });

        // If the conversation was not found (e.g., new conversation for this user)
        // This case should ideally be handled by "newConversation" event, but as a fallback
        if (!conversationFound) {
          // You might want to fetch the full conversation here or handle it differently
          // For now, we'll just add a placeholder or ignore if not found
          console.warn("Received message for unknown conversation:", message.conversationId);
          return updatedConversations;
        }

        // Bring the updated conversation to the top
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

  const handleConversationCreated = (newConversation: ConversationWithMessagesAndUsers) => {
    setConversations((prev) => [newConversation, ...prev]);
    onSelectConversation(newConversation);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Messages</h2>
        <NewConversationModal
          onConversationCreated={handleConversationCreated}
        />
      </div>
      <div className="flex-1">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <div className="overflow-y-auto h-full">
            {conversations.map((conversation, index) => {
              const otherUser = conversation.users.find(
                (user) => user.email !== session?.user?.email
              );

              return (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => onSelectConversation(conversation)}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${selectedConversation?.id === conversation.id ? 'bg-blue-100 dark:bg-blue-900' : ''}`}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <Avatar className="w-12 h-12 mr-4">
                        <Image
                          src={otherUser?.image || "/images/default-avatar.png"}
                          alt={otherUser?.name || "User Avatar"}
                          fill
                          className="rounded-full object-cover"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                        />
                        <AvatarFallback>
                          {otherUser?.name?.charAt(0)}
                        </AvatarFallback>
                        {otherUser && onlineUsers.includes(otherUser.id) && (
                          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 border-2 border-white dark:border-gray-800"></span>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{otherUser?.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(
                            conversation.messages[0]?.createdAt
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {conversation.messages[0]?.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
