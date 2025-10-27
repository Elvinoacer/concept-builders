
"use client";

import React, { useState, useEffect } from 'react';
import { User } from '@/generated/prisma';
import { ConversationWithMessagesAndUsers } from './ConversationList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

import { useSocket } from '@/app/Providers'; // Import the useSocket hook

interface NewConversationModalProps {
  onConversationCreated: (conversation: ConversationWithMessagesAndUsers) => void;
}

const NewConversationModal: React.FC<NewConversationModalProps> = ({ onConversationCreated }) => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket(); // Get the socket instance

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/users/admins');
        if (response.ok) {
          const data = await response.json();
          setAdmins(data);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };

    fetchAdmins();
  }, []);

  const handleStartConversation = () => {
    if (!selectedAdmin || !socket) return;

    setLoading(true);

    socket.emit('createConversation', { recipientId: selectedAdmin.id, initialMessage: 'Hi!' });

    socket.on('conversationCreated', (newConversation: ConversationWithMessagesAndUsers) => {
      onConversationCreated(newConversation);
      toast.success('Conversation started.');
      setLoading(false);
      // Close modal or reset state
    });

    socket.on('conversationError', (error: string) => {
      toast.error(error);
      setLoading(false);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New Conversation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new conversation</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Select an admin to chat with:</h3>
          <div className="mt-2 space-y-2">
            {admins.map(admin => (
              <div 
                key={admin.id} 
                onClick={() => setSelectedAdmin(admin)}
                className={`p-2 rounded-md cursor-pointer ${selectedAdmin?.id === admin.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {admin.name} ({admin.email})
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleStartConversation} disabled={!selectedAdmin || loading}>
            {loading ? 'Starting...' : 'Start Conversation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationModal;
