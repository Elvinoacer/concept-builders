
'use client';

import { useState } from 'react';

interface Tab {
  title: string;
  content: string;
}

interface DesignTabsProps {
  tabs: Tab[];
}

const DesignTabs: React.FC<DesignTabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === index ? 'text-primary border-primary' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-700 border-transparent'}`}>
              {tab.title}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-10">
        <p className="text-gray-600 dark:text-gray-400 max-w-4xl">
          {tabs[activeTab].content}
        </p>
      </div>
    </div>
  );
};

export default DesignTabs;
