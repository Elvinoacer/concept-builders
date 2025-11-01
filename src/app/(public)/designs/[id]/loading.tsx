"use client";

import { motion } from "framer-motion";
import { Building2 } from "lucide-react";

const Loading = () => {
  return (
    <motion.div
      className="min-h-screen flex-1 flex items-center justify-center bg-white dark:bg-gray-900 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-8">
        {/* Elegant spinning logo */}
        <motion.div
          className="relative w-20 h-20 mx-auto"
          animate={{ rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div className="absolute inset-0 rounded-2xl border-4 border-gray-200 dark:border-gray-700 border-t-primary dark:border-t-cyan-400" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Building2 className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto" />
          <h1 className="text-2xl font-light text-gray-600 dark:text-gray-400">
            Loading Design
          </h1>
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Please wait while we prepare your experience
          </p>
        </motion.div>

        {/* Minimal progress bar */}
        <motion.div
          className="w-48 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Loading;
