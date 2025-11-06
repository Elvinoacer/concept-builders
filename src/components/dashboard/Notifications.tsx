"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Download,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Settings,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Notifications = ({ compact = false }) => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showAll, setShowAll] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchNotifications();
    }
  }, [session]);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: true }),
      });
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const clearAll = async () => {
    try {
      await fetch("/api/notifications", { method: "DELETE" });
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const refreshNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notifications");
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get icon component based on notification type
  const getIcon = (iconName: string) => {
    const iconMap = {
      download: Download,
      check_circle: CheckCircle2,
      warning: AlertCircle,
      info: Info,
      bell: Bell,
    };

    const IconComponent = iconMap[iconName] || Bell;
    return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />;
  };

  // Get background color based on notification type
  const getIconBgColor = (type: string) => {
    const colorMap = {
      success: "from-green-500 to-green-600",
      warning: "from-amber-500 to-amber-600",
      error: "from-red-500 to-red-600",
      info: "from-blue-500 to-cyan-400",
      default: "from-gray-500 to-gray-600",
    };
    return colorMap[type] || colorMap.default;
  };

  const displayedNotifications =
    compact && !showAll ? notifications.slice(0, 3) : notifications;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3,
      },
    },
  };

  if (loading) {
    return (
      <section className={`${compact ? "mb-6" : "mt-6 sm:mt-8"}`}>
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`font-bold text-gray-900 dark:text-white ${
              compact ? "text-lg" : "text-2xl sm:text-3xl"
            }`}
          >
            Notifications
          </h3>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4 sm:p-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`${compact ? "mb-6" : "mt-6 sm:mt-8"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`font-bold text-gray-900 dark:text-white ${
            compact ? "text-lg" : "text-2xl sm:text-3xl"
          }`}
        >
          Notifications
          {notifications.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
              {notifications.length}
            </span>
          )}
        </h3>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <motion.button
              onClick={clearAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              title="Clear all"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
          <motion.button
            onClick={refreshNotifications}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Notifications Container */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-lg overflow-hidden">
        <AnimatePresence>
          {displayedNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 sm:py-12"
            >
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                No notifications yet
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                We'll notify you when something important happens
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="divide-y divide-gray-200/50 dark:divide-gray-700/50"
            >
              {displayedNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  variants={itemVariants}
                  exit="exit"
                  className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 group"
                >
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getIconBgColor(notification.type)} rounded-full flex items-center justify-center shadow-lg`}
                  >
                    {getIcon(notification.icon)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 text-base sm:text-lg font-semibold dark:text-white leading-tight mb-1">
                          {notification.title}
                        </p>
                        <p className="text-gray-600 text-sm sm:text-base dark:text-gray-400 leading-relaxed">
                          {notification.description}
                        </p>
                      </div>

                      {/* Time and Actions */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {formatDistanceToNow(
                            new Date(notification.createdAt),
                            { addSuffix: true }
                          )}
                        </span>
                        <motion.button
                          onClick={() => markAsRead(notification.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-200"
                          title="Mark as read"
                        >
                          <X className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Action Buttons for specific notification types */}
                    {notification.action && (
                      <div className="mt-3 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
                          onClick={() =>
                            (window.location.href = notification.actionUrl)
                          }
                        >
                          {notification.action}
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Show More/Less for compact mode */}
        {compact && notifications.length > 3 && (
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
            >
              {showAll ? "Show Less" : `Show All (${notifications.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Settings Link for non-compact view */}
      {!compact && (
        <div className="mt-4 text-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-sm font-medium transition-colors duration-200"
          >
            <Settings className="w-4 h-4" />
            Notification Settings
          </motion.button>
        </div>
      )}
    </section>
  );
};

export default Notifications;
