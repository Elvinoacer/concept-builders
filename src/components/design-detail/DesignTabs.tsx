'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'plan-details', label: 'Plan Details' },
  { id: 'design-tiers', label: 'Design Tiers' },
  { id: 'faq-support', label: 'FAQ & Support' },
  { id: 'reviews', label: 'Reviews' },
];

const DesignTabs = ({ design }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="mt-8 md:mt-12">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav aria-label="Tabs" className="-mb-px flex space-x-4 md:space-x-8 overflow-x-auto whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'text-[var(--primary-color)] border-[var(--primary-color)]'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 border-transparent dark:text-gray-400 dark:hover:text-gray-300'
              }`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-6 md:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'description' && <p className="text-gray-600 max-w-4xl dark:text-gray-300">{design.description}</p>}
            {activeTab === 'plan-details' && (
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-4 dark:text-white">Detailed Specifications</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2 dark:text-gray-300">
                  {design.planDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'design-tiers' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Design Tiers</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {design.designTiers.map((tier, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
                      <h4 className="font-bold text-lg dark:text-white">{tier.name}</h4>
                      <p className="text-gray-600 mt-2 dark:text-gray-300">{tier.features.join(', ')}</p>
                      <p className="text-[var(--primary-color)] font-bold mt-3">${tier.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'faq-support' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {design.faq.map((item, index) => (
                    <div key={index}>
                      <h4 className="font-medium text-gray-800 dark:text-gray-200">{item.question}</h4>
                      <p className="text-gray-600 mt-1 dark:text-gray-300">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Customer Reviews</h3>
                <div className="space-y-6">
                  {design.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6 dark:border-gray-700">
                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400">
                          {[...Array(Math.floor(review.rating))].map((_, i) => (
                            <span key={i} className="material-symbols-outlined">star</span>
                          ))}
                          {review.rating % 1 !== 0 && <span className="material-symbols-outlined">star_half</span>}
                        </div>
                        <p className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-200">{review.rating} out of 5</p>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                      <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">- {review.author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DesignTabs;