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
import { Skeleton } from "@/components/ui/skeleton";

const HistoricalCostChart = ({ historicalCosts, timePeriod, loading }) => {
  if (loading) {
    return <Skeleton className="h-80 w-full rounded-xl" />;
  }

  if (!historicalCosts || historicalCosts.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
        <div>
          <div className="text-4xl mb-4">📉</div>
          <h3 className="text-lg font-semibold mb-2">No Historical Data</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            There is no historical cost data to display for the selected time
            period.
          </p>
        </div>
      </div>
    );
  }

  const formattedData = historicalCosts.map((cost) => ({
    month: new Date(cost.month).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    }),
    total: cost.total,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--chart-1))"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background) / 0.92)",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default HistoricalCostChart;
