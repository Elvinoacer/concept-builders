"use client";

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

interface ReferralSource {
  name: string;
  value: number;
  percentage: number;
}

const ReferralSourcesChart = ({ data }: { data: ReferralSource[] }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSource, setExpandedSource] = useState<number | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const chartColors = [
    "bg-chart-1",
    "bg-chart-2",
    "bg-chart-3",
    "bg-chart-4",
    "bg-chart-5",
  ];

  const textChartColors = [
    "text-chart-1",
    "text-chart-2",
    "text-chart-3",
    "text-chart-4",
    "text-chart-5",
  ];

  const bgChartColors = [
    "bg-chart-1/10",
    "bg-chart-2/10",
    "bg-chart-3/10",
    "bg-chart-4/10",
    "bg-chart-5/10",
  ];

  // Format source names for mobile
  const formatSourceName = (name: string, index: number) => {
    if (!isMobile) return name;

    // Shorten common referral sources for mobile
    const shortNames: { [key: string]: string } = {
      "Organic Search": "Organic",
      "Social Media": "Social",
      "Direct Traffic": "Direct",
      "Email Marketing": "Email",
      "Referral Sites": "Referral",
      "Paid Search": "Paid",
    };

    return (
      shortNames[name] || (name.length > 12 ? `${name.slice(0, 10)}...` : name)
    );
  };

  // Format value for display
  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className="relative group flex flex-col gap-3 xs:gap-4 rounded-xl border border-gray-200/80 bg-white dark:bg-gray-800 dark:border-gray-700/80 shadow-xs hover:shadow-md p-4 xs:p-5 sm:p-6 transition-all duration-300"
    >
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-chart-3 text-lg xs:text-xl font-bold tracking-tight truncate">
            Referral Sources
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm xs:text-base">
            Top 5 Channels
          </p>
        </div>

        {/* Total Summary - Hidden on mobile */}
        <div className="hidden xs:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-3"></div>
            <span className="text-gray-600 dark:text-gray-400">
              Traffic Sources
            </span>
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className="min-h-[200px] xs:min-h-[240px] sm:min-h-[280px] flex flex-col justify-center">
        {isMobile ? (
          // Mobile Layout: Vertical cards with enhanced interaction
          <div className="space-y-3 xs:space-y-4">
            {data.map((source, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative rounded-xl p-3 xs:p-4 border-2 transition-all duration-300 cursor-pointer
                  ${
                    expandedSource === index
                      ? "border-chart-3 bg-chart-3/5 shadow-sm"
                      : "border-transparent bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  }
                `}
                onClick={() =>
                  setExpandedSource(expandedSource === index ? null : index)
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Source Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
                    <div
                      className={`w-3 h-3 rounded-full ${chartColors[index]} flex-shrink-0`}
                    ></div>
                    <span
                      className={`text-sm xs:text-base font-semibold truncate ${textChartColors[index]}`}
                    >
                      {formatSourceName(source.name, index)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-sm font-bold ${textChartColors[index]}`}
                    >
                      {formatValue(source.value)}
                    </span>
                    <motion.span
                      animate={{ rotate: expandedSource === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="material-symbols-outlined text-base text-gray-400"
                    >
                      expand_more
                    </motion.span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${source.percentage}%` }}
                    transition={{
                      delay: index * 0.1 + 0.3,
                      duration: 0.8,
                      ease: "easeOut",
                    }}
                    className={`h-full rounded-full ${chartColors[index]} relative`}
                  >
                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/30 rounded-full"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{
                        delay: index * 0.1 + 1,
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />
                  </motion.div>
                </div>

                {/* Expanded Details */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: expandedSource === index ? 1 : 0,
                    height: expandedSource === index ? "auto" : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
                      <span>Percentage</span>
                      <span className="font-semibold">
                        {source.percentage}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 mt-1">
                      <span>Raw Value</span>
                      <span className="font-semibold">
                        {source.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Percentage badge for collapsed state */}
                {expandedSource !== index && (
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${bgChartColors[index]} ${textChartColors[index]}`}
                    >
                      {source.percentage}%
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          // Desktop Layout: Traditional grid with enhancements
          <div className="grid grid-cols-[minmax(120px,auto)_1fr_auto] items-center gap-x-4 xs:gap-x-6 gap-y-3 xs:gap-y-4 py-2">
            {data.map((source, index) => (
              <React.Fragment key={index}>
                {/* Source Name */}
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`text-sm xs:text-base font-semibold truncate ${textChartColors[index]} hover:underline cursor-help`}
                  title={source.name}
                >
                  {source.name}
                </motion.p>

                {/* Progress Bar */}
                <div className="relative group/progress">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 xs:h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${source.percentage}%` }}
                      transition={{
                        delay: index * 0.1 + 0.3,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      className={`h-full rounded-full ${chartColors[index]} relative`}
                    >
                      {/* Animated shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-white/40 rounded-full"
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                          delay: index * 0.1 + 1,
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Tooltip on hover */}
                  <div className="absolute inset-0 flex items-center">
                    <div className="absolute left-0 top-full mt-2 hidden group-hover/progress:block bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                      {source.percentage}% of total traffic
                    </div>
                  </div>
                </div>

                {/* Value */}
                <motion.p
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`text-sm xs:text-base font-bold whitespace-nowrap ${textChartColors[index]}`}
                >
                  {formatValue(source.value)}
                </motion.p>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Legend */}
      <div className="xs:hidden flex justify-center pt-2">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-chart-3"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Tap items for details
          </span>
        </div>
      </div>

      {/* Loading/Empty State */}
      {(!data || data.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <div className="text-4xl mb-2">🔗</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No referral data available
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ReferralSourcesChart;
