"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, X, FileText, Image as ImageIcon, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSocket } from "@/app/Providers";
import { useSession } from "next-auth/react";

interface MessageInputProps {
  conversationId: string;
  onSendMessage: (message: any) => void;
  isMobile?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  onSendMessage,
  isMobile = false,
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

    const oversizedFiles = newFiles.filter(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error(
        `Files must be less than 10MB: ${oversizedFiles.map((f) => f.name).join(", ")}`
      );
      return;
    }

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
          const response = await fetch("/api/upload-file", {
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
        return <FileText className="w-4 h-4 text-gold" />;
      case "image":
        return <ImageIcon className="w-4 h-4 text-emerald-500" />;
      default:
        return <FileText className="w-4 h-4 text-cream-dim" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* File Previews */}
      <AnimatePresence>
        {filePreviews.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: "auto", opacity: 1, marginBottom: 12 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {filePreviews.map((preview, index) => (
                <motion.div
                  key={preview.file.name + index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative flex items-center bg-surface rounded-xl p-2 pr-8 border border-cb-border shadow-sm min-w-[160px] max-w-[200px]"
                >
                  {preview.type === "image" ? (
                    <img
                      src={preview.previewUrl}
                      alt={preview.file.name}
                      className="w-10 h-10 object-cover rounded-lg flex-shrink-0 mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-card rounded-lg mr-3 flex-shrink-0 shadow-sm">
                      {getFileIcon(preview.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-cream truncate">
                      {preview.file.name}
                    </p>
                    <p className="text-[10px] text-cream-dim">
                      {(preview.file.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(preview.file)}
                    className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-surface text-cream-dim rounded-full text-xs hover:bg-destructive hover:text-white transition-colors"
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
        className={`
          relative flex items-center gap-2 p-1.5 rounded-[2rem] transition-all duration-300
          ${isFocused 
            ? "bg-card shadow-[0_0_0_2px_rgba(200,137,42,0.5)] ring-4 ring-gold/10" 
            : "bg-surface border border-transparent hover:bg-card hover:shadow-md hover:border-cb-border"
          }
        `}
      >
        {/* File Attachment Button */}
        <label
          htmlFor="file-upload"
          className={`
            flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200
            ${attachedFiles.length > 0 ? "bg-gold/10 text-gold" : "text-cream-dim hover:text-gold hover:bg-gold/10"}
          `}
          title="Attach files"
        >
          <Plus className={`w-5 h-5 transition-transform duration-200 ${attachedFiles.length > 0 ? "rotate-45" : ""}`} />
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
        <Input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={handleContentChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-2 py-3 text-base placeholder:text-muted"
          disabled={loading}
          autoComplete="off"
        />

        {/* Send Button */}
        <Button
          type="submit"
          size="icon"
          className={`
            w-10 h-10 rounded-full transition-all duration-300 shadow-sm
            ${
              !content.trim() && attachedFiles.length === 0
                ? "bg-surface text-muted cursor-not-allowed"
                : "bg-gold hover:bg-gold-light text-ink hover:scale-105"
            }
          `}
          disabled={loading || (!content.trim() && attachedFiles.length === 0)}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-ink/30 border-t-ink rounded-full animate-spin" />
          ) : (
            <Send className={`w-4 h-4 ${content.trim() || attachedFiles.length > 0 ? "ml-0.5" : ""}`} />
          )}
        </Button>
      </form>
    </motion.div>
  );
};

export default MessageInput;
