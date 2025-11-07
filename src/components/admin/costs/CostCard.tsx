"use client";

import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiDatabase,
  FiMail,
  FiCloud,
  FiCreditCard,
} from "react-icons/fi";

interface CostCardProps {
  service: string;
  cost: string;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  icon: string;
  details?: string;
  trend?: number;
  isTotal?: boolean;
  className?: string;
}

const CostCard = ({
  service,
  cost,
  change,
  changeType,
  icon,
  details,
  trend = 0,
  isTotal = false,
  className = "",
}: CostCardProps) => {
  // Icon mapping with React Icons
  const getIcon = () => {
    const iconProps = { className: "w-5 h-5 sm:w-6 sm:h-6" };

    switch (icon) {
      case "storage":
        return <FiDatabase {...iconProps} />;
      case "email":
        return <FiMail {...iconProps} />;
      case "cloud":
        return <FiCloud {...iconProps} />;
      case "payments":
        return <FiCreditCard {...iconProps} />;
      default:
        return <FiCreditCard {...iconProps} />;
    }
  };

  // Get trend icon based on change type
  const getTrendIcon = () => {
    const iconProps = { className: "w-4 h-4 sm:w-5 sm:h-5" };

    switch (changeType) {
      case "increase":
        return <FiTrendingUp {...iconProps} />;
      case "decrease":
        return <FiTrendingDown {...iconProps} />;
      default:
        return <FiMinus {...iconProps} />;
    }
  };

  // Get background color based on card type and trend
  const getCardStyle = () => {
    if (isTotal) {
      return "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800";
    }

    if (changeType === "increase" && trend > 10) {
      return "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 border-red-200 dark:border-red-800";
    }

    if (changeType === "decrease") {
      return "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800";
    }

    return "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700";
  };

  // Get text color based on change type
  const getChangeColor = () => {
    switch (changeType) {
      case "increase":
        return trend > 10
          ? "text-red-600 dark:text-red-400"
          : "text-orange-600 dark:text-orange-400";
      case "decrease":
        return "text-green-600 dark:text-green-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  // Get icon color based on change type
  const getIconColor = () => {
    if (isTotal) {
      return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30";
    }

    switch (changeType) {
      case "increase":
        return trend > 10
          ? "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
          : "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
      case "decrease":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      default:
        return "text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{
        y: -4,
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
      className={`group relative rounded-xl p-4 xs:p-5 sm:p-6 border-2 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden ${getCardStyle()} ${className}`}
    >
      {/* Background Pattern for Total Card */}
      {isTotal && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200"></div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex items-start justify-between gap-3 mb-3 xs:mb-4 relative z-10">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Icon Container */}
          <div
            className={`p-2 xs:p-2.5 rounded-lg xs:rounded-xl transition-colors duration-200 flex-shrink-0 ${getIconColor()}`}
          >
            {getIcon()}
          </div>

          {/* Service Name */}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm xs:text-base font-semibold text-gray-900 dark:text-white truncate leading-tight">
              {service}
            </h3>
            {details && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate hidden xs:block">
                {details}
              </p>
            )}
          </div>
        </div>

        {/* Change Indicator - Desktop */}
        <div
          className={`hidden xs:flex items-center gap-1 px-2 xs:px-3 py-1 rounded-full text-xs font-semibold transition-colors ${getChangeColor()} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm`}
        >
          {getTrendIcon()}
          <span className="whitespace-nowrap">{change}</span>
        </div>
      </div>

      {/* Cost Value */}
      <div className="mb-3 xs:mb-4 relative z-10">
        <p
          className={`text-2xl xs:text-3xl font-bold tracking-tight leading-tight ${
            isTotal
              ? "text-blue-900 dark:text-blue-100"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {cost}
        </p>

        {/* Mobile Details */}
        {details && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 xs:hidden">
            {details}
          </p>
        )}
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-between relative z-10">
        {/* Change Indicator - Mobile */}
        <div
          className={`xs:hidden flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getChangeColor()} bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm`}
        >
          {getTrendIcon()}
          <span>{change}</span>
        </div>

        {/* Trend Indicator Bar */}
        <div className="hidden xs:block flex-1 max-w-[120px]">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.abs(trend), 100)}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${
                changeType === "increase"
                  ? trend > 10
                    ? "bg-red-500"
                    : "bg-orange-500"
                  : changeType === "decrease"
                    ? "bg-green-500"
                    : "bg-gray-500"
              }`}
            />
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 text-right">
            {Math.abs(trend).toFixed(1)}% change
          </p>
        </div>

        {/* Status Badge */}
        <div className="hidden sm:block">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              changeType === "increase"
                ? trend > 10
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                : changeType === "decrease"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
            }`}
          >
            {changeType === "increase"
              ? trend > 10
                ? "High Increase"
                : "Increasing"
              : changeType === "decrease"
                ? "Decreasing"
                : "Stable"}
          </span>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl ${
          isTotal
            ? "bg-blue-500/5"
            : changeType === "increase"
              ? "bg-red-500/5"
              : changeType === "decrease"
                ? "bg-green-500/5"
                : "bg-gray-500/5"
        }`}
      />

      {/* Corner Accent */}
      {isTotal && (
        <div className="absolute top-0 right-0 w-12 h-12 xs:w-16 xs:h-16 rounded-bl-full bg-blue-500/10" />
      )}
    </motion.div>
  );
};

export default CostCard;
