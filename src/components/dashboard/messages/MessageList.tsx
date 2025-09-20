"use client";
import React from "react";
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages }: { messages: any[] }) => {
  return (
    <div className="flex-1 space-y-4 md:space-y-8 overflow-y-auto pr-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
