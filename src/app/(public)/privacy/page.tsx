"use client";
import { privacy } from "@/lib/privacy-data";
import { motion } from "framer-motion";
import { Shield, Calendar, Eye, FileText } from "lucide-react";
import { useState, useEffect } from "react";

const PrivacyPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

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

  // Animation variants
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
        duration: isMobile ? 0.4 : 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <main className="flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      <div className="mx-auto max-w-4xl px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <motion.div
          className="mb-8 sm:mb-12 text-center"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/30 text-teal-600 dark:text-teal-400 text-sm font-medium mb-4 sm:mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Shield className="w-4 h-4" />
            Privacy & Security
          </motion.div>

          <motion.h1
            className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-teal-900 bg-clip-text text-transparent dark:from-slate-200 dark:to-teal-400 mb-3 sm:mb-4"
            variants={headerVariants}
          >
            Privacy Policy
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Last updated: October 26, 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{privacy.length} sections</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Navigation for larger screens */}
        {!isMobile && (
          <motion.div
            className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200/50 dark:border-gray-700/50 sticky top-4 z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Quick Navigation
            </h3>
            <div className="flex flex-wrap gap-2">
              {privacy.map((section, index) => (
                <a
                  key={index}
                  href={`#section-${index}`}
                  className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-teal-100 dark:hover:bg-teal-900/30 hover:text-teal-700 dark:hover:text-teal-400 rounded-lg transition-all duration-200 font-medium"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </motion.div>
        )}

        {/* Privacy Content */}
        <motion.div
          className="space-y-6 sm:space-y-8 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 sm:p-8 lg:p-12 shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {privacy.map((section, index) => (
            <motion.section
              key={index}
              id={`section-${index}`}
              className="space-y-4 sm:space-y-6 scroll-mt-24"
              variants={itemVariants}
            >
              {/* Section Header */}
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm sm:text-base">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-slate-900 to-teal-900 bg-clip-text text-transparent dark:from-slate-200 dark:to-teal-400 leading-tight">
                    {section.title}
                  </h2>

                  {/* Progress indicator for mobile */}
                  {isMobile && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 rounded-full"
                          style={{
                            width: `${((index + 1) / privacy.length) * 100}%`,
                          }}
                        />
                      </div>
                      <span>
                        {index + 1} of {privacy.length}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section Content */}
              <div className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 space-y-4 ml-11 sm:ml-14">
                {/* Split content into paragraphs for better readability */}
                {section.content.split("\n\n").map((paragraph, pIndex) => (
                  <motion.div
                    key={pIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * (index + pIndex) }}
                  >
                    {paragraph.includes("<") ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: paragraph }}
                        className="prose prose-sm sm:prose-base max-w-none prose-headings:font-semibold prose-p:text-gray-700 prose-p:dark:text-gray-300 prose-ul:text-gray-700 prose-ul:dark:text-gray-300 prose-ol:text-gray-700 prose-ol:dark:text-gray-300 prose-li:marker:text-teal-500 prose-strong:text-gray-900 prose-strong:dark:text-white prose-a:text-teal-600 prose-a:dark:text-teal-400 hover:prose-a:text-teal-700 hover:prose-a:dark:text-teal-300"
                      />
                    ) : (
                      <p className="leading-relaxed">{paragraph}</p>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Section Separator */}
              {index < privacy.length - 1 && (
                <motion.div
                  className="pt-4 sm:pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                />
              )}
            </motion.section>
          ))}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          className="mt-8 sm:mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="bg-teal-50/50 dark:bg-teal-900/20 border-2 border-teal-200/50 dark:border-teal-700/30 rounded-2xl p-6 sm:p-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Questions About Our Privacy Policy?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              If you have any questions or concerns about our privacy practices,
              please don't hesitate to contact our privacy team. We're committed
              to protecting your personal information and being transparent
              about our data practices.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-2xl transition-colors duration-200 text-sm sm:text-base">
                Contact Privacy Team
              </button>
              <button className="px-6 py-3 bg-white/80 dark:bg-gray-800/80 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 font-medium rounded-2xl transition-all duration-200 text-sm sm:text-base">
                Download PDF Version
              </button>
            </div>
          </div>
        </motion.div>

        {/* Back to Top for mobile */}
        {isMobile && (
          <motion.button
            className="fixed bottom-6 right-6 w-12 h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl shadow-lg flex items-center justify-center z-50"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.button>
        )}

        {/* Reading Progress Bar for mobile */}
        {isMobile && (
          <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-40">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-teal-600"
              initial={{ width: "0%" }}
              animate={{
                width: `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`,
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default PrivacyPage;
