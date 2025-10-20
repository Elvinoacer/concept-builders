
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message as MessageType } from '@/generated/prisma';
import Message from './Message';
import MessageInput from './MessageInput';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface ChatWindowProps {
  conversation: Conversation;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?conversationId=${conversation.id}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          toast.error('Failed to fetch messages.');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Error fetching messages.');
      }
      setLoading(false);
    };

    fetchMessages();
  }, [conversation.id]);

  useEffect(() => {
    let isPolling = true;

    const poll = async () => {
      while (isPolling) {
        try {
          const lastMessageTimestamp = messages.length > 0 ? messages[messages.length - 1].createdAt : new Date(0).toISOString();
          const response = await fetch(`/api/poll?conversationId=${conversation.id}&lastMessageTimestamp=${lastMessageTimestamp}`);
          
          if (response.ok) {
            const newMessages = await response.json();
            if (newMessages.length > 0) {
              setMessages(prevMessages => {
                const existingIds = new Set(prevMessages.map(m => m.id));
                const filteredNewMessages = newMessages.filter((m: any) => !existingIds.has(m.id));
                return [...prevMessages, ...filteredNewMessages];
              });
            }
          } else {
            console.error("Polling failed with status:", response.status);
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        } catch (error) {
          console.error('Error during polling:', error);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    };

    if (!loading) {
        poll();
    }

    return () => {
      isPolling = false;
    };
  }, [conversation.id, loading, messages]);

  useEffect(() => {
    const markAsSeen = async () => {
      if (conversation.id) {
        await fetch('/api/messages/seen', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversationId: conversation.id }),
        });
      }
    };

    markAsSeen();
  }, [conversation.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: any) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold">{conversation.users.filter(user => user.email !== session?.user?.email).map(user => user.email).join(', ')}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center">Loading messages...</div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Message message={{...message, status: message.status || 'sent'}} />
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <MessageInput conversationId={conversation.id} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
