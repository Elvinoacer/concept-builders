
"use client";

import React, { useState, useEffect } from 'react';
import { Conversation } from '@/generated/prisma';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import NewConversationModal from './NewConversationModal';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationListProps {
  onSelectConversation: (conversation: Conversation) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      } else {
        toast.error('Failed to fetch conversations.');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Error fetching conversations.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleConversationCreated = (newConversation: any) => {
    setConversations((prev) => [newConversation, ...prev]);
    onSelectConversation(newConversation);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Messages</h2>
        <NewConversationModal onConversationCreated={handleConversationCreated} />
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : (
          <div>
            {conversations.map((conversation, index) => {
              const otherUser = conversation.users.find(user => user.email !== session?.user?.email);

              return (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => onSelectConversation(conversation)}
                  className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <Avatar className="w-12 h-12 mr-4">
                        <AvatarImage src={otherUser?.image || '/images/default-avatar.png'} />
                        <AvatarFallback>{otherUser?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{otherUser?.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(conversation.messages[0]?.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conversation.messages[0]?.content}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
