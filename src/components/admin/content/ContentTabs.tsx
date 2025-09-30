"use client";

import { motion } from "framer-motion";
import { contentTabsData } from "@/lib/dummydata";

const ContentTabs = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-4 md:mb-6"
    >
      <div className="flex border-b border-border overflow-x-auto whitespace-nowrap">
        {contentTabsData.map((tab, index) => (
          <a
            key={tab.name}
            href="#"
            className={`flex items-center justify-center border-b-2 py-3 px-4 ${
              index === 0
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <p className={`text-sm ${index === 0 ? "font-semibold" : "font-medium"}`}>
              {tab.name}
            </p>
          </a>
        ))}
      </div>
    </motion.div>
  );
};

export default ContentTabs;