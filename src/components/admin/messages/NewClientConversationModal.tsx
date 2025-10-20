
"use client";

import React, { useState, useEffect } from 'react';
import { User } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface NewClientConversationModalProps {
  onConversationCreated: (conversation: any) => void;
}

const NewClientConversationModal: React.FC<NewClientConversationModalProps> = ({ onConversationCreated }) => {
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleStartConversation = async () => {
    if (!selectedClient) return;

    setLoading(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          recipientId: selectedClient.id,
          content: 'Hi!', // Initial message
        }),
      });

      if (response.ok) {
        const newConversation = await response.json();
        onConversationCreated(newConversation);
        toast.success('Conversation started.');
      } else {
        toast.error('Failed to start conversation.');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Error starting conversation.');
    }

    setLoading(false);
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
