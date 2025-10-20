"use client";
import Notifications from "@/components/dashboard/Notifications";
import PurchasedDesigns from "@/components/dashboard/PurchasedDesigns";
import RecommendedDesigns from "@/components/dashboard/RecommendedDesigns";
import { useSearch } from "@/lib/SearchContext";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const DashboardPage = () => {
  const { data: session } = useSession();
  const { searchQuery } = useSearch();
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  return (
    <div className="dark:bg-gray-950 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white"
            >
              Welcome Back, {session?.user?.name || "User"}!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-500 mt-1 dark:text-gray-400"
            >
              Here&apos;s a summary of your account and recent activity.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center gap-4"
            >
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2 sm:p-3 rounded-full">
                <span className="material-symbols-outlined text-2xl sm:text-3xl text-blue-600 dark:text-blue-400">
                  {stat.icon}
                </span>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <PurchasedDesigns searchQuery={searchQuery} />
        </div>
        <div className="space-y-8">
          <RecommendedDesigns />
          <Notifications />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
