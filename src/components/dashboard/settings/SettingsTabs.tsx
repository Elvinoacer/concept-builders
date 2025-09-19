// components/dashboard/settings/SettingsTabs.jsx
"use client";
import React from "react";

const SettingsTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "profile", name: "Profile" },
    { id: "password", name: "Password" },
    { id: "referrals", name: "Referrals" },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav aria-label="Tabs" className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? "border-transparent text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsTabs;
