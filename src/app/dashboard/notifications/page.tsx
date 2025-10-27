"use client";
import React, { useEffect, useState, useCallback } from "react";
import NotificationsHeader from "@/components/dashboard/notifications/NotificationsHeader";
import NotificationList from "@/components/dashboard/notifications/NotificationList";

export type Notification = {
  id: string;
  icon: string;
  title: string;
  description: string;
  createdAt: string; // Will be Date object, but fetched as string
  read: boolean;
  userId: string;
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/notifications");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Notification[] = await response.json();
      setNotifications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchNotifications(); // Re-fetch to update UI
    } catch (err: any) {
      console.error("Failed to mark all as read:", err);
      setError("Failed to mark all as read.");
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await fetch("/api/notifications/clear-all", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchNotifications(); // Re-fetch to update UI
    } catch (err: any) {
      console.error("Failed to clear all notifications:", err);
      setError("Failed to clear all notifications.");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchNotifications(); // Re-fetch to update UI
    } catch (err: any) {
      console.error("Failed to mark notification as read:", err);
      setError("Failed to mark notification as read.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchNotifications(); // Re-fetch to update UI
    } catch (err: any) {
      console.error("Failed to delete notification:", err);
      setError("Failed to delete notification.");
    }
  };

  if (loading) {
    return (
      <div className="layout-content-container flex flex-col w-full max-w-[960px] mx-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <NotificationsHeader onMarkAllAsRead={handleMarkAllAsRead} onClearAll={handleClearAll} />
        <p className="text-center text-gray-600 dark:text-gray-400">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="layout-content-container flex flex-col w-full max-w-[960px] mx-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <NotificationsHeader onMarkAllAsRead={handleMarkAllAsRead} onClearAll={handleClearAll} />
        <p className="text-center text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="layout-content-container flex flex-col w-full max-w-[960px] mx-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <NotificationsHeader onMarkAllAsRead={handleMarkAllAsRead} onClearAll={handleClearAll} />
      <NotificationList notifications={notifications} onMarkAsRead={handleMarkAsRead} onDelete={handleDelete} />
    </div>
  );
};

export default NotificationsPage;
