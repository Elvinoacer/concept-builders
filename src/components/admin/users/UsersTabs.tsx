"use client";

import { motion } from "framer-motion";
import { usersTabsData } from "@/lib/dummydata/users";

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
      className="border-b border-gray-200 mb-4 md:mb-6 dark:border-gray-800"
    >
      <nav className="flex gap-4 md:gap-8 overflow-x-auto whitespace-nowrap">
        {usersTabsData.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`pb-3 border-b-2 text-sm font-semibold ${
              activeTab === tab.name
                ? "border-primary text-primary dark:text-blue-400 dark:border-blue-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </motion.div>
  );
};

export default UsersTabs;
