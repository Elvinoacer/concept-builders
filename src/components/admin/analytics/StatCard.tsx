"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  color: string;
  className?: string;
}

const StatCard = ({
  label,
  value,
  change,
  changeType,
  color,
  className = "",
}: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -2,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 },
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className={`
        group relative flex flex-col justify-between rounded-xl 
        border border-gray-200/80 bg-white dark:bg-gray-800 dark:border-gray-700/80 
        shadow-xs hover:shadow-md 
        p-4 xs:p-5 sm:p-6
        transition-all duration-300 ease-out
        hover:border-gray-300 dark:hover:border-gray-600
        overflow-hidden
        ${className}
      `}
    >
      {/* Background Glow Effect */}
      <div
        className={`
        absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${
          changeType === "increase"
            ? "bg-gradient-to-br from-green-50 to-transparent dark:from-green-900/10"
            : "bg-gradient-to-br from-red-50 to-transparent dark:from-red-900/10"
        }
      `}
      ></div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Label */}
        <p
          className="
          text-gray-600 dark:text-gray-400 
          text-xs xs:text-sm font-medium 
          mb-2 xs:mb-3
          truncate
        "
        >
          {label}
        </p>

        {/* Value - Responsive Sizing */}
        <p
          className={`
          font-bold tracking-tight break-words
          text-xl xs:text-2xl sm:text-3xl
          mb-3 xs:mb-4
          ${color}
        `}
        >
          {value}
        </p>

        {/* Change Indicator */}
        <div className="flex items-center gap-1.5 xs:gap-2">
          {/* Icon Container */}
          <div
            className={`
            flex items-center justify-center 
            rounded-lg p-1 xs:p-1.5
            transition-colors duration-200
            ${
              changeType === "increase"
                ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
            }
          `}
          >
            <span className="material-symbols-outlined text-base xs:text-lg">
              {changeType === "increase" ? "trending_up" : "trending_down"}
            </span>
          </div>

          {/* Change Text */}
          <span
            className={`
            text-xs xs:text-sm font-semibold whitespace-nowrap
            ${
              changeType === "increase"
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }
          `}
          >
            {change}
          </span>
        </div>
      </div>

      {/* Progress Bar Indicator */}
      <div className="relative z-10 mt-4 xs:mt-5">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: changeType === "increase" ? "75%" : "40%" }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            className={`
              h-full rounded-full
              ${
                changeType === "increase"
                  ? "bg-green-500 dark:bg-green-400"
                  : "bg-red-500 dark:bg-red-400"
              }
            `}
          />
        </div>
        <p className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400 mt-1.5">
          {changeType === "increase" ? "Positive trend" : "Needs attention"}
        </p>
      </div>

      {/* Corner Accent */}
      <div
        className={`
        absolute top-0 right-0 w-12 h-12 xs:w-16 xs:h-16 
        rounded-bl-full
        opacity-10 group-hover:opacity-20
        transition-opacity duration-300
        ${changeType === "increase" ? "bg-green-500" : "bg-red-500"}
      `}
      ></div>
    </motion.div>
  );
};

export default StatCard;
