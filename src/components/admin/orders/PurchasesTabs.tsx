"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ordersTabsData } from "@/lib/dummydata/orders";
import { useState, useRef, useEffect } from "react";

const PurchasesTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile and handle scroll visibility
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setShowScrollButtons(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check scroll position
  const checkScrollPosition = () => {
    const container = tabsContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollPosition);
      checkScrollPosition(); // Initial check
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, []);

  const scrollTabs = (direction: "left" | "right") => {
    const container = tabsContainerRef.current;
    if (container) {
      const scrollAmount = 200; // Adjust scroll amount as needed
      const newScrollLeft =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);

    // Scroll the active tab into view on mobile
    if (isMobile && tabsContainerRef.current) {
      setTimeout(() => {
        const activeTabElement = tabsContainerRef.current?.querySelector(
          `[data-tab="${tabName}"]`
        );
        activeTabElement?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 100);
    }
  };

  // Enhanced tab data with counts (you can replace with real data)
  const enhancedTabsData = ordersTabsData.map((tab) => ({
    ...tab,
    count: Math.floor(Math.random() * 99) + 1, // Random count for demonstration
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
    >
      {/* Scroll Buttons for Mobile */}
      {showScrollButtons && (
        <div className="absolute inset-y-0 left-0 z-10 flex items-center">
          <button
            onClick={() => scrollTabs("left")}
            disabled={!canScrollLeft}
            className={`h-full px-2 bg-gradient-to-r from-white dark:from-gray-900 to-transparent transition-opacity ${
              canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="w-6 h-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm flex items-center justify-center">
              <svg
                className="w-3 h-3 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Tabs Container */}
      <div
        ref={tabsContainerRef}
        className="flex gap-1 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-3 xs:px-4 sm:px-6 overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {enhancedTabsData.map((tab, index) => (
          <motion.button
            key={tab.name}
            data-tab={tab.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => handleTabClick(tab.name)}
            className={`flex flex-col items-center justify-center border-b-2 transition-all duration-300 ease-out flex-shrink-0 min-w-0 ${
              activeTab === tab.name
                ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            } px-3 xs:px-4 sm:px-5 py-2 xs:py-3 sm:py-4 rounded-t-lg relative group`}
          >
            {/* Active Tab Indicator */}
            <AnimatePresence>
              {activeTab === tab.name && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-blue-600 dark:bg-blue-400"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>

            {/* Tab Content */}
            <div className="flex flex-col xs:flex-row items-center gap-1 xs:gap-2">
              {/* Tab Name */}
              <span
                className={`text-xs xs:text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.name
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200"
                }`}
              >
                {tab.name}
              </span>

              {/* Count Badge */}
              <span
                className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  activeTab === tab.name
                    ? "bg-blue-600 text-white dark:bg-blue-400 dark:text-gray-900"
                    : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400 group-hover:bg-gray-300 dark:group-hover:bg-gray-600"
                }`}
              >
                {tab.count > 99 ? "99+" : tab.count}
              </span>
            </div>

            {/* Hover Effect */}
            <div
              className={`absolute inset-0 rounded-t-lg transition-opacity duration-200 ${
                activeTab === tab.name
                  ? "bg-blue-500/5 dark:bg-blue-400/10"
                  : "bg-transparent group-hover:bg-gray-500/5 dark:group-hover:bg-gray-400/10"
              }`}
            />
          </motion.button>
        ))}
      </div>

      {/* Right Scroll Button for Mobile */}
      {showScrollButtons && (
        <div className="absolute inset-y-0 right-0 z-10 flex items-center">
          <button
            onClick={() => scrollTabs("right")}
            disabled={!canScrollRight}
            className={`h-full px-2 bg-gradient-to-l from-white dark:from-gray-900 to-transparent transition-opacity ${
              canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="w-6 h-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow-sm flex items-center justify-center">
              <svg
                className="w-3 h-3 text-gray-600 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </button>
        </div>
      )}

      {/* Scroll Indicator for Mobile */}
      {showScrollButtons && (canScrollLeft || canScrollRight) && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1 px-2 py-1 bg-black/10 dark:bg-white/10 rounded-full backdrop-blur-sm">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Custom CSS to hide scrollbar
const styles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

// Add styles to document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default PurchasesTabs;
