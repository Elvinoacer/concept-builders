'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CostToBuildTab from './CostToBuildTab';
import WhatsIncludedTab from './WhatsIncludedTab';

const DesignTabs = ({ design }) => {
  const tabs = [
    { id: "plan-details", label: "Plan Details" },
    { id: "whats-included", label: "What's Included" },
    { id: "building-cost-estimates", label: "Cost to Build" },
    { id: "reviews", label: "Reviews" },
    { id: "faq-support", label: "FAQ" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reviewsCurrentPage, setReviewsCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleFaqToggle = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const indexOfLastReview = reviewsCurrentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = design.reviews?.slice(indexOfFirstReview, indexOfLastReview) || [];
  const totalReviewPages = Math.ceil((design.reviews?.length || 0) / reviewsPerPage);

  const handleReviewPageChange = (pageNumber: number) => {
    setReviewsCurrentPage(pageNumber);
  };

  return (
    <div className="mt-8 md:mt-12">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav aria-label="Tabs" className="-mb-px flex space-x-4 md:space-x-8 overflow-x-auto whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600 dark:text-blue-400 dark:border-blue-400'
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
            {activeTab === 'plan-details' && (
              <div>
                <h3 className="text-2xl font-bold mb-4 dark:text-white">Detailed Specifications</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700 dark:text-gray-300">
                  {Array.isArray(design.planDetails) && design.planDetails.map((detail, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'whats-included' && (
              <WhatsIncludedTab design={design} />
            )}
            {activeTab === 'building-cost-estimates' && (
              <CostToBuildTab design={design} />
            )}
            {activeTab === 'faq-support' && (
              <div>
                <h3 className="text-2xl font-bold mb-6 dark:text-white">Frequently Asked Questions</h3>
                {Array.isArray(design.faq) && design.faq.length > 0 ? (
                  <div className="space-y-4">
                    {design.faq.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <button
                          className="w-full flex justify-between items-center py-4 text-left font-semibold text-lg text-gray-800 dark:text-gray-200"
                          onClick={() => handleFaqToggle(index)}
                        >
                          <span>{item.question}</span>
                          <motion.span
                            animate={{ rotate: openFaq === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </motion.span>
                        </button>
                        <AnimatePresence>
                          {openFaq === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <p className="text-gray-600 mt-2 pb-4 dark:text-gray-300">{item.answer}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>No frequently asked questions for this design yet.</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-bold mb-6 dark:text-white">Customer Reviews</h3>
                {Array.isArray(design.reviews) && design.reviews.length > 0 ? (
                  <div>
                    <div className="space-y-8">
                      {currentReviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 dark:border-gray-700 last:border-b-0">
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(Math.floor(review.rating))].map((_, i) => (
                                <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.35 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /></svg>
                              ))}
                              {review.rating % 1 !== 0 && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.539 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.35 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" /></svg>}
                            </div>
                            <p className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-200">{review.rating} out of 5</p>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 italic">"{review.comment}"</p>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-400 mt-3">- {review.author.name}</p>
                        </div>
                      ))}
                    </div>
                    {totalReviewPages > 1 && (
                      <div className="flex justify-center items-center space-x-4 mt-8">
                        <button
                          onClick={() => handleReviewPageChange(reviewsCurrentPage - 1)}
                          disabled={reviewsCurrentPage === 1}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span>Page {reviewsCurrentPage} of {totalReviewPages}</span>
                        <button
                          onClick={() => handleReviewPageChange(reviewsCurrentPage + 1)}
                          disabled={reviewsCurrentPage === totalReviewPages}
                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <p>No reviews yet.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DesignTabs;

