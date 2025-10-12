"use client";

import { motion } from "framer-motion";
import { contentTabsData } from "@/lib/dummydata/content";

const ContentTabs = ({ activeTab, onTabClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-4 md:mb-6"
    >
      <div className="flex border-b border-border overflow-x-auto whitespace-nowrap">
        {contentTabsData.map((tab) => (
          <a
            key={tab.name}
            href="#"
            onClick={() => onTabClick(tab.name)}
            className={`flex items-center justify-center border-b-2 py-3 px-4 ${
              activeTab === tab.name
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <p className={`text-sm ${activeTab === tab.name ? "font-semibold" : "font-medium"}`}>
              {tab.name}
            </p>
          </a>
        ))}
      </div>
    </motion.div>
  );
};

export default ContentTabs;