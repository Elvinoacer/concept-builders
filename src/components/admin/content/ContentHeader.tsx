"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiPlus, FiFileText } from "react-icons/fi";

const ContentHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
      className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8"
    >
      {/* Title Section */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="hidden xs:flex p-2 bg-primary/10 rounded-lg text-primary">
          <FiFileText className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground tracking-tight truncate">
            Content Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1 hidden xs:block">
            Create and manage your website content
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full xs:w-auto">
        {/* Mobile Quick Actions */}
        <div className="xs:hidden flex gap-2">
          <Link href="/admin/content/editor" className="flex-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 w-full h-11 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-semibold rounded-lg hover:to-primary/80 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FiPlus className="w-4 h-4" />
              <span>New Post</span>
            </motion.button>
          </Link>

          {/* Mobile Secondary Action */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center h-11 px-4 border border-gray-300 dark:border-gray-600 text-foreground text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <span>Filter</span>
          </motion.button>
        </div>

        {/* Desktop Actions */}
        <div className="hidden xs:flex items-center gap-2 sm:gap-3">
          {/* Filter Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center h-10 px-4 border border-gray-300 dark:border-gray-600 text-foreground text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
          >
            <span>Filter & Sort</span>
          </motion.button>

          {/* Primary CTA */}
          <Link href="/admin/content/editor">
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 h-10 px-4 sm:px-5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-sm font-semibold rounded-lg hover:to-primary/80 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <FiPlus className="w-4 h-4" />
              <span className="whitespace-nowrap">New Blog Post</span>
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Mobile Description */}
      <p className="xs:hidden text-xs text-muted-foreground text-center mt-1">
        Create and manage your website content
      </p>
    </motion.header>
  );
};

export default ContentHeader;
