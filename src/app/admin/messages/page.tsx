"use client";

import { useSocket } from "@/app/Providers";
import NewClientConversationModal from "@/components/admin/messages/NewClientConversationModal";
import ChatWindow from "@/components/dashboard/messages/ChatWindow";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/generated/prisma/browser";
import {
  ChevronLeft,
  Filter,
  Menu,
  MessageCircle,
  Search,
  Users,
  MoreVertical,
  CheckCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
          (conv) => conv.id === message.conversationId,
        );
        if (conversationToMove) {
          return [
            conversationToMove,
            ...updatedConversations.filter(
              (conv) => conv.id !== message.conversationId,
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
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            {showConversationList || !selectedConversation ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                      Messages
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
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
                  className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full px-3"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleConversationList}
                  className="rounded-full w-8 h-8 p-0"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Search and Filter - Only show when viewing conversation list */}
          {(showConversationList || !selectedConversation) && (
            <div className="mt-4 space-y-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-100/50 dark:bg-gray-700/50 border-transparent focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/20 rounded-xl transition-all h-11"
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                    filter === "all"
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  All Chats
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                    filter === "unread"
                      ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                  }`}
                >
                  Unread
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {showConversationList || !selectedConversation ? (
            /* Conversation List */
            <ScrollArea className="h-full bg-white dark:bg-gray-900">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
                    Loading conversations...
                  </p>
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 pt-20">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-gray-100 dark:ring-gray-700">
                    <MessageCircle className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    No conversations yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                    Start a new conversation to begin messaging with your
                    clients.
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-1">
                  {conversations.map((conversation) => {
                    const otherParticipants = conversation.users.filter(
                      (user) => user.email !== session?.user?.email,
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
                      <motion.div
                        key={conversation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => handleSelectConversation(conversation)}
                        className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-transparent hover:border-gray-100 dark:hover:border-gray-700 hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative flex-shrink-0">
                            <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-gray-900 shadow-sm">
                              <AvatarImage
                                src={
                                  displayAvatarUser?.image ||
                                  "/images/default-avatar.png"
                                }
                                className="object-cover"
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-300 font-bold">
                                {displayAvatarUser?.name?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            {isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900 shadow-sm" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                {conversationDisplayName}
                              </h3>
                              {lastMessage && (
                                <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
                                  {new Date(
                                    lastMessage.createdAt,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate leading-relaxed">
                              {lastMessage?.senderId === session?.user?.id && (
                                <span className="mr-1">You:</span>
                              )}
                              {lastMessage?.content || "No messages yet"}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          ) : (
            /* Chat Window */
            <div className="h-full bg-white dark:bg-gray-800 absolute inset-0 z-20">
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Conversation List Sidebar */}
      <div className="w-full md:w-80 lg:w-96 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-xl z-10">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                  Messages
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {onlineUsers.length} online
                  </p>
                </div>
              </div>
            </div>
            <NewClientConversationModal
              onConversationCreated={handleConversationCreated}
              existingConversations={conversations}
              onSelectExistingConversation={setSelectedConversation}
            />
          </div>

          {/* Search */}
          <div className="mb-4 relative group">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl transition-all h-11 shadow-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                filter === "all"
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md transform scale-[1.02]"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              All Chats
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                filter === "unread"
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md transform scale-[1.02]"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 bg-gray-50/50 dark:bg-gray-900/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="mt-4 text-xs font-medium text-gray-500 dark:text-gray-400 animate-pulse">
                Syncing messages...
              </p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 pt-20">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mb-4 ring-1 ring-gray-100 dark:ring-gray-700">
                <Users className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                No conversations
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px] mx-auto leading-relaxed">
                Your inbox is empty. Start a new conversation to connect with
                clients.
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-1">
              <AnimatePresence>
                {conversations.map((conversation, index) => {
                  const otherParticipants = conversation.users.filter(
                    (user) => user.email !== session?.user?.email,
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

                  const isSelected =
                    selectedConversation?.id === conversation.id;

                  return (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`
                        group relative p-3 rounded-xl cursor-pointer transition-all duration-200
                        ${
                          isSelected
                            ? "bg-white dark:bg-gray-800 shadow-md ring-1 ring-black/5 dark:ring-white/10 z-10"
                            : "hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-sm"
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full" />
                      )}

                      <div className="flex items-center gap-3.5 pl-1">
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-gray-900 shadow-sm group-hover:scale-105 transition-transform duration-200">
                            <AvatarImage
                              src={
                                displayAvatarUser?.image ||
                                "/images/default-avatar.png"
                              }
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-600 dark:text-gray-300 font-bold">
                              {displayAvatarUser?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          {isOnline && (
                            <span className="absolute -bottom-0.5 -right-0.5 block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-900 shadow-sm" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={`text-sm font-semibold truncate ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}
                            >
                              {conversationDisplayName}
                            </h3>
                            {lastMessage && (
                              <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
                                {new Date(
                                  lastMessage.createdAt,
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-xs truncate leading-relaxed max-w-[180px] ${isSelected ? "text-gray-600 dark:text-gray-300" : "text-gray-500 dark:text-gray-400"}`}
                            >
                              {lastMessage?.senderId === session?.user?.id && (
                                <span className="font-medium mr-1">You:</span>
                              )}
                              {lastMessage?.content || "No messages yet"}
                            </p>
                            {/* Unread indicator could go here */}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-50/50 dark:bg-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--muted-foreground)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            onlineUsers={onlineUsers}
            isMobile={false}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 relative z-10">
            <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-3xl shadow-xl flex items-center justify-center mb-8 ring-1 ring-gray-100 dark:ring-gray-700 rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl"></div>
              <MessageCircle className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              Select a conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md text-base leading-relaxed">
              Choose a conversation from the list to start messaging or create a
              new one to connect with your clients.
            </p>
            <div className="mt-8 flex gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900"
                  ></div>
                ))}
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500 self-center">
                Connect with your team
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
