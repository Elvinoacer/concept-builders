"use client";

import { useSocket } from "@/app/Providers";
import NewClientConversationModal from "@/components/admin/messages/NewClientConversationModal";
import ChatWindow from "@/components/dashboard/messages/ChatWindow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Conversation } from "@/generated/prisma";
import {
  ChevronLeft,
  Filter,
  Menu,
  MessageCircle,
  Search,
  Users
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const AdminMessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const { data: session } = useSession();

  const socketContext = useSocket();
  const socket = socketContext?.socket;
  const onlineUsers = socketContext?.onlineUsers || [];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-show conversation list on mobile when no conversation is selected
  useEffect(() => {
    if (isMobile && !selectedConversation) {
      setShowConversationList(true);
    }
  }, [isMobile, selectedConversation]);

  useEffect(() => {
    if (!socket || session?.user?.role !== "ADMIN") return;

    socket.emit("join", session.user.id);

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
    if (isMobile) {
      setShowConversationList(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowConversationList(false);
    }
  };

  const handleBackToConversations = () => {
    setSelectedConversation(null);
    if (isMobile) {
      setShowConversationList(true);
    }
  };

  const toggleConversationList = () => {
    setShowConversationList(!showConversationList);
  };

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚫</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            {showConversationList || !selectedConversation ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Messages
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {conversations.length} conversations
                    </p>
                  </div>
                </div>
                <NewClientConversationModal
                  onConversationCreated={handleConversationCreated}
                  existingConversations={conversations}
                  onSelectExistingConversation={handleSelectConversation}
                />
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToConversations}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleConversationList}
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Search and Filter - Only show when viewing conversation list */}
          {(showConversationList || !selectedConversation) && (
            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  <Filter className="w-3 h-3 inline mr-1" />
                  Filter:
                </span>
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                    filter === "all"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors ${
                    filter === "unread"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Unread
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {showConversationList || !selectedConversation ? (
            /* Conversation List */
            <div className="h-full bg-white dark:bg-gray-800 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Loading conversations...
                  </p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No conversations yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Start a new conversation to begin messaging.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {conversations.map((conversation) => {
                    const otherParticipants = conversation.users.filter(
                      (user) => user.email !== session?.user?.email
                    );

                    let conversationDisplayName = "";
                    if (otherParticipants.length === 1) {
                      conversationDisplayName =
                        otherParticipants[0].name || otherParticipants[0].email;
                    } else if (otherParticipants.length > 1) {
                      conversationDisplayName = otherParticipants
                        .map((p) => p.name || p.email)
                        .join(", ");
                    } else {
                      conversationDisplayName = "Self Chat";
                    }

                    const displayAvatarUser =
                      otherParticipants[0] || session?.user;
                    const lastMessage = conversation.messages[0];
                    const isOnline =
                      displayAvatarUser &&
                      session?.user &&
                      onlineUsers.includes(displayAvatarUser.id);

                    return (
                      <div
                        key={conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={
                                  displayAvatarUser?.image ||
                                  "/images/default-avatar.png"
                                }
                              />
                              <AvatarFallback className="text-sm">
                                {displayAvatarUser?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            {isOnline && (
                              <span className="absolute -bottom-1 -right-1">
                                <span className="block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                {conversationDisplayName}
                              </h3>
                              {lastMessage && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                  {new Date(
                                    lastMessage.createdAt
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {lastMessage?.content || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Chat Window */
            <div className="h-full bg-white dark:bg-gray-800">
              <ChatWindow
                conversation={selectedConversation}
                onlineUsers={onlineUsers}
                onBack={handleBackToConversations}
                isMobile={isMobile}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Conversation List Sidebar */}
      <div className="w-full md:w-96 lg:w-1/3 xl:w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All Conversations
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {conversations.length} conversations
                </p>
              </div>
            </div>
            <NewClientConversationModal
              onConversationCreated={handleConversationCreated}
              existingConversations={conversations}
              onSelectExistingConversation={setSelectedConversation}
            />
          </div>

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              <Filter className="w-3 h-3 inline mr-1" />
              Filter:
            </span>
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filter === "all"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                filter === "unread"
                  ? "bg-blue-500 text-white shadow-sm"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Loading conversations...
              </p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No conversations
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Start a new conversation to begin messaging.
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto h-full divide-y divide-gray-200 dark:divide-gray-700">
              {conversations.map((conversation) => {
                const otherParticipants = conversation.users.filter(
                  (user) => user.email !== session?.user?.email
                );

                let conversationDisplayName = "";
                if (otherParticipants.length === 1) {
                  conversationDisplayName =
                    otherParticipants[0].name || otherParticipants[0].email;
                } else if (otherParticipants.length > 1) {
                  conversationDisplayName = otherParticipants
                    .map((p) => p.name || p.email)
                    .join(", ");
                } else {
                  conversationDisplayName = "Self Chat";
                }

                const displayAvatarUser = otherParticipants[0] || session?.user;
                const lastMessage = conversation.messages[0];
                const isOnline =
                  displayAvatarUser &&
                  session?.user &&
                  onlineUsers.includes(displayAvatarUser.id);

                return (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-r-2 border-r-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={
                              displayAvatarUser?.image ||
                              "/images/default-avatar.png"
                            }
                          />
                          <AvatarFallback>
                            {displayAvatarUser?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        {isOnline && (
                          <span className="absolute -bottom-1 -right-1">
                            <span className="block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-800" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                            {conversationDisplayName}
                          </h3>
                          {lastMessage && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                              {new Date(
                                lastMessage.createdAt
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {lastMessage?.content || "No messages yet"}
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

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onlineUsers={onlineUsers}
            isMobile={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Select a conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Choose a conversation from the list to start messaging or create a
              new one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
