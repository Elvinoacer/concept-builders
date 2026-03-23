"use client";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { RefreshCw, Wrench, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

const MaintenancePage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [progress, setProgress] = useState(0);

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

  // Simulate progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85; // Stay at 85% to indicate ongoing work
        }
        return prev + Math.random() * 10;
      });
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.6,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const iconVariants: Variants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        duration: 0.8,
      },
    },
    spin: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear" as const,
      },
    },
  };

  const buttonVariants: Variants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  return (
    <motion.main
      className="min-h-screen flex items-center justify-center bg-ink py-8 sm:py-12 md:py-16 lg:py-20 px-3 xs:px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-gold/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 bg-gold/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-xs xs:max-w-sm sm:max-w-md lg:max-w-lg text-center"
        variants={containerVariants}
      >
        {/* Maintenance Icon */}
        <motion.div className="relative mb-6 sm:mb-8" variants={iconVariants}>
          <div className="relative inline-block">
            {/* Outer ring with rotating animation */}
            <motion.div
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-surface border-2 border-cb-border backdrop-blur-sm flex items-center justify-center mx-auto"
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {/* Inner circle */}
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gold flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Wrench className="w-10 h-10 sm:w-12 sm:h-12 text-ink" />
              </motion.div>
            </motion.div>

            {/* Floating tools */}
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-surface rounded-full border-2 border-cb-border flex items-center justify-center shadow-lg"
              variants={iconVariants}
              animate="spin"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
            </motion.div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants}>
          {/* Status Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-6 sm:mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AlertCircle className="w-4 h-4" />
            Scheduled Maintenance
          </motion.div>

          {/* Heading */}
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-cream mb-4 sm:mb-6">
            We&apos;ll Be Back Soon
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-cream-dim leading-relaxed mb-6 sm:mb-8 px-2 sm:px-0">
            We&apos;re currently performing scheduled maintenance to improve
            your experience.
            {isMobile
              ? " We'll be back shortly."
              : " Thank you for your patience and understanding."}
          </p>

          {/* Progress Indicator */}
          <motion.div
            className="mb-8 sm:mb-10 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center justify-between text-sm text-cream-dim mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Maintenance Progress
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-surface rounded-full h-2 overflow-hidden border border-cb-border">
              <motion.div
                className="h-full bg-gold rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Additional Info Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 sm:mb-10"
            variants={containerVariants}
          >
            <motion.div
              className="p-4 rounded-2xl bg-card backdrop-blur-sm border border-cb-border shadow-lg"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-cream text-sm">
                    Estimated Time
                  </p>
                  <p className="text-cream-dim text-xs">
                    ~30-60 minutes
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50"
              variants={itemVariants}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-gold" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-cream text-sm">
                    Auto Refresh
                  </p>
                  <p className="text-cream-dim text-xs">
                    Check back soon
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={containerVariants}
          >
            <motion.button
              onClick={handleRefresh}
              variants={buttonVariants}
              whileHover={!isMobile ? "hover" : undefined}
              whileTap="tap"
              className="flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gold hover:bg-gold-light text-ink font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg w-full sm:w-auto"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.div>
              Refresh Page
            </motion.button>

            {!isMobile && (
              <motion.button
                onClick={() => window.history.back()}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-surface backdrop-blur-sm border-2 border-cb-border text-cream hover:border-gold hover:text-gold font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg"
              >
                Go Back
              </motion.button>
            )}
          </motion.div>

          {/* Contact Info for larger screens */}
          {!isMobile && (
            <motion.div
              className="mt-8 p-4 rounded-2xl bg-card border border-cb-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <p className="text-sm text-cream-dim">
                For urgent inquiries, please contact{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-gold hover:underline"
                >
                  support@example.com
                </a>
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.main>
  );
};

export default MaintenancePage;
