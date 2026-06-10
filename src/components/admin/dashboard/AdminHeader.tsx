"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

const AdminHeader = (props: {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (arg: boolean) => void;
  isMobile: boolean;
}) => {
  const { data: session, status } = useSession();
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Fetch unread notifications
  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (session?.user?.role === "ADMIN") {
        try {
          const response = await fetch("/api/admin/notifications/unread-count");
          if (response.ok) {
            const data = await response.json();
            setUnreadNotificationCount(data.unreadCount);
          }
        } catch (error) {
          console.error("Failed to fetch unread notification count:", error);
        }
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [session]);

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 flex w-full bg-card border-b border-cb-border backdrop-blur-sm shadow-sm">
      <div className="flex flex-grow items-center justify-between px-3 min-[375px]:px-4 sm:px-5 md:px-6 lg:px-8 py-3 min-[375px]:py-3.5 sm:py-4">
        {/* Left Section - Menu Button & Welcome */}
        <div className="flex items-center gap-2 min-[375px]:gap-3 sm:gap-4 md:gap-5">
          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="flex items-center justify-center w-10 h-10 min-[375px]:w-11 min-[375px]:h-11 rounded-xl border border-cb-border bg-surface shadow-sm transition-all duration-200 hover:bg-card hover:shadow-md md:hidden focus:outline-none focus:ring-2 focus:ring-gold/50"
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-cream-dim text-xl min-[375px]:text-2xl">
              {props.sidebarOpen ? "close" : "menu"}
            </span>
          </motion.button>

          {/* Desktop Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              props.setIsDesktopSidebarOpen(!props.isDesktopSidebarOpen)
            }
            className="hidden md:flex items-center justify-center w-10 h-10 rounded-xl border border-cb-border bg-surface shadow-sm transition-all duration-200 hover:bg-card hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gold/50"
            aria-label={
              props.isDesktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"
            }
          >
            <span className="material-symbols-outlined text-cream-dim text-xl">
              {props.isDesktopSidebarOpen ? "chevron_left" : "chevron_right"}
            </span>
          </motion.button>

          {/* Welcome Message */}
          <div className="flex items-center gap-2 min-[375px]:gap-3">
            <motion.span
              className="text-2xl min-[375px]:text-3xl hidden xs:block"
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5 }}
            >
              👋
            </motion.span>
            <div className="hidden sm:block">
              <p className="text-xs min-[375px]:text-sm text-cream-dim">
                Welcome back,
              </p>
              <div>
                {status === "loading" ? (
                  <div className="h-4 w-24 bg-card rounded animate-pulse" />
                ) : (
                  <p className="font-semibold text-cream text-sm min-[375px]:text-base">
                    {session?.user?.name?.split(" ")[0] || "Admin"}
                  </p>
                )}
              </div>
            </div>

            {/* Mobile Welcome - Compact */}
            <div className="sm:hidden">
              <p className="text-xs text-cream-dim">
                Welcome
              </p>
              {status === "loading" ? (
                <div className="h-3 w-16 bg-card rounded animate-pulse" />
              ) : (
                <p className="font-semibold text-cream text-xs">
                  {session?.user?.name?.split(" ")[0] || "Admin"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Center Section - Dashboard Title & Time */}
        <div className="flex flex-col items-center gap-1 min-[375px]:gap-2 flex-1 max-w-md mx-2 min-[375px]:mx-4">
          <div className="flex items-center gap-2 min-[375px]:gap-3">
            <span className="material-symbols-outlined text-gold text-xl min-[375px]:text-2xl hidden xs:block">
              dashboard
            </span>
            <h2 className="text-lg min-[375px]:text-xl sm:text-2xl md:text-3xl font-bold text-gold text-center">
              Admin Dashboard
            </h2>
          </div>

          {/* Date and Time */}
          <div className="hidden xs:flex items-center gap-2 text-xs min-[375px]:text-sm text-cream-dim">
            <span>{formattedDate}</span>
            <span className="w-1 h-1 bg-gold rounded-full"></span>
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-2 min-[375px]:gap-3 sm:gap-4 md:gap-5">
          {/* Notifications */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/admin/notifications"
              className="relative flex items-center justify-center w-10 h-10 min-[375px]:w-11 min-[375px]:h-11 rounded-xl bg-surface border border-cb-border shadow-sm transition-all duration-200 hover:shadow-md hover:bg-card group focus:outline-none focus:ring-2 focus:ring-gold/50"
              aria-label={`Notifications ${unreadNotificationCount > 0 ? `(${unreadNotificationCount} unread)` : ""}`}
            >
              <span className="material-symbols-outlined text-cream-dim text-xl min-[375px]:text-2xl group-hover:scale-110 transition-transform">
                notifications
              </span>
              {unreadNotificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 min-[375px]:top-2 min-[375px]:right-2 h-2.5 w-2.5 min-[375px]:h-3 min-[375px]:w-3 rounded-full bg-gold ring-2 ring-surface flex items-center justify-center"
                >
                  {unreadNotificationCount <= 9 && (
                    <span className="text-[8px] min-[375px]:text-[10px] font-bold text-white">
                      {unreadNotificationCount}
                    </span>
                  )}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* Theme Toggle removed */}

          {/* User Profile */}
          <motion.div
            className="flex items-center gap-2 min-[375px]:gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* User Avatar */}
            <div className="relative">
              {status === "loading" ? (
                <div className="w-10 h-10 min-[375px]:w-11 min-[375px]:h-11 rounded-full bg-card animate-pulse border-2 border-cb-border" />
              ) : (
                <Image
                  src={
                    session?.user?.image ||
                    "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
                  }
                  alt="User Avatar"
                  width={44}
                  height={44}
                  className="rounded-full border-2 border-cb-border shadow-sm hover:border-gold transition-colors duration-200 w-10 h-10 min-[375px]:w-11 min-[375px]:h-11"
                />
              )}
              {/* Online Indicator */}
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 min-[375px]:h-3 min-[375px]:w-3 rounded-full bg-gold border-2 border-surface"></span>
            </div>

            {/* User Info - Hidden on mobile, shown on tablet and up */}
            <div className="hidden md:block min-w-0">
              {status === "loading" ? (
                <div className="space-y-1">
                  <div className="h-4 w-24 rounded bg-card animate-pulse" />
                  <div className="h-3 w-32 rounded bg-card animate-pulse" />
                </div>
              ) : (
                <div className="min-w-0">
                  <p className="font-semibold text-cream text-sm truncate max-w-[120px] lg:max-w-[140px]">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-cream-dim truncate max-w-[120px] lg:max-w-[140px]">
                    {session?.user?.email}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
