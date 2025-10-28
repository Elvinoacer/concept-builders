"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import UserAnalyticsCharts from "@/components/admin/users/analytics/UserAnalyticsCharts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { FiDollarSign, FiShoppingCart, FiEye, FiUsers, FiCode } from "react-icons/fi";

const UserAnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState("Last 6 Months");
  const params = useParams();
  const { id: userId } = params;

  const fetchAnalytics = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/${userId}/analytics?timePeriod=${timePeriod}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user analytics");
      }
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error fetching user analytics:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, timePeriod]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return <div className="p-4 md:p-8">Loading user analytics...</div>;
  }

  if (error) {
    return <div className="p-4 md:p-8 text-red-500">Error: {error}</div>;
  }

  if (!analyticsData) {
    return <div className="p-4 md:p-8">No analytics data available for this user.</div>;
  }

  const { user, summary, chartData } = analyticsData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics for {user.name || user.email}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              {timePeriod} <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTimePeriod("Last 1 Month")}>
              Last 1 Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimePeriod("Last 6 Months")}>
              Last 6 Months
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimePeriod("Last 1 Year")}>
              Last 1 Year
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTimePeriod("All Time")}>
              All Time
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center gap-4">
          <FiDollarSign className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Spending</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${summary.totalSpending.toFixed(2)}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center gap-4">
          <FiShoppingCart className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{summary.totalOrders}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center gap-4">
          <FiEye className="w-8 h-8 text-purple-500" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Design Views</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{summary.totalDesignViews}</p>
          </div>
        </div>
        {user.referralCode && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center gap-4">
            <FiUsers className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Referred Users</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{summary.totalReferredUsers}</p>
            </div>
          </div>
        )}
        {user.referralCode && summary.totalReferralRevenue > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center gap-4">
            <FiDollarSign className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Referral Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${summary.totalReferralRevenue.toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <UserAnalyticsCharts data={chartData} />
    </motion.div>
  );
};

export default UserAnalyticsPage;
