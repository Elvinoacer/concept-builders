"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Mail,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
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
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.6,
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
          className="absolute -top-32 -left-32 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-md w-full text-center"
        variants={containerVariants}
      >
        {/* Error Icon */}
        <motion.div
          className="relative mb-8"
          variants={iconVariants}
          animate="visible"
          whileHover="hover"
        >
          <div className="relative inline-block">
            {/* Outer ring */}
            <motion.div
              className="w-32 h-32 rounded-3xl bg-red-500/10 border-2 border-red-500/20 backdrop-blur-sm flex items-center justify-center mx-auto"
              whileHover="shake"
            >
              {/* Inner circle */}
              <motion.div
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <AlertTriangle className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            {/* Floating alert dot */}
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center shadow-lg"
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{
                delay: 0.8,
                type: "spring",
                stiffness: 500,
              }}
            >
              <AlertCircle className="w-3 h-3 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Error Content */}
        <motion.div className="space-y-6" variants={containerVariants}>
          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Something Went Wrong
          </motion.h1>

          {/* Error Message */}
          <motion.div
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border-2 border-red-200/50 dark:border-red-700/30"
            variants={itemVariants}
          >
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
              <AlertCircle className="w-5 h-5" />
              <span className="font-semibold">Error Details</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-left">
              {message}
            </p>
          </motion.div>

          {/* Help Text */}
          <motion.p
            className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed"
            variants={itemVariants}
          >
            We apologize for the inconvenience. This might be a temporary issue.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            variants={containerVariants}
          >
            {/* Retry Button */}
            <motion.button
              onClick={onRetry}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop",
                }}
                className="group-hover:scale-110 transition-transform duration-300"
              >
                <RefreshCw className="w-5 h-5" />
              </motion.div>
              Try Again
            </motion.button>

            {/* Home Button */}
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/designs"
                className="flex items-center justify-center gap-3 px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500/50 hover:text-red-600 dark:hover:text-red-400 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                Browse Designs
              </Link>
            </motion.div>
          </motion.div>

          {/* Additional Help */}
          <motion.div
            className="pt-6 border-t border-gray-200/50 dark:border-gray-700/50"
            variants={itemVariants}
          >
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">
              Still experiencing issues?
            </p>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium transition-colors duration-300 group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                Contact Support
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Error Code (Optional) */}
        <motion.div
          className="mt-8 p-4 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Error Reference
            </span>
            <code className="text-red-500 dark:text-red-400 font-mono bg-white/50 dark:bg-gray-700/50 px-3 py-1 rounded-lg">
              ERR_{Math.random().toString(36).substr(2, 8).toUpperCase()}
            </code>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ErrorState;
// "use client";

// import React from 'react';
// import { motion } from 'framer-motion';
// import { AlertTriangle, RefreshCw } from 'lucide-react';

// interface ErrorStateProps {
//   message: string;
//   onRetry: () => void;
// }

// const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
//   return (
//     <motion.div
//       className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.6 }}
//     >
//       <div className="text-center max-w-sm w-full space-y-8">
//         {/* Icon */}
//         <motion.div
//           className="relative"
//           initial={{ scale: 0, rotate: -180 }}
//           animate={{ scale: 1, rotate: 0 }}
//           transition={{
//             type: "spring",
//             stiffness: 200,
//             damping: 15,
//             duration: 0.8
//           }}
//         >
//           <div className="w-20 h-20 rounded-2xl bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center mx-auto">
//             <AlertTriangle className="w-10 h-10 text-red-500" />
//           </div>
//         </motion.div>

//         {/* Content */}
//         <motion.div
//           className="space-y-4"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//         >
//           <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
//             Unable to Load
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
//             {message}
//           </p>
//         </motion.div>

//         {/* Action */}
//         <motion.button
//           onClick={onRetry}
//           className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300 font-medium mx-auto"
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.4 }}
//         >
//           <RefreshCw className="w-4 h-4" />
//           Retry
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// };

// export default ErrorState;
