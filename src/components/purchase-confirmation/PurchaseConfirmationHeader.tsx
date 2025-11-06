"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, PartyPopper } from "lucide-react";

const PurchaseConfirmationHeader = ({ purchaseNumber }) => {
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
    float: {
      y: [-5, 5, -5],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="p-6 sm:p-8 lg:p-12 text-center"
      initial="hidden"
      animate="visible"
    >
      {/* Animated Icon */}
      <motion.div
        className="relative inline-flex mb-4 sm:mb-6"
        variants={iconVariants}
      >
        <motion.div
          className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl"
          variants={iconVariants}
          animate="float"
        >
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>

        {/* Floating confetti */}
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
          variants={iconVariants}
          animate="float"
          transition={{ delay: 0.5 }}
        >
          <PartyPopper className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </motion.div>
      </motion.div>

      {/* Main Heading */}
      <motion.h2
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-3 sm:mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent"
        variants={textVariants}
      >
        Purchase Confirmed!
      </motion.h2>

      {/* Order Number */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/30 rounded-2xl mb-4 sm:mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-blue-600 dark:text-blue-400 text-sm font-semibold">
          Order #{purchaseNumber}
        </span>
      </motion.div>

      {/* Description */}
      <motion.p
        className="text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto px-2 sm:px-0"
        variants={textVariants}
        transition={{ delay: 0.2 }}
      >
        Thank you for your purchase! Your order has been successfully processed
        and you'll receive an email confirmation shortly. Your design files are
        now ready for download.
      </motion.p>

      {/* Additional Info */}
      <motion.div
        className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          🎉 <strong>What's next?</strong> Download your plans below and check
          your email for the receipt.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default PurchaseConfirmationHeader;
