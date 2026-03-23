"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Mail,
  AlertCircle,
  Smartphone,
  Wifi,
  WifiOff,
} from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Detect screen size and connectivity
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };

    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    checkScreenSize();
    checkOnlineStatus();

    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("online", checkOnlineStatus);
    window.addEventListener("offline", checkOnlineStatus);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("online", checkOnlineStatus);
      window.removeEventListener("offline", checkOnlineStatus);
    };
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
    shake: {
      x: [0, -8, 8, -8, 8, 0],
      transition: {
        duration: isMobile ? 0.4 : 0.6,
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

  // Responsive icon sizes
  const getIconSize = () => {
    if (isMobile) return 20;
    if (isTablet) return 22;
    return 24;
  };

  const getMainIconSize = () => {
    if (isMobile) return 40;
    if (isTablet) return 44;
    return 48;
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-surface px-3 xs:px-4 sm:px-6 py-8 sm:py-12 lg:py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decorative elements - reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-16 sm:-top-32 -left-16 sm:-left-32 w-32 h-32 sm:w-64 sm:h-64 bg-gold/5 rounded-full blur-2xl sm:blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: isMobile ? 0.8 : 1, delay: 0.3 }}
        />
        <motion.div
          className="absolute -bottom-16 sm:-bottom-32 -right-16 sm:-right-32 w-32 h-32 sm:w-64 sm:h-64 bg-gold/5 rounded-full blur-2xl sm:blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: isMobile ? 0.8 : 1, delay: 0.5 }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg mx-auto"
        variants={containerVariants}
      >
        {/* Error Icon */}
        <motion.div
          className="relative mb-6 sm:mb-8"
          variants={iconVariants}
          animate="visible"
          whileHover={!isMobile ? "hover" : undefined}
        >
          <div className="relative inline-block">
            {/* Outer ring */}
            <motion.div
              className={`rounded-2xl sm:rounded-3xl bg-card border-2 border-cb-border backdrop-blur-sm flex items-center justify-center mx-auto ${
                isMobile ? "w-20 h-20" : "w-24 sm:w-32 sm:h-32"
              }`}
              whileHover="shake"
            >
              {/* Inner circle */}
              <motion.div
                className={`rounded-xl sm:rounded-2xl bg-gradient-to-r from-gold to-gold-light flex items-center justify-center shadow-xl ${
                  isMobile ? "w-16 h-16" : "w-20 sm:w-24 sm:h-24"
                }`}
                whileHover={!isMobile ? { scale: 1.1 } : {}}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AlertTriangle
                  className="text-ink"
                  size={getMainIconSize()}
                />
              </motion.div>
            </motion.div>

            {/* Floating alert dot */}
            <motion.div
              className={`absolute -top-1 -right-1 bg-gold rounded-full border-2 sm:border-4 border-ink flex items-center justify-center shadow-xl ${
                isMobile ? "w-5 h-5" : "w-6 sm:w-8 sm:h-8"
              }`}
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                delay: 0.6,
                type: "spring",
                stiffness: 500,
              }}
            >
              <AlertCircle className={isMobile ? "w-2 h-2 text-ink" : "w-3 h-3 text-ink"} />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Content */}
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
            {isMobile ? "Error Occurred" : "Something Went Wrong"}
          </motion.h1>

          {/* Connectivity Status */}
          {!isOnline && (
            <motion.div
              className="flex items-center justify-center gap-2 p-3 bg-gold/10 border border-gold/20 rounded-xl"
              variants={itemVariants}
            >
              <WifiOff className="w-4 h-4 text-amber-600" />
              <span className="text-gold text-sm font-bold">
                You appear to be offline
              </span>
            </motion.div>
          )}

          {/* Error Message */}
          <motion.div
            className="bg-card/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-cb-border"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 sm:gap-3 text-gold mb-2 sm:mb-3">
              <AlertCircle size={getIconSize()} />
              <span className="font-bold text-sm sm:text-base">
                Error Details
              </span>
            </div>
            <p className="text-cream-dim text-sm sm:text-base lg:text-lg leading-relaxed text-left break-words">
              {message.length > 200 && isMobile
                ? `${message.substring(0, 200)}...`
                : message}
            </p>
          </motion.div>

          {/* Help Text */}
          <motion.p
            className="text-muted text-sm sm:text-base lg:text-xl font-bold leading-relaxed text-center px-2 sm:px-0"
            variants={itemVariants}
          >
            {isMobile
              ? "We apologize for the inconvenience."
              : "We apologize for the inconvenience. This might be a temporary issue."}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className={`flex gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 ${
              isMobile ? "flex-col" : "flex-row"
            }`}
            variants={containerVariants}
          >
            {/* Retry Button */}
            <motion.button
              onClick={onRetry}
              variants={buttonVariants}
              whileHover={!isMobile ? "hover" : undefined}
              whileTap="tap"
              className={`flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-gold to-gold-light text-ink rounded-xl sm:rounded-2xl font-bold shadow-xl hover:shadow-gold/20 transition-all duration-300 group w-full sm:w-auto ${
                isMobile
                  ? "px-6 py-3 text-base"
                  : "px-6 sm:px-8 py-3 sm:py-4 text-lg"
              }`}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: isMobile ? 1.5 : 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                }}
                className="group-hover:scale-110 transition-transform duration-300"
              >
                <RefreshCw size={getIconSize()} />
              </motion.div>
              Try Again
            </motion.button>

            {/* Home Button */}
            <motion.div
              variants={buttonVariants}
              whileHover={!isMobile ? "hover" : undefined}
              whileTap="tap"
              className="w-full sm:w-auto"
            >
              <Link
                href="/designs"
                className={`flex items-center justify-center gap-2 sm:gap-3 bg-surface border-2 border-cb-border text-cream hover:border-gold/50 hover:text-gold rounded-xl sm:rounded-2xl font-bold shadow-xl transition-all duration-300 group w-full ${
                  isMobile
                    ? "px-6 py-3 text-base"
                    : "px-6 sm:px-8 py-3 sm:py-4 text-lg"
                }`}
              >
                <Home
                  size={getIconSize()}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                {isMobile ? "Designs" : "Browse Designs"}
              </Link>
            </motion.div>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            className="pt-4 sm:pt-6 border-t border-cb-border"
            variants={itemVariants}
          >
            <p className="text-muted text-xs sm:text-sm mb-3 text-center font-bold">
              Still experiencing issues?
            </p>
            <motion.div
              variants={buttonVariants}
              whileHover={!isMobile ? "hover" : undefined}
              whileTap="tap"
              className="text-center"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-gold hover:text-gold-light font-bold transition-colors duration-300 group text-sm sm:text-base"
              >
                <Mail
                  size={isMobile ? 16 : 18}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
                Contact Support
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Error Code */}
        <motion.div
          className="mt-6 sm:mt-8 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-surface border border-cb-border"
          variants={itemVariants}
        >
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0 text-xs sm:text-sm">
            <span className="text-muted text-center xs:text-left font-bold">
              Error Reference
            </span>
            <code className="text-gold font-mono bg-ink px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm break-all text-center xs:text-right border border-gold/20">
              ERR_{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </code>
          </div>
        </motion.div>

        {/* Mobile-specific tips */}
        {isMobile && (
          <motion.div
            className="mt-4 p-3 bg-gold/5 rounded-xl border border-cb-border"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs">
              <Smartphone className="w-3 h-3" />
              <span>Tip: Check your connection and try again</span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ErrorState;
