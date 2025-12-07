"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import {
  FiBell,
  FiCheckCircle,
  FiCheckSquare,
  FiEye,
  FiFilter,
  FiSearch,
  FiSend,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: string; // Changed to string to handle JSON serialization
  icon?: string;
  type?: "info" | "warning" | "success" | "error";
  userId: string;
}

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(
    new Set()
  );
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendFormData, setSendFormData] = useState({
    title: "",
    body: "",
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/notifications");
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === "unread") return matchesSearch && !notification.read;
    if (filter === "read") return matchesSearch && notification.read;
    return matchesSearch;
  });

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: sendFormData.title,
          body: sendFormData.body,
          sendToAll: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send notification");
      }

      toast.success(`Successfully sent ${data.successCount} notifications`);
      setIsSendModalOpen(false);
      setSendFormData({ title: "", body: "" });
      fetchNotifications(); // Refresh list
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast.error(error.message || "Failed to send notification");
    } finally {
      setIsSending(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(`/api/admin/notifications/${id}/read`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      toast.success("Notification marked as read");
    } catch (error) {
      console.error("Error marking as read:", error);
      toast.error("Failed to mark as read");
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
      if (!response.ok) throw new Error("Failed to delete notification");

      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setSelectedNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      toast.success("Notification deleted");
    } catch (error) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleMarkMultipleAsRead = async () => {
    try {
      const ids = Array.from(selectedNotifications);
      const response = await fetch("/api/admin/notifications/batch/read", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) throw new Error("Failed to mark selected as read");

      setNotifications((prev) =>
        prev.map((n) => (selectedNotifications.has(n.id) ? { ...n, read: true } : n))
      );
      setSelectedNotifications(new Set());
      toast.success("Selected notifications marked as read");
    } catch (error) {
      console.error("Error batch marking as read:", error);
      toast.error("Failed to mark selected as read");
    }
  };

  const handleDeleteMultiple = async () => {
    if (!confirm("Are you sure you want to delete selected notifications?")) return;

    try {
      const ids = Array.from(selectedNotifications);
      const response = await fetch("/api/admin/notifications/batch/delete", {
        method: "POST", // Using POST for batch delete usually, or DELETE with body
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) throw new Error("Failed to delete selected notifications");

      setNotifications((prev) => prev.filter((n) => !selectedNotifications.has(n.id)));
      setSelectedNotifications(new Set());
      toast.success("Selected notifications deleted");
    } catch (error) {
      console.error("Error batch deleting:", error);
      toast.error("Failed to delete selected notifications");
    }
  };

  const selectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map((n) => n.id)));
    }
  };

  const toggleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "success": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "warning": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "error": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage and review system notifications and alerts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <FiSend className="w-4 h-4" />
                Send Notification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleSendNotification}>
                <DialogHeader>
                  <DialogTitle>Send Push Notification</DialogTitle>
                  <DialogDescription>
                    Send a notification to all users who have enabled push
                    notifications.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={sendFormData.title}
                      onChange={(e) =>
                        setSendFormData({
                          ...sendFormData,
                          title: e.target.value,
                        })
                      }
                      placeholder="Notification Title"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="body">Message</Label>
                    <Textarea
                      id="body"
                      value={sendFormData.body}
                      onChange={(e) =>
                        setSendFormData({
                          ...sendFormData,
                          body: e.target.value,
                        })
                      }
                      placeholder="Notification Message"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSending}>
                    {isSending ? (
                      <>
                        <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Bulk Actions - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            {selectedNotifications.size > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={handleMarkMultipleAsRead}
                  className="flex items-center gap-2"
                >
                  <FiCheckCircle className="w-4 h-4" />
                  Mark as Read ({selectedNotifications.size})
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDeleteMultiple}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete ({selectedNotifications.size})
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions - Mobile */}
      {selectedNotifications.size > 0 && (
        <div className="sm:hidden bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedNotifications.size} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedNotifications(new Set())}
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkMultipleAsRead}
              className="flex-1 text-xs h-8"
            >
              <FiCheckCircle className="w-3 h-3 mr-1" />
              Mark Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteMultiple}
              className="flex-1 text-xs h-8 text-red-600 hover:text-red-700"
            >
              <FiTrash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            {/* Filter Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <FiFilter className="w-4 h-4" />
                  <span className="hidden xs:inline">
                    {filter === "all"
                      ? "All"
                      : filter === "unread"
                        ? "Unread"
                        : "Read"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter("all")}>
                  All Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("unread")}>
                  Unread Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("read")}>
                  Read Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Select All - Desktop */}
            <Button
              variant="outline"
              onClick={selectAll}
              className="hidden sm:flex items-center gap-2"
            >
              <FiCheckSquare className="w-4 h-4" />
              {selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>

          {/* Select All - Mobile */}
          <div className="sm:hidden flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredNotifications.length} notifications
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={selectAll}
              className="flex items-center gap-2 text-xs"
            >
              <FiCheckSquare className="w-3 h-3" />
              {selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0
                ? "Deselect All"
                : "Select All"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 sm:py-16">
          <CgSpinner className="animate-spin text-primary w-8 h-8 sm:w-12 sm:h-12 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Loading notifications...
          </p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        /* Empty State */
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <FiBell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery || filter !== "all"
                ? "No matching notifications"
                : "No notifications yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-4">
              {searchQuery || filter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "You're all caught up! New notifications will appear here."}
            </p>
            {(searchQuery || filter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilter("all");
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <button
                        onClick={selectAll}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          selectedNotifications.size ===
                          filteredNotifications.length
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {selectedNotifications.size ===
                          filteredNotifications.length && (
                          <FiCheckSquare className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow
                      key={notification.id}
                      className={`
                        transition-colors
                        ${
                          notification.read
                            ? "text-gray-600 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50"
                            : "font-semibold bg-white dark:bg-gray-800"
                        }
                        ${
                          selectedNotifications.has(notification.id)
                            ? "bg-blue-50 dark:bg-blue-900/20"
                            : ""
                        }
                      `}
                    >
                      <TableCell>
                        <button
                          onClick={() =>
                            toggleSelectNotification(notification.id)
                          }
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedNotifications.has(notification.id)
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {selectedNotifications.has(notification.id) && (
                            <FiCheckSquare className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>
                        {notification.read ? (
                          <FiEye
                            className="text-gray-500 mx-auto"
                            title="Read"
                          />
                        ) : (
                          <FiCheckCircle
                            className="text-blue-500 mx-auto"
                            title="Unread"
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {notification.title}
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {notification.description}
                      </TableCell>
                      <TableCell>
                        {notification.type && (
                          <Badge
                            variant="secondary"
                            className={getTypeColor(notification.type)}
                          >
                            {notification.type}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={loadingStates[notification.id]}
                              title="Mark as Read"
                              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                            >
                              {loadingStates[notification.id] ? (
                                <CgSpinner className="animate-spin w-4 h-4" />
                              ) : (
                                <FiCheckCircle className="w-4 h-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteNotification(notification.id)
                            }
                            disabled={loadingStates[notification.id]}
                            title="Delete Notification"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            {loadingStates[notification.id] ? (
                              <CgSpinner className="animate-spin w-4 h-4" />
                            ) : (
                              <FiTrash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                isSelected={selectedNotifications.has(notification.id)}
                onSelect={() => toggleSelectNotification(notification.id)}
                onMarkAsRead={() => handleMarkAsRead(notification.id)}
                onDelete={() => handleDeleteNotification(notification.id)}
                isLoading={loadingStates[notification.id]}
                getTypeColor={getTypeColor}
              />
            ))}
          </div>
        </>
      )}

      {/* Stats Summary */}
      {!isLoading && filteredNotifications.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Total: {notifications.length}</span>
          <span>Unread: {notifications.filter((n) => !n.read).length}</span>
          <span>Showing: {filteredNotifications.length}</span>
        </div>
      )}
    </div>
  );
};

const NotificationCard = ({
  notification,
  isSelected,
  onSelect,
  onMarkAsRead,
  onDelete,
  isLoading,
  getTypeColor,
}: {
  notification: Notification;
  isSelected: boolean;
  onSelect: () => void;
  onMarkAsRead: () => void;
  onDelete: () => void;
  isLoading?: boolean;
  getTypeColor: (type?: string) => string;
}) => {
  return (
    <div
      className={`
        p-4 rounded-lg border transition-all
        ${
          notification.read
            ? "bg-gray-50/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
            : "bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800 shadow-sm"
        }
        ${isSelected ? "ring-2 ring-blue-500" : ""}
      `}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={onSelect}
          className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
            isSelected
              ? "bg-blue-500 border-blue-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
        >
          {isSelected && <FiCheckSquare className="w-4 h-4 text-white" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4
              className={`text-sm font-medium truncate ${
                notification.read
                  ? "text-gray-700 dark:text-gray-300"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {notification.description}
          </p>
          <div className="flex items-center justify-between">
            {notification.type && (
              <Badge
                variant="secondary"
                className={`text-xs ${getTypeColor(notification.type)}`}
              >
                {notification.type}
              </Badge>
            )}
            <div className="flex items-center gap-2 ml-auto">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAsRead}
                  disabled={isLoading}
                  className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  {isLoading ? (
                    <CgSpinner className="animate-spin w-4 h-4" />
                  ) : (
                    <span className="text-xs flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" /> Mark Read
                    </span>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                disabled={isLoading}
                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                {isLoading ? (
                  <CgSpinner className="animate-spin w-4 h-4" />
                ) : (
                  <FiTrash2 className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
