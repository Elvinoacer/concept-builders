"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, BarChart3, AlertCircle } from "lucide-react";

const ChartsSkeleton = () => {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
      {/* Sales Chart Skeleton */}
      <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-5 w-32 mb-2 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="h-8 w-28 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="h-48 sm:h-64 lg:h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
      </div>

      {/* Client Acquisition Skeleton */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-5 w-32 mb-2 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
              <div className="h-4 w-24 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            </div>
          </div>
          <div className="h-8 w-16 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="h-48 sm:h-64 lg:h-80 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
      </div>
    </section>
  );
};

const Charts = ({ stats, monthlySales, clientAcquisition }) => {
  if (!stats || !monthlySales || !clientAcquisition) {
    return <ChartsSkeleton />;
  }

  const hasSalesData = monthlySales.length > 0;
  const maxSales = hasSalesData
    ? Math.max(...monthlySales.map((s) => s.sales))
    : 0;

  // Prepare chart data with responsive scaling
  const chartData = hasSalesData
    ? monthlySales.map((sale, index) => {
        const y = 280 - (sale.sales / maxSales) * 260;
        const x = 60 + index * 70;
        return { x, y, ...sale };
      })
    : [];

  const pathData = hasSalesData
    ? chartData.reduce((acc, point, index) => {
        if (index === 0) {
          return `M ${point.x} ${point.y}`;
        }
        return `${acc} L ${point.x} ${point.y}`;
      }, "")
    : "";

  const totalClients = clientAcquisition.reduce(
    (acc, curr) => acc + curr.count,
    0
  );
  const maxClientCount = Math.max(
    ...clientAcquisition.map((source) => source.count)
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6"
    >
      {/* Sales Performance Chart */}
      <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Sales Performance
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Last {monthlySales.length} Months
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              ${stats.totalSales?.toLocaleString() || "0"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Sales
            </p>
          </div>
        </div>

        <div className="h-48 sm:h-64 lg:h-80 overflow-x-auto custom-scrollbar">
          {hasSalesData ? (
            <div className="min-w-[500px] lg:min-w-full">
              <svg
                fill="none"
                height="100%"
                preserveAspectRatio="none"
                viewBox="0 0 500 300"
                width="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Grid Lines */}
                <path
                  d="M40 280 H460"
                  className="stroke-gray-200 dark:stroke-gray-700"
                  strokeWidth="2"
                ></path>
                <path
                  d="M40 20 V280"
                  className="stroke-gray-200 dark:stroke-gray-700"
                  strokeWidth="2"
                ></path>

                {/* Sales Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="url(#salesGradient)"
                  strokeLinecap="round"
                  strokeWidth="3"
                ></path>

                {/* Gradient Definition */}
                <defs>
                  <linearGradient
                    id="salesGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>

                {/* Area Fill */}
                <g fill="rgba(17, 147, 212, 0.1)">
                  <path
                    d={`${pathData} L ${chartData[chartData.length - 1].x} 280 L ${chartData[0].x} 280 Z`}
                  />
                </g>

                {/* X-axis Labels */}
                <g className="text-xs sm:text-sm fill-gray-500 dark:fill-gray-400">
                  {monthlySales.map((d, i) => (
                    <text
                      key={i}
                      x={60 + i * 70}
                      y="295"
                      textAnchor="middle"
                      className="font-medium"
                    >
                      {d.month.substring(0, 3)}
                    </text>
                  ))}
                </g>

                {/* Y-axis Labels */}
                <g className="text-xs sm:text-sm fill-gray-500 dark:fill-gray-400">
                  <text x="5" y="280" textAnchor="start">
                    0
                  </text>
                  <text x="5" y="205" textAnchor="start">
                    {Math.round(maxSales / 2).toLocaleString()}
                  </text>
                  <text x="5" y="130" textAnchor="start">
                    {maxSales.toLocaleString()}
                  </text>
                  <text x="5" y="55" textAnchor="start">
                    {(maxSales * 1.5).toLocaleString()}
                  </text>
                </g>

                {/* Data Points */}
                {chartData
                  .filter((point) => !isNaN(point.y))
                  .map((point, index) => (
                  <g key={index}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#0ea5e9"
                      className="hover:r-6 transition-all duration-200"
                    />
                    <title>
                      {point.month}: ${point.sales.toLocaleString()}
                    </title>
                  </g>
                ))}
              </svg>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                No sales data available for this period.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Sales data will appear here once transactions occur.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Client Acquisition Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Client Sources
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Acquisition Channels
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {totalClients.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Clients
            </p>
          </div>
        </div>

        <div className="h-48 sm:h-64 lg:h-80">
          {clientAcquisition.length > 0 ? (
            <div className="flex flex-col h-full">
              {/* Bar Chart */}
              <div className="flex-1 flex items-end justify-between gap-2 sm:gap-3 pb-8">
                {clientAcquisition.map((source, index) => {
                  const percentage =
                    totalClients > 0 ? (source.count / totalClients) * 100 : 0;
                  const heightPercentage =
                    maxClientCount > 0
                      ? (source.count / maxClientCount) * 100
                      : 0;

                  return (
                    <motion.div
                      key={index}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex flex-col items-center gap-2 flex-1"
                    >
                      <div
                        className="w-full max-w-12 sm:max-w-16 bg-gradient-to-t from-green-600 to-emerald-400 rounded-t-xl hover:from-green-700 hover:to-emerald-500 transition-all duration-300 cursor-help relative group"
                        style={{
                          height: `${heightPercentage}%`,
                          minHeight: "20px",
                        }}
                        title={`${source.source}: ${source.count} clients (${percentage.toFixed(1)}%)`}
                      >
                        {/* Hover Tooltip */}
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                          {source.count} ({percentage.toFixed(1)}%)
                        </div>
                      </div>

                      {/* Source Label */}
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight font-medium">
                        {source.source
                          ? source.source
                              .split(" ")
                              .map((word) => word.charAt(0))
                              .join("")
                              .toUpperCase()
                          : "N/A"}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {clientAcquisition.map((source, index) => {
                    const percentage =
                      totalClients > 0
                        ? (source.count / totalClients) * 100
                        : 0;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-600 to-emerald-400 rounded-sm flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300 truncate font-medium">
                          {source.source}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-right flex-shrink-0 ml-auto">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                No client data available
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Client acquisition data will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </motion.section>
  );
};

export default Charts;
