"use client";
import React from "react";

interface Notification {
  color: string;
  icon: string;
  title: string;
  description: string;
}

const NotificationItem = ({ notification }: { notification: Notification }) => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200";
      case "green":
        return "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200";
      case "purple":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200";
      case "pink":
        return "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-200";
      case "teal":
        return "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-200";
      case "indigo":
        return "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200";
      case "lime":
        return "bg-lime-100 text-lime-600 dark:bg-lime-900 dark:text-lime-200";
      case "cyan":
        return "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-200";
      case "orange":
        return "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="flex items-center gap-4 px-4 py-3 md:px-6 md:py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors last:border-b-0 dark:border-gray-700 dark:hover:bg-gray-700">
      <div
        className={`flex items-center justify-center rounded-full shrink-0 size-10 md:size-12 ${getColorClasses(
          notification.color
        )}`}
      >
        <span className="material-symbols-outlined">{notification.icon}</span>
      </div>
      <div className="flex-grow">
        <p className="text-gray-800 text-sm md:text-base font-medium dark:text-white">
          {notification.title}
        </p>
        <p className="text-gray-500 text-sm dark:text-gray-400">
          {notification.description}
        </p>
      </div>
      <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors">
        <span className="material-symbols-outlined">close</span>
      </button>
    </div>
  );
};

export default NotificationItem;
