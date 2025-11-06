"use client";
import React from "react";
import NotificationItem from "./NotificationItem";
import { Notification } from "@/app/dashboard/notifications/page";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
  onDelete,
}) => {
  return (
    <motion.div layout className="space-y-3">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            layout
          >
            <NotificationItem
              notification={notification}
              onMarkAsRead={onMarkAsRead}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default NotificationList;
