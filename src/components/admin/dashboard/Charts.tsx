"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, BarChart3, AlertCircle } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

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

  const totalClients = clientAcquisition.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );
  const maxClientCount = Math.max(
    ...clientAcquisition.map((source) => source.count),
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

        <div className="h-48 sm:h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 185, 168, 0.1)" />
              <XAxis
                dataKey="month"
                stroke="#5a5548"
                tick={{ fill: "#c8bfa8", fontSize: 12 }}
              />
              <YAxis
                stroke="#5a5548"
                tick={{ fill: "#c8bfa8", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--cream)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="hsl(var(--chart-1))"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
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
    </motion.section>
  );
};

export default Charts;
