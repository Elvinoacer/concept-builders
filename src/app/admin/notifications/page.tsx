"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import {
  FiBell,
  FiCheckCircle,
  FiCheckSquare,
  FiEye,
  FiFilter,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  description: string;
  read: boolean;
  createdAt: Date;
  icon?: string;
  type?: "info" | "warning" | "success" | "error";
}

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/notifications");
      if (!response.ok) {
        throw new Error("Failed to fetch notifications");
      }
      const data = await response.json();
      setNotifications(data);
      setFilteredNotifications(data);
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      toast.error(`Failed to load notifications: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Filter notifications based on search and filter
  useEffect(() => {
    let filtered = notifications;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (notif) =>
          notif.title.toLowerCase().includes(query) ||
          notif.description.toLowerCase().includes(query)
      );
    }

    // Apply read/unread filter
    if (filter === "unread") {
      filtered = filtered.filter((notif) => !notif.read);
    } else if (filter === "read") {
      filtered = filtered.filter((notif) => notif.read);
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchQuery, filter]);

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
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      setSelectedNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      toast.success("Notification marked as read.");
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      toast.error(`Failed to mark as read: ${error.message}`);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleMarkMultipleAsRead = async () => {
    if (selectedNotifications.size === 0) return;

    const selectedArray = Array.from(selectedNotifications);
    setLoadingStates((prev) => {
      const newStates = { ...prev };
      selectedArray.forEach((id) => {
        newStates[id] = true;
      });
      return newStates;
    });

    try {
      const response = await fetch("/api/admin/notifications/bulk", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: selectedArray,
          read: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to mark notifications as read");
      }

      setNotifications((prev) =>
        prev.map((notif) =>
          selectedNotifications.has(notif.id) ? { ...notif, read: true } : notif
        )
      );
      setSelectedNotifications(new Set());
      toast.success(
        `${selectedNotifications.size} notifications marked as read.`
      );
    } catch (error: any) {
      console.error("Error marking notifications as read:", error);
      toast.error(`Failed to mark as read: ${error.message}`);
    } finally {
      setLoadingStates((prev) => {
        const newStates = { ...prev };
        selectedArray.forEach((id) => {
          newStates[id] = false;
        });
        return newStates;
      });
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
      setSelectedNotifications((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      toast.success("Notification deleted.");
    } catch (error: any) {
      console.error("Error deleting notification:", error);
      toast.error(`Failed to delete notification: ${error.message}`);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteMultiple = async () => {
    if (selectedNotifications.size === 0) return;

    const selectedArray = Array.from(selectedNotifications);
    setLoadingStates((prev) => {
      const newStates = { ...prev };
      selectedArray.forEach((id) => {
        newStates[id] = true;
      });
      return newStates;
    });

    try {
      const response = await fetch("/api/admin/notifications/bulk", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedArray }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete notifications");
      }

      setNotifications((prev) =>
        prev.filter((notif) => !selectedNotifications.has(notif.id))
      );
      setSelectedNotifications(new Set());
      toast.success(`${selectedNotifications.size} notifications deleted.`);
    } catch (error: any) {
      console.error("Error deleting notifications:", error);
      toast.error(`Failed to delete notifications: ${error.message}`);
    } finally {
      setLoadingStates((prev) => {
        const newStates = { ...prev };
        selectedArray.forEach((id) => {
          newStates[id] = false;
        });
        return newStates;
      });
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

  const selectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map((n) => n.id)));
    }
  };

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "warning":
        return "⚠️";
      case "success":
        return "✅";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "success":
        return "text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400";
      case "error":
        return "text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400";
    }
  };

  // Mobile Card View
  const NotificationCard = ({
    notification,
  }: {
    notification: Notification;
  }) => (
    <Card
      className={`
        transition-all duration-200 border-l-4
        ${
          notification.read
            ? "border-l-gray-300 dark:border-l-gray-600 bg-gray-50/50 dark:bg-gray-800/50"
            : "border-l-blue-500 bg-white dark:bg-gray-800 shadow-sm"
        }
        ${
          selectedNotifications.has(notification.id)
            ? "ring-2 ring-blue-500 dark:ring-blue-400"
            : ""
        }
      `}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Selection Checkbox */}
            <button
              onClick={() => toggleSelectNotification(notification.id)}
              className={`w-5 h-5 rounded border-2 mt-1 flex-shrink-0 transition-colors ${
                selectedNotifications.has(notification.id)
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              {selectedNotifications.has(notification.id) && (
                <FiCheckSquare className="w-4 h-4 text-white" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle
                  className={`text-base font-semibold truncate ${
                    notification.read
                      ? "text-gray-600 dark:text-gray-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {notification.title}
                </CardTitle>
                {notification.type && (
                  <Badge
                    variant="secondary"
                    className={`text-xs px-2 py-0 ${getTypeColor(notification.type)}`}
                  >
                    {getNotificationIcon(notification.type)} {notification.type}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm line-clamp-2">
                {notification.description}
              </CardDescription>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {!notification.read && (
              <Badge
                variant="default"
                className="bg-blue-500 text-white text-xs"
              >
                New
              </Badge>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {formatDistanceToNow(new Date(notification.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <FiBell className="w-4 h-4" />
            <span>{notification.read ? "Read" : "Unread"}</span>
          </div>

          <div className="flex items-center gap-1">
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkAsRead(notification.id)}
                disabled={loadingStates[notification.id]}
                className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
              >
                {loadingStates[notification.id] ? (
                  <CgSpinner className="w-4 h-4 animate-spin" />
                ) : (
                  <FiCheckCircle className="w-4 h-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteNotification(notification.id)}
              disabled={loadingStates[notification.id]}
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              {loadingStates[notification.id] ? (
                <CgSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <FiTrash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
              {selectedNotifications.size === filteredNotifications.length
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
              {selectedNotifications.size === filteredNotifications.length
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

export default AdminNotificationsPage;
