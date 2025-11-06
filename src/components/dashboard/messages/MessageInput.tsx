"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, X, FileText, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSocket } from "@/app/Providers";
import { useSession } from "next-auth/react";

interface MessageInputProps {
  conversationId: string;
  onSendMessage: (message: any) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  onSendMessage,
}) => {
  const [content, setContent] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<
    Array<{ file: File; previewUrl: string; type: string }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const socketContext = useSocket();
  const socket = socketContext?.socket;
  const { data: session } = useSession();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);

    // Check file size (max 10MB per file)
    const oversizedFiles = newFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error(
        `Files must be less than 10MB: ${oversizedFiles.map((f) => f.name).join(", ")}`
      );
      return;
    }

    // Check total files (max 5 files)
    if (attachedFiles.length + newFiles.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }

    setAttachedFiles((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return { file, previewUrl: URL.createObjectURL(file), type: "image" };
      } else if (file.type === "application/pdf") {
        return { file, previewUrl: "/icons/pdf-icon.svg", type: "pdf" };
      } else if (
        file.type.includes("document") ||
        file.type.includes("text") ||
        file.type.includes("word")
      ) {
        return { file, previewUrl: "/icons/doc-icon.svg", type: "document" };
      }
      return { file, previewUrl: "/icons/file-icon.svg", type: "other" };
    });
    setFilePreviews((prev) => [...prev, ...newPreviews]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (!socket || !session?.user?.id) return;

    if (newContent.length > 0 && !isTyping) {
      socket.emit("typing", { conversationId, userId: session.user.id });
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { conversationId, userId: session.user.id });
      setIsTyping(false);
    }, 3000);
  };

  const handleRemoveFile = (fileToRemove: File) => {
    setAttachedFiles((prev) => prev.filter((file) => file !== fileToRemove));
    setFilePreviews((prev) =>
      prev.filter((preview) => {
        if (preview.file === fileToRemove && preview.type === "image") {
          URL.revokeObjectURL(preview.previewUrl);
        }
        return preview.file !== fileToRemove;
      })
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping && socket && session?.user?.id) {
        socket.emit("stopTyping", { conversationId, userId: session.user.id });
      }
      filePreviews.forEach((preview) => {
        if (preview.type === "image") {
          URL.revokeObjectURL(preview.previewUrl);
        }
      });
    };
  }, [conversationId, socket, session?.user?.id, isTyping, filePreviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && attachedFiles.length === 0) return;

    setLoading(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (isTyping && socket && session?.user?.id) {
      socket.emit("stopTyping", { conversationId, userId: session.user.id });
      setIsTyping(false);
    }

    const optimisticId = `optimistic-${Date.now()}`;
    const optimisticAttachments = filePreviews.map((p) => ({
      url: p.previewUrl,
      type: p.file.type,
      name: p.file.name,
    }));

    onSendMessage({
      id: optimisticId,
      optimisticId: optimisticId,
      content: content.trim(),
      attachments: optimisticAttachments,
      conversationId,
      sender: session?.user,
      senderId: session?.user?.id,
      createdAt: new Date().toISOString(),
      status: "pending",
    });

    const uploadedAttachments: Array<{
      url: string;
      type: string;
      name: string;
    }> = [];

    if (attachedFiles.length > 0) {
      for (const file of attachedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await fetch("/api/files/upload", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            uploadedAttachments.push({
              url: data.url,
              type: file.type,
              name: file.name,
            });
          } else {
            toast.error(`Failed to upload: ${file.name}`);
          }
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          toast.error(`Error uploading: ${file.name}`);
        }
      }
    }

    if (!socket) {
      toast.error("Connection error. Please try again.");
      setLoading(false);
      return;
    }

    const messageData = {
      content: content.trim(),
      attachments:
        uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
      conversationId,
      tempId: optimisticId,
      senderId: session?.user?.id,
    };

    socket.emit("sendMessage", messageData);
    setContent("");
    setAttachedFiles([]);
    setFilePreviews([]);
    setLoading(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="w-4 h-4 text-red-500" />;
      case "document":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "image":
        return <ImageIcon className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
    >
      {/* File Previews */}
      <AnimatePresence>
        {filePreviews.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-3 sm:px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 overflow-x-auto"
          >
            <div className="flex gap-2 min-w-max">
              {filePreviews.map((preview, index) => (
                <motion.div
                  key={preview.file.name + index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative flex items-center bg-white dark:bg-gray-700 rounded-lg p-2 pr-8 border border-gray-200 dark:border-gray-600 min-w-0 max-w-[180px] sm:max-w-[200px]"
                >
                  {preview.type === "image" ? (
                    <img
                      src={preview.previewUrl}
                      alt={preview.file.name}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded flex-shrink-0 mr-2"
                    />
                  ) : (
                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-100 dark:bg-gray-600 rounded mr-2 flex-shrink-0">
                      {getFileIcon(preview.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                      {preview.file.name}
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {(preview.file.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(preview.file)}
                    className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 flex items-end gap-2 sm:gap-3"
      >
        {/* File Attachment Button */}
        <label
          htmlFor="file-upload"
          className="flex-shrink-0 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Attach files"
        >
          <Paperclip className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" />
          <input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            multiple
            className="sr-only"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
        </label>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Type a message..."
            value={content}
            onChange={handleContentChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 pr-12 py-3 sm:py-4 text-sm sm:text-base resize-none min-h-[48px]"
            disabled={loading}
          />
        </div>

        {/* Send Button */}
        <Button
          type="submit"
          size="icon"
          className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white transition-all shadow-sm hover:shadow-md"
          disabled={loading || (!content.trim() && attachedFiles.length === 0)}
        >
          {loading ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4 sm:w-5 sm:h-5" />
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default MessageInput;
