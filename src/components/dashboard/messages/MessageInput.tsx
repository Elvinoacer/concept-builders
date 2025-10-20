"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface MessageInputProps {
  conversationId: string;
  onSendMessage: (message: any) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId, onSendMessage }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !file) return;

    setLoading(true);

    const tempId = `temp-${Date.now()}`;
    onSendMessage({ 
      id: tempId, 
      content, 
      attachmentUrl: file ? URL.createObjectURL(file) : undefined,
      attachmentType: file?.type,
      conversationId, 
      sender: { id: 'temp-sender' }, // temporary sender
      createdAt: new Date().toISOString(),
      status: 'sending' 
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

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content, 
          attachmentUrl, 
          attachmentType, 
          conversationId,
          tempId
        }),
      });

      if (response.ok) {
        setContent('');
        setFile(null);
      } else {
        toast.error('Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error sending message.');
    }

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
          onChange={(e) => setContent(e.target.value)}
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