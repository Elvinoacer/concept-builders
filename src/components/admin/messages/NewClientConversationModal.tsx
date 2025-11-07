"use client";

import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/generated/prisma";
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
} from "lucide-react";

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
        conv.users.some((user) => user.id === selectedClient.id) &&
        conv.users.some((user) => user.id === session.user.id)
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
      (conv) => conv.users && conv.users.some((user) => user.id === client.id)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UserPlus className="w-4 h-4" />
          <span className="hidden xs:inline">New Chat</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg p-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  New Conversation
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select a client to start chatting
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search clients by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Clients List */}
        <div className="flex-1 overflow-hidden">
          {loading ? (
            // Loading State
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Loading clients...
              </p>
            </div>
          ) : filteredClients.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? "No clients found" : "No clients available"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "There are no clients available to start a conversation with."}
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="mt-3"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            // Clients List
            <div className="overflow-y-auto max-h-64 sm:max-h-80 p-2">
              <div className="space-y-2">
                {filteredClients.map((client) => {
                  const hasExistingConv = hasExistingConversation(client);
                  const isSelected = selectedClient?.id === client.id;

                  return (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClient(client)}
                      className={`
                        p-3 rounded-lg border transition-all duration-200 cursor-pointer
                        ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500/20"
                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                        }
                        active:scale-[0.98]
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage
                            src={client.image || undefined}
                            alt={client.name || client.email}
                          />
                          <AvatarFallback className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>

                        {/* Client Info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                              {client.name || "Unnamed Client"}
                            </h4>
                            {hasExistingConv && (
                              <Badge
                                variant="secondary"
                                className="text-xs px-1.5 py-0 h-4 flex items-center"
                              >
                                <MessageCircle className="w-3 h-3 mr-1" />
                                Chat
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {client.email}
                          </p>
                        </div>

                        {/* Selection Indicator */}
                        <div
                          className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${
                            isSelected
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300 dark:border-gray-600"
                          }
                        `}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex flex-col-reverse xs:flex-row gap-3 xs:gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 xs:flex-none"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartConversation}
              disabled={!selectedClient || loading}
              className="flex-1 xs:flex-none bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Starting...
                </>
              ) : hasExistingConversation(selectedClient!) ? (
                "Switch to Chat"
              ) : (
                "Start Conversation"
              )}
            </Button>
          </div>

          {/* Selection Info */}
          {selectedClient && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Selected:{" "}
                  <span className="font-semibold">
                    {selectedClient.name || selectedClient.email}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientConversationModal;
