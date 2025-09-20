"use client";
import React from "react";
import ChatHeader from "@/components/dashboard/messages/ChatHeader";
import MessageList from "@/components/dashboard/messages/MessageList";
import MessageInput from "@/components/dashboard/messages/MessageInput";
import { messages } from "@/lib/messages";

const MessagesPage = () => {
  const project = {
    title: "Lakeside Retreat",
    id: "2024-001",
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <ChatHeader project={project} />
      <div className="flex-1 flex flex-col p-4 md:p-8">
        <MessageList messages={messages} />
        <MessageInput />
      </div>
    </div>
  );
};

export default MessagesPage;
