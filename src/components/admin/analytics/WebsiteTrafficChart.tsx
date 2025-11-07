"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 backdrop-blur-sm">
        <p className="text-gray-900 dark:text-white font-medium text-sm">
          {label}
        </p>
        <p className="text-chart-1 font-semibold text-base">
          {payload[0].value.toLocaleString()} visitors
        </p>
      </div>
    );
  }
  return null;
};

const WebsiteTrafficChart = ({ data }: { data: any[] }) => {
  // Format X-axis labels for better mobile display
  const formatXAxis = (tickItem: string) => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      // Shorten month names on mobile
      return tickItem.slice(0, 3);
    }
    return tickItem;
  };

  // Format Y-axis labels for better readability
  const formatYAxis = (tickItem: number) => {
    if (tickItem >= 1000) {
      return `${(tickItem / 1000).toFixed(0)}k`;
    }
    return tickItem.toString();
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
        delay: 0.1,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className="group flex flex-col gap-3 xs:gap-4 rounded-xl border border-gray-200/80 bg-white dark:bg-gray-800 dark:border-gray-700/80 shadow-xs hover:shadow-md p-4 xs:p-5 sm:p-6 transition-all duration-300"
    >
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-chart-1 text-lg xs:text-xl font-bold tracking-tight truncate">
            Website Traffic
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm xs:text-base">
            Last 30 Days
          </p>
        </div>

        {/* Summary Stats - Hidden on smallest screens */}
        <div className="hidden xs:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-1"></div>
            <span className="text-gray-600 dark:text-gray-400">Visitors</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 5
                  : 10,
              left:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? -10
                  : 0,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient
                id="websiteTrafficGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            {/* X Axis - Responsive */}
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize:
                  typeof window !== "undefined" && window.innerWidth < 640
                    ? 10
                    : 12,
                fill: "hsl(var(--muted-foreground))",
              }}
              tickFormatter={formatXAxis}
              interval={
                typeof window !== "undefined" && window.innerWidth < 640
                  ? "preserveStartEnd"
                  : 0
              }
              minTickGap={
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 2
                  : 10
              }
            />

            {/* Y Axis - Responsive */}
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fontSize:
                  typeof window !== "undefined" && window.innerWidth < 640
                    ? 10
                    : 12,
                fill: "hsl(var(--muted-foreground))",
              }}
              tickFormatter={formatYAxis}
              width={
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 30
                  : 40
              }
            />

            {/* Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "hsl(var(--chart-1))",
                strokeWidth: 1,
                strokeDasharray: "4 4",
                opacity: 0.6,
              }}
            />

            {/* Area */}
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="url(#websiteTrafficGradient)"
              fillOpacity={1}
              activeDot={{
                r: 4,
                stroke: "hsl(var(--chart-1))",
                strokeWidth: 2,
                fill: "#ffffff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile Legend - Only show on small screens */}
      <div className="xs:hidden flex justify-center pt-2">
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-chart-1"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">
            Website Visitors
          </span>
        </div>
      </div>

      {/* Loading/Empty State */}
      {(!data || data.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No traffic data available
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default WebsiteTrafficChart;
