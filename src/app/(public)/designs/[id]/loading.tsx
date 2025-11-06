"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";

const Loading = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [progress, setProgress] = useState(0);

  // Detect mobile devices for optimized animations
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Simulate progress for better UX
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90; // Stay at 90% until actual load completes
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Optimized animation variants for different screen sizes
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: isMobile ? 0.3 : 0.5,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: isMobile ? 0.2 : 0.3,
        ease: "easeIn",
      },
    },
  };

  const spinTransition = {
    duration: isMobile ? 1.5 : 2,
    repeat: Infinity,
    ease: "linear",
  };

  const progressTransition = {
    duration: isMobile ? 1.5 : 2,
    repeat: Infinity,
    ease: "easeInOut",
  };

  const contentVariants = {
    hidden: { opacity: 0, y: isMobile ? 10 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: isMobile ? 0.4 : 0.6,
        delay: isMobile ? 0.1 : 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex-1 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="text-center space-y-6 sm:space-y-8 max-w-sm sm:max-w-md mx-auto w-full">
        {/* Responsive spinning logo */}
        <motion.div
          className="relative mx-auto"
          animate={{ rotate: 360 }}
          transition={spinTransition}
          style={{
            width: isMobile ? "4rem" : "5rem",
            height: isMobile ? "4rem" : "5rem",
          }}
        >
          <div className="absolute inset-0 rounded-2xl border-[3px] sm:border-4 border-gray-200 dark:border-gray-700 border-t-primary dark:border-t-cyan-400" />
          {/* Optional inner ring for better visual hierarchy */}
          <motion.div
            className="absolute inset-2 rounded-xl border-2 border-gray-100 dark:border-gray-800 border-b-transparent dark:border-b-transparent"
            animate={{ rotate: -360 }}
            transition={spinTransition}
          />
        </motion.div>

        {/* Responsive content */}
        <motion.div
          className="space-y-3 sm:space-y-4"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          <Building2
            className="mx-auto text-gray-400 dark:text-gray-600"
            size={isMobile ? 40 : 48}
          />
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-2xl font-light text-gray-600 dark:text-gray-400 leading-tight">
              Loading Design
            </h1>
            <p className="text-gray-500 dark:text-gray-500 text-xs sm:text-sm lg:text-sm leading-relaxed px-2 sm:px-0">
              {isMobile
                ? "Preparing your experience..."
                : "Please wait while we prepare your experience"}
            </p>
          </div>
        </motion.div>

        {/* Adaptive progress bar */}
        <motion.div
          className="mx-auto rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isMobile ? 0.3 : 0.4 }}
          style={{
            width: isMobile ? "12rem" : "16rem",
            height: isMobile ? "0.375rem" : "0.5rem",
          }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-blue-500 to-cyan-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          />
        </motion.div>

        {/* Optional loading dots for mobile */}
        {isMobile && (
          <motion.div
            className="flex justify-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-600"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        )}

        {/* Performance indicator for larger screens */}
        {!isMobile && (
          <motion.div
            className="pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-xs text-gray-400 dark:text-gray-600 font-mono">
              {Math.min(Math.round(progress), 90)}% loaded
            </p>
          </motion.div>
        )}
      </div>

      {/* Background subtle animation for larger screens */}
      {!isMobile && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-gradient-to-br from-primary/5 to-cyan-400/5 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gradient-to-tr from-blue-400/5 to-primary/5 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 50, 0],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Loading;
