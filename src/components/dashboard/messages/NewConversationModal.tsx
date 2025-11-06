"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/generated/prisma";
import { ConversationWithMessagesAndUsers } from "./ConversationList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useSocket } from "@/app/Providers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface NewConversationModalProps {
  onConversationCreated: (
    conversation: ConversationWithMessagesAndUsers
  ) => void;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({
  onConversationCreated,
}) => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { socket } = useSocket();

  // Filter admins based on search query
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.adminRole?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch("/api/users/admins");
        if (response.ok) {
          const data = await response.json();
          setAdmins(data);
        } else {
          toast.error("Failed to load admins");
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast.error("Error loading admins");
      }
    };

    if (open) {
      fetchAdmins();
    }
  }, [open]);

  const handleStartConversation = () => {
    if (!selectedAdmin || !socket) return;

    setLoading(true);

    // Set up event listeners first
    const handleConversationCreated = (
      newConversation: ConversationWithMessagesAndUsers
    ) => {
      onConversationCreated(newConversation);
      toast.success("Conversation started successfully!");
      setLoading(false);
      setOpen(false);
      setSelectedAdmin(null);
      setSearchQuery("");

      // Clean up listeners
      socket.off("conversationCreated", handleConversationCreated);
      socket.off("conversationError", handleConversationError);
    };

    const handleConversationError = (error: string) => {
      toast.error(error || "Failed to start conversation");
      setLoading(false);

      // Clean up listeners
      socket.off("conversationCreated", handleConversationCreated);
      socket.off("conversationError", handleConversationError);
    };

    socket.on("conversationCreated", handleConversationCreated);
    socket.on("conversationError", handleConversationError);

    // Emit the conversation creation event
    socket.emit("createConversation", {
      recipientId: selectedAdmin.id,
      initialMessage: "Hello! I would like to start a conversation.",
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset state when modal closes
      setSelectedAdmin(null);
      setSearchQuery("");
      setLoading(false);
    }
  };

  const getAdminBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "super admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "admin":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "support":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
          size="sm"
        >
          <span className="material-symbols-outlined mr-2 text-lg">add</span>
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
            Start New Conversation
          </DialogTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Choose an admin to start chatting with
          </p>
        </DialogHeader>

        {/* Search Bar */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-lg">
                search
              </span>
            </div>
            <input
              type="text"
              placeholder="Search admins..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Admins List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredAdmins.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-gray-400 text-2xl">
                  person_search
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-2">
                No admins found
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                {searchQuery
                  ? "Try adjusting your search"
                  : "No admins available at the moment"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredAdmins.map((admin, index) => (
                  <motion.div
                    key={admin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    onClick={() => setSelectedAdmin(admin)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedAdmin?.id === admin.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Admin Avatar */}
                      <Avatar className="w-12 h-12 flex-shrink-0">
                        <AvatarImage
                          src={admin.image || ""}
                          alt={admin.name || "Admin"}
                        />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold text-sm">
                          {admin.name?.charAt(0)?.toUpperCase() || "A"}
                        </AvatarFallback>
                      </Avatar>

                      {/* Admin Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {admin.name}
                          </h3>
                          {admin.adminRole && (
                            <Badge
                              variant="secondary"
                              className={`text-xs px-2 py-1 ${getAdminBadgeColor(admin.adminRole)}`}
                            >
                              {admin.adminRole}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {admin.email}
                        </p>
                      </div>

                      {/* Selection Indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedAdmin?.id === admin.id
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {selectedAdmin?.id === admin.id && (
                          <span className="material-symbols-outlined text-white text-xs">
                            check
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartConversation}
              disabled={!selectedAdmin || loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white font-semibold"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin mr-2 text-lg">
                    progress_activity
                  </span>
                  Starting...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined mr-2 text-lg">
                    chat
                  </span>
                  Start Chat
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationModal;
