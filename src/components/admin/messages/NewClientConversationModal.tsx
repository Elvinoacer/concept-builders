
"use client";

import React, { useState, useEffect } from 'react';
import { User } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

import { useSocket } from '@/app/Providers'; // Import the useSocket hook

interface NewClientConversationModalProps {
  onConversationCreated: (conversation: any) => void;
}

const NewClientConversationModal: React.FC<NewClientConversationModalProps> = ({ onConversationCreated }) => {
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const socket = useSocket(); // Get the socket instance

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/users/clients');
        if (response.ok) {
          const data = await response.json();
          setClients(data);
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  const handleStartConversation = () => {
    if (!selectedClient || !socket) return;

    setLoading(true);

    socket.emit('createConversation', { recipientId: selectedClient.id, initialMessage: 'Hi!' });

    socket.on('conversationCreated', (newConversation: any) => {
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
        <Button size="sm">New</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new conversation</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Select a client to chat with:</h3>
          <div className="mt-2 space-y-2">
            {clients.map(client => (
              <div 
                key={client.id} 
                onClick={() => setSelectedClient(client)}
                className={`p-2 rounded-md cursor-pointer ${selectedClient?.id === client.id ? 'bg-blue-100 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                {client.name} ({client.email})
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleStartConversation} disabled={!selectedClient || loading}>
            {loading ? 'Starting...' : 'Start Conversation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientConversationModal;
