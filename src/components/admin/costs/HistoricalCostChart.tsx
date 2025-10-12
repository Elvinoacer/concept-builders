
"use client";

import { useEffect, useState } from 'react';
// import { historicalCostData } from "@/lib/costs-data"; // Removed as we will fetch dynamically
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const HistoricalCostChart = () => {
  const [activeTimePeriod, setActiveTimePeriod] = useState('1Y');
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/historical-costs?timePeriod=${activeTimePeriod}`);
        if (!res.ok) {
          throw new Error('Failed to fetch historical cost data');
        }
        const data = await res.json();
        setHistoricalData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [activeTimePeriod]);

  if (loading) {
    return <div className="h-64 md:h-80 flex items-center justify-center">Loading historical data...</div>;
  }

  if (error) {
    return <div className="h-64 md:h-80 flex items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4 md:mb-6">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Total Operational Costs</p>
          <p className="text-3xl md:text-4xl font-bold tracking-tight dark:text-white">$400.00</p>
          <div className="flex items-center text-sm">
            <p className="text-gray-600 dark:text-gray-400 mr-2">Last 12 Months</p>
            <div className="flex items-center text-green-500 font-medium">
              <span className="material-symbols-outlined text-base">
                arrow_upward
              </span>
              <span>5%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <button
            onClick={() => setActiveTimePeriod('1M')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTimePeriod === '1M' ? 'text-primary-foreground bg-primary' : 'text-foreground bg-muted hover:bg-muted/80'}`}
          >
            1M
          </button>
          <button
            onClick={() => setActiveTimePeriod('6M')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTimePeriod === '6M' ? 'text-primary-foreground bg-primary' : 'text-foreground bg-muted hover:bg-muted/80'}`}
          >
            6M
          </button>
          <button
            onClick={() => setActiveTimePeriod('1Y')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTimePeriod === '1Y' ? 'text-primary-foreground bg-primary' : 'text-foreground bg-muted hover:bg-muted/80'}`}
          >
            1Y
          </button>
          <button
            onClick={() => setActiveTimePeriod('All')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${activeTimePeriod === 'All' ? 'text-primary-foreground bg-primary' : 'text-foreground bg-muted hover:bg-muted/80'}`}
          >
            All
          </button>
        </div>
      </div>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historicalData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default HistoricalCostChart;
