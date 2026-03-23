"use client";

import { refund } from "@/lib/refund-data";
import { motion } from "framer-motion";
import {
  Shield,
  Calendar,
  FileText,
  ArrowLeft,
  Download,
  Mail,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const RefundPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

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

  return (
    <main className="min-h-screen bg-ink">
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-cb-border text-cream-dim hover:text-gold hover:border-gold rounded-2xl font-medium transition-all duration-300 group"
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gold/10 border border-gold/30 text-gold text-sm font-medium mb-4 sm:mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Shield className="w-4 h-4" />
            Refund Policy
          </motion.div>

          <motion.h1
            className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-cream mb-3 sm:mb-4"
            variants={headerVariants}
          >
            Refund Policy
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base text-cream-dim"
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
              <span>{refund.length} sections</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-card backdrop-blur-sm p-4 rounded-2xl border border-cb-border text-center">
            <div className="text-2xl font-bold text-gold mb-1">
              30
            </div>
            <div className="text-xs text-cream-dim">
              Days Refund
            </div>
          </div>
          <div className="bg-card backdrop-blur-sm p-4 rounded-2xl border border-cb-border text-center">
            <div className="text-2xl font-bold text-emerald-500 mb-1">
              100%
            </div>
            <div className="text-xs text-cream-dim">
              Digital Products
            </div>
          </div>
          <div className="bg-card backdrop-blur-sm p-4 rounded-2xl border border-cb-border text-center">
            <div className="text-2xl font-bold text-gold-light mb-1">
              24h
            </div>
            <div className="text-xs text-cream-dim">
              Response Time
            </div>
          </div>
          <div className="bg-card backdrop-blur-sm p-4 rounded-2xl border border-cb-border text-center">
            <div className="text-2xl font-bold text-gold mb-1">
              No Fees
            </div>
            <div className="text-xs text-cream-dim">
              Processing
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation - Desktop */}
          {!isMobile && (
            <motion.div
              className="lg:w-64 flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="sticky top-24 bg-card backdrop-blur-sm rounded-2xl p-6 border border-cb-border">
                <h3 className="text-lg font-semibold text-cream mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Quick Navigation
                </h3>
                <nav className="space-y-2">
                  {refund.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(index)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeSection === index
                          ? "bg-gold/10 text-gold border border-gold/30"
                          : "text-cream-dim hover:bg-surface hover:text-cream"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
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
            <div className="bg-card backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-sm border border-cb-border">
              {/* Introduction */}
              <motion.section className="mb-8 sm:mb-12" variants={itemVariants}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gold" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-semibold text-cream">
                    Our Commitment to Fair Refunds
                  </h2>
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-cream-dim">
                  At Concept Builders, we strive to provide exceptional
                  architectural designs and construction services. However, we
                  understand that circumstances may arise where a refund is
                  necessary. This Refund Policy outlines the terms and
                  conditions under which refunds may be issued for our services.
                </p>
              </motion.section>

              {/* Policy Sections */}
              <div className="space-y-8 sm:space-y-12">
                {refund.map((section, index) => (
                  <motion.section
                    key={index}
                    id={`section-${index}`}
                    className="scroll-mt-24"
                    variants={itemVariants}
                  >
                    {/* Section Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold flex items-center justify-center shadow-lg">
                        <span className="text-ink font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-cream leading-tight">
                          {section.title}
                        </h2>

                        {/* Progress indicator for mobile */}
                        {isMobile && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted">
                            <div className="flex-1 h-1 bg-surface rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold rounded-full transition-all duration-300"
                                style={{
                                  width: `${((index + 1) / refund.length) * 100}%`,
                                }}
                              />
                            </div>
                            <span>
                              {index + 1} of {refund.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Section Content */}
                    <div
                      className="text-base leading-relaxed text-cream-dim space-y-4 ml-14"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />

                    {/* Section Separator */}
                    {index < refund.length - 1 && (
                      <motion.div
                        className="pt-6 sm:pt-8 border-t border-cb-border mt-6 sm:mt-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      />
                    )}
                  </motion.section>
                ))}
              </div>

              {/* Contact Section */}
              <motion.section
                className="mt-12 sm:mt-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="bg-surface border border-cb-border rounded-2xl sm:rounded-3xl p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-cream mb-4 text-center">
                    Need Help With a Refund?
                  </h3>
                  <p className="text-cream-dim text-center mb-6 max-w-2xl mx-auto leading-relaxed">
                    Our support team is here to help you with any refund-related
                    questions or requests. We typically respond within 24 hours.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <motion.a
                      href="/contact"
                      whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-ink font-bold rounded-2xl transition-colors duration-200 text-sm sm:text-base shadow-md"
                    >
                      <Mail className="w-4 h-4" />
                      Contact Support
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: isMobile ? 1.02 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-card border border-cb-border text-cream-dim hover:text-gold hover:border-gold font-bold rounded-2xl transition-all duration-200 text-sm sm:text-base shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      Download Policy
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
            className="fixed bottom-6 right-6 w-12 h-12 bg-gold hover:bg-gold-light text-ink rounded-2xl shadow-lg flex items-center justify-center z-50"
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
          <div className="fixed top-0 left-0 right-0 h-1 bg-surface z-40">
            <motion.div
              className="h-full bg-gold"
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

export default RefundPage;
