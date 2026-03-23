"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Mail,
  MessageCircle,
  Users,
  Video,
  Rocket,
  CreditCard,
  Headphones,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageSquare,
  ArrowRight,
  BookOpen,
  HelpCircle,
} from "lucide-react";

const HelpPage = () => {
  const [activeCategory, setActiveCategory] = useState("getting-started");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
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

  const categories = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Rocket,
      articles: [
        {
          id: 1,
          title: "Creating Your First Project",
          content:
            "Learn how to create your first project from scratch with our step-by-step guide.",
          path: "/dashboard/help/articles/creating-first-project",
        },
        {
          id: 2,
          title: "Account Setup Guide",
          content:
            "Complete guide to setting up your account and personalizing your workspace.",
          path: "/dashboard/help/articles/account-setup-guide",
        },
        {
          id: 3,
          title: "Navigation Basics",
          content:
            "Learn how to navigate the dashboard and access all features efficiently.",
          path: "/dashboard/help/articles/navigation-basics",
        },
      ],
    },
    {
      id: "billing",
      title: "Billing & Payments",
      icon: CreditCard,
      articles: [
        {
          id: 4,
          title: "Payment Methods",
          content:
            "How to add and manage payment methods for seamless transactions.",
          path: "/dashboard/help/articles/payment-methods",
        },
        {
          id: 5,
          title: "Subscription Plans",
          content:
            "Compare features and choose the perfect plan for your needs.",
          path: "/dashboard/help/articles/subscription-plans",
        },
        {
          id: 6,
          title: "Invoice Management",
          content:
            "How to view, download, and manage your invoices and receipts.",
          path: "/dashboard/help/articles/invoice-management",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical Support",
      icon: Headphones,
      articles: [
        {
          id: 7,
          title: "System Requirements",
          content:
            "Minimum system requirements for optimal performance across devices.",
          path: "/dashboard/help/articles/system-requirements",
        },
        {
          id: 8,
          title: "Troubleshooting Guide",
          content:
            "Common issues and their solutions for quick problem resolution.",
          path: "/dashboard/help/articles/troubleshooting",
        },
        {
          id: 9,
          title: "Performance Optimization",
          content:
            "Tips and tricks to optimize your experience and loading times.",
          path: "/dashboard/help/articles/performance-optimization",
        },
      ],
    },
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I reset my password?",
      answer:
        "You can reset your password by clicking 'Forgot Password' on the login page. We'll send a secure reset link to your registered email address that expires in 1 hour for security.",
    },
    {
      id: 2,
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period, and you won't be charged again.",
    },
    {
      id: 3,
      question: "How many projects can I create?",
      answer:
        "The number of projects depends on your subscription plan. Free users can create up to 3 projects, while paid plans offer unlimited projects with additional collaboration features.",
    },
    {
      id: 4,
      question: "Is my data secure?",
      answer:
        "Yes, we use industry-standard encryption (AES-256) and security measures to protect your data. All data is stored on secure servers with regular backups and 99.9% uptime guarantee.",
    },
    {
      id: 5,
      question: "How do I export my designs?",
      answer:
        "You can export designs in various formats (PNG, JPG, PDF, SVG) from the export menu in the design editor. Higher resolution exports and additional formats are available for paid plans.",
    },
    {
      id: 6,
      question: "Do you offer team collaboration?",
      answer:
        "Yes, our Professional and Enterprise plans include team collaboration features, allowing multiple users to work on projects simultaneously with role-based permissions.",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed help via email with 24-hour response time",
      contact: "support@conceptbuilders.com",
      action: "mailto:support@conceptbuilders.com",
      available: true,
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Instant real-time help from our support team",
      contact: "Available 9AM-6PM EST",
      action: "/dashboard/messages",
      available: true,
    },
    {
      icon: Users,
      title: "Community Forum",
      description: "Get help from our community of expert users",
      contact: "Join 10,000+ members",
      action: "#forum",
      available: false,
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch comprehensive step-by-step guides",
      contact: "100+ tutorials available",
      action: "#tutorials",
      available: false,
    },
  ];

  const toggleFAQ = (id: number) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  const activeCategoryData = categories.find(
    (cat) => cat.id === activeCategory
  );

  const filteredArticles =
    activeCategoryData?.articles.filter(
      (article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-ink">
      <div className="px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-6xl mx-auto">
        {/* Header */}
        <motion.header
          className="mb-6 sm:mb-8 lg:mb-12 text-center sm:text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gold/20 border border-gold/30 text-gold text-sm font-medium mb-4"
            variants={itemVariants}
          >
            <HelpCircle className="w-4 h-4" />
            Help & Support Center
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-cream mb-3"
          >
            How can we help you?
          </motion.h1>

          <motion.p
            variants={itemVariants}
            transition={{ delay: 0.1 }}
            className="text-cream-dim text-base sm:text-lg lg:text-xl max-w-3xl mx-auto sm:mx-0 leading-relaxed"
          >
            Find answers to common questions, browse documentation, or get in
            touch with our support team.
          </motion.p>
        </motion.header>

        {/* Search Bar */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="mb-8 sm:mb-12 lg:mb-16 max-w-2xl mx-auto"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search help articles, FAQs, and documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 bg-card backdrop-blur-sm border-2 border-cb-border rounded-2xl text-cream placeholder-muted focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 text-sm sm:text-base"
            />
          </div>
        </motion.div>

        {/* Quick Help Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16"
        >
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                className="bg-card backdrop-blur-sm rounded-2xl border-2 border-cb-border p-4 sm:p-6 hover:border-gold/30 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4 mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-cream text-sm sm:text-base mb-1 leading-tight">
                      {method.title}
                    </h3>
                    <p className="text-cream-dim text-xs sm:text-sm leading-relaxed">
                      {method.description}
                    </p>
                  </div>
                </div>

                <p className="text-gold text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                  {method.contact}
                </p>

                {method.available ? (
                  <motion.a
                    href={method.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gold/20 text-gold py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium hover:bg-gold/30 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    Contact Now
                    <ArrowRight className="w-3 h-3" />
                  </motion.a>
                ) : (
                  <button
                    disabled
                    className="w-full bg-surface text-muted py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Coming Soon
                  </button>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Knowledge Base */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cream mb-2 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-gold" />
                Knowledge Base
              </h2>
              <p className="text-cream-dim text-sm sm:text-base">
                Browse articles by category to find detailed guides and
                tutorials
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <motion.div variants={itemVariants} className="relative mb-6 sm:mb-8">
            <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide -mx-2 px-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-200 border-2 min-w-max ${
                      activeCategory === category.id
                        ? "bg-gold border-gold text-ink shadow-lg"
                        : "bg-card border-cb-border text-cream-dim hover:border-gold/30"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm font-medium">
                      {isMobile ? category.title.split(" ")[0] : category.title}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Articles Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
            >
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    variants={cardVariants}
                    whileHover="hover"
                    className="bg-card backdrop-blur-sm rounded-2xl border-2 border-cb-border p-4 sm:p-6 hover:border-gold/30 transition-all duration-300 group"
                  >
                    <h3 className="font-semibold text-cream text-base sm:text-lg mb-2 sm:mb-3 leading-tight line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-cream-dim text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-3">
                      {article.content}
                    </p>
                    <Link
                      href={article.path}
                      className="inline-flex items-center gap-2 text-gold text-sm font-medium hover:text-gold-light group-hover:gap-3 transition-all duration-200"
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted" />
                  </div>
                  <h3 className="text-lg font-semibold text-cream mb-2">
                    No articles found
                  </h3>
                  <p className="text-cream-dim text-sm max-w-sm mx-auto">
                    {searchQuery
                      ? `No articles match "${searchQuery}". Try different keywords.`
                      : `No articles available in ${activeCategoryData?.title}.`}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="mb-8 sm:mb-12 lg:mb-16"
        >
          <div className="text-center sm:text-left mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-cream mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-cream-dim text-sm sm:text-base">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  variants={itemVariants}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card backdrop-blur-sm rounded-2xl border-2 border-cb-border overflow-hidden hover:border-gold/30 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between gap-4 group"
                  >
                    <span className="font-semibold text-cream text-sm sm:text-base text-left flex-1 leading-relaxed">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: activeFAQ === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0 w-5 h-5 text-muted group-hover:text-gold"
                    >
                      {activeFAQ === faq.id ? <ChevronUp /> : <ChevronDown />}
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {activeFAQ === faq.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 sm:px-6 pb-4 sm:pb-5 border-t border-cb-border pt-4"
                      >
                        <p className="text-cream-dim text-sm sm:text-base leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="w-8 h-8 text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-cream mb-2">
                  No FAQs found
                </h3>
                <p className="text-cream-dim text-sm">
                  {searchQuery
                    ? `No FAQs match "${searchQuery}". Try different keywords.`
                    : "No FAQs available at the moment."}
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
          className="bg-gold rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center text-ink overflow-hidden relative"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-white rounded-full"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
              Still need help?
            </h2>
            <p className="text-ink/70 text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Our dedicated support team is here to assist you with any
              questions or issues you might have.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <motion.a
                href="https://wa.me/254741360865"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-ink text-gold font-semibold rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base min-w-[140px]"
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                WhatsApp
              </motion.a>

              <motion.a
                href="tel:254741360865"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-ink text-ink font-semibold rounded-xl sm:rounded-2xl hover:bg-ink hover:text-gold transition-all duration-200 text-sm sm:text-base min-w-[140px]"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                Call Now
              </motion.a>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2 text-ink/70 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>24/7 Email Support</span>
              </div>
              <span className="hidden sm:block">•</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Average response time: 2 hours</span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default HelpPage;
