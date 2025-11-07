"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import UserAnalyticsCharts from "@/components/admin/users/analytics/UserAnalyticsCharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import {
  FiDollarSign,
  FiShoppingCart,
  FiEye,
  FiUsers,
  FiCode,
  FiTrendingUp,
  FiCalendar,
} from "react-icons/fi";

const UserAnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState("Last 6 Months");
  const [refreshing, setRefreshing] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { id: userId } = params;

  const fetchAnalytics = useCallback(
    async (showRefresh = false) => {
      if (!userId) return;

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      try {
        const response = await fetch(
          `/api/users/${userId}/analytics?timePeriod=${encodeURIComponent(timePeriod)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user analytics");
        }
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Error fetching user analytics:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId, timePeriod]
  );

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleRefresh = () => {
    fetchAnalytics(true);
  };

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
  };

  const timePeriodOptions = [
    { value: "Last 1 Month", label: "Last 1 Month" },
    { value: "Last 3 Months", label: "Last 3 Months" },
    { value: "Last 6 Months", label: "Last 6 Months" },
    { value: "Last 1 Year", label: "Last 1 Year" },
    { value: "All Time", label: "All Time" },
  ];

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4 mb-6 xs:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              </div>
            </div>
            <div className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          </div>

          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6 mb-6 xs:mb-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 xs:p-6 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 xs:p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4 mb-6 xs:mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/admin/users/${userId}`)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white">
                  User Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Error loading analytics
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 xs:p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
              Failed to Load Analytics
            </h3>
            <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
            <div className="flex flex-col xs:flex-row gap-2 justify-center">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => router.push(`/admin/users/${userId}`)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back to User
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No Data State
  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-4 mb-6 xs:mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(`/admin/users/${userId}`)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white">
                  User Analytics
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  No data available
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 xs:p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
              No Analytics Data
            </h3>
            <p className="text-yellow-700 dark:text-yellow-400 mb-4">
              There's no analytics data available for this user in the selected
              time period.
            </p>
            <button
              onClick={() => setTimePeriod("All Time")}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              View All Time Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { user, summary, chartData } = analyticsData;

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6"
    >
      <div className="max-w-7xl mx-auto space-y-4 xs:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/admin/users/${userId}`)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white truncate">
                Analytics for {user?.name || user?.email || "User"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Performance metrics and insights
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Refresh analytics"
            >
              <RefreshCw
                className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-3 xs:px-4 py-2 h-auto border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FiCalendar className="w-4 h-4" />
                  <span className="text-sm font-medium">{timePeriod}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[180px]">
                {timePeriodOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleTimePeriodChange(option.value)}
                    className="text-sm py-2.5"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
          {/* Total Spending */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Spending
                </p>
                <p className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white truncate">
                  {formatCurrency(summary.totalSpending || 0)}
                </p>
                {summary.previousPeriodSpending !== undefined && (
                  <p
                    className={`text-xs mt-1 ${
                      summary.totalSpending >= summary.previousPeriodSpending
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {summary.totalSpending >= summary.previousPeriodSpending
                      ? "↑"
                      : "↓"}
                    {Math.abs(
                      getPercentageChange(
                        summary.totalSpending,
                        summary.previousPeriodSpending
                      )
                    ).toFixed(1)}
                    % from previous period
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Orders
                </p>
                <p className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(summary.totalOrders || 0)}
                </p>
                {summary.previousPeriodOrders !== undefined && (
                  <p
                    className={`text-xs mt-1 ${
                      summary.totalOrders >= summary.previousPeriodOrders
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {summary.totalOrders >= summary.previousPeriodOrders
                      ? "↑"
                      : "↓"}
                    {Math.abs(
                      getPercentageChange(
                        summary.totalOrders,
                        summary.previousPeriodOrders
                      )
                    ).toFixed(1)}
                    % from previous period
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Design Views */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiEye className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Design Views
                </p>
                <p className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">
                  {formatNumber(summary.totalDesignViews || 0)}
                </p>
                {summary.previousPeriodDesignViews !== undefined && (
                  <p
                    className={`text-xs mt-1 ${
                      summary.totalDesignViews >=
                      summary.previousPeriodDesignViews
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {summary.totalDesignViews >=
                    summary.previousPeriodDesignViews
                      ? "↑"
                      : "↓"}
                    {Math.abs(
                      getPercentageChange(
                        summary.totalDesignViews,
                        summary.previousPeriodDesignViews
                      )
                    ).toFixed(1)}
                    % from previous period
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Referred Users */}
          {user?.referralCode && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiUsers className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Referred Users
                  </p>
                  <p className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(summary.totalReferredUsers || 0)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    Code: {user.referralCode}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Referral Revenue */}
          {user?.referralCode && summary.totalReferralRevenue > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiCode className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Referral Revenue
                  </p>
                  <p className="text-xl xs:text-2xl font-bold text-gray-900 dark:text-white truncate">
                    {formatCurrency(summary.totalReferralRevenue || 0)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    From referrals
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Charts Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 mb-6">
            <h2 className="text-lg xs:text-xl font-semibold text-gray-900 dark:text-white">
              Performance Analytics
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiCalendar className="w-4 h-4" />
              <span>{timePeriod}</span>
            </div>
          </div>

          {chartData ? (
            <UserAnalyticsCharts data={chartData} />
          ) : (
            <div className="text-center py-12">
              <FiTrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No chart data available
              </p>
            </div>
          )}
        </div>

        {/* Additional Insights */}
        {(summary.averageOrderValue || summary.favoriteCategory) && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Additional Insights
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
              {summary.averageOrderValue > 0 && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <FiDollarSign className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Average Order Value
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(summary.averageOrderValue)}
                    </p>
                  </div>
                </div>
              )}
              {summary.favoriteCategory && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <FiShoppingCart className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Favorite Category
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                      {summary.favoriteCategory}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserAnalyticsPage;
