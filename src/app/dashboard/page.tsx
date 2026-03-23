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
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import PhoneNumberModal from "@/components/dashboard/PhoneNumberModal";
import { NotificationPermissionModal } from "@/components/notifications/NotificationPermissionModal";

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
      setActiveView("list");
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
    window.location.reload();
  };

  // Enhanced stats with trends
  const defaultStats = [
    { 
      name: "Purchased Designs", 
      value: "0", 
      icon: "download", 
      trend: "up", 
      trendValue: "0%",
    },
    { 
      name: "Active Requests", 
      value: "0", 
      icon: "pending", 
      trend: "neutral", 
      trendValue: "0%",
    },
    { 
      name: "Favorites", 
      value: "0", 
      icon: "favorite", 
      trend: "up", 
      trendValue: "0%",
    },
    { 
      name: "Downloads", 
      value: "0", 
      icon: "file_download", 
      trend: "up", 
      trendValue: "0%",
    },
  ];

  const displayStats = stats.length > 0 ? stats : defaultStats;

  // Trend icon component
  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="w-3 h-3" />;
    if (trend === "down") return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  return (
    <div className="min-h-screen bg-ink relative overflow-hidden">
      <NotificationPermissionModal />
      <div className="px-3 xs:px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 relative z-10">
        {/* Header Section */}
        <motion.header
          className="mb-8 sm:mb-10 lg:mb-14"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div className="flex-1 min-w-0">
              <motion.div
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gold/10 border border-border-gold text-gold text-xs font-bold tracking-wider uppercase mb-5 backdrop-blur-sm"
                variants={headerVariants}
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gold"></span>
                </span>
                Dashboard Overview
              </motion.div>

              <motion.h1
                variants={headerVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-cream mb-4 tracking-tight leading-tight"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                Welcome back,{" "}
                <span className="text-gold">
                  {session?.user?.name?.split(" ")[0] || "User"}
                </span>
              </motion.h1>

              <motion.p
                variants={headerVariants}
                transition={{ delay: 0.1 }}
                className="text-lg sm:text-xl text-cream-dim max-w-2xl leading-relaxed"
              >
                Manage your projects, view purchased designs, and explore new architectural possibilities.
              </motion.p>
            </div>

            {/* Action Buttons */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                onClick={refreshData}
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-3.5 bg-card backdrop-blur-xl border border-cb-border text-cream-dim hover:text-gold rounded-2xl shadow-lg hover:shadow-xl hover:border-border-gold transition-all"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>

              {/* View Toggle */}
              {!isMobile && (
                <div className="flex bg-card backdrop-blur-xl border border-cb-border rounded-2xl p-1.5 shadow-lg">
                  <button
                    onClick={() => setActiveView("grid")}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      activeView === "grid"
                        ? "bg-gold text-ink shadow-lg shadow-gold/30"
                        : "text-cream-dim hover:text-cream hover:bg-surface"
                    }`}
                    title="Grid View"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveView("list")}
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      activeView === "list"
                        ? "bg-gold text-ink shadow-lg shadow-gold/30"
                        : "text-cream-dim hover:text-cream hover:bg-surface"
                    }`}
                    title="List View"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Enhanced Stats Grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
            variants={containerVariants}
          >
            {displayStats.map((stat, index) => (
              <motion.div
                key={stat.name}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="relative group"
              >
                <div className="relative bg-card backdrop-blur-xl p-5 sm:p-7 rounded-3xl shadow-xl border border-cb-border hover:border-border-gold hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-3.5 rounded-2xl bg-gold/10 shadow-lg group-hover:scale-110 transition-transform duration-300 relative overflow-hidden"
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      
                      {loading ? (
                        <div className="w-7 h-7 bg-gold/20 rounded animate-pulse"></div>
                      ) : (
                        <span className="material-symbols-outlined text-3xl text-gold relative z-10">
                          {stat.icon}
                        </span>
                      )}
                    </div>
                    
                    {/* Trend indicator */}
                    {!loading && stat.trend && (
                      <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        stat.trend === "up" 
                          ? "bg-emerald-900/30 text-emerald-400"
                          : stat.trend === "down"
                          ? "bg-red-900/30 text-red-400"
                          : "bg-surface text-cream-dim"
                      }`}>
                        <TrendIcon trend={stat.trend} />
                        <span>{stat.trendValue}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {loading ? (
                      <>
                        <div className="h-8 bg-surface rounded-lg mb-2 animate-pulse"></div>
                        <div className="h-4 bg-surface rounded animate-pulse w-3/4"></div>
                      </>
                    ) : (
                      <>
                        <p className="text-3xl sm:text-4xl font-black text-cream mb-1 tracking-tight">
                          {stat.value}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-cream-dim tracking-wide">
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
              className="mt-6 flex gap-2.5 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {[
                { icon: Download, label: "Downloads" },
                { icon: Heart, label: "Favorites" },
                { icon: Clock, label: "Recent" },
                { icon: Filter, label: "Filters" },
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-card backdrop-blur-xl border border-cb-border rounded-2xl text-xs font-bold text-cream-dim whitespace-nowrap flex-shrink-0 shadow-lg hover:shadow-xl hover:border-border-gold hover:text-gold transition-all"
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.header>

        {/* Main Content Grid */}
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-4 gap-5 sm:gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Left Column - Main Content */}
          <div className="xl:col-span-3 space-y-6 sm:space-y-8">
            <motion.div
              variants={itemVariants}
              className="bg-card backdrop-blur-xl rounded-3xl sm:rounded-[2rem] border border-cb-border overflow-hidden shadow-2xl"
            >
              <PurchasedDesigns
                searchQuery={searchQuery}
                viewMode={activeView}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-card backdrop-blur-xl rounded-3xl sm:rounded-[2rem] border border-cb-border overflow-hidden shadow-2xl"
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
              className="bg-card backdrop-blur-xl rounded-3xl sm:rounded-[2rem] border border-cb-border overflow-hidden shadow-2xl"
            >
              <RecommendedDesigns />
            </motion.div>

            {/* Notifications */}
            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.5 }}
              className="bg-card backdrop-blur-xl rounded-3xl sm:rounded-[2rem] border border-cb-border overflow-hidden shadow-2xl"
            >
              <Notifications compact={isMobile} />
            </motion.div>

            {/* Quick Tip for Mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative overflow-hidden bg-gold/10 border border-border-gold rounded-3xl p-5 shadow-xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <h3 className="text-sm font-black text-gold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">tips_and_updates</span>
                    Quick Tip
                  </h3>
                  <p className="text-cream-dim text-xs leading-relaxed font-medium">
                    Swipe left on designs to access quick actions like download and favorite.
                  </p>
                </div>
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
              className="fixed inset-0 bg-black/30 backdrop-blur-md z-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-cb-border"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 border-4 border-gold/20 border-t-gold rounded-full"
                  />
                  <span className="text-cream font-bold text-lg">
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
