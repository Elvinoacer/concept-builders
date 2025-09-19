"use client";
import React from "react";

const NotificationsHeader = () => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
      <h1 className="text-gray-900 text-4xl font-bold tracking-tight dark:text-white">
        Notifications
      </h1>
      <div className="flex gap-4">
        <button className="text-sm font-medium text-gray-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-blue-600 to-cyan-400 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
          Mark all as read
        </button>
        <button className="text-sm font-medium text-gray-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-blue-600 to-cyan-400 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
          Settings
        </button>
      </div>
    </div>
  );
};

export default NotificationsHeader;
