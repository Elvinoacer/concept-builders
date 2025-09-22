'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const HelpPage = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: 'rocket_launch',
      articles: [
        {
          id: 1,
          title: 'Creating Your First Project',
          content: 'Learn how to create your first project from scratch...',
        },
        {
          id: 2,
          title: 'Account Setup Guide',
          content: 'Complete guide to setting up your account...',
        },
      ],
    },
    {
      id: 'billing',
      title: 'Billing & Payments',
      icon: 'payments',
      articles: [
        {
          id: 3,
          title: 'Payment Methods',
          content: 'How to add and manage payment methods...',
        },
        {
          id: 4,
          title: 'Subscription Plans',
          content: 'Understanding different subscription tiers...',
        },
      ],
    },
    {
      id: 'design',
      title: 'Design Tools',
      icon: 'palette',
      articles: [
        {
          id: 5,
          title: 'Using the Design Editor',
          content: 'Master the design editor tools and features...',
        },
        {
          id: 6,
          title: 'Templates Library',
          content: 'How to use and customize templates...',
        },
      ],
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: 'support_agent',
      articles: [
        {
          id: 7,
          title: 'System Requirements',
          content: 'Minimum system requirements for optimal performance...',
        },
        {
          id: 8,
          title: 'Troubleshooting',
          content: 'Common issues and their solutions...',
        },
      ],
    },
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I reset my password?',
      answer:
        'You can reset your password by clicking "Forgot Password" on the login page. We\'ll send a reset link to your email address.',
    },
    {
      id: 2,
      question: 'Can I cancel my subscription anytime?',
      answer:
        'Yes, you can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.',
    },
    {
      id: 3,
      question: 'How many projects can I create?',
      answer:
        'The number of projects depends on your subscription plan. Free users can create up to 3 projects, while paid plans offer unlimited projects.',
    },
    {
      id: 4,
      question: 'Is my data secure?',
      answer:
        'Yes, we use industry-standard encryption and security measures to protect your data. All data is stored on secure servers with regular backups.',
    },
    {
      id: 5,
      question: 'How do I export my designs?',
      answer:
        'You can export designs in various formats (PNG, JPG, PDF) from the export menu in the design editor. Higher resolution exports are available for paid plans.',
    },
  ];

  const contactMethods = [
    {
      icon: 'mail',
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'support@conceptbuilders.com',
      action: 'mailto:support@conceptbuilders.com',
    },
    {
      icon: 'chat',
      title: 'Live Chat',
      description: 'Instant help from our support team',
      contact: 'Available 9AM-6PM EST',
      action: '#chat',
    },
    {
      icon: 'forum',
      title: 'Community Forum',
      description: 'Get help from other users',
      contact: 'Join 10,000+ members',
      action: '#forum',
    },
    {
      icon: 'video_library',
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      contact: '100+ tutorials available',
      action: '#tutorials',
    },
  ];

  const toggleFAQ = (id: number) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          Help & Support
        </h2>
        <p className="text-gray-500 mt-0.5 md:mt-1 dark:text-gray-400">
          Find answers to common questions, browse documentation, or get in touch with our support team.
        </p>
      </header>
      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 md:mb-12"
        >
          <div className="relative max-w-2xl mx-auto">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              search
            </span>
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-blue-400"
            />
          </div>
        </motion.div>

        {/* Quick Help Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 md:mb-16"
        >
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 dark:bg-blue-900">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
                  {method.icon}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2 dark:text-white">
                {method.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3 dark:text-gray-400">
                {method.description}
              </p>
              <p className="text-blue-600 text-sm font-medium dark:text-blue-400">
                {method.contact}
              </p>
              <button className="w-full mt-4 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800">
                Contact Now
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Knowledge Base */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 md:mb-16"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-8 dark:text-white">
            Knowledge Base
          </h2>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <span className="material-symbols-outlined">
                  {category.icon}
                </span>
                {category.title}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories
              .find((cat) => cat.id === activeCategory)
              ?.articles.map((article) => (
                <motion.div
                  key={article.id}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700"
                >
                  <h3 className="font-semibold text-gray-900 mb-3 dark:text-white">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 dark:text-gray-400">
                    {article.content}
                  </p>
                  <button className="text-blue-600 text-sm font-medium hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    Read Article →
                  </button>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8 md:mb-16"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-8 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <span className="material-symbols-outlined text-gray-400 transform transition-transform dark:text-gray-500">
                    {activeFAQ === faq.id ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
                {activeFAQ === faq.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-400 rounded-xl p-8 text-center text-white"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Still need help?</h2>
          <p className="mb-6 opacity-90">
            Our support team is here to assist you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Schedule a Call
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;
