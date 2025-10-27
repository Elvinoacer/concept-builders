"use client";
import React from "react";
import {
  Bell,
  ShoppingCart,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Notification } from "@/app/dashboard/notifications/page"; // Import the Notification type

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const iconMap: { [key: string]: JSX.Element } = {
  new_order: <ShoppingCart className="w-6 h-6 text-blue-500" />,
  new_message: <MessageSquare className="w-6 h-6 text-green-500" />,
  system_alert: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
  default: <Bell className="w-6 h-6 text-gray-500" />,
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  return (
    <div
      className="flex items-start p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
    >
      <div className="flex-shrink-0">
        {iconMap[notification.icon] || iconMap.default}
      </div>
      <div className="ml-4 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {notification.title}
        </p>
        {notification.description && (
          <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
            {notification.description}
          </p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
      <div className="flex items-center space-x-2 ml-4">
        {!notification.read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            title="Mark as read"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          title="Delete"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
