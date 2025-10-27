'use client';
import React from 'react';

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'profile', name: 'Profile' },
    { id: 'password', name: 'Password' },
    { id: 'referrals', name: 'Referrals' },
  ];

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="-mb-px flex space-x-4 md:space-x-8 overflow-x-auto whitespace-nowrap" role="tablist" aria-label="Settings Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`} // Unique ID for each tab
            role="tab" // ARIA role for tab
            aria-selected={activeTab === tab.id} // ARIA selected state
            aria-controls={`panel-${tab.id}`} // Link to tab panel
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-transparent text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
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

