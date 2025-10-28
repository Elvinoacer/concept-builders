"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CgSpinner } from "react-icons/cg";
import { FiCheckCircle, FiTrash, FiEye } from "react-icons/fi";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: Date;
  icon?: string; // Optional icon for display
}

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/notifications");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      toast.error(`Failed to load notifications: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notification as read");
      }

      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
      );
      toast.success("Notification marked as read.");
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      toast.error(`Failed to mark as read: ${error.message}`);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteNotification = async (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete notification");
      }

      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
      toast.success("Notification deleted.");
    } catch (error: any) {
      console.error("Error deleting notification:", error);
      toast.error(`Failed to delete notification: ${error.message}`);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Notifications</h1>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <CgSpinner className="animate-spin text-primary" size={32} />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-muted-foreground h-48 flex items-center justify-center">
          No notifications found.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id} className={notification.read ? "text-muted-foreground" : "font-semibold"}>
                <TableCell>
                  {notification.read ? (
                    <FiEye className="text-gray-500" title="Read" />
                  ) : (
                    <FiCheckCircle className="text-blue-500" title="Unread" />
                  )}
                </TableCell>
                <TableCell>{notification.title}</TableCell>
                <TableCell>{notification.description}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={loadingStates[notification.id]}
                        title="Mark as Read"
                      >
                        {loadingStates[notification.id] ? (
                          <CgSpinner className="animate-spin" />
                        ) : (
                          <FiCheckCircle />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteNotification(notification.id)}
                      disabled={loadingStates[notification.id]}
                      title="Delete Notification"
                    >
                      {loadingStates[notification.id] ? (
                        <CgSpinner className="animate-spin" />
                      ) : (
                        <FiTrash />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AdminNotificationsPage;
