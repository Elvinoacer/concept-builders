"use client";
import { useEffect, useState } from "react";
import AnalyticsHeader from "@/components/admin/analytics/AnalyticsHeader";
import StatCard from "@/components/admin/analytics/StatCard";
import WebsiteTrafficChart from "@/components/admin/analytics/WebsiteTrafficChart";
import ProductViewsChart from "@/components/admin/analytics/ProductViewsChart";
import ReferralSourcesChart from "@/components/admin/analytics/ReferralSourcesChart";
import ConversionRateChart from "@/components/admin/analytics/ConversionRateChart";
import { textChartColors } from "@/lib/analytics-data";

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState("Last 30 Days");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `/api/admin/analytics?timePeriod=${encodeURIComponent(timePeriod)}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const data = await res.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timePeriod]);

  // Enhanced Loading State
  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto bg-background text-foreground">
        <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 lg:p-8">
          {/* Skeleton Header */}
          <div className="animate-pulse">
            <div className="h-8 w-3/4 sm:h-10 sm:w-1/2 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
            <div className="h-12 w-full sm:w-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>

          {/* Skeleton Stat Cards */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
                <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>

          {/* Skeleton Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-48 sm:h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Error State
  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto bg-background text-foreground">
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-4">📊</div>
            <h1 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 dark:text-white">
              Analytics Unavailable
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6 leading-relaxed">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                Retry
              </button>
              <button
                onClick={() => setTimePeriod("Last 30 Days")}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
              >
                Reset Time Period
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto bg-background text-foreground">
      <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <AnalyticsHeader
          timePeriod={timePeriod}
          setTimePeriod={setTimePeriod}
        />

        {/* Stats Grid - Enhanced Responsiveness */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {analyticsData?.statsData?.map((stat: any, index: number) => (
            <StatCard
              key={`${stat.label}-${index}`}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              changeType={stat.changeType}
              color={textChartColors[index]}
              className="h-full"
            />
          ))}
        </div>

        {/* Charts Grid - Advanced Responsive Layout */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Full-width charts on mobile, side-by-side on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <WebsiteTrafficChart
                data={analyticsData?.websiteTrafficData}
                className="min-h-[300px] sm:min-h-[400px]"
              />
              <ProductViewsChart
                data={analyticsData?.productViewsData}
                className="min-h-[300px] sm:min-h-[400px]"
              />
            </div>

            <ReferralSourcesChart
              data={analyticsData?.referralSourcesData}
              className="min-h-[300px] sm:min-h-[350px]"
            />
            <ConversionRateChart
              data={analyticsData?.conversionRateData}
              className="min-h-[300px] sm:min-h-[350px]"
            />
          </div>
        </div>

        {/* Empty State */}
        {(!analyticsData?.statsData ||
          analyticsData.statsData.length === 0) && (
          <div className="text-center py-12 px-4">
            <div className="text-5xl mb-4">📈</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              No Analytics Data
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-md mx-auto">
              Analytics data will appear here once your store starts receiving
              traffic and orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
