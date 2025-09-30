"use client";

import { motion } from "framer-motion";
import { conversionRateData } from "@/lib/dummydata";

const ConversionRateChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-sm"
    >
      <div className="flex flex-col">
        <h3 className="text-chart-4 text-base md:text-lg font-semibold">
          Conversion Rate
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Last 30 days</p>
      </div>
      <div className="flex h-48 md:h-64 items-center justify-center">
        <div className="relative h-32 w-32 md:h-48 md:w-48">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-muted"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            ></path>
            <path
              className="text-chart-1"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={`${conversionRateData.converted}, 100`}
              strokeWidth="3"
            ></path>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl md:text-3xl font-bold text-chart-1">{conversionRateData.rate}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Converted</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-chart-1"></div>
          <span className="text-chart-1">Converted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted"></div>
          <span>Not Converted</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ConversionRateChart;