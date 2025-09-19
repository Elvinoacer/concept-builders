
"use client";

import { motion } from "framer-motion";

const AnalyticsHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-base font-normal leading-normal">
          Analyze your business performance in real-time.
        </p>
      </div>
      <div className="flex h-10 items-center rounded-lg bg-muted p-1">
        <label className="flex h-full cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium transition-colors has-[:checked]:bg-background has-[:checked]:text-primary has-[:checked]:shadow-sm text-muted-foreground hover:text-foreground">
          <span>Today</span>
          <input
            className="sr-only"
            name="time_period"
            type="radio"
            value="Today"
          />
        </label>
        <label className="flex h-full cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium transition-colors has-[:checked]:bg-background has-[:checked]:text-primary has-[:checked]:shadow-sm text-muted-foreground hover:text-foreground">
          <span>Last 7 Days</span>
          <input
            className="sr-only"
            name="time_period"
            type="radio"
            value="Last 7 Days"
          />
        </label>
        <label className="flex h-full cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium transition-colors has-[:checked]:bg-background has-[:checked]:text-primary has-[:checked]:shadow-sm text-muted-foreground hover:text-foreground">
          <span>Last 30 Days</span>
          <input
            defaultChecked
            className="sr-only"
            name="time_period"
            type="radio"
            value="Last 30 Days"
          />
        </label>
        <label className="flex h-full cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium transition-colors has-[:checked]:bg-background has-[:checked]:text-primary has-[:checked]:shadow-sm text-muted-foreground hover:text-foreground">
          <span>All Time</span>
          <input
            className="sr-only"
            name="time_period"
            type="radio"
            value="All Time"
          />
        </label>
      </div>
    </motion.div>
  );
};

export default AnalyticsHeader;
