
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message as MessageType } from '@/generated/prisma';
import Message from './Message';
import MessageInput from './MessageInput';
import { motion } from 'framer-motion';

import Pusher from 'pusher-js';

import { toast } from 'sonner';

import { useSession } from 'next-auth/react';

interface ChatWindowProps {
  conversation: Conversation;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
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

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
    });

    const channel = pusher.subscribe(`presence-${conversation.id}`);

    channel.bind('pusher:subscription_succeeded', (members: any) => {
      setOnlineUsers(Object.keys(members.members));
    });

    channel.bind('pusher:member_added', (member: any) => {
      setOnlineUsers((prev) => [...prev, member.id]);
    });

    channel.bind('pusher:member_removed', (member: any) => {
      setOnlineUsers((prev) => prev.filter(id => id !== member.id));
    });

    channel.bind('messages:new', (newMessage: MessageType & { tempId?: string }) => {
      setMessages((prevMessages) => {
        if (newMessage.tempId) {
          return prevMessages.map(msg => msg.id === newMessage.tempId ? newMessage : msg);
        } else {
          return [...prevMessages, newMessage];
        }
      });
    });

    channel.bind('message:seen', (seenMessage: MessageType) => {
      setMessages((prevMessages) => 
        prevMessages.map(msg => 
          msg.id === seenMessage.id ? { ...msg, status: 'seen' } : msg
        )
      );
    });

    return () => {
      pusher.unsubscribe(`presence-${conversation.id}`);
    };
  }, [conversation.id]);

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
