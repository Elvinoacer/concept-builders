"use client";

import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/generated/prisma/browser";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useSocket } from "@/app/Providers";
import {
  Search,
  Users,
  UserPlus,
  MessageCircle,
  Check,
  Loader2,
  X,
  Mail,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  users: User[];
}

interface NewClientConversationModalProps {
  onConversationCreated: (conversation: any) => void;
  existingConversations: Conversation[];
  onSelectExistingConversation: (conversation: Conversation) => void;
}

const NewClientConversationModal: React.FC<NewClientConversationModalProps> = ({
  onConversationCreated,
  existingConversations,
  onSelectExistingConversation,
}) => {
  const [clients, setClients] = useState<User[]>([]);
  const [filteredClients, setFilteredClients] = useState<User[]>([]);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { socket } = useSocket();
  const { data: session } = useSession();

  // Filter clients based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredClients(clients);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = clients.filter(
        (client) =>
          client.name?.toLowerCase().includes(query) ||
          client.email.toLowerCase().includes(query)
      );
      setFilteredClients(filtered);
    }
  }, [clients, searchQuery]);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/users/clients");
      if (response.ok) {
        const data = await response.json();
        setClients(data);
        setFilteredClients(data);
      } else {
        throw new Error("Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    } else {
      // Reset states when modal closes
      setSearchQuery("");
      setSelectedClient(null);
      setFilteredClients([]);
    }
  }, [isOpen, fetchClients]);

  const handleStartConversation = () => {
    if (!selectedClient || !socket || !session?.user?.id) return;

    // Check for existing conversation
    const existingConv = existingConversations.find(
      (conv) =>
        conv.users &&
        conv.users.some((user) => user && user.id === selectedClient.id) &&
        conv.users.some((user) => user && user.id === session.user.id)
    );

    if (existingConv) {
      onSelectExistingConversation(existingConv);
      toast.info("Switched to existing conversation");
      setIsOpen(false);
      return;
    }

    setLoading(true);

    socket.emit("createConversation", {
      recipientId: selectedClient.id,
      initialMessage: "Hello! How can I help you today?",
    });

    const handleConversationCreated = (newConversation: any) => {
      onConversationCreated(newConversation);
      toast.success("Conversation started successfully");
      setLoading(false);
      setIsOpen(false);
      socket.off("conversationCreated", handleConversationCreated);
      socket.off("conversationError", handleConversationError);
    };

    const handleConversationError = (error: string) => {
      toast.error(error || "Failed to start conversation");
      setLoading(false);
      socket.off("conversationCreated", handleConversationCreated);
      socket.off("conversationError", handleConversationError);
    };

    socket.on("conversationCreated", handleConversationCreated);
    socket.on("conversationError", handleConversationError);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const hasExistingConversation = (client: User) => {
    return existingConversations.some(
      (conv) =>
        conv.users &&
        conv.users.some((user) => user && user.id && user.id === client.id)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md transition-all duration-200"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden xs:inline font-medium">New Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg p-0 bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* Header */}
        <DialogHeader className="p-5 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-100/50 dark:bg-blue-900/30 rounded-xl ring-1 ring-blue-100 dark:ring-blue-800">
                <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                  New Conversation
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  Select a client to start chatting
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
            <Input
              placeholder="Search clients by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 rounded-xl transition-all"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
              >
                <X className="w-3.5 h-3.5 text-gray-500" />
              </Button>
            )}
          </div>
        </div>

        {/* Clients List */}
        <ScrollArea className="h-[400px]">
          {loading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-blue-100 dark:border-blue-900/30 animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-blue-600 absolute top-0 left-0 animate-spin" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-4 font-medium animate-pulse">
                Loading clients...
              </p>
            </div>
          ) : filteredClients.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4 ring-1 ring-gray-100 dark:ring-gray-700">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {searchQuery ? "No clients found" : "No clients available"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
                {searchQuery
                  ? "We couldn't find any clients matching your search. Try different keywords."
                  : "There are no clients available to start a conversation with at the moment."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="mt-6 rounded-full px-6"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            // Clients List
            <div className="p-2 space-y-1">
              {filteredClients.map((client) => {
                const hasExistingConv = hasExistingConversation(client);
                const isSelected = selectedClient?.id === client.id;

                return (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`
                      w-full text-left group relative p-3 rounded-xl border transition-all duration-200
                      ${
                        isSelected
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-sm"
                          : "bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className="w-12 h-12 ring-2 ring-white dark:ring-gray-900 shadow-sm">
                          <AvatarImage
                            src={client.image || undefined}
                            alt={client.name || client.email}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-300 font-bold">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        {hasExistingConv && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-0.5 rounded-full ring-2 ring-white dark:ring-gray-900" title="Existing Chat">
                            <MessageCircle className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      {/* Client Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <h4 className={`font-semibold text-sm truncate ${isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-white'}`}>
                            {client.name || "Unnamed Client"}
                          </h4>
                          {isSelected && (
                            <div className="bg-blue-500 rounded-full p-0.5 animate-in zoom-in duration-200">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{client.email}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer with Action Buttons */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="flex flex-col-reverse sm:flex-row gap-3 items-center justify-between">
            {selectedClient ? (
              <div className="flex items-center gap-3 bg-white dark:bg-gray-800 py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm w-full sm:w-auto">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={selectedClient.image || undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(selectedClient.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Selected</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">
                    {selectedClient.name || selectedClient.email}
                  </span>
                </div>
              </div>
            ) : (
              <div className="hidden sm:block text-sm text-gray-500 dark:text-gray-400 italic">
                Select a client to continue
              </div>
            )}

            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 sm:flex-none rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartConversation}
                disabled={!selectedClient || loading}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-lg min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Starting...
                  </>
                ) : selectedClient && hasExistingConversation(selectedClient) ? (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Open Chat
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Start Chat
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientConversationModal;
