"use client";

import React, { useState, useEffect } from "react";
import { Conversation } from "@/generated/prisma";
import ChatWindow from "@/components/dashboard/messages/ChatWindow";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import NewClientConversationModal from "@/components/admin/messages/NewClientConversationModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocket } from "@/app/Providers";

const AdminMessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const { data: session } = useSession();

  const socketContext = useSocket();
  const socket = socketContext?.socket;
  const onlineUsers = socketContext?.onlineUsers || [];

  useEffect(() => {
    if (!socket || session?.user?.role !== "ADMIN") return;

    socket.emit("join", session.user.id); // Admin joins their own room

    socket.emit("getAdminConversations", { searchTerm, filter });

    socket.on("adminConversations", (fetchedConversations: Conversation[]) => {
      setConversations(fetchedConversations);
      setLoading(false);
    });

    socket.on("newConversation", (newConversation: Conversation) => {
      setConversations((prev) => [newConversation, ...prev]);
    });

    socket.on("messageReceived", (message: any) => {
      setConversations((prev) => {
        const updatedConversations = prev.map((conv) => {
          if (conv.id === message.conversationId) {
            return { ...conv, messages: [message] };
          }
          return conv;
        });
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
      socket.off("adminConversations");
      socket.off("newConversation");
      socket.off("messageReceived");
    };
  }, [socket, session, searchTerm, filter]);

  const handleConversationCreated = (newConversation: any) => {
    setConversations((prev) => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
  };

  if (session?.user?.role !== "ADMIN") {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Conversations</h2>
            <NewClientConversationModal
              onConversationCreated={handleConversationCreated}
              existingConversations={conversations}
              onSelectExistingConversation={setSelectedConversation}
            />
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded-full ${filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1 text-sm rounded-full ${filter === "unread" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              Unread
            </button>
          </div>
        </div>
        <div className="flex-1">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <div className="overflow-y-auto h-full">
              {conversations.map((conversation) => {
                const otherParticipants = conversation.users.filter(
                  (user) => user.email !== session?.user?.email
                );

                let conversationDisplayName = "";
                if (otherParticipants.length === 1) {
                  conversationDisplayName = otherParticipants[0].name || otherParticipants[0].email;
                } else if (otherParticipants.length > 1) {
                  conversationDisplayName = otherParticipants.map(p => p.name || p.email).join(", ");
                } else {
                  conversationDisplayName = "Self Chat"; // Should not happen in a typical conversation list
                }

                const displayAvatarUser = otherParticipants[0] || session?.user; // Use the first other participant for avatar, or current user if self-chat

                return (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar className="w-12 h-12 mr-4">
                          <AvatarImage
                            src={
                              displayAvatarUser?.image || "/images/default-avatar.png"
                            }
                          />
                          <AvatarFallback>
                            {displayAvatarUser?.name?.charAt(0)}
                          </AvatarFallback>
                          {displayAvatarUser && onlineUsers.includes(displayAvatarUser.id) && (
                            <span className="absolute inset-y-0 inset-x-0 flex items-end justify-end z-20">
                              <span className="block h-4 w-4 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800" />
                            </span>
                          )}
                        </Avatar>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">{conversationDisplayName}</h3>
                          </div>
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} onlineUsers={onlineUsers} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">
              Select a conversation to view messages
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;