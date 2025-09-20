"use client";
import React from "react";
import NotificationItem from "./NotificationItem";

interface Notification {
  id: number;
  color: string;
  icon: string;
  title: string;
  description: string;
}

const NotificationList = ({ notifications }: { notifications: Notification[] }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationList;
