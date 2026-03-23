"use client";

import React from "react";
import { Message as MessageType } from "@/generated/prisma";
import { Paperclip, Check, CheckCheck, Clock, FileText, Image as ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface MessageWithAttachments extends MessageType {
  sender: { image?: string; name?: string };
  status?: "pending" | "sent" | "seen";
  attachments?: Array<{ url: string; type: string; name: string }>;
}

interface MessageProps {
  message: MessageWithAttachments;
  isOwnMessage: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isOwnMessage }) => {
  const getStatusIcon = () => {
    if (message.status === "pending") {
      return isOwnMessage ? (
        <Clock className="w-3 h-3 text-muted animate-pulse" />
      ) : null;
    } else if (message.status === "sent") {
      return <Check className="w-3.5 h-3.5 text-muted" />;
    } else if (message.status === "seen") {
      return <CheckCheck className="w-3.5 h-3.5 text-gold" />;
    }
    return null;
  };

  const formatMessageTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
      .replace("about ", "")
      .replace("less than a minute ago", "just now");
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
    if (type === "application/pdf") return <FileText className="w-4 h-4" />;
    return <Paperclip className="w-4 h-4" />;
  };

  return (
    <div
      className={`flex items-end gap-2 sm:gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar - Only show for other users */}
      {!isOwnMessage && (
        <Avatar className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 ring-2 ring-card shadow-sm mb-1">
          <Image
            src={message.sender.image || "/images/default-avatar.png"}
            alt={message.sender.name || "User Avatar"}
            fill
            className="rounded-full object-cover"
            sizes="(max-width: 640px) 32px, 36px"
          />
          <AvatarFallback className="text-xs font-bold bg-surface text-cream-dim">
            {message.sender.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content Group */}
      <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isOwnMessage ? "items-end" : "items-start"}`}>
        {/* Sender Name - Only show for received messages in group chats (optional logic, keeping simple for now) */}
        {!isOwnMessage && (
          <span className="text-[10px] font-medium text-muted ml-1 mb-1">
            {message.sender.name}
          </span>
        )}

        {/* Message Bubble */}
        <div
          className={`
            relative px-4 py-2.5 sm:px-5 sm:py-3 shadow-sm
            ${
              isOwnMessage
                ? "bg-gold text-ink rounded-2xl rounded-tr-sm"
                : "bg-card text-cream rounded-2xl rounded-tl-sm border border-cb-border"
            }
          `}
        >
          {/* Message Text */}
          {message.content && (
            <p className="text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={`flex flex-col gap-2 ${message.content ? "mt-3" : ""}`}>
              {message.attachments.map((attachment, attIndex) => (
                <a
                  key={attIndex}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    group flex items-center gap-3 p-2 rounded-xl transition-all duration-200
                    ${
                      isOwnMessage
                        ? "bg-white/10 hover:bg-white/20 border border-white/10"
                        : "bg-surface hover:bg-card border border-cb-border"
                    }
                  `}
                >
                  {attachment.type.startsWith("image/") ? (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden rounded-lg bg-surface">
                      <Image
                        src={attachment.url}
                        alt={attachment.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className={`
                      w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg flex-shrink-0
                      ${isOwnMessage ? "bg-white/20" : "bg-surface"}
                    `}>
                      {getFileIcon(attachment.type)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium truncate ${isOwnMessage ? "text-white/90" : "text-cream-dim"}`}>
                      {attachment.name}
                    </p>
                    <p className={`text-[10px] ${isOwnMessage ? "text-white/70" : "text-muted"}`}>
                      Click to view
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp and Status */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-muted font-medium">
            {formatMessageTime(new Date(message.createdAt))}
          </span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default Message;
