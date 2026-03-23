"use client";
import React from "react";
import { motion } from "framer-motion";
import { User, Shield, Users } from "lucide-react";

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "password", name: "Password", icon: Shield },
    { id: "referrals", name: "Referrals", icon: Users },
  ];

  return (
    <div className="border-b border-cb-border bg-surface">
      <nav
        className="flex space-x-1 p-2 overflow-x-auto whitespace-nowrap styled-scrollbar"
        role="tablist"
        aria-label="Settings Tabs"
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-card text-cream shadow-sm"
                  : "text-cream-dim hover:text-cream hover:bg-card/50"
              }`}
            >
              <IconComponent className="w-4 h-4 flex-shrink-0" />
              <span>{tab.name}</span>

              {/* Active indicator */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 border-2 border-gold rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default SettingsTabs;
