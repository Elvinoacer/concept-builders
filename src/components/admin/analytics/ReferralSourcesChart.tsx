"use client";

import React from "react";
import { referralSourcesData } from "@/lib/analytics-data";
import { motion } from "framer-motion";

const ReferralSourcesChart = () => {
  const chartColors = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"];
  const textChartColors = ["text-chart-1", "text-chart-2", "text-chart-3", "text-chart-4", "text-chart-5"];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-sm"
    >
      <div className="flex flex-col">
        <h3 className="text-chart-3 text-lg font-semibold">
          Referral Sources
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Top 5 Channels</p>
      </div>
      <div className="grid h-64 grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-3 py-3">
        {referralSourcesData.map((source, index) => (
          <React.Fragment key={index}>
            <p className={`text-sm font-medium ${textChartColors[index]}`}>{source.name}</p>
            <div className="h-2.5 w-full rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${chartColors[index]}`}
                style={{ width: `${source.percentage}%` }}
              ></div>
            </div>
            <p className={`text-sm font-semibold ${textChartColors[index]}`}>
              {source.value}
            </p>
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default ReferralSourcesChart;
