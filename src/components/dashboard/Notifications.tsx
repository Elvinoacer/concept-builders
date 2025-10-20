"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { formatDistanceToNow } from 'date-fns';

const Notifications = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (session) {
      fetchNotifications();
    }
  }, [session]);

  return (
    <section className="mt-4 md:mt-8">
      <h3 className="text-gray-800 text-lg md:text-xl font-bold leading-tight tracking-[-0.015em] mb-2 md:mb-4 dark:text-white">
        Notifications
      </h3>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700">
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 flex items-center justify-center rounded-full bg-blue-100 shrink-0 size-10 md:size-12 dark:bg-blue-900">
              <span className="material-symbols-outlined">{notification.icon}</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-800 text-base font-medium dark:text-white">
                {notification.title}
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {notification.description}
              </p>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Notifications;
