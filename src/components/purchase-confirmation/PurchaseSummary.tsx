"use client";
import React from "react";
import { motion } from "framer-motion";
import { Calendar, Hash, DollarSign, FileText } from "lucide-react";

const PurchaseSummary = ({ purchaseNumber, purchaseDate, total }) => {
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <h3 className="text-gray-900 dark:text-white text-lg sm:text-xl font-bold leading-tight tracking-tight mb-4 sm:mb-6 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-500" />
        Order Summary
      </h3>

      <div className="space-y-3 sm:space-y-4">
        {/* Purchase Number */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center p-3 sm:p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Hash className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                Order Number
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Unique identifier
              </p>
            </div>
          </div>
          <p className="text-gray-900 dark:text-white text-sm font-semibold bg-white/50 dark:bg-gray-600/50 px-3 py-1 rounded-lg">
            #{purchaseNumber}
          </p>
        </motion.div>

        {/* Purchase Date */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center p-3 sm:p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                Purchase Date
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                When you placed order
              </p>
            </div>
          </div>
          <p className="text-gray-900 dark:text-white text-sm font-semibold">
            {purchaseDate}
          </p>
        </motion.div>

        {/* Total Amount */}
        <motion.div
          variants={itemVariants}
          className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-200/50 dark:border-blue-700/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                Total Amount
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Including all fees
              </p>
            </div>
          </div>
          <p className="text-gray-900 dark:text-white text-lg font-bold bg-white/50 dark:bg-gray-600/50 px-3 py-2 rounded-lg">
            ${typeof total === "number" ? total.toFixed(2) : "0.00"}
          </p>
        </motion.div>
      </div>

      {/* Payment Status */}
      <motion.div
        className="mt-4 p-3 bg-green-50/50 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-700/30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-700 dark:text-green-400 text-sm font-medium">
            Payment completed successfully
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PurchaseSummary;
