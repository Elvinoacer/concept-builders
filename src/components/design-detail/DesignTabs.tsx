"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WhatsIncludedTab from "./WhatsIncludedTab"; ///here
import FaqForm from "./FaqForm";

const DesignTabs = ({ design, onFaqSubmitted }) => {
  const tabs = [
    { id: "whats-included", label: "What's Included", icon: "inventory_2" },
    { id: "reviews", label: "Reviews", icon: "reviews" },
    { id: "faq-support", label: "FAQ & Support", icon: "help" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [reviewsCurrentPage, setReviewsCurrentPage] = useState(1);
  const [showFaqForm, setShowFaqForm] = useState(false);
  const reviewsPerPage = 10;

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleFaqToggle = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const indexOfLastReview = reviewsCurrentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews =
    design.reviews?.slice(indexOfFirstReview, indexOfLastReview) || [];
  const totalReviewPages = Math.ceil(
    (design.reviews?.length || 0) / reviewsPerPage
  );

  const handleReviewPageChange = (pageNumber: number) => {
    setReviewsCurrentPage(pageNumber);
  };

  const tabVariants: any = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.4,
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="mt-8 sm:mt-12 md:mt-16 bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl shadow-2xl border border-cb-border overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="border-b border-cb-border bg-surface">
        <nav aria-label="Tabs" className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              className={`relative flex items-center gap-2 sm:gap-3 py-3 sm:py-4 md:py-5 px-3 sm:px-4 md:px-6 font-medium text-xs sm:text-sm transition-all duration-500 group min-w-max ${
                activeTab === tab.id
                  ? "text-gold"
                  : "text-cream-dim hover:text-gold"
              }`}
              onClick={() => handleTabClick(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === tab.id && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-gold-light"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              <span className="material-symbols-outlined text-lg sm:text-xl">
                {tab.icon}
              </span>
              <span className="font-semibold hidden xs:inline">
                {tab.label}
              </span>
              <span className="font-semibold xs:hidden">
                {tab.label.split(" ")[0]}
              </span>

              <div
                className={`absolute inset-0 rounded-t-lg sm:rounded-t-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gold/5"
                    : "bg-transparent group-hover:bg-gold/5"
                }`}
              />
            </motion.button>
          ))}
        </nav>
      </div>

      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="min-h-[300px] sm:min-h-[350px] md:min-h-[400px]"
          >
            {activeTab === "whats-included" && (
              <WhatsIncludedTab design={design} />
            )}

            {activeTab === "faq-support" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h3
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-cream flex items-center gap-2 sm:gap-3"
                  variants={itemVariants}
                >
                  <span className="material-symbols-outlined text-gold">
                    help_center
                  </span>
                  Frequently Asked Questions
                </motion.h3>
                {Array.isArray(design.faq) && design.faq.length > 0 ? (
                  <>
                    <motion.div
                      className="space-y-2 sm:space-y-3 md:space-y-4"
                      variants={containerVariants}
                    >
                      {design.faq.map((item, index) => (
                        <motion.div
                          key={index}
                          className="rounded-lg sm:rounded-xl md:rounded-2xl border border-cb-border bg-surface overflow-hidden group"
                          variants={itemVariants}
                          whileHover={{ scale: 1.01 }}
                        >
                          <motion.button
                            className="w-full flex justify-between items-center p-3 sm:p-4 md:p-6 text-left font-bold text-sm sm:text-base md:text-lg text-cream hover:bg-gold/5 transition-all duration-300"
                            onClick={() => handleFaqToggle(index)}
                            whileHover={{ x: 2 }}
                          >
                            <span className="flex items-center gap-2 sm:gap-3">
                              <span className="material-symbols-outlined text-gold text-lg sm:text-xl">
                                help
                              </span>
                              {item.question}
                            </span>
                            <motion.span
                              className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold"
                              animate={{ rotate: openFaq === index ? 180 : 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="material-symbols-outlined text-base sm:text-lg">
                                expand_more
                              </span>
                            </motion.span>
                          </motion.button>
                          <AnimatePresence>
                            {openFaq === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.4,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <div className="p-3 sm:p-4 md:p-6 pt-1 sm:pt-2 border-t border-cb-border">
                                  <p className="text-sm sm:text-base md:text-lg text-cream-dim leading-relaxed">
                                    {item.answer}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </motion.div>
                    <div className="mt-6 sm:mt-8 text-center">
                      <button
                        onClick={() => setShowFaqForm(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md shadow-lg text-ink bg-gold hover:bg-gold-light transition-all duration-300"
                      >
                        Ask a Question
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div
                    className="text-center py-8 sm:py-10 md:py-12"
                    variants={itemVariants}
                  >
                    <span className="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-gray-300 dark:text-gray-600 mb-3 sm:mb-4">
                      contact_support
                    </span>
                    <p className="text-sm sm:text-base md:text-lg text-cream-dim">
                      No frequently asked questions for this design yet.
                    </p>
                    <button
                      onClick={() => setShowFaqForm(true)}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-md shadow-lg text-ink bg-gold hover:bg-gold-light transition-all duration-300"
                    >
                      Ask a Question
                    </button>
                  </motion.div>
                )}
                {showFaqForm && (
                  <FaqForm
                    designId={design.id}
                    onFaqSubmitted={() => {
                      setShowFaqForm(false);
                      onFaqSubmitted();
                    }}
                  />
                )}
              </motion.div>
            )}

            {activeTab === "reviews" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h3
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-cream flex items-center gap-2 sm:gap-3"
                  variants={itemVariants}
                >
                  <span className="material-symbols-outlined text-gold">
                    star
                  </span>
                  Customer Reviews
                </motion.h3>
                {Array.isArray(design.reviews) && design.reviews.length > 0 ? (
                  <div>
                    <motion.div
                      className="space-y-4 sm:space-y-5 md:space-y-6"
                      variants={containerVariants}
                    >
                      {currentReviews.map((review, index) => (
                        <motion.div
                          key={index}
                          className="p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl bg-surface border border-cb-border hover:border-gold/30 transition-all duration-300"
                          variants={itemVariants}
                          whileHover={{ y: -1, scale: 1.01 }}
                        >
                          <div className="flex items-center mb-3 sm:mb-4">
                            <div className="flex text-gold">
                              {[...Array(5)].map((_, i) => (
                                <motion.span
                                  key={i}
                                  import
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: i * 0.1 }}
                                >
                                  <span className="material-symbols-outlined text-xl sm:text-2xl">
                                    {i < Math.floor(review.rating)
                                      ? "star"
                                      : i < review.rating
                                        ? "star_half"
                                        : "star"}
                                  </span>
                                </motion.span>
                              ))}
                            </div>
                            <p className="ml-2 sm:ml-3 text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-gray-200">
                              {review.rating} out of 5
                            </p>
                          </div>
                          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed italic mb-3 sm:mb-4">
                            "{review.comment}"
                          </p>
                          <div className="flex items-center gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center">
                              <span className="text-white font-semibold text-xs sm:text-sm">
                                {review.author.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <p className="font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-400">
                              {review.author.name}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {totalReviewPages > 1 && (
                      <motion.div
                        className="flex flex-col xs:flex-row justify-center items-center gap-2 sm:gap-3 md:gap-4 mt-6 sm:mt-8 md:mt-10"
                        variants={itemVariants}
                      >
                        <motion.button
                          onClick={() =>
                            handleReviewPageChange(reviewsCurrentPage - 1)
                          }
                          disabled={reviewsCurrentPage === 1}
                          className="flex items-center gap-1 sm:gap-2 px-4 py-2 rounded-lg bg-surface border border-cb-border text-cream-dim disabled:opacity-50 hover:bg-gold hover:text-ink transition-all duration-300 text-xs sm:text-sm font-bold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="material-symbols-outlined text-base sm:text-lg">
                            chevron_left
                          </span>
                          Previous
                        </motion.button>

                        <div className="flex items-center gap-1 sm:gap-2">
                          {[...Array(totalReviewPages)].map((_, i) => (
                            <motion.button
                              key={i}
                              onClick={() => handleReviewPageChange(i + 1)}
                              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl font-bold transition-all duration-300 text-xs sm:text-sm ${
                                reviewsCurrentPage === i + 1
                                  ? "bg-gold text-ink shadow-lg shadow-gold/25"
                                  : "bg-surface text-cream-dim border border-cb-border hover:bg-gold/10 hover:text-gold"
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {i + 1}
                            </motion.button>
                          ))}
                        </div>

                        <motion.button
                          onClick={() =>
                            handleReviewPageChange(reviewsCurrentPage + 1)
                          }
                          disabled={reviewsCurrentPage === totalReviewPages}
                          className="flex items-center gap-1 sm:gap-2 px-4 py-2 rounded-lg bg-surface border border-cb-border text-cream-dim disabled:opacity-50 hover:bg-gold hover:text-ink transition-all duration-300 text-xs sm:text-sm font-bold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Next
                          <span className="material-symbols-outlined text-base sm:text-lg">
                            chevron_right
                          </span>
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                ) : (
                  <motion.div
                    className="text-center py-8 sm:py-10 md:py-12"
                    variants={itemVariants}
                  >
                    <span className="material-symbols-outlined text-4xl sm:text-5xl md:text-6xl text-gray-300 dark:text-gray-600 mb-3 sm:mb-4">
                      rate_review
                    </span>
                    <p className="text-sm sm:text-base md:text-lg text-cream-dim">
                      No reviews yet for this design.
                    </p>
                    <p className="text-xs sm:text-sm text-muted mt-2">
                      Be the first to share your experience!
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default DesignTabs;
