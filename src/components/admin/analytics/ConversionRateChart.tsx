"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface ConversionData {
  rate: number;
  converted: number;
  total: number;
  trend?: "up" | "down" | "stable";
  change?: number;
}

const ConversionRateChart = ({ data }: { data: ConversionData }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [animatedRate, setAnimatedRate] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Animate the conversion rate number
  useEffect(() => {
    if (data?.rate) {
      const timer = setTimeout(() => {
        const duration = 1500;
        const steps = 60;
        const step = data.rate / steps;
        let current = 0;

        const interval = setInterval(() => {
          current += step;
          if (current >= data.rate) {
            current = data.rate;
            clearInterval(interval);
          }
          setAnimatedRate(Math.round(current));
        }, duration / steps);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [data?.rate]);

  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col gap-4 rounded-xl border border-gray-200/80 bg-white dark:bg-gray-800 dark:border-gray-700/80 shadow-xs p-6"
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          No conversion data available
        </div>
      </motion.div>
    );
  }

  const convertedPercentage = data.converted;
  const notConvertedPercentage = 100 - convertedPercentage;
  const circumference = 2 * Math.PI * 15.9155;
  const strokeDasharray = `${(convertedPercentage / 100) * circumference} ${circumference}`;

  const getTrendColor = () => {
    switch (data.trend) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getTrendIcon = () => {
    switch (data.trend) {
      case "up":
        return "↗";
      case "down":
        return "↘";
      default:
        return "→";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -2,
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }}
      transition={{
        duration: 0.5,
        delay: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className="group flex flex-col gap-4 xs:gap-5 rounded-xl border border-gray-200/80 bg-white dark:bg-gray-800 dark:border-gray-700/80 shadow-xs hover:shadow-md p-4 xs:p-5 sm:p-6 transition-all duration-300"
    >
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-chart-4 text-lg xs:text-xl font-bold tracking-tight truncate">
            Conversion Rate
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm xs:text-base">
            Last 30 days
          </p>
        </div>

        {/* Trend Indicator */}
        {data.trend && data.change && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${getTrendColor()}`}
          >
            <span>{getTrendIcon()}</span>
            <span>{data.change}%</span>
          </div>
        )}
      </div>

      {/* Main Chart Area */}
      <div className="flex flex-col xs:flex-row items-center justify-between gap-4 xs:gap-6">
        {/* Circular Progress */}
        <div className="relative flex-shrink-0">
          <div className="relative h-40 w-40 xs:h-44 xs:w-44 sm:h-48 sm:w-48">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              {/* Background Circle */}
              <path
                className="text-gray-200 dark:text-gray-700"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              {/* Animated Progress Circle */}
              <motion.path
                className="text-chart-4"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: convertedPercentage / 100 }}
                transition={{
                  duration: 1.5,
                  delay: 0.3,
                  ease: "easeOut",
                }}
              />
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.p
                className="text-3xl xs:text-4xl font-bold text-chart-4"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {animatedRate}%
              </motion.p>
              <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-1">
                Converted
              </p>
            </div>
          </div>
        </div>

        {/* Stats Breakdown - Hidden on smallest screens */}
        <div className="hidden xs:flex flex-col gap-3 xs:gap-4 flex-1 max-w-[200px]">
          {/* Converted */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-3 h-3 rounded-full bg-chart-4 flex-shrink-0"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                Converted
              </span>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-chart-4">
                {data.converted}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round((data.converted / 100) * (data.total || 1000))}{" "}
                users
              </p>
            </div>
          </div>

          {/* Not Converted */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
                Not Converted
              </span>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-gray-600 dark:text-gray-400">
                {notConvertedPercentage}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {Math.round(
                  (notConvertedPercentage / 100) * (data.total || 1000)
                )}{" "}
                users
              </p>
            </div>
          </div>

          {/* Total Users */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Total Users
              </span>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {(data.total || 1000).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats - Only show on small screens */}
      <div className="xs:hidden space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-4"></div>
            <span className="text-sm font-medium text-chart-4">Converted</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-chart-4">
              {data.converted}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600"></div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Not Converted
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
              {notConvertedPercentage}%
            </span>
          </div>
        </div>

        {/* Mobile Total */}
        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Total Users
          </span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {(data.total || 1000).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="flex justify-center">
        <div
          className={`
          inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium
          ${
            data.rate >= 5
              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : data.rate >= 2
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          }
        `}
        >
          {data.rate >= 5
            ? "Excellent"
            : data.rate >= 2
              ? "Good"
              : "Needs Improvement"}
        </div>
      </div>
    </motion.div>
  );
};

export default ConversionRateChart;
