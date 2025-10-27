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
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<Array<{ file: File; previewUrl: string; type: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const socketContext = useSocket(); // Get the socket instance
  const socket = socketContext?.socket;
  const { data: session } = useSession(); // Get the session

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) => {
        if (file.type.startsWith('image/')) {
          return { file, previewUrl: URL.createObjectURL(file), type: 'image' };
        } else if (file.type === 'application/pdf') {
          return { file, previewUrl: '/icons/pdf-icon.svg', type: 'pdf' }; // Placeholder icon
        } else if (file.type.includes('document') || file.type.includes('text')) {
          return { file, previewUrl: '/icons/doc-icon.svg', type: 'document' }; // Placeholder icon
        }
        return { file, previewUrl: '/icons/file-icon.svg', type: 'other' }; // Generic icon
      });
      setFilePreviews((prev) => [...prev, ...newPreviews]);
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

  const handleRemoveFile = (fileToRemove: File) => {
    setAttachedFiles((prev) => prev.filter((file) => file !== fileToRemove));
    setFilePreviews((prev) =>
      prev.filter((preview) => {
        if (preview.file === fileToRemove && preview.type === 'image') {
          URL.revokeObjectURL(preview.previewUrl); // Clean up object URL
        }
        return preview.file !== fileToRemove;
      })
    );
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
      // Revoke all object URLs when component unmounts
      filePreviews.forEach(preview => {
        if (preview.type === 'image') {
          URL.revokeObjectURL(preview.previewUrl);
        }
      });
    };
  }, [conversationId, socket, session?.user?.id, isTyping, filePreviews]); // Add filePreviews to dependency array

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && attachedFiles.length === 0) return;

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
    const optimisticAttachments = filePreviews.map(p => ({
      url: p.previewUrl, // Use previewUrl for optimistic display
      type: p.file.type,
      name: p.file.name,
    }));

    onSendMessage({
      id: optimisticId,
      optimisticId: optimisticId,
      content,
      attachments: optimisticAttachments, // Pass array of attachments
      conversationId,
      sender: session?.user,
      senderId: session?.user?.id,
      createdAt: new Date().toISOString(),
      status: 'pending',
    });

    const uploadedAttachments: Array<{ url: string; type: string; name: string }> = [];

    if (attachedFiles.length > 0) {
      for (const file of attachedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        try {
          const response = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            uploadedAttachments.push({
              url: data.url,
              type: file.type,
              name: file.name,
            });
          } else {
            toast.error(`Failed to upload file: ${file.name}`);
          }
        } catch (error) {
          console.error(`Error uploading file ${file.name}:`, error);
          toast.error(`Error uploading file: ${file.name}`);
        }
      }
    }

    if (!socket) {
      toast.error('Socket not connected.');
      setLoading(false);
      return;
    }

    const messageData = {
      content,
      attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined, // Send uploaded attachments
      conversationId,
      tempId: optimisticId,
      senderId: session?.user?.id,
    };

    socket.emit('sendMessage', messageData);
    setContent('');
    setAttachedFiles([]); // Clear attached files
    setFilePreviews([]); // Clear file previews
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
        <label htmlFor="file-upload" className="mr-2 cursor-pointer">
          <Paperclip className="w-6 h-6 text-gray-500 dark:text-gray-400 hover:text-primary" />
          <input id="file-upload" type="file" multiple className="sr-only" onChange={handleFileChange} />
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
      {filePreviews.length > 0 && (
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
          {filePreviews.map((preview, index) => (
            <motion.div
              key={preview.file.name + index} // Use name + index for a unique key
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-2 pr-8 text-sm text-gray-700 dark:text-gray-300"
            >
              {preview.type === 'image' ? (
                <img src={preview.previewUrl} alt={preview.file.name} className="h-10 w-10 object-cover rounded mr-2" />
              ) : (
                <img src={preview.previewUrl} alt={preview.type} className="h-10 w-10 object-contain rounded mr-2" />
              )}
              <span className="truncate max-w-[100px]">{preview.file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(preview.file)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                &times;
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MessageInput;