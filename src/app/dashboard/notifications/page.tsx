"use client";
import React, { useEffect, useState, useCallback } from "react";
import NotificationsHeader from "@/components/dashboard/notifications/NotificationsHeader";
import NotificationList from "@/components/dashboard/notifications/NotificationList";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Bell } from "lucide-react";

export type Notification = {
  id: string;
  icon: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  userId: string;
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filteredNotifications = notifications.filter(
    (notification) => filter === "all" || !notification.read
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/notifications");
      if (!response.ok) {
        throw new Error(`Failed to load notifications: ${response.status}`);
      }
      const data: Notification[] = await response.json();
      setNotifications(data);
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
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
        throw new Error(`Failed to mark all as read: ${response.status}`);
      }
      fetchNotifications();
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
        throw new Error(`Failed to clear all: ${response.status}`);
      }
      fetchNotifications();
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
        throw new Error(`Failed to mark as read: ${response.status}`);
      }
      fetchNotifications();
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
        throw new Error(`Failed to delete: ${response.status}`);
      }
      fetchNotifications();
    } catch (err: any) {
      console.error("Failed to delete notification:", err);
      setError("Failed to delete notification.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 min-[375px]:px-5 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto py-6 sm:py-8">
          {/* Skeleton Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
            <div className="flex gap-3">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>

          {/* Skeleton Notifications */}
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Unable to Load Notifications
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchNotifications}
            className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 min-[375px]:px-5 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto py-6 sm:py-8">
        <NotificationsHeader
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAll}
          unreadCount={unreadCount}
          filter={filter}
          onFilterChange={setFilter}
        />

        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 sm:py-16"
            >
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {filter === "unread"
                  ? "No Unread Notifications"
                  : "No Notifications"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "unread"
                  ? "You're all caught up! No unread notifications."
                  : "You don't have any notifications yet."}
              </p>
            </motion.div>
          ) : (
            <NotificationList
              notifications={filteredNotifications}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationsPage;
