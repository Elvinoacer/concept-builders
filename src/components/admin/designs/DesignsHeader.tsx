"use client";

import { motion } from "framer-motion";
import {
  FiChevronDown,
  FiFolderPlus,
  FiGrid,
  FiPlus,
  FiTag,
} from "react-icons/fi";

interface DesignsHeaderProps {
  activeTab: string;
  newfolder?: boolean;
  onNewDesignClick: () => void;
  onNewFolderClick: () => void;
  onManageCategoriesClick: () => void;
}

const DesignsHeader = ({
  activeTab,
  newfolder,
  onNewDesignClick,
  onNewFolderClick,
  onManageCategoriesClick,
}: DesignsHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4"
    >
      {/* Title Section */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="hidden xs:flex p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
          <FiGrid className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight truncate">
            Design Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1 hidden xs:block">
            {activeTab === "all"
              ? "All design files and projects"
              : "Organize designs in folders"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto">
        {/* Mobile Actions Dropdown */}
        <div className="xs:hidden relative">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-between w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span className="text-sm font-medium text-foreground">
              Quick Actions
            </span>
            <FiChevronDown className="w-4 h-4 text-muted-foreground" />
          </motion.button>

          {/* Mobile Dropdown Content */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden">
            <button
              onClick={onManageCategoriesClick}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600"
            >
              <FiTag className="w-4 h-4 text-blue-500" />
              <span>Manage Categories</span>
            </button>
            {newfolder && (
              <button
                onClick={onNewFolderClick}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-600"
              >
                <FiFolderPlus className="w-4 h-4 text-green-500" />
                <span>Create Folder</span>
              </button>
            )}
            <button
              onClick={onNewDesignClick}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-foreground hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <FiPlus className="w-4 h-4 text-purple-500" />
              <span>New Design</span>
            </button>
          </div>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden xs:flex items-center gap-2 sm:gap-3">
          {/* Manage Categories Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onManageCategoriesClick}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-secondary-foreground/10"
          >
            <FiTag className="w-4 h-4" />
            <span className="hidden sm:inline">Manage Categories</span>
            <span className="sm:hidden">Categories</span>
          </motion.button>

          {/* Create Folder Button - Conditionally Rendered */}
          {newfolder && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewFolderClick}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-secondary-foreground/10"
            >
              <FiFolderPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Folder</span>
              <span className="sm:hidden">Folder</span>
            </motion.button>
          )}

          {/* Primary CTA - New Design */}
          <motion.button
            whileHover={{
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewDesignClick}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-medium rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">New Design</span>
            <span className="sm:hidden">New</span>
          </motion.button>
        </div>
      </div>

      {/* Mobile Description */}
      <p className="xs:hidden text-xs text-muted-foreground text-center -mt-2">
        {activeTab === "all" ? "All design files" : "Folder organization"}
      </p>
    </motion.div>
  );
};

export default DesignsHeader;
