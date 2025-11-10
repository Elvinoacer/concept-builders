"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiGrid,
  FiFolder,
  FiStar,
  FiArchive,
  FiTrendingUp,
  FiChevronDown,
} from "react-icons/fi";

interface DesignsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const initialTabs = [
  { id: "all", label: "All Designs", icon: FiGrid, count: 0 },
  { id: "folders", label: "Folders", icon: FiFolder, count: 0 },
  { id: "featured", label: "Featured", icon: FiStar, count: 0 },
  { id: "archived", label: "Archived", icon: FiArchive, count: 0 },
  { id: "trending", label: "Trending", icon: FiTrendingUp, count: 0 },
];

const DesignsTabs = ({ activeTab, setActiveTab }: DesignsTabsProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [designTabs, setDesignTabs] = useState(initialTabs);

  useEffect(() => {
    const fetchTabCounts = async () => {
      try {
        const response = await fetch("/api/designs/tabs-count");
        const counts = await response.json();
        setDesignTabs((prevTabs) =>
          prevTabs.map((tab) => ({
            ...tab,
            count: counts[tab.id] ?? tab.count,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch tab counts:", error);
      }
    };

    fetchTabCounts();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getActiveTabData = () => {
    return designTabs.find((tab) => tab.id === activeTab) || designTabs[0];
  };

  const activeTabData = getActiveTabData();

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsDropdownOpen(false);
  };

  // Mobile Dropdown Component
  const MobileDropdown = () => (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          <activeTabData.icon className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-foreground">
            {activeTabData.label}
          </span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {activeTabData.count}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isDropdownOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10 overflow-hidden"
          >
            {designTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center justify-between p-4 transition-colors duration-150 ${
                  activeTab === tab.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500"
                    : "hover:bg-gray-50 dark:hover:bg-gray-700 text-foreground"
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon
                    className={`w-5 h-5 ${
                      activeTab === tab.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground"
                    }`}
                  />
                  <span className="font-medium text-sm">{tab.label}</span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Desktop Tabs Component
  const DesktopTabs = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative border-b border-gray-200 dark:border-gray-700"
    >
      <nav className="flex gap-2 lg:gap-6 overflow-x-auto">
        {designTabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleTabClick(tab.id)}
            className={`group relative flex items-center gap-2 lg:gap-3 border-b-2 py-3 px-2 lg:px-4 transition-all duration-200 min-w-0 ${
              activeTab === tab.id
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Active Tab Indicator */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeDesignTab"
                className="absolute inset-x-0 -bottom-px h-0.5 bg-blue-500"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}

            {/* Icon */}
            <tab.icon
              className={`w-4 h-4 lg:w-5 lg:h-5 transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
            />

            {/* Label */}
            <span
              className={`text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
            >
              {tab.label}
            </span>

            {/* Count Badge */}
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
              }`}
            >
              {tab.count}
            </span>

            {/* Hover Effect */}
            <div className="absolute inset-0 rounded-t-lg bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-200" />
          </motion.button>
        ))}
      </nav>

      {/* Scroll Gradient Indicator */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </motion.div>
  );

  return (
    <div className="mb-4 sm:mb-6">
      {isMobile ? <MobileDropdown /> : <DesktopTabs />}

      {/* Mobile Active Tab Info */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center justify-between text-xs text-muted-foreground px-1"
        >
          <span>Active view</span>
          <span>{activeTabData.count} items</span>
        </motion.div>
      )}
    </div>
  );
};

export default DesignsTabs;
