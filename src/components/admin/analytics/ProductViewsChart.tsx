"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 backdrop-blur-sm min-w-[120px]">
        <p className="text-gray-900 dark:text-white font-medium text-sm mb-1 truncate">
          {label}
        </p>
        <p className="text-chart-2 font-bold text-base">
          {payload[0].value.toLocaleString()} views
        </p>
      </div>
    );
  }
  return null;
};

const ProductViewsChart = ({ data }: { data: ChartData[] }) => {
  // Format X-axis labels for better mobile display
  const formatXAxis = (tickItem: string) => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      // Truncate long product names on mobile
      return tickItem.length > 8 ? `${tickItem.slice(0, 8)}...` : tickItem;
    }
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      return tickItem.length > 12 ? `${tickItem.slice(0, 12)}...` : tickItem;
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

  // Calculate bar size based on screen width
  const getBarSize = () => {
    if (typeof window === "undefined") return 40;
    if (window.innerWidth < 480) return 20;
    if (window.innerWidth < 640) return 30;
    if (window.innerWidth < 768) return 35;
    return 40;
  };

  // Generate gradient fills for bars
  const getBarGradient = (index: number, total: number) => {
    const baseColor = "hsl(var(--chart-2))";
    const opacity = 0.7 + 0.3 * (index / total);
    return baseColor.replace("hsl", "hsla").replace(")", `, ${opacity})`);
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
        delay: 0.2,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className="group flex flex-col gap-3 xs:gap-4 rounded-xl border border-gray-200/80 bg-white dark:bg-gray-800 dark:border-gray-700/80 shadow-xs hover:shadow-md p-4 xs:p-5 sm:p-6 transition-all duration-300"
    >
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-chart-2 text-lg xs:text-xl font-bold tracking-tight truncate">
            Product Views
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm xs:text-base">
            Top Products
          </p>
        </div>

        {/* Summary Stats */}
        <div className="hidden xs:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-2"></div>
            <span className="text-gray-600 dark:text-gray-400">Views</span>
          </div>
          {data && data.length > 0 && (
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              Total:{" "}
              {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
              bottom:
                typeof window !== "undefined" && window.innerWidth < 640
                  ? 25
                  : 20,
            }}
            barSize={getBarSize()}
            barGap={
              typeof window !== "undefined" && window.innerWidth < 480 ? 2 : 4
            }
          >
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
                angle:
                  typeof window !== "undefined" && window.innerWidth < 480
                    ? -45
                    : 0,
                textAnchor:
                  typeof window !== "undefined" && window.innerWidth < 480
                    ? "end"
                    : "middle",
              }}
              tickFormatter={formatXAxis}
              interval={0}
              minTickGap={1}
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
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />

            {/* Bar with gradient effect */}
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data &&
                data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getBarGradient(index, data.length)}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mobile Legend and Summary - Only show on small screens */}
      <div className="xs:hidden flex flex-col gap-2 pt-2">
        <div className="flex justify-center">
          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 rounded-full px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-chart-2"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Product Views
            </span>
          </div>
        </div>
        {data && data.length > 0 && (
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            Total:{" "}
            {data.reduce((sum, item) => sum + item.value, 0).toLocaleString()}{" "}
            views
          </div>
        )}
      </div>

      {/* Loading/Empty State */}
      {(!data || data.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No product view data available
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductViewsChart;
