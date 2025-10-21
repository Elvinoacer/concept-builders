'use client';

import { Conversation } from '@/generated/prisma';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatHeaderProps {
  conversation: Conversation;
  onlineUsers: string[];
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onlineUsers }) => {
  const { data: session } = useSession();
  const otherUser = conversation.users.find(user => user.email !== session?.user?.email);
  const isOnline = otherUser ? onlineUsers.includes(otherUser.id) : false;

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
      <Avatar className="w-12 h-12 mr-4">
        <AvatarImage src={otherUser?.image || '/images/default-avatar.png'} />
        <AvatarFallback>{otherUser?.name?.charAt(0)}</AvatarFallback>
        {isOnline && (
          <span className="absolute bottom-0 -right-2 block h-4 w-4 rounded-full bg-green-500 ring-2 ring-white z-10" />
        )}
      </Avatar>
      <div>
        <h2 className="text-xl font-semibold">{otherUser?.name}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{isOnline ? 'Online' : 'Offline'}</p>
      </div>
    </div>
  );
};

export default ChatHeader;
