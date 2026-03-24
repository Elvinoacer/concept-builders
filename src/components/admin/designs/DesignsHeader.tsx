"use client";

import { motion } from "framer-motion";
import { FiFolderPlus, FiGrid, FiPlus, FiTag } from "react-icons/fi";

interface DesignsHeaderProps {
  activeTab: string;
  newfolder?: boolean;
  onTabChange?: (tab: string) => void;
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
      className="flex flex-col gap-4"
    >
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4">
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
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full xs:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onManageCategoriesClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium text-foreground"
          >
            <FiTag className="w-4 h-4 text-blue-500" />
            <span>Categories</span>
          </motion.button>

          {newfolder && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNewFolderClick}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium text-foreground"
            >
              <FiFolderPlus className="w-4 h-4 text-green-500" />
              <span>New Folder</span>
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNewDesignClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium"
          >
            <FiPlus className="w-4 h-4" />
            <span>New Design</span>
          </motion.button>
        </div>

        {/* Mobile Description */}
        <p className="xs:hidden text-xs text-muted-foreground text-center -mt-2">
          {activeTab === "all" ? "All design files" : "Folder organization"}
        </p>
      </div>

      {/* Tab Navigation */}
      {/* <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onTabChange("all")}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 relative ${
            activeTab === "all"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <FiGrid className="w-4 h-4" />
          <span>All Designs</span>
          {activeTab === "all" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            />
          )}
        </button>

        <button
          onClick={() => onTabChange("folders")}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 relative ${
            activeTab === "folders"
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <FiFolder className="w-4 h-4" />
          <span>Folders</span>
          {activeTab === "folders" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            />
          )}
        </button>
      </div> */}
    </motion.div>
  );
};

export default DesignsHeader;
