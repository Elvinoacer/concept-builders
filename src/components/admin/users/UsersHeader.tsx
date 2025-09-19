"use client";

import { motion } from "framer-motion";

const UsersHeader = ({ activeTab }: { activeTab: string }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between mb-8"
    >
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
        Team Management
      </h2>
      <div className="flex items-center gap-4">
        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            search
          </span>
          <input
            className="form-input w-full rounded-md border-gray-300 pl-10 focus:border-primary focus:ring-primary dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400"
            placeholder="Search team members..."
            type="text"
          />
        </div>
        <button className="flex items-center gap-2 rounded-md bg-gradient-to-r from-dark-blue to-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:to-primary-dark transition-colors">
          <span className="material-symbols-outlined">add</span>
          Add Member
        </button>
      </div>
    </motion.header>
  );
};

export default UsersHeader;
