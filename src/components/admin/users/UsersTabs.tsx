"use client";

import { motion } from "framer-motion";

const UsersTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="border-b border-gray-200 mb-6 dark:border-gray-800"
    >
      <nav className="flex gap-8">
        <button
          onClick={() => setActiveTab("clients")}
          className={`pb-3 border-b-2 text-sm font-semibold ${
            activeTab === "clients"
              ? "border-primary text-primary dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Clients
        </button>
        <button
          onClick={() => setActiveTab("team")}
          className={`pb-3 border-b-2 text-sm font-medium ${
            activeTab === "team"
              ? "border-primary text-primary dark:text-blue-400 dark:border-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          }`}
        >
          Team
        </button>
      </nav>
    </motion.div>
  );
};

export default UsersTabs;
