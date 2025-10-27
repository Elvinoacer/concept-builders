
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message as MessageType, Attachment } from '@/generated/prisma';
import { ConversationWithMessagesAndUsers } from './ConversationList';
import Message from './Message';
import MessageInput from './MessageInput';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/app/Providers'; // Import the useSocket hook

interface LocalMessageType extends MessageType {
  optimisticId?: string; // A stable ID for optimistic updates
  status?: 'pending' | 'sent' | 'seen';
  attachments?: Attachment[]; // Add attachments array
}

import ChatHeader from './ChatHeader';

interface ChatWindowProps {
  conversation: ConversationWithMessagesAndUsers;
  onlineUsers: string[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onlineUsers }) => {
  const [messages, setMessages] = useState<LocalMessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set()); // State to track typing users
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const socketContext = useSocket(); // Get the socket instance
  const socket = socketContext?.socket;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    if (!socket || !session?.user?.id) return;

    // Join the conversation room
    socket.emit('joinConversation', conversation.id);

    // Fetch initial messages
    socket.emit('getMessages', conversation.id);

    socket.on('messages', (fetchedMessages: MessageType[]) => {
      setMessages((prevMessages) => {
        // Create a map of existing messages for quick lookup by their permanent ID or optimistic ID
        const messagesMap = new Map<string, LocalMessageType>();
        prevMessages.forEach(msg => {
          if (msg.id) messagesMap.set(msg.id, msg);
          if (msg.optimisticId) messagesMap.set(msg.optimisticId, msg);
        });

        // Process fetched messages
        fetchedMessages.forEach(fetchedMsg => {
          const fetchedLocalMsg: LocalMessageType = { ...fetchedMsg, status: 'sent' };

          // If a fetched message matches an existing optimistic message (by optimisticId/tempId)
          // then update the optimistic message with the permanent ID and 'sent' status.
          // This assumes the server sends back the original optimisticId as tempId in the messageSent event.
          // For socket.on('messages'), fetchedMsg does NOT have tempId.
          // So, we check if a pending message with the same content and sender exists (weak match).
          const matchingOptimistic = prevMessages.find(
            (prevMsg) => prevMsg.status === 'pending' &&
                         prevMsg.senderId === fetchedMsg.senderId &&
                         prevMsg.content === fetchedMsg.content
          );

          if (matchingOptimistic && matchingOptimistic.optimisticId) {
            // Update the existing optimistic message with the fetched data
            messagesMap.set(matchingOptimistic.optimisticId, { ...fetchedLocalMsg, optimisticId: matchingOptimistic.optimisticId });
          } else {
            // Otherwise, just add the fetched message (it's a new confirmed message)
            messagesMap.set(fetchedMsg.id, fetchedLocalMsg);
          }
        });

        // Filter out any pending messages that were confirmed by fetched messages
        const finalMessages = Array.from(messagesMap.values()).filter(msg => {
          // Keep all messages that are not pending
          if (msg.status !== 'pending') return true;
          // Keep pending messages only if they haven't been confirmed by a fetched message
          return !fetchedMessages.some(fetchedMsg => fetchedMsg.id === msg.id);
        });

        // Sort by createdAt to maintain chronological order
        return finalMessages.sort((a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      setLoading(false);
      scrollToBottom();
    });

    socket.on('receiveMessage', (message: MessageType) => {
      // Ignore messages from the current user to prevent duplicates.
      // The 'messageSent' event handles UI updates for the sender.
      if (message.senderId === session?.user?.id) {
        return;
      }

      setMessages((prevMessages) => {
        // For messages from other users, add them if they don't already exist.
        if (prevMessages.some((m) => m.id === message.id)) {
          return prevMessages;
        }
        return [...prevMessages, { ...message, status: 'sent' }];
      });
    });

    socket.on('messageSent', (confirmedMessage: LocalMessageType) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.optimisticId === confirmedMessage.tempId // Match by optimisticId
            ? { ...confirmedMessage, status: 'sent', optimisticId: msg.optimisticId } // Preserve the original optimisticId from the pending message
            : msg
        )
      );
    });

    // Listen for typing indicators
    socket.on('typing', ({ userId: typingUserId }) => {
      if (typingUserId !== session?.user?.id) {
        setTypingUsers((prev) => new Set(prev).add(typingUserId));
      }
    });

    socket.on('stopTyping', ({ userId: typingUserId }) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(typingUserId);
        return newSet;
      });
    });

    return () => {
      socket.off('messages');
      socket.off('receiveMessage');
      socket.off('messageSent');
      socket.off('typing');
      socket.off('stopTyping');
      socket.emit('leaveConversation', conversation.id); // Leave the conversation room
    };
  }, [socket, conversation.id, session?.user?.id]);

  useEffect(() => {
    if (socket && conversation.id && session?.user?.id) {
      socket.emit('messageSeen', { conversationId: conversation.id, userId: session.user.id });
    }
  }, [socket, conversation.id, session?.user?.id, messages]); // Mark as seen when messages change or conversation changes

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: LocalMessageType) => { // Use LocalMessageType
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <div className="h-full flex flex-col">
      <ChatHeader conversation={conversation} onlineUsers={onlineUsers} />
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center">Loading messages...</div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.optimisticId || message.id}
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
      {typingUsers.size > 0 && (
        <div className="p-2 text-sm text-gray-500 dark:text-gray-400">
          {Array.from(typingUsers).map(userId => {
            const typingUser = conversation.users.find(user => user.id === userId);
            return typingUser ? `${typingUser.name || typingUser.email} is typing...` : '';
          }).filter(Boolean).join(', ')}
        </div>
      )}
      <MessageInput conversationId={conversation.id} onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
