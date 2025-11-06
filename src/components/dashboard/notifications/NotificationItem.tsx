"use client";
import { Notification } from "@/app/dashboard/notifications/page";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bell,
  Check,
  MessageSquare,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import React from "react";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const iconMap: { [key: string]: JSX.Element } = {
  new_order: <ShoppingCart className="w-5 h-5 text-blue-500" />,
  new_message: <MessageSquare className="w-5 h-5 text-green-500" />,
  system_alert: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  default: <Bell className="w-5 h-5 text-gray-500" />,
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
      .replace("about ", "")
      .replace("less than a minute ago", "just now");
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`relative flex items-start gap-3 sm:gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border transition-all ${
        notification.read
          ? "border-gray-200 dark:border-gray-700"
          : "border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20"
      }`}
    >
      {/* Unread Indicator */}
      {!notification.read && (
        <div className="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full"></div>
      )}

      {/* Icon */}
      <div
        className={`flex-shrink-0 mt-0.5 ${!notification.read ? "ml-3" : ""}`}
      >
        {iconMap[notification.icon] || iconMap.default}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
          <h3
            className={`text-sm font-semibold leading-tight ${
              notification.read
                ? "text-gray-900 dark:text-white"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {notification.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
            {formatTime(notification.createdAt)}
          </p>
        </div>

        {notification.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
            {notification.description}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {!notification.read && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onMarkAsRead(notification.id)}
            className="p-2 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            title="Mark as read"
          >
            <Check className="w-4 h-4" />
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(notification.id)}
          className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default NotificationItem;
