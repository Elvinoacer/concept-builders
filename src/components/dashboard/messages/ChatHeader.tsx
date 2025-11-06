"use client";

import { Conversation } from "@/generated/prisma";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";

interface ChatHeaderProps {
  conversation: Conversation;
  onlineUsers: string[];
  onBackClick?: () => void;
  showBackButton?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onlineUsers,
  onBackClick,
  showBackButton = false,
}) => {
  const { data: session } = useSession();
  const router = useRouter();

  const otherUser = conversation.users.find(
    (user) => user.email !== session?.user?.email
  );
  const isOnline = otherUser ? onlineUsers.includes(otherUser.id) : false;

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  const getStatusColor = () => {
    return isOnline ? "bg-green-500" : "bg-gray-400";
  };

  const getStatusText = () => {
    return isOnline ? "Online" : "Offline";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20"
    >
      <div className="px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        {/* Left Section - Back Button and User Info */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Back Button - Mobile Only */}
          {showBackButton && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackClick}
              className="flex-shrink-0 lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Back to conversations"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </motion.button>
          )}

          {/* User Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="w-10 h-10 sm:w-12 sm:h-12">
              <Image
                src={otherUser?.image || "/images/default-avatar.png"}
                alt={otherUser?.name || "User Avatar"}
                fill
                className="rounded-full object-cover"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                sizes="(max-width: 640px) 40px, 48px"
              />
              <AvatarFallback className="text-sm font-medium bg-gradient-to-r from-blue-600 to-cyan-400 text-white">
                {otherUser?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>

            {/* Online Status Indicator */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`absolute bottom-0 right-0 block h-3 w-3 sm:h-4 sm:w-4 rounded-full ring-2 ring-white dark:ring-gray-800 z-10 ${getStatusColor()}`}
            />
          </div>

          {/* User Information */}
          <div className="flex-1 min-w-0">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white truncate"
            >
              {otherUser?.name || "Unknown User"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`text-xs sm:text-sm font-medium flex items-center gap-1.5 ${
                isOnline
                  ? "text-green-600 dark:text-green-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getStatusColor()}`}
              ></span>
              {getStatusText()}
            </motion.p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* More Options Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </motion.button>

          {/* Additional actions can be added here */}
          {/* <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button> */}
        </div>
      </div>

      {/* Typing Indicator - Can be added later */}
      {/* {isTyping && (
        <div className="px-4 pb-2">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-gray-500 dark:text-gray-400 italic"
          >
            {otherUser?.name?.split(' ')[0]} is typing...
          </motion.p>
        </div>
      )} */}
    </motion.div>
  );
};

export default ChatHeader;
