"use client";
import React from "react";

interface NotificationsHeaderProps {
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  onMarkAllAsRead,
  onClearAll,
}) => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-4 mb-4 md:mb-8">
      <h1 className="text-gray-900 text-3xl md:text-4xl font-bold tracking-tight dark:text-white">
        Notifications
      </h1>
      <div className="flex gap-4 w-full md:w-auto justify-center">
        <button
          onClick={onMarkAllAsRead}
          className="text-sm font-medium text-gray-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-blue-600 to-cyan-400 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
        >
          Mark all as read
        </button>
        <button
          onClick={onClearAll}
          className="text-sm font-medium text-red-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-red-600 to-orange-400 dark:text-red-400 dark:hover:text-red-300 transition-colors"
        >
          Clear all
        </button>
      </div>
    </div>
  );
};

export default NotificationsHeader;
