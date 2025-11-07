"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useSearch } from "@/lib/SearchContext";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import {
  Search,
  ShoppingCart,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";

const DashboardHeader = ({
  setIsSidebarOpen,
  isSidebarOpen,
}: {
  setIsSidebarOpen: (isOpen: boolean) => void;
  isSidebarOpen: boolean;
}) => {
  const { searchQuery, setSearchQuery, resultsRef } = useSearch();
  const { data: session } = useSession();
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { cartCount } = useCart();

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/notifications/unread-count");
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

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      title: "New design template available",
      time: "5 min ago",
      unread: true,
      type: "info",
    },
    {
      id: 2,
      title: "Project approved by client",
      time: "1 hour ago",
      unread: true,
      type: "success",
    },
    {
      id: 3,
      title: "Weekly design inspiration",
      time: "2 hours ago",
      unread: false,
      type: "update",
    },
    {
      id: 4,
      title: "New message from Sarah",
      time: "1 day ago",
      unread: false,
      type: "message",
    },
  ];

  const quickActions = [
    { label: "New Project", icon: Sparkles, href: "/dashboard/projects/new" },
    { label: "Templates", icon: Zap, href: "/designs" },
    { label: "Analytics", icon: TrendingUp, href: "/dashboard/analytics" },
  ];

  return (
    <header className="flex-shrink-0 w-full border-b border-gray-200/80 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl sticky top-0 z-40 shadow-sm dark:border-gray-800/80">
      <div className="flex items-center justify-between w-full px-4 sm:px-6 lg:px-8 py-3">
        {/* Left Section - Menu Button & Brand */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-all duration-300 dark:text-gray-300 dark:hover:text-blue-400 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>

          {/* Brand Logo/Name - Hidden on mobile, visible on desktop */}
          <Link
            href="/dashboard"
            className="hidden md:flex items-center gap-3 group"
          >
            <div className="relative">
              <Image
                src="/images/concept-builders-logo-free-bg.png"
                alt="Concept Builders Logo"
                width={40}
                height={40}
                className="w-8 h-8 rounded-lg transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                Concept Builders
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                Dashboard
              </span>
            </div>
          </Link>
        </div>

        {/* Center Section - Search Bar & Quick Actions */}
        <div className="flex-1 max-w-2xl mx-4 sm:mx-6 lg:mx-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full group">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors group-focus-within:text-blue-500" />
              <input
                type="text"
                placeholder="Search designs, projects, templates..."
                className="w-full h-12 pl-12 pr-24 rounded-2xl border border-gray-300/80 dark:border-gray-700/80 bg-gray-50/80 dark:bg-gray-800/80 focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {/* Quick Actions */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
                <div className="flex items-center gap-1">
                  {quickActions
                    .slice(0, isMobile ? 1 : 2)
                    .map((action, index) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                      >
                        <action.icon size={12} />
                        <span className="hidden sm:inline">{action.label}</span>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {/* Theme Toggle */}
          <div className="hidden sm:flex items-center">
            <ModeToggle />
          </div>

          {/* Cart */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:text-blue-600 transition-all duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-400 shadow-lg border-2 border-white dark:border-gray-900"
                >
                  {cartCount > 9 ? "9+" : cartCount}
                </motion.span>
              )}
            </Link>
          </motion.div>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:text-blue-600 transition-all duration-300 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              aria-label={`Notifications ${unreadNotificationCount > 0 ? `(${unreadNotificationCount} unread)` : ""}`}
            >
              <Bell size={20} />
              {unreadNotificationCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 border-2 border-white dark:border-gray-900 shadow-sm flex items-center justify-center"
                >
                  <span className="text-xs font-bold text-white">
                    {unreadNotificationCount > 9
                      ? "9+"
                      : unreadNotificationCount}
                  </span>
                </motion.div>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm z-50"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {unreadNotificationCount} unread
                      </span>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                          notification.unread
                            ? "bg-blue-50/50 dark:bg-blue-900/10"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.unread
                                ? "bg-blue-500"
                                : "bg-gray-300 dark:bg-gray-600"
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                    <Link
                      href="/dashboard/notifications"
                      className="block text-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      View all notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative" ref={userDropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 group"
            >
              <div className="relative">
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    width={36}
                    height={36}
                    className="rounded-full w-9 h-9 border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-200 dark:group-hover:border-blue-400 transition-colors"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white dark:border-gray-700 shadow-lg">
                    <User size={16} />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                  {session?.user?.name?.split(" ")[0] || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight capitalize">
                  {session?.user?.role?.toLowerCase() || "client"}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  isUserDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </motion.button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {isUserDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm z-50"
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={48}
                          height={48}
                          className="rounded-full w-12 h-12 border-2 border-gray-200 dark:border-gray-600"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {session?.user?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {session?.user?.email}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium capitalize">
                            {session?.user?.role?.toLowerCase() || "client"}
                          </span>
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <User size={18} />
                      <span>My Dashboard</span>
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setIsUserDropdownOpen(false);
                        // Add logout logic here
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 w-full"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
