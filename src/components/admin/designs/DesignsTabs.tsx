"use client";

import { motion } from "framer-motion";
import { designTabs } from "@/lib/dummydata";

interface DesignsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DesignsTabs = ({ activeTab, setActiveTab }: DesignsTabsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="border-b border-border mb-4 md:mb-6"
    >
      <nav className="flex gap-4 md:gap-8 overflow-x-auto whitespace-nowrap">
        {designTabs.map((tab) => (
          <a
            key={tab.id}
            href="#"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 border-b-2 text-sm font-semibold ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </nav>
    </motion.div>
  );
};

export default DesignsTabs;