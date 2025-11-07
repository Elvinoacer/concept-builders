"use client";

import { motion } from "framer-motion";
import { FiTrendingUp, FiDollarSign, FiBarChart, FiInfo } from "react-icons/fi";

const CostsHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className="flex flex-col xs:flex-row xs:items-end xs:justify-between gap-3 xs:gap-4 pb-4 xs:pb-6 border-b border-gray-200 dark:border-gray-700"
    >
      {/* Title Section */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 xs:gap-4 mb-2 xs:mb-3">
          {/* Icon Container */}
          <div className="p-2 xs:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
            <FiDollarSign className="w-5 h-5 xs:w-6 xs:h-6 text-white" />
          </div>

          {/* Text Content */}
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white truncate">
              Costs Dashboard
            </h1>
            <p className="text-sm xs:text-base text-muted-foreground mt-1 xs:mt-2 leading-relaxed max-w-2xl">
              Track and analyze your operational costs across all services in
              real-time
            </p>
          </div>
        </div>

        {/* Stats Bar - Mobile */}
        <div className="xs:hidden flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FiTrendingUp className="w-3 h-3 text-green-500" />
            <span>Live Updates</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FiBarChart className="w-3 h-3 text-blue-500" />
            <span>Multi-service</span>
          </div>
        </div>
      </div>

      {/* Action Section */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 xs:gap-3">
        {/* Quick Stats - Desktop */}
        <div className="hidden xs:flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Data</span>
          </div>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center gap-2">
            <FiBarChart className="w-4 h-4 text-blue-500" />
            <span>Real-time</span>
          </div>
        </div>

        {/* Info Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden sm:flex items-center gap-2 px-3 xs:px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg xs:rounded-xl text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800"
          title="View cost management tips"
        >
          <FiInfo className="w-4 h-4" />
          <span className="hidden xs:inline">Tips</span>
        </motion.button>

        {/* Last Updated */}
        <div className="text-xs text-muted-foreground text-center xs:text-right pt-2 xs:pt-0 border-t xs:border-t-0 border-gray-100 dark:border-gray-800 xs:border-none">
          Updated just now
        </div>
      </div>

      {/* Mobile Info Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="sm:hidden flex items-center justify-center gap-2 w-full py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200 dark:border-blue-800"
        title="View cost management tips"
      >
        <FiInfo className="w-4 h-4" />
        <span>Cost Management Tips</span>
      </motion.button>
    </motion.header>
  );
};

export default CostsHeader;
