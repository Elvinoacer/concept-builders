
"use client";

import React from 'react';
import { Message as MessageType } from '@/generated/prisma';
import { Paperclip } from 'lucide-react';

import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useSession } from "next-auth/react";

import { Check, CheckCheck } from 'lucide-react';

interface MessageProps {
  message: MessageType & { sender: { image?: string, name?: string }, status?: 'sending' | 'sent' | 'seen' };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { data: session } = useSession();
  const isSender = message.senderId === session?.user?.id;

  const getStatusIcon = () => {
    if (message.status === 'sending') {
      return <Check className="w-4 h-4 text-gray-400" />;
    } else if (message.status === 'sent') {
      return <Check className="w-4 h-4 text-gray-400" />;
    } else if (message.status === 'seen') {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }
    return null;
  };

  return (
    <div className={`flex items-start gap-3 ${isSender ? 'flex-row-reverse' : ''}`}>
       <Avatar className="w-8 h-8">
        <AvatarImage src={message.sender.image || '/images/default-avatar.png'} />
        <AvatarFallback>{message.sender.name?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className={`flex flex-col gap-1 ${isSender ? 'items-end' : ''}`}>
        <div className={`relative max-w-lg px-4 py-2 rounded-lg ${isSender ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
          <p className="text-sm font-semibold mb-1">{message.sender.name}</p>
          <p className="text-sm">{message.content}</p>
          {message.attachmentUrl && (
            <a 
              href={message.attachmentUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center mt-2 text-sm bg-gray-100 dark:bg-gray-600 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
            >
              <Paperclip className="w-4 h-4 mr-2" />
              <span>{message.attachmentType}</span>
            </a>
          )}
          <div className={`absolute bottom-0 ${isSender ? 'right-[-8px]' : 'left-[-8px]'} w-0 h-0 border-t-[8px] border-t-transparent ${isSender ? 'border-l-[8px] border-l-blue-500' : 'border-r-[8px] border-r-gray-200 dark:border-r-gray-700'} border-b-[8px] border-b-transparent`}></div>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </p>
          {isSender && getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default Message;
