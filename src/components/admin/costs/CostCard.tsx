
"use client";

import { motion } from "framer-motion";

const CostCard = ({ service, cost, change, changeType, icon }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{service}</p>
        <span className="material-symbols-outlined text-gray-400 dark:text-gray-500">
          {icon}
        </span>
      </div>
      <p className="text-3xl font-bold mt-1 dark:text-white">{cost}</p>
      <div
        className={`flex items-center text-sm font-medium ${
          changeType === "increase" ? "text-green-500" : "text-red-500"
        }`}
      >
        <span className="material-symbols-outlined text-lg">
          {changeType === "increase" ? "arrow_upward" : "arrow_downward"}
        </span>
        <span>{change}</span>
      </div>
    </motion.div>
  );
};

export default CostCard;
