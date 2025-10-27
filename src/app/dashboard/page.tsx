"use client";
import Notifications from "@/components/dashboard/Notifications";
import PurchasedDesigns from "@/components/dashboard/PurchasedDesigns";
import RecommendedDesigns from "@/components/dashboard/RecommendedDesigns";
import MyRequests from "@/components/dashboard/MyRequests";
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
              className="text-gray-900 text-4xl md:text-5xl font-bold leading-tight dark:text-white"
            >
              Welcome Back, {session?.user?.name || "User"}!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-500 mt-2 text-lg dark:text-gray-400"
            >
              Here&apos;s a summary of your account and recent activity.
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center gap-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-4 rounded-full">
                <span className="material-symbols-outlined text-4xl text-white">
                  {stat.icon}
                </span>
              </div>
              <div>
                <p className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-md font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
        <div className="lg:col-span-2 space-y-10">
          <PurchasedDesigns searchQuery={searchQuery} />
          <MyRequests />
        </div>
        <div className="space-y-10">
          <RecommendedDesigns />
        </div>
      </div>

      <div className="mt-12">
        <Notifications />
      </div>
    </div>
  );
};

export default DashboardPage;
