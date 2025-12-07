"use client";

import Charts from "@/components/admin/dashboard/Charts";
import CustomDesignRequests from "@/components/admin/dashboard/CustomDesignRequests";
import KPIs from "@/components/admin/dashboard/KPIs";
import { motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  DollarSign,
  Package,
  RefreshCw,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NotificationPermissionModal } from "@/components/notifications/NotificationPermissionModal";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [monthlySales, setMonthlySales] = useState(null);
  const [clientAcquisition, setClientAcquisition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [statsRes, monthlySalesRes, clientAcquisitionRes] =
        await Promise.all([
          fetch("/api/admin/dashboard/kpis"),
          fetch("/api/admin/monthly-sales"),
          fetch("/api/admin/client-acquisition"),
        ]);

      if (!statsRes.ok || !monthlySalesRes.ok || !clientAcquisitionRes.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const [statsData, monthlySalesData, clientAcquisitionData] =
        await Promise.all([
          statsRes.json(),
          monthlySalesRes.json(),
          clientAcquisitionRes.json(),
        ]);

      setStats(statsData);
      setMonthlySales(monthlySalesData);
      setClientAcquisition(clientAcquisitionData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setError(
        error.message ||
          "An unknown error occurred while loading dashboard data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 min-[375px]:px-5 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto py-6 sm:py-8">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
          </div>

          {/* KPI Skeletons */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            ))}
          </div>

          {/* Chart Skeletons */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>

          {/* Custom Requests Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                >
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto"
        >
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-6 py-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 min-[375px]:px-5 sm:px-6 lg:px-8">
      <NotificationPermissionModal />
      <div className="max-w-7xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8"
        >
          <div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-base sm:text-lg">
              Overview of your platform performance and metrics
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </motion.button>
        </motion.header>

        {/* Last Updated */}
        {stats?.lastUpdated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-gray-500 dark:text-gray-400 mb-6 text-center sm:text-left"
          >
            Last updated: {new Date(stats.lastUpdated).toLocaleString()}
          </motion.div>
        )}

        {/* KPI Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <KPIs stats={stats?.kpis} />
        </motion.section>

        {/* Charts Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <Charts
            stats={stats}
            monthlySales={monthlySales}
            clientAcquisition={clientAcquisition}
          />
        </motion.section>

        {/* Custom Design Requests Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CustomDesignRequests />
        </motion.section>

        {/* Quick Stats Summary */}
        {stats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalUsers || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total Users
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <Package className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalProjects || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Active Projects
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <DollarSign className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalRevenue || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Total Revenue
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <BarChart3 className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.conversionRate || "0%"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Conversion Rate
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
