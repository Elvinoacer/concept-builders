"use client";
import MyRequests from "@/components/dashboard/MyRequests";
import Notifications from "@/components/dashboard/Notifications";
import PurchasedDesigns from "@/components/dashboard/PurchasedDesigns";
import RecommendedDesigns from "@/components/dashboard/RecommendedDesigns";
import { useSearch } from "@/lib/SearchContext";
import { AnimatePresence, motion } from "framer-motion";
import {
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
  const [activeView, setActiveView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [showPhoneNumberModal, setShowPhoneNumberModal] = useState(false);

  useEffect(() => {
    const checkPhoneNumber = async () => {
      if (session?.user) {
        if (!(session.user as { phone?: string }).phone) {
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
        ease: [0.4, 0, 0.2, 1] as const,
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
        ease: "easeOut" as const,
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
    <div className="relative min-h-screen overflow-x-hidden bg-ink text-cream">
      <NotificationPermissionModal />

      {/* Atmospheric background layers */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_85%_10%,rgba(200,137,42,0.12),transparent_60%),radial-gradient(ellipse_40%_35%_at_15%_35%,rgba(200,137,42,0.06),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(200,137,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(200,137,42,0.03)_1px,transparent_1px)] bg-[size:88px_88px] [mask-image:linear-gradient(to_bottom,transparent,rgba(0,0,0,0.45)_20%,rgba(0,0,0,0.45)_78%,transparent)]" />
      </div>

      <div className="relative z-10 px-3 py-4 xs:px-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10">
        <motion.header
          className="mb-8 border border-cb-border bg-[rgba(20,18,16,0.72)] p-5 backdrop-blur-2xl sm:mb-10 sm:p-7 lg:mb-12 lg:p-9"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mb-9 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="flex-1 min-w-0">
              <motion.div
                className="mb-5 inline-flex items-center gap-2.5 border border-border-gold bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-gold"
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
                className="mb-4 text-4xl font-black leading-tight tracking-tight text-cream sm:text-5xl lg:text-6xl"
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
                className="max-w-2xl text-base leading-relaxed text-cream-dim sm:text-lg lg:text-xl"
              >
                Manage your projects, view purchased designs, and explore new
                architectural possibilities.
              </motion.p>
            </div>

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
                className="border border-cb-border bg-card p-3.5 text-cream-dim transition-all hover:border-border-gold hover:text-gold"
                title="Refresh data"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.button>

              {!isMobile && (
                <div className="flex border border-cb-border bg-card p-1.5">
                  <button
                    onClick={() => setActiveView("grid")}
                    className={`p-2.5 transition-all duration-200 ${
                      activeView === "grid"
                        ? "bg-gold text-ink"
                        : "text-cream-dim hover:bg-surface hover:text-cream"
                    }`}
                    title="Grid View"
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveView("list")}
                    className={`p-2.5 transition-all duration-200 ${
                      activeView === "list"
                        ? "bg-gold text-ink"
                        : "text-cream-dim hover:bg-surface hover:text-cream"
                    }`}
                    title="List View"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          <motion.div
            className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5"
            variants={containerVariants}
          >
            {displayStats.map((stat) => (
              <motion.div
                key={stat.name}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                className="group relative"
              >
                <div className="relative border border-cb-border bg-card p-5 transition-all duration-300 hover:border-border-gold sm:p-7">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative overflow-hidden bg-gold/10 p-3.5 transition-transform duration-300 group-hover:scale-110">
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
                      <div
                        className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold ${
                          stat.trend === "up"
                            ? "bg-emerald-900/30 text-emerald-400"
                            : stat.trend === "down"
                              ? "bg-red-900/30 text-red-400"
                              : "bg-surface text-cream-dim"
                        }`}
                      >
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
                        <p className="mb-1 text-3xl font-black tracking-tight text-cream sm:text-4xl">
                          {stat.value}
                        </p>
                        <p className="text-xs font-semibold tracking-wide text-cream-dim sm:text-sm">
                          {stat.name}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {isMobile && (
            <motion.div
              className="-mx-2 mt-6 flex gap-2.5 overflow-x-auto px-2 pb-2 scrollbar-hide"
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
                  className="flex flex-shrink-0 items-center gap-2 whitespace-nowrap border border-cb-border bg-card px-4 py-2.5 text-xs font-bold text-cream-dim transition-all hover:border-border-gold hover:text-gold"
                >
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </motion.header>

        <motion.div
          className="grid grid-cols-1 gap-5 sm:gap-6 lg:gap-8 xl:grid-cols-[minmax(0,1.75fr)_minmax(300px,0.9fr)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="min-w-0 space-y-6 sm:space-y-8">
            <motion.div
              variants={itemVariants}
              className="overflow-hidden border border-cb-border bg-card"
            >
              <PurchasedDesigns
                searchQuery={searchQuery}
                viewMode={activeView}
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="overflow-hidden border border-cb-border bg-card"
            >
              <MyRequests />
            </motion.div>
          </div>

          <div className="min-w-0 space-y-6 sm:space-y-8 xl:sticky xl:top-6 xl:self-start">
            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.4 }}
              className="border border-cb-border bg-card p-4 sm:p-5"
            >
              <RecommendedDesigns compact />
            </motion.div>

            <motion.div
              variants={itemVariants}
              transition={{ delay: 0.5 }}
              className="border border-cb-border bg-card p-4 sm:p-5"
            >
              <Notifications compact />
            </motion.div>

            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative overflow-hidden border border-border-gold bg-gold/10 p-5"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16" />
                <div className="relative z-10">
                  <h3 className="text-sm font-black text-gold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl">
                      tips_and_updates
                    </span>
                    Quick Tip
                  </h3>
                  <p className="text-cream-dim text-xs leading-relaxed font-medium">
                    Swipe left on designs to access quick actions like download
                    and favorite.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

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
                className="border border-cb-border bg-card/95 p-8 backdrop-blur-xl"
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
