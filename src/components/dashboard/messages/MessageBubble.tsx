"use client";
import React from "react";
import Image from "next/image";

const MessageBubble = ({ message }: { message: any }) => {
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
          <p className="font-semibold text-gray-800 dark:text-white">
            {message.sender.name}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {message.time}
          </p>
        </div>
        <div
          className={`${
            isSent
              ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white"
              : "bg-white text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200 dark:border dark:border-gray-700"
          } p-4 rounded-lg ${
            isSent ? "rounded-tr-none" : "rounded-tl-none"
          } max-w-xs md:max-w-lg`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        {message.attachment && (
          <div className="bg-white p-3 rounded-lg max-w-xs md:max-w-lg flex items-center gap-3 shadow-sm border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
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
              <p className="text-sm font-medium text-gray-800 dark:text-white">
                {message.attachment.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {message.attachment.size}
              </p>
            </div>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
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
