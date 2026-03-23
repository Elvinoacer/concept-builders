"use client";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import React from "react";

interface NotificationsHeaderProps {
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  unreadCount: number;
  filter: "all" | "unread";
  onFilterChange: (filter: "all" | "unread") => void;
}

const NotificationsHeader: React.FC<NotificationsHeaderProps> = ({
  onMarkAllAsRead,
  onClearAll,
  unreadCount,
  filter,
  onFilterChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8"
    >
      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell className="w-8 h-8 sm:w-10 sm:h-10 text-cream" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream leading-tight">
              Notifications
            </h1>
            <p className="text-cream-dim text-sm sm:text-base mt-1">
              {unreadCount > 0
                ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                : "All caught up!"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="px-4 py-2 text-sm font-medium text-cream-dim bg-surface border border-cb-border rounded-lg hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark All Read
          </button>
          <button
            onClick={onClearAll}
            className="px-4 py-2 text-sm font-medium text-destructive bg-surface border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-surface rounded-2xl w-fit">
        <button
          onClick={() => onFilterChange("all")}
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
            filter === "all"
              ? "bg-card text-cream shadow-sm"
              : "text-cream-dim hover:text-cream"
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange("unread")}
          className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
            filter === "unread"
              ? "bg-card text-cream shadow-sm"
              : "text-cream-dim hover:text-cream"
          }`}
        >
          Unread
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationsHeader;
