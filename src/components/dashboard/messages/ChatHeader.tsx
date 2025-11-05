'use client';

import { Conversation } from '@/generated/prisma';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

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
        <Image src={otherUser?.image || '/images/default-avatar.png'} alt={otherUser?.name || "User Avatar"} fill className="rounded-full object-cover" placeholder="blur" blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII=" />
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
