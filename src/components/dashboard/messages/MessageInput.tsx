"use client";

import React, { useState, useEffect, useRef } from 'react'; // Import useEffect and useRef
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useSocket } from '@/app/Providers'; // Import the useSocket hook
import { useSession } from 'next-auth/react'; // Import useSession

interface MessageInputProps {
  conversationId: string;
  onSendMessage: (message: any) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId, onSendMessage }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const socketContext = useSocket(); // Get the socket instance
  const socket = socketContext?.socket;
  const { data: session } = useSession(); // Get the session

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    if (!socket || !session?.user?.id) return;

    if (newContent.length > 0 && !isTyping) {
      socket.emit('typing', { conversationId, userId: session.user.id });
      setIsTyping(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { conversationId, userId: session.user.id });
      setIsTyping(false);
    }, 3000); // Stop typing after 3 seconds of inactivity
  };

  useEffect(() => {
    // Cleanup typing status when component unmounts or conversation changes
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping && socket && session?.user?.id) {
        socket.emit('stopTyping', { conversationId, userId: session.user.id });
      }
    };
  }, [conversationId, socket, session?.user?.id, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !file) return;

    setLoading(true);

    // Clear any pending typing timeout and send stopTyping immediately
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    if (isTyping && socket && session?.user?.id) {
      socket.emit('stopTyping', { conversationId, userId: session.user.id });
      setIsTyping(false);
    }

    const optimisticId = `optimistic-${Date.now()}`;
    onSendMessage({ 
      id: optimisticId, 
      optimisticId: optimisticId, 
      content, 
      attachmentUrl: file ? URL.createObjectURL(file) : undefined,
      attachmentType: file?.type,
      conversationId, 
      sender: session?.user, // Use actual session.user object
      senderId: session?.user?.id, // Explicitly set senderId for optimistic message
      createdAt: new Date().toISOString(),
      status: 'pending' 
    });

    let attachmentUrl: string | undefined;
    let attachmentType: string | undefined;

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          attachmentUrl = data.url;
          attachmentType = file.type;
        } else {
          toast.error('Failed to upload file.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('Error uploading file.');
      }
    }

    if (!socket) {
      toast.error('Socket not connected.');
      setLoading(false);
      return;
    }

    const messageData = {
      content,
      attachmentUrl,
      attachmentType,
      conversationId,
      tempId: optimisticId,
      senderId: session?.user?.id, // Use actual sender ID
    };

    socket.emit('sendMessage', messageData);
    setContent('');
    setFile(null);
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <label htmlFor="file-upload" className="mr-2 cursor-pointer">
          <Paperclip className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-primary" />
          <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
        </label>
        <Input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={handleContentChange} // Use the new handler
          className="flex-1 bg-gray-100 dark:bg-gray-800 border-none focus:ring-0"
        />
        <Button type="submit" size="icon" className="ml-2" disabled={loading}>
          {loading ? <div className="loader"></div> : <Send className="w-6 h-6" />}
        </Button>
      </form>
      {file && (
        <div className="p-2 text-sm text-gray-500 dark:text-gray-400">Selected file: {file.name}</div>
      )}
    </motion.div>
  );
};

export default MessageInput;