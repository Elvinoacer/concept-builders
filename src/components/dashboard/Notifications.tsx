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
    <section className="mt-8">
      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h3>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {notifications.map((notification, index) => (
            <div key={index} className="flex items-center gap-6 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 rounded-lg">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center rounded-full shrink-0 size-14">
                <span className="material-symbols-outlined text-white text-3xl">{notification.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-lg font-bold dark:text-white">
                  {notification.title}
                </p>
                <p className="text-gray-600 text-md dark:text-gray-400">
                  {notification.description}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 self-start">
                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Notifications;
