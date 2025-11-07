"use client";
import MyRequests from "@/components/dashboard/MyRequests";
import Notifications from "@/components/dashboard/Notifications";
import PurchasedDesigns from "@/components/dashboard/PurchasedDesigns";
import RecommendedDesigns from "@/components/dashboard/RecommendedDesigns";
import { useSearch } from "@/lib/SearchContext";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Clock,
  Download,
  Filter,
  Grid3X3,
  Heart,
  List,
  RefreshCw,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PhoneNumberModal from "@/components/dashboard/PhoneNumberModal";

const DashboardPage = () => {
  const { data: session } = useSession();
  const { searchQuery } = useSearch();
  const [stats, setStats] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPhoneNumberModal, setShowPhoneNumberModal] = useState(false);

  useEffect(() => {
    const checkPhoneNumber = async () => {
      if (session?.user) {
        // @ts-ignore
        if (!session.user.phone) {
          const hasDismissed = localStorage.getItem("hasDismissedPhoneModal");
          if (!hasDismissed) {
            setShowPhoneNumberModal(true);
          }
        }
      }
    };

    checkPhoneNumber();
  }, [session]);

  const handlePhoneNumberSubmit = async (phoneNumber: string) => {
    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      if (response.ok) {
        setShowPhoneNumberModal(false);
        // Optionally, you can update the session data here to reflect the change immediately
      } else {
        console.error("Failed to update phone number");
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
    }
  };

  const handleModalClose = () => {
    setShowPhoneNumberModal(false);
  };

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Set default view based on screen size
  useEffect(() => {
    if (isMobile) {
      setActiveView("list"); // Better for mobile
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 10 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const refreshData = async () => {
    // Implement refresh logic here
    window.location.reload();
  };

  // Default stats if API fails
  const defaultStats = [
    { name: "Purchased Designs", value: "0", icon: "download" },
    { name: "Active Requests", value: "0", icon: "pending" },
    { name: "Favorites", value: "0", icon: "favorite" },
    { name: "Downloads", value: "0", icon: "file_download" },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      <div className="px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <motion.header
          className="mb-6 sm:mb-8 lg:mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex-1 min-w-0">
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 text-blue-600 dark:text-blue-400 text-xs font-medium mb-3"
                variants={headerVariants}
              >
                <Bell className="w-3 h-3" />
                Your Dashboard
              </motion.div>

              <motion.h1
                variants={headerVariants}
                className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-gray-900 dark:text-white mb-2"
              >
                Welcome Back, {session?.user?.name?.split(" ")[0] || "User"}!
              </motion.h1>

              <motion.p
                variants={headerVariants}
                transition={{ delay: 0.1 }}
                className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                Here's a summary of your account and recent activity.
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={refreshData}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl transition-all duration-200"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>

              {/* View Toggle - Hidden on mobile since we default to list */}
              {!isMobile && (
                <div className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl p-1">
                  <button
                    onClick={() => setActiveView("grid")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      activeView === "grid"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveView("list")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      activeView === "list"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
            variants={containerVariants}
          >
            {displayStats.map((stat, index) => (
              <motion.div
                key={stat.name}
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.2 },
                }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-600/30 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 group-hover:scale-110 transition-transform duration-300 ${
                      loading ? "animate-pulse" : ""
                    }`}
                  >
                    {loading ? (
                      <div className="w-6 h-6 bg-white/20 rounded"></div>
                    ) : (
                      <span className="material-symbols-outlined text-2xl text-white">
                        {stat.icon}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {loading ? (
                      <>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                          {stat.value}
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          {stat.name}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions for Mobile */}
          {isMobile && (
            <motion.div
              className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-2 px-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { icon: Download, label: "Downloads", color: "blue" },
                { icon: Heart, label: "Favorites", color: "pink" },
                { icon: Clock, label: "Recent", color: "amber" },
                { icon: Filter, label: "Filters", color: "gray" },
              ].map((action, index) => (
                <motion.button
                  key={action.label}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap flex-shrink-0"
                >
                  <action.icon className="w-3 h-3" />
                  {action.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.header>

        {/* Main Content Grid */}
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Left Column - Main Content */}
          <div className="xl:col-span-3 space-y-6 sm:space-y-8">
            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              <PurchasedDesigns
                searchQuery={searchQuery}
                viewMode={activeView}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              <MyRequests />
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="xl:col-span-1 space-y-6 sm:space-y-8">
            {/* Recommended Designs */}
            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.4 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              <RecommendedDesigns />
            </motion.div>

            {/* Notifications - Compact on mobile */}
            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.5 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl border-2 border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
            >
              <Notifications compact={isMobile} />
            </motion.div>

            {/* Quick Stats for Mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200/50 dark:border-blue-700/30 rounded-2xl p-4"
              >
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Quick Tip
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-xs leading-relaxed">
                  Swipe left on designs to access quick actions like download
                  and favorite.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-2xl shadow-2xl border-2 border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full"
                  />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    Loading your dashboard...
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <PhoneNumberModal
        isOpen={showPhoneNumberModal}
        onClose={handleModalClose}
        onSubmit={handlePhoneNumberSubmit}
      />
    </div>
  );
};

export default DashboardPage;
