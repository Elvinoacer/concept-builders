"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { FiFileText, FiGlobe, FiShield, FiChevronDown } from "react-icons/fi";

interface ContentTabsProps {
  activeTab: string;
  onTabClick: (tabName: string) => void;
  blogPostCount: number;
  staticPageCount: number;
  policyCount: number;
}

const ContentTabs = ({
  activeTab,
  onTabClick,
  blogPostCount,
  staticPageCount,
  policyCount,
}: ContentTabsProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Local tabs data to avoid dependency
  const contentTabsData = [
    {
      name: "Blog Posts",
      icon: FiFileText,
      count: blogPostCount,
      color: "text-blue-600",
    },
    {
      name: "Static Pages",
      icon: FiGlobe,
      count: staticPageCount,
      color: "text-green-600",
    },
    {
      name: "Policies",
      icon: FiShield,
      count: policyCount,
      color: "text-purple-600",
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTabClick = (tabName) => {
    onTabClick(tabName);
    setIsDropdownOpen(false);
  };

  const getActiveTabData = () => {
    return (
      contentTabsData.find((tab) => tab.name === activeTab) ||
      contentTabsData[0]
    );
  };

  const activeTabData = getActiveTabData();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-4 sm:mb-6"
    >
      {isMobile ? (
        // Mobile: Dropdown Select
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-3 sm:p-4 border border-border rounded-xl bg-card hover:bg-muted/50 transition-colors duration-200 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <activeTabData.icon
                className={`w-5 h-5 ${activeTabData.color}`}
              />
              <span className="font-semibold text-foreground text-sm">
                {activeTab}
              </span>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full font-medium">
                {activeTabData.count}
              </span>
            </div>
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden"
              >
                {contentTabsData.map((tab) => (
                  <button
                    key={tab.name}
                    onClick={() => handleTabClick(tab.name)}
                    className={`w-full flex items-center justify-between p-3 sm:p-4 transition-colors duration-150 ${
                      activeTab === tab.name
                        ? "bg-primary/10 text-primary border-r-2 border-primary"
                        : "hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon className={`w-5 h-5 ${tab.color}`} />
                      <span className="font-medium text-sm">{tab.name}</span>
                    </div>
                    <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full font-medium">
                      {tab.count}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        // Desktop: Traditional Tabs
        <div className="relative">
          <div className="flex border-b border-border overflow-x-auto scrollbar-hide">
            {contentTabsData.map((tab, index) => (
              <motion.button
                key={tab.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => handleTabClick(tab.name)}
                className={`group relative flex items-center gap-2 sm:gap-3 border-b-2 py-3 px-4 sm:px-6 transition-all duration-200 min-w-0 ${
                  activeTab === tab.name
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Active Tab Indicator */}
                {activeTab === tab.name && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-0 -bottom-px h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}

                {/* Icon */}
                <tab.icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                    activeTab === tab.name
                      ? tab.color
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                />

                {/* Tab Name */}
                <span
                  className={`text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.name
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {tab.name}
                </span>

                {/* Count Badge */}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                    activeTab === tab.name
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                  }`}
                >
                  {tab.count}
                </span>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-t-lg bg-primary/0 group-hover:bg-primary/5 transition-colors duration-200" />
              </motion.button>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-card to-transparent pointer-events-none" />
        </div>
      )}

      {/* Mobile Active Tab Info */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center justify-between text-xs text-muted-foreground"
        >
          <span>Active section</span>
          <span>{activeTabData.count} items</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ContentTabs;
