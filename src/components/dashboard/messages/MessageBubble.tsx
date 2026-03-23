"use client";
import { Message } from "@/lib/types";
import Image from "next/image";

const MessageBubble = ({ message }: { message: Message }) => {
  const isSent = message.type === "sent";

  return (
    <div className={`flex items-start gap-4 ${isSent ? "justify-end" : ""}`}>
      {!isSent && (
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-cover bg-center shrink-0">
          <Image
            src={message.sender.avatar}
            alt={message.sender.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      )}
      <div className={`flex flex-col gap-1.5 ${isSent ? "items-end" : ""}`}>
        <div className="flex items-baseline gap-2">
          <p className="font-semibold text-cream">
            {message.sender.name}
          </p>
          <p className="text-xs text-muted">
            {message.time}
          </p>
        </div>
        <div
          className={`${
            isSent
              ? "bg-gold text-ink"
              : "bg-surface text-cream border border-cb-border"
          } p-4 rounded-lg ${
            isSent ? "rounded-tr-none" : "rounded-tl-none"
          } max-w-[80%] md:max-w-lg`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        {message.attachment && (
          <div className="bg-surface p-3 rounded-lg max-w-[80%] md:max-w-lg flex items-center gap-3 shadow-sm border border-cb-border">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-cover bg-center">
              <Image
                src={message.attachment.preview}
                alt={message.attachment.name}
                width={48}
                height={48}
                className="rounded-lg"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-cream">
                {message.attachment.name}
              </p>
              <p className="text-xs text-cream-dim">
                {message.attachment.size}
              </p>
            </div>
            <button className="text-cream-dim hover:text-cream transition-colors">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
        )}
      </div>
      {isSent && (
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-cover bg-center shrink-0">
          <Image
            src={message.sender.avatar}
            alt={message.sender.name}
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
