"use client";

import React, { useState } from 'react';
import ConversationList from '@/components/dashboard/messages/ConversationList';
import ChatWindow from '@/components/dashboard/messages/ChatWindow';
import { Conversation } from '@/generated/prisma';

const MessagesPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <ConversationList onSelectConversation={setSelectedConversation} />
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;