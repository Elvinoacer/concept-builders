"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Home,
  Building2,
  ArrowRight,
  Compass,
  Eye,
} from "lucide-react";

const NotFoundState: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        duration: 0.8,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.3,
      },
    },
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  const searchVariants = {
    initial: { scale: 1 },
    searching: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 px-4 py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-32 -left-32 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
          variants={iconVariants}
          animate="float"
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"
          variants={iconVariants}
          animate="float"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"
          variants={iconVariants}
          animate="float"
          transition={{ delay: 1 }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-2xl w-full text-center"
        variants={containerVariants}
      >
        {/* Main Icon */}
        <motion.div className="relative mb-8" variants={iconVariants}>
          <div className="relative inline-block">
            {/* Outer ring */}
            <motion.div
              className="w-32 h-32 rounded-3xl bg-blue-500/10 border-2 border-blue-500/20 backdrop-blur-sm flex items-center justify-center mx-auto"
              whileHover="hover"
            >
              {/* Inner circle */}
              <motion.div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Search className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            {/* Floating building icons */}
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-2 border-blue-500/30 flex items-center justify-center shadow-lg"
              variants={iconVariants}
              animate="float"
            >
              <Building2 className="w-4 h-4 text-blue-500" />
            </motion.div>
            <motion.div
              className="absolute -bottom-2 -left-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-2 border-cyan-500/30 flex items-center justify-center shadow-lg"
              variants={iconVariants}
              animate="float"
              transition={{ delay: 0.5 }}
            >
              <Eye className="w-4 h-4 text-cyan-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div className="space-y-6" variants={containerVariants}>
          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Design Not Found
          </motion.h1>

          {/* Message */}
          <motion.div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200/50 dark:border-blue-700/30"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 mb-3">
              <Compass className="w-5 h-5" />
              <span className="font-semibold">Design Search</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              We couldn't find the architectural design you're looking for. It
              might have been moved, or you may have followed an outdated link.
            </p>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
          >
            <motion.div
              className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                  <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Check the URL
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                Ensure the design URL is correct and try again
              </p>
            </motion.div>

            <motion.div
              className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-900/20 border border-cyan-200/50 dark:border-cyan-700/30"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-800 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white">
                  Browse Collection
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-left">
                Explore our complete architectural design portfolio
              </p>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            variants={containerVariants}
          >
            {/* Explore Designs Button */}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/designs"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Building2 className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Explore Designs
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>

            {/* Home Button */}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Back to Home
              </Link>
            </motion.div>
          </motion.div>

          {/* Search Animation */}
          <motion.div className="pt-6" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 text-gray-600 dark:text-gray-400 text-sm"
              variants={searchVariants}
              initial="initial"
              animate="searching"
            >
              <Search className="w-4 h-4" />
              <span>Searching for designs...</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          className="mt-8 p-6 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-left">
              <h4 className="font-semibold text-slate-800 dark:text-white mb-1">
                Need assistance?
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Our architectural consultants are here to help
              </p>
            </div>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300 group"
              >
                <span>Contact Support</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundState;
