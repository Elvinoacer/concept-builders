"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ReferralTrendData {
  date: string;
  [key: string]: any;
}

interface ReferralTrendsChartProps {
  data: ReferralTrendData[];
}

// Custom tooltip component for better mobile experience
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 sm:p-4">
        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
          {new Date(label).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <div className="space-y-1 min-w-[140px] sm:min-w-[160px]">
          {payload.map((entry: any, index: number) => (
            <div
              key={`item-${index}`}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {entry.dataKey}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-900 dark:text-white">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Custom legend component for better mobile experience
const renderLegend = (props: any) => {
  const { payload } = props;
  const [visibleLines, setVisibleLines] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Initialize all lines as visible
    const initialVisibility: Record<string, boolean> = {};
    payload?.forEach((entry: any) => {
      initialVisibility[entry.dataKey] = true;
    });
    setVisibleLines(initialVisibility);
  }, [payload]);

  const toggleLine = (dataKey: string) => {
    setVisibleLines((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 mt-4 px-2 sm:px-0">
      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
        Click to toggle platforms:
      </p>
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {payload.map((entry: any, index: number) => (
          <button
            key={`legend-${index}`}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              visibleLines[entry.dataKey]
                ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
                : "bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-700 line-through"
            } hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95`}
            onClick={() => toggleLine(entry.dataKey)}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate max-w-[80px] xs:max-w-[100px] sm:max-w-none">
              {entry.value}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ReferralTrendsChart = ({ data }: ReferralTrendsChartProps) => {
  const [isClient, setIsClient] = useState(false);
  const [chartDimensions, setChartDimensions] = useState({
    width: 600,
    height: 300,
  });

  useEffect(() => {
    setIsClient(true);

    const updateDimensions = () => {
      const width = window.innerWidth;
      let chartWidth = 600;
      let chartHeight = 300;

      if (width < 640) {
        // sm breakpoint
        chartWidth = 350;
        chartHeight = 250;
      } else if (width < 768) {
        // md breakpoint
        chartWidth = 500;
        chartHeight = 280;
      } else if (width < 1024) {
        // lg breakpoint
        chartWidth = 600;
        chartHeight = 300;
      } else {
        chartWidth = 700;
        chartHeight = 320;
      }

      setChartDimensions({ width: chartWidth, height: chartHeight });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-64 sm:h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
            Loading chart...
          </p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 sm:h-80 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">📊</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            No referral data available for the selected period. Try selecting a
            different time range or generate more referral URLs.
          </p>
        </div>
      </div>
    );
  }

  // Extract all unique source keys from the data
  const allSources = Array.from(
    new Set(
      data.flatMap((item) => Object.keys(item).filter((key) => key !== "date"))
    )
  );

  // Enhanced color palette with better contrast
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#6366f1",
    "#ec4899",
  ];

  // Format X-axis ticks based on screen size
  const formatXAxisTick = (tick: string) => {
    const date = new Date(tick);
    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      return date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
      });
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full h-64 sm:h-80 lg:h-96 px-2 sm:px-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: window.innerWidth < 640 ? 10 : 30,
            left: window.innerWidth < 640 ? 0 : 20,
            bottom: window.innerWidth < 640 ? 10 : 20,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
            className="dark:stroke-gray-700"
            vertical={window.innerWidth > 640} // Hide vertical grid on mobile
          />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            className="text-xs"
            tick={{
              fill: "#6b7280",
              fontSize: window.innerWidth < 640 ? 10 : 12,
            }}
            tickFormatter={formatXAxisTick}
            angle={window.innerWidth < 640 ? -45 : 0}
            textAnchor={window.innerWidth < 640 ? "end" : "middle"}
            height={window.innerWidth < 640 ? 40 : 30}
            interval={window.innerWidth < 640 ? "preserveStartEnd" : 0}
          />
          <YAxis
            stroke="#6b7280"
            className="text-xs"
            tick={{
              fill: "#6b7280",
              fontSize: window.innerWidth < 640 ? 10 : 12,
            }}
            width={window.innerWidth < 640 ? 30 : 40}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={renderLegend}
            wrapperStyle={{
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          />
          {allSources.map((source, index) => (
            <Line
              key={source}
              type="monotone"
              dataKey={source}
              stroke={colors[index % colors.length]}
              strokeWidth={window.innerWidth < 640 ? 2 : 2.5}
              dot={window.innerWidth > 640 ? { r: 4 } : { r: 3 }}
              activeDot={{
                r: window.innerWidth < 640 ? 6 : 8,
                strokeWidth: 2,
                stroke: colors[index % colors.length],
              }}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Chart Instructions */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 flex-wrap">
          <span>💡</span>
          <span>Pinch to zoom on mobile</span>
          <span className="hidden sm:inline">•</span>
          <span>Hover for details</span>
          <span className="hidden sm:inline">•</span>
          <span>Tap platforms to toggle</span>
        </p>
      </div>
    </div>
  );
};

export default ReferralTrendsChart;
