"use client";
import { terms } from "@/lib/terms-data";
import { motion } from "framer-motion";
import {
  FileText,
  Calendar,
  Scale,
  ArrowLeft,
  Download,
  Mail,
  Shield,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const TermsPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [hasAccepted, setHasAccepted] = useState(false);

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

  // Update active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if user has previously accepted terms
  useEffect(() => {
    const accepted = localStorage.getItem("terms_accepted");
    setHasAccepted(accepted === "true");
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem("terms_accepted", "true");
    setHasAccepted(true);
    // You could trigger an analytics event or API call here
  };

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

  const scrollToSection = (index: number) => {
    const section = document.getElementById(`section-${index}`);
    if (section) {
      const offset = 80; // Account for sticky header
      const sectionTop = section.offsetTop - offset;

      window.scrollTo({
        top: sectionTop,
        behavior: "smooth",
      });
    }
  };

  const formatContent = (content: string) => {
    // Split content into paragraphs and add proper formatting
    return content.split("\n\n").map((paragraph, pIndex) => (
      <motion.p
        key={pIndex}
        className="text-base leading-relaxed text-gray-700 dark:text-gray-300 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 * pIndex }}
      >
        {paragraph}
      </motion.p>
    ));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      <div className="px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-4xl mx-auto">
        {/* Back Navigation */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-teal-500/50 hover:text-teal-600 dark:hover:text-teal-400 rounded-2xl font-medium transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Home
          </Link>
        </motion.div>

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
            <Scale className="w-4 h-4" />
            Terms of Service
          </motion.div>

          <motion.h1
            className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-teal-900 bg-clip-text text-transparent dark:from-slate-200 dark:to-teal-400 mb-3 sm:mb-4"
            variants={headerVariants}
          >
            Terms of Service
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{terms.length} sections</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Important Notice */}
        {!hasAccepted && (
          <motion.div
            className="mb-8 bg-amber-50/80 dark:bg-amber-900/20 border-2 border-amber-200/50 dark:border-amber-700/30 rounded-2xl p-4 sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-amber-900 dark:text-amber-100 font-semibold mb-2">
                  Important Legal Notice
                </h3>
                <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                  Please read these terms carefully before using our services.
                  By accessing or using Concept Builders, you agree to be bound
                  by these terms and our Privacy Policy.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Desktop */}
          {!isMobile && (
            <motion.div
              className="lg:w-64 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="sticky top-24 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Quick Navigation
                </h3>
                <nav className="space-y-2">
                  {terms.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(index)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeSection === index
                          ? "bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-700"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>

                {/* Acceptance Button */}
                {!hasAccepted && (
                  <motion.button
                    onClick={handleAcceptTerms}
                    className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors duration-200 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />I Accept Terms
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div
            className="flex-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-sm border-2 border-gray-200/50 dark:border-gray-700/50">
              {/* Introduction */}
              <motion.section className="mb-8 sm:mb-12" variants={itemVariants}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                    Welcome to Concept Builders
                  </h2>
                </div>
                <div className="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300 space-y-4">
                  <p>
                    These Terms of Service govern your use of Concept Builders'
                    website, services, and applications. By accessing or using
                    our services, you agree to be bound by these terms.
                  </p>
                  <p>
                    Please read these terms carefully as they contain important
                    information about your legal rights, remedies, and
                    obligations.
                  </p>
                </div>
              </motion.section>

              {/* Terms Sections */}
              <div className="space-y-8 sm:space-y-12">
                {terms.map((section, index) => (
                  <motion.section
                    key={index}
                    id={`section-${index}`}
                    className="scroll-mt-24"
                    variants={itemVariants}
                  >
                    {/* Section Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-teal-900 bg-clip-text text-transparent dark:from-slate-200 dark:to-teal-400 leading-tight">
                          {section.title}
                        </h2>

                        {/* Progress indicator for mobile */}
                        {isMobile && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-teal-500 rounded-full transition-all duration-300"
                                style={{
                                  width: `${((index + 1) / terms.length) * 100}%`,
                                }}
                              />
                            </div>
                            <span>
                              {index + 1} of {terms.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section Content */}
                    <div className="text-base leading-relaxed text-gray-700 dark:text-gray-300 space-y-4 ml-14">
                      {formatContent(section.content)}
                    </div>

                    {/* Section Separator */}
                    {index < terms.length - 1 && (
                      <motion.div
                        className="pt-6 sm:pt-8 border-t border-gray-200/50 dark:border-gray-700/50 mt-6 sm:mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      />
                    )}
                  </motion.section>
                ))}
              </div>

              {/* Acceptance Section for Mobile */}
              {isMobile && !hasAccepted && (
                <motion.div
                  className="mt-8 bg-teal-50/80 dark:bg-teal-900/20 border-2 border-teal-200/50 dark:border-teal-700/30 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <h3 className="text-lg font-semibold text-teal-900 dark:text-teal-100 mb-3 text-center">
                    Ready to Continue?
                  </h3>
                  <p className="text-teal-800 dark:text-teal-200 text-sm text-center mb-4 leading-relaxed">
                    By accepting our terms, you can fully access all features
                    and services.
                  </p>
                  <motion.button
                    onClick={handleAcceptTerms}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors duration-200 text-base"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <CheckCircle2 className="w-5 h-5" />I Accept Terms &
                    Conditions
                  </motion.button>
                </motion.div>
              )}

              {/* Confirmation Message */}
              {hasAccepted && (
                <motion.div
                  className="mt-8 bg-green-50/80 dark:bg-green-900/20 border-2 border-green-200/50 dark:border-green-700/30 rounded-2xl p-6 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                    Terms Accepted
                  </h3>
                  <p className="text-green-800 dark:text-green-200 text-sm">
                    Thank you for accepting our Terms of Service. You're all set
                    to use our platform.
                  </p>
                </motion.div>
              )}

              {/* Contact Section */}
              <motion.section
                className="mt-12 sm:mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-2 border-teal-200/50 dark:border-teal-700/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    Questions About Our Terms?
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-center mb-6 max-w-2xl mx-auto leading-relaxed">
                    If you have any questions about these Terms of Service,
                    please don't hesitate to contact our legal team for
                    clarification.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a
                      href="/contact"
                      whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl transition-colors duration-200 text-sm sm:text-base"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Legal Team
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-teal-300 dark:border-teal-600 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 font-semibold rounded-2xl transition-all duration-200 text-sm sm:text-base"
                    >
                      <Download className="w-4 h-4" />
                      Download Terms
                    </motion.button>
                  </div>
                </div>
              </motion.section>
            </div>
          </motion.div>
        </div>

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

export default TermsPage;
