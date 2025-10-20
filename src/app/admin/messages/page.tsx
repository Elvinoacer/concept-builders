
"use client";

import React, { useState, useEffect } from 'react';
import { Conversation } from '@/generated/prisma';
import ChatWindow from '@/components/dashboard/messages/ChatWindow';
import { useSession } from 'next-auth/react';

import { Input } from '@/components/ui/input';

import NewClientConversationModal from '@/components/admin/messages/NewClientConversationModal';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Pusher from 'pusher-js';

const AdminMessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { data: session } = useSession();

  const fetchConversations = async () => {
    if (session?.user?.role !== 'ADMIN') return;
    try {
      const response = await fetch(`/api/conversations/all?q=${searchTerm}&filter=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session) {
      fetchConversations();
    }
  }, [session, searchTerm, filter]);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: '/api/pusher/auth',
    });

    conversations.forEach(conversation => {
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
    });

    return () => {
      conversations.forEach(conversation => {
        pusher.unsubscribe(`presence-${conversation.id}`);
      });
    };
  }, [conversations]);

  const handleConversationCreated = (newConversation: any) => {
    setConversations((prev) => [newConversation, ...prev]);
    setSelectedConversation(newConversation);
  };

  if (session?.user?.role !== 'ADMIN') {
    return <div>Unauthorized</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Conversations</h2>
            <NewClientConversationModal onConversationCreated={handleConversationCreated} />
          </div>
          <div className="mt-4">
            <Input 
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="mt-4 flex space-x-2">
            <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm rounded-full ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>All</button>
            <button onClick={() => setFilter('unread')} className={`px-3 py-1 text-sm rounded-full ${filter === 'unread' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Unread</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center">Loading...</div>
          ) : (
            <div>
              {conversations.map((conversation) => {
                const otherUser = conversation.users.find(user => user.email !== session?.user?.email);
                const isOnline = otherUser ? onlineUsers.includes(otherUser.id) : false;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className="p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar className="w-12 h-12 mr-4">
                          <AvatarImage src={otherUser?.image || '/images/default-avatar.png'} />
                          <AvatarFallback>{otherUser?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-4 w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold">{otherUser?.name}</h3>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(conversation.messages[0]?.createdAt).toLocaleTimeString()}</p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conversation.messages[0]?.content}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Select a conversation to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
