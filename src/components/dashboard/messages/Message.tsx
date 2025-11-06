"use client";

import React from "react";
import { Message as MessageType } from "@/generated/prisma";
import { Paperclip, Check, CheckCheck, Clock } from "lucide-react";
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
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { data: session } = useSession();
  const isSender = message.senderId === session?.user?.id;

  const getStatusIcon = () => {
    if (message.status === "pending") {
      return isSender ? (
        <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
      ) : null;
    } else if (message.status === "sent") {
      return <Check className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />;
    } else if (message.status === "seen") {
      return <CheckCheck className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />;
    }
    return null;
  };

  const formatMessageTime = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true })
      .replace("about ", "")
      .replace("less than a minute ago", "just now");
  };

  return (
    <div
      className={`flex items-start gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-2 ${isSender ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar - Hidden for sender on mobile to save space */}
      <Avatar
        className={`w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 ${isSender ? "sm:flex hidden" : ""}`}
      >
        <Image
          src={message.sender.image || "/images/default-avatar.png"}
          alt={message.sender.name || "User Avatar"}
          fill
          className="rounded-full object-cover"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
          sizes="(max-width: 640px) 28px, 32px"
        />
        <AvatarFallback className="text-xs font-medium">
          {message.sender.name?.charAt(0)?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div
        className={`flex flex-col gap-1 flex-1 min-w-0 ${isSender ? "items-end" : "items-start"}`}
      >
        {/* Sender Name - Only show for received messages */}
        {!isSender && (
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 px-1">
            {message.sender.name}
          </p>
        )}

        {/* Message Bubble */}
        <div
          className={`relative max-w-[85vw] sm:max-w-lg px-3 sm:px-4 py-2 sm:py-3 rounded-2xl ${
            isSender
              ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white rounded-br-sm"
              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm"
          }`}
        >
          {/* Message Text */}
          <p className="text-sm sm:text-base leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </p>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 sm:mt-3 space-y-2">
              {message.attachments.map((attachment, attIndex) => (
                <a
                  key={attIndex}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center text-xs sm:text-sm p-2 rounded-lg border transition-colors ${
                    isSender
                      ? "bg-blue-500/20 border-blue-400/30 hover:bg-blue-500/30 text-white"
                      : "bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {attachment.type.startsWith("image/") ? (
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 flex-shrink-0">
                      <Image
                        src={attachment.url}
                        alt={attachment.name}
                        fill
                        className="object-cover rounded"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                        sizes="(max-width: 640px) 32px, 40px"
                      />
                    </div>
                  ) : (
                    <Paperclip className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                  )}
                  <span className="truncate flex-1 min-w-0">
                    {attachment.name}
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Message Tail */}
          <div
            className={`absolute bottom-0 ${
              isSender
                ? "right-[-6px] sm:right-[-8px]"
                : "left-[-6px] sm:left-[-8px]"
            } w-0 h-0 border-t-[6px] sm:border-t-[8px] border-t-transparent ${
              isSender
                ? "border-l-[6px] sm:border-l-[8px] border-l-blue-600"
                : "border-r-[6px] sm:border-r-[8px] border-r-gray-100 dark:border-r-gray-700"
            } border-b-[6px] sm:border-b-[8px] border-b-transparent`}
          ></div>
        </div>

        {/* Timestamp and Status */}
        <div
          className={`flex items-center gap-1 px-1 ${isSender ? "flex-row-reverse" : ""}`}
        >
          <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            {formatMessageTime(new Date(message.createdAt))}
          </p>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default Message;
