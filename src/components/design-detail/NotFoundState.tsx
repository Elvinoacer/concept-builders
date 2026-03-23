"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Home,
  Building2,
  ArrowRight,
  Compass,
  Eye,
  MapPin,
  Globe,
} from "lucide-react";

const NotFoundState: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Detect screen size changes
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Optimized animation variants for different screen sizes
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.2,
        duration: isMobile ? 0.4 : 0.6,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: isMobile ? 20 : 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants: any = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: isMobile ? 150 : 200,
        damping: isMobile ? 12 : 15,
        duration: isMobile ? 0.6 : 0.8,
      },
    },
    hover: !isMobile
      ? {
          scale: 1.1,
          rotate: 5,
          transition: {
            duration: 0.3,
          },
        }
      : {},
    float: {
      y: isMobile ? [-5, 8, -5] : [-10, 10, -10],
      transition: {
        duration: isMobile ? 3 : 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const buttonVariants: any = {
    initial: { scale: 1 },
    hover: !isMobile
      ? {
          scale: 1.05,
          transition: {
            duration: 0.2,
            ease: "easeInOut",
          },
        }
      : {},
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  const searchVariants: any = {
    initial: { scale: 1 },
    searching: {
      scale: [1, 1.05, 1],
      transition: {
        duration: isMobile ? 1.5 : 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Responsive icon sizes
  const getIconSize = () => {
    if (isMobile) return 16;
    if (isTablet) return 18;
    return 20;
  };

  const getMainIconSize = () => {
    if (isMobile) return 32;
    if (isTablet) return 40;
    return 48;
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-surface px-3 xs:px-4 sm:px-6 py-8 sm:py-12 lg:py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decorative elements - optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`bg-gold/5 rounded-full blur-2xl sm:blur-3xl ${
            isMobile
              ? "absolute -top-16 -left-16 w-32 h-32"
              : "absolute -top-32 -left-32 w-64 h-64"
          }`}
          variants={iconVariants}
          animate="float"
        />
        <motion.div
          className={`bg-gold/5 rounded-full blur-2xl sm:blur-3xl ${
            isMobile
              ? "absolute -bottom-16 -right-16 w-32 h-32"
              : "absolute -bottom-32 -right-32 w-64 h-64"
          }`}
          variants={iconVariants}
          animate="float"
          transition={{ delay: 2 }}
        />
        {!isMobile && (
          <motion.div
            className="absolute top-1/2 left-1/4 w-32 h-32 bg-gold/5 rounded-full blur-2xl"
            variants={iconVariants}
            animate="float"
            transition={{ delay: 1 }}
          />
        )}
      </div>

      <motion.div
        className="relative z-10 w-full max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-2xl mx-auto"
        variants={containerVariants}
      >
        {/* Main Icon */}
        <motion.div
          className="relative mb-6 sm:mb-8"
          variants={iconVariants}
          whileHover={!isMobile ? "hover" : undefined}
        >
          <div className="relative inline-block">
            {/* Outer ring */}
            <motion.div
              className={`bg-card border-2 border-cb-border backdrop-blur-sm flex items-center justify-center mx-auto rounded-2xl sm:rounded-3xl ${
                isMobile ? "w-20 h-20" : "w-24 sm:w-32 sm:h-32"
              }`}
            >
              {/* Inner circle */}
              <motion.div
                className={`bg-gradient-to-r from-gold to-gold-light flex items-center justify-center shadow-xl rounded-xl sm:rounded-2xl ${
                  isMobile ? "w-16 h-16" : "w-20 sm:w-24 sm:h-24"
                }`}
                whileHover={!isMobile ? { scale: 1.1 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Search className="text-ink" size={getMainIconSize()} />
              </motion.div>
            </motion.div>

            {/* Floating building icons */}
            <motion.div
              className={`absolute bg-ink rounded-full border-2 border-gold/30 flex items-center justify-center shadow-xl ${
                isMobile
                  ? "-top-1 -right-1 w-5 h-5"
                  : "-top-2 -right-2 w-6 sm:w-8 sm:h-8"
              }`}
              variants={iconVariants}
              animate="float"
            >
              <Building2 className={isMobile ? "w-3 h-3 text-gold" : "w-4 h-4 text-gold"} />
            </motion.div>
            <motion.div
              className={`absolute bg-ink rounded-full border-2 border-gold/30 flex items-center justify-center shadow-xl ${
                isMobile
                  ? "-bottom-1 -left-1 w-5 h-5"
                  : "-bottom-2 -left-2 w-6 sm:w-8 sm:h-8"
              }`}
              variants={iconVariants}
              animate="float"
              transition={{ delay: 0.5 }}
            >
              <Eye className={isMobile ? "w-3 h-3 text-gold" : "w-4 h-4 text-gold"} />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-4 sm:space-y-6"
          variants={containerVariants}
        >
          {/* Title */}
          <motion.h1
            className={`font-black text-gold text-center ${
              isMobile ? "text-2xl" : "text-3xl sm:text-4xl lg:text-5xl"
            }`}
            variants={itemVariants}
          >
            {isMobile ? "Design Not Found" : "Design Not Found"}
          </motion.h1>

          {/* Message */}
          <motion.div
            className="bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-cb-border"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 sm:gap-3 text-gold mb-2 sm:mb-3">
              <Compass size={getIconSize()} />
              <span className="font-semibold text-sm sm:text-base">
                Design Search
              </span>
            </div>
            <p className="text-cream-dim text-sm sm:text-base lg:text-lg leading-relaxed text-left">
              {isMobile
                ? "We couldn't find the design you're looking for. It might have been moved or the link may be outdated."
                : "We couldn't find the architectural design you're looking for. It might have been moved, or you may have followed an outdated link."}
            </p>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            className={`gap-3 sm:gap-4 ${
              isMobile ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2"
            }`}
            variants={containerVariants}
          >
            <motion.div
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-700/30"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div
                  className={`rounded-lg sm:rounded-xl bg-ink/50 flex items-center justify-center flex-shrink-0 ${
                    isMobile ? "w-7 h-7" : "w-8 h-8"
                  }`}
                >
                  <Search className={isMobile ? "w-3 h-3 text-gold" : "w-4 h-4 text-gold"} />
                </div>
                <h3 className="font-bold text-cream text-sm sm:text-base">
                  Check the URL
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-cream-dim text-left">
                Ensure the design URL is correct and try again
              </p>
            </motion.div>

            <motion.div
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-cyan-50/50 dark:bg-cyan-900/20 border border-cyan-200/50 dark:border-cyan-700/30"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <div
                  className={`rounded-lg sm:rounded-xl bg-ink/50 flex items-center justify-center flex-shrink-0 ${
                    isMobile ? "w-7 h-7" : "w-8 h-8"
                  }`}
                >
                  <Building2 className={isMobile ? "w-3 h-3 text-gold" : "w-4 h-4 text-gold"} />
                </div>
                <h3 className="font-bold text-cream text-sm sm:text-base">
                  Browse Collection
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-cream-dim text-left">
                Explore our complete architectural design portfolio
              </p>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className={`gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 ${
              isMobile ? "flex flex-col" : "flex flex-row"
            }`}
            variants={containerVariants}
          >
            {/* Explore Designs Button */}
            <motion.div
              variants={buttonVariants}
              whileHover={!isMobile ? "hover" : undefined}
              whileTap="tap"
              className="w-full sm:w-auto"
            >
              <Link
                href="/designs"
                className={`flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-gold to-gold-light text-ink font-bold shadow-xl hover:shadow-gold/20 transition-all duration-300 group w-full ${
                  isMobile
                    ? "px-6 py-3 rounded-xl text-base"
                    : "px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-lg"
                }`}
              >
                <Building2
                  size={getIconSize()}
                  className="group-hover:scale-110 transition-transform duration-300 text-ink"
                />
                {isMobile ? "Explore" : "Explore Designs"}
                <ArrowRight
                  size={getIconSize()}
                  className="group-hover:translate-x-1 transition-transform duration-300 text-ink"
                />
              </Link>
            </motion.div>

            {/* Home Button */}
            <motion.div
              variants={buttonVariants}
              whileHover={!isMobile ? "hover" : undefined}
              whileTap="tap"
              className="w-full sm:w-auto"
            >
              <Link
                href="/"
                className={`flex items-center justify-center gap-2 sm:gap-3 bg-surface border-2 border-cb-border text-cream hover:border-gold/50 hover:text-gold font-bold shadow-xl transition-all duration-300 group w-full ${
                  isMobile
                    ? "px-6 py-3 rounded-xl text-base"
                    : "px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-lg"
                }`}
              >
                <Home
                  size={getIconSize()}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                {isMobile ? "Home" : "Back to Home"}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="pt-4 sm:pt-6" variants={itemVariants}>
            <motion.div
              className={`inline-flex items-center gap-2 backdrop-blur-sm border border-cb-border text-muted ${
                isMobile
                  ? "px-3 py-2 rounded-xl text-xs"
                  : "px-4 py-2 rounded-2xl text-sm"
              }`}
              variants={searchVariants}
              initial="initial"
              animate="searching"
            >
              <Search size={isMobile ? 12 : 16} className="text-gold" />
              <span className="font-bold">
                {isMobile ? "Searching..." : "Searching for designs..."}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className={`mt-6 sm:mt-8 backdrop-blur-sm border border-cb-border ${
            isMobile ? "p-4 rounded-xl" : "p-6 rounded-2xl"
          }`}
          variants={itemVariants}
        >
          <div
            className={`flex items-center justify-between gap-3 sm:gap-4 ${
              isMobile ? "flex-col text-center" : "flex-row"
            }`}
          >
            <div className={`text-left ${isMobile ? "text-center" : ""}`}>
              <h4
                className={`font-bold text-cream ${
                  isMobile ? "text-sm mb-1" : "text-base mb-1"
                }`}
              >
                Need assistance?
              </h4>
              <p
                className={`text-muted ${
                  isMobile ? "text-xs font-bold" : "text-sm font-bold"
                }`}
              >
                {isMobile
                  ? "Our team is here to help"
                  : "Our architectural consultants are here to help"}
              </p>
            </div>
            <motion.div
              variants={buttonVariants}
              whileHover={!isMobile ? "hover" : undefined}
              whileTap="tap"
            >
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 text-gold hover:text-gold-light font-bold transition-colors duration-300 group ${
                  isMobile ? "px-4 py-2 text-sm" : "px-6 py-3 text-base"
                }`}
              >
                <span>{isMobile ? "Support" : "Contact Support"}</span>
                <ArrowRight
                  size={isMobile ? 14 : 16}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {isMobile && (
          <motion.div
            className="mt-4 p-3 bg-ink/30 rounded-xl border border-cb-border"
            variants={itemVariants}
          >
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-2">
              Quick actions:
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/designs?category=residential"
                className="flex items-center gap-1 text-gold text-xs font-bold"
              >
                <MapPin className="w-3 h-3 text-gold" />
                <span>Homes</span>
              </Link>
              <Link
                href="/designs?category=commercial"
                className="flex items-center gap-1 text-gold text-xs font-bold"
              >
                <Building2 className="w-3 h-3 text-gold" />
                <span>Commercial</span>
              </Link>
              <Link
                href="/designs"
                className="flex items-center gap-1 text-muted text-xs font-bold"
              >
                <Globe className="w-3 h-3 text-muted" />
                <span>All</span>
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default NotFoundState;
