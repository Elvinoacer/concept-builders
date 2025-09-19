"use client";
import React from "react";
import NotificationItem from "./NotificationItem";

const NotificationList = ({ notifications }: { notifications: any[] }) => {
  return (
    <div className="flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationList;
