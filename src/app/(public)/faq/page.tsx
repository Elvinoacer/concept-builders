"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dummyFaqs } from "@/lib/dummydata/faq";
import { Search, ChevronDown, ChevronUp, HelpCircle, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const FaqPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0); // Open first FAQ by default on mobile
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const router = useRouter();

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Filter FAQs based on search
  const filteredFaqs = dummyFaqs.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFaqToggle = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Optimized animations for different screen sizes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: isMobile ? 10 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: isMobile ? 0.2 : 0.3,
        ease: "easeInOut",
      },
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: isMobile ? 0.3 : 0.4,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    collapsed: { rotate: 0 },
    expanded: { rotate: 180 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      <div className="max-w-4xl mx-auto py-6 sm:py-8 md:py-12 lg:py-16 px-3 xs:px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4 sm:mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <HelpCircle className="w-4 h-4" />
            Frequently Asked Questions
          </motion.div>

          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-3 sm:mb-4">
            How can we help you?
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Have questions? We've got answers. If you can't find what you're
            looking for, feel free to contact us.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-base sm:text-lg"
            />
          </div>
          {searchTerm && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center"
            >
              Found {filteredFaqs.length}{" "}
              {filteredFaqs.length === 1 ? "result" : "results"}
            </motion.p>
          )}
        </motion.div>

        {/* FAQ List */}
        <motion.div
          className="space-y-3 sm:space-y-4 max-w-3xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden hover:border-blue-300/50 dark:hover:border-blue-600/30 transition-all duration-300"
              >
                <button
                  className="w-full flex justify-between items-center p-4 sm:p-6 text-left font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200 active:scale-95"
                  onClick={() => handleFaqToggle(index)}
                >
                  <span className="text-base sm:text-lg md:text-xl pr-4 text-left leading-relaxed">
                    {item.question}
                  </span>
                  <motion.span
                    variants={iconVariants}
                    animate={openFaq === index ? "expanded" : "collapsed"}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0 ml-2"
                  >
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 dark:text-gray-400" />
                    )}
                  </motion.span>
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            // No results state
            <motion.div
              className="text-center py-12 sm:py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No results found
              </h3>
              <p className="text-gray-500 dark:text-gray-500 text-sm sm:text-base max-w-md mx-auto">
                We couldn't find any questions matching "{searchTerm}". Try
                different keywords or browse all questions.
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-4 px-6 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="mt-12 sm:mt-16 md:mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200/50 dark:border-blue-700/30 rounded-3xl p-6 sm:p-8 md:p-10">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Still have questions?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Can't find the answer you're looking for? Our support team is
                here to help you.
              </p>
              <motion.button
                onClick={() => router.push('/contact')}
                whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
              >
                <Mail className="w-4 h-4 sm:w-5 sm:h-h5" />
                Contact Support
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {dummyFaqs.length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Questions
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30">
            <div className="text-2xl sm:text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-1">
              24/7
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Support
            </div>
          </div>
          <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/30 dark:border-gray-700/30 col-span-2 md:col-span-1">
            <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
              100%
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Satisfaction
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FaqPage;
