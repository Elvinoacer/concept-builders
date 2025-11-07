"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

const UsersHeader = ({ searchTerm, setSearchTerm, onAddUser }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 mb-4 md:mb-6 lg:mb-8 px-2 xs:px-4 sm:px-0"
    >
      {/* Title Section */}
      <div className="flex-shrink-0 min-w-0">
        <h2 className="text-xl xs:text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white truncate">
          Team Management
        </h2>
      </div>

      {/* Search and Button Section */}
      <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3 w-full lg:w-auto">
        {/* Search Input */}
        <div className="relative flex-1 xs:flex-none min-w-0">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-base sm:text-lg">
            search
          </span>
          <Input
            className="w-full rounded-lg border-gray-300 pl-10 pr-3 py-2.5 sm:py-3 text-sm sm:text-base focus:border-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-all duration-200 min-h-[44px] sm:min-h-[48px]"
            placeholder="Search team members..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add Member Button */}
        <button
          onClick={onAddUser}
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-dark-blue to-primary px-4 py-3 sm:py-2.5 text-sm sm:text-base font-medium text-white shadow-sm hover:to-primary-dark transition-all duration-200 hover:shadow-md active:scale-95 min-h-[44px] sm:min-h-[48px] whitespace-nowrap flex-shrink-0"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">
            add
          </span>
          <span className="truncate">Add Member</span>
        </button>
      </div>
    </motion.header>
  );
};

export default UsersHeader;
