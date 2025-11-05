
"use client";

import React, { useState, useEffect } from 'react';
import { User } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react'; // Import useSession
import { useSocket } from '@/app/Providers'; // Import the useSocket hook

interface NewClientConversationModalProps {
  onConversationCreated: (conversation: any) => void;
  existingConversations: Conversation[]; // Add this
  onSelectExistingConversation: (conversation: Conversation) => void; // Add this
}

const NewClientConversationModal: React.FC<NewClientConversationModalProps> = ({
  onConversationCreated,
  existingConversations,
  onSelectExistingConversation,
}) => {
  const [clients, setClients] = useState<User[]>([]);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Add this state
  const { socket } = useSocket(); // Get the socket instance
  const { data: session } = useSession(); // Get session

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

    if (isOpen) { // Fetch clients only when modal is open
      fetchClients();
    }
  }, [isOpen]);

  const handleStartConversation = () => {
    if (!selectedClient || !socket || !session?.user?.id) return;

    // Check for existing conversation
    const existingConv = existingConversations.find(conv =>
      conv.users && conv.users.some(user => user.id === selectedClient.id) &&
      conv.users.some(user => user.id === session.user.id) // Assuming session.user.id is the admin's ID
    );

    if (existingConv) {
      onSelectExistingConversation(existingConv);
      toast.info('Conversation already exists. Selecting it.');
      setIsOpen(false); // Close modal
      setSelectedClient(null); // Reset selected client
      return;
    }

    setLoading(true);

    socket.emit('createConversation', { recipientId: selectedClient.id, initialMessage: 'Hi!' });

    socket.on('conversationCreated', (newConversation: any) => {
      onConversationCreated(newConversation);
      toast.success('Conversation started.');
      setLoading(false);
      setIsOpen(false); // Close modal
      setSelectedClient(null); // Reset selected client
    });

    socket.on('conversationError', (error: string) => {
      toast.error(error);
      setLoading(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Start a new conversation</DialogTitle>
        </DialogHeader>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Select a client to chat with:</h3>
          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-2">
            {clients.map(client => (
              <div 
                key={client.id} 
                onClick={() => setSelectedClient(client)}
                className={`p-3 rounded-md cursor-pointer transition-all duration-200 flex items-center justify-between 
                  ${selectedClient?.id === client.id ? 'bg-blue-500 text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                <span>{client.name} ({client.email})</span>
                {selectedClient?.id === client.id && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleStartConversation} disabled={!selectedClient || loading}>
            {loading ? 'Starting...' : 'Start Conversation'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientConversationModal;
