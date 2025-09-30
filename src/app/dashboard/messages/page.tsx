'use client';
import React from 'react';
import ChatHeader from '@/components/dashboard/messages/ChatHeader';
import MessageList from '@/components/dashboard/messages/MessageList';
import MessageInput from '@/components/dashboard/messages/MessageInput';
import { messages } from "@/lib/dummydata/messages";

const MessagesPage = () => {
  const project = {
    title: 'Lakeside Retreat',
    id: '2024-001',
  };

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 md:p-8 flex flex-col h-screen">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          Messages
        </h2>
        <p className="text-gray-500 mt-0.5 md:mt-1 dark:text-gray-400">
          Communicate with our support team.
        </p>
      </header>
      <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-sm flex-1">
        <ChatHeader project={project} />
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto">
          <MessageList messages={messages} />
        </div>
        <MessageInput />
      </div>
    </div>
  );
};

export default MessagesPage;
