"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const AnalyticsHeader = ({
  timePeriod,
  setTimePeriod,
}: {
  timePeriod: string;
  setTimePeriod: (period: string) => void;
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const timePeriods = [
    { label: "Today", value: "Today" },
    { label: "Last 7 Days", value: "Last 7 Days" },
    { label: "Last 30 Days", value: "Last 30 Days" },
    { label: "All Time", value: "All Time" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 sm:gap-4 w-full"
    >
      {/* Title Section */}
      <div className="flex flex-col gap-1 sm:gap-2 flex-1 min-w-0">
        <h1 className="text-foreground text-xl xs:text-2xl sm:text-3xl font-bold tracking-tight truncate">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground text-sm xs:text-base font-normal leading-normal max-w-2xl">
          Analyze your business performance in real-time
        </p>
      </div>

      {/* Time Period Selector - Responsive Versions */}
      {isMobile ? (
        // Mobile: Dropdown Select
        <div className="w-full xs:w-auto">
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="w-full h-11 px-4 py-2.5 text-sm bg-background border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1rem",
              paddingRight: "2.5rem",
            }}
          >
            {timePeriods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      ) : (
        // Desktop: Button Group
        <motion.div
          className="flex h-10 items-center rounded-lg bg-muted p-1 shadow-xs border border-border/50"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {timePeriods.map((period) => (
            <label
              key={period.value}
              className={`
                relative flex h-full cursor-pointer items-center justify-center rounded-md px-3 sm:px-4 text-xs sm:text-sm font-medium transition-all duration-200
                ${
                  timePeriod === period.value
                    ? "bg-background text-primary shadow-sm border border-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }
                min-w-[60px] sm:min-w-[80px] text-center
              `}
            >
              <span className="whitespace-nowrap">{period.label}</span>
              <input
                className="sr-only"
                name="time_period"
                type="radio"
                value={period.value}
                checked={timePeriod === period.value}
                onChange={() => setTimePeriod(period.value)}
              />
              {timePeriod === period.value && (
                <motion.div
                  layoutId="activePeriod"
                  className="absolute inset-0 rounded-md bg-background border border-border/50 shadow-sm"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{period.label}</span>
            </label>
          ))}
        </motion.div>
      )}

      {/* Mobile Indicator (Optional) */}
      <div className="xs:hidden text-xs text-muted-foreground text-center mt-1">
        Swipe charts to explore data
      </div>
    </motion.div>
  );
};

export default AnalyticsHeader;
