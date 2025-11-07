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
      className="border-b border-gray-200 mb-3 sm:mb-4 md:mb-6 dark:border-gray-800 px-2 xs:px-4 sm:px-0"
    >
      <nav className="flex gap-2 xs:gap-3 sm:gap-4 md:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide whitespace-nowrap py-1 -mx-2 xs:-mx-4 sm:mx-0 px-2 xs:px-4 sm:px-0">
        {usersTabsData.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`relative pb-2 sm:pb-3 border-b-2 text-xs xs:text-sm sm:text-base font-medium transition-all duration-200 min-h-[36px] xs:min-h-[40px] flex items-center justify-center px-1 xs:px-2 ${
              activeTab === tab.name
                ? "border-primary text-primary dark:text-blue-400 dark:border-blue-400 font-semibold"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
          >
            {tab.name}
            {/* Active indicator dot for mobile */}
            {activeTab === tab.name && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary dark:bg-blue-400 rounded-full sm:hidden" />
            )}
          </button>
        ))}
      </nav>
    </motion.div>
  );
};

export default UsersTabs;
