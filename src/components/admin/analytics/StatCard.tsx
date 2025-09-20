
"use client";

import { motion } from "framer-motion";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  color: string;
}

const StatCard = ({ label, value, change, changeType, color }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-sm"
    >
      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{label}</p>
      <p className={`text-2xl md:text-3xl font-bold ${color}`}>{value}</p>
      <p
        className={`flex items-center gap-1 text-sm font-medium ${
          changeType === "increase" ? "text-green-600" : "text-red-600"
        }`}
      >
        <span className="material-symbols-outlined text-base">
          {changeType === "increase" ? "trending_up" : "trending_down"}
        </span>
        <span>{change}</span>
      </p>
    </motion.div>
  );
};

export default StatCard;
