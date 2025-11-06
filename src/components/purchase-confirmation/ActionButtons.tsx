"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Download, Mail, Loader2 } from "lucide-react";

const ActionButtons = ({ orderId }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/downloads/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to get download links");
      }
      const signedUrls = await response.json();

      // Open each download link
      signedUrls.forEach((url, index) => {
        setTimeout(() => {
          window.open(url, "_blank");
        }, index * 500); // Stagger downloads to avoid overwhelming the browser
      });

      toast.success(
        `Started downloading ${signedUrls.length} file${signedUrls.length > 1 ? "s" : ""}`
      );
    } catch (error) {
      toast.error(error.message || "Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleResendReceipt = async () => {
    try {
      setIsResending(true);
      const response = await fetch("/api/receipts/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });
      if (!response.ok) {
        throw new Error("Failed to resend receipt");
      }
      toast.success("Receipt has been resent to your email");
    } catch (error) {
      toast.error(error.message || "Failed to resend receipt");
    } finally {
      setIsResending(false);
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    loading: { scale: 0.95 },
  };

  return (
    <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full">
      {/* Download Button */}
      <motion.button
        onClick={handleDownload}
        disabled={isDownloading}
        variants={buttonVariants}
        initial="initial"
        whileHover={!isDownloading ? "hover" : "initial"}
        whileTap="tap"
        animate={isDownloading ? "loading" : "initial"}
        className="flex items-center justify-center gap-2 xs:gap-3 px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-blue-400 disabled:to-cyan-300 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base min-h-12 w-full xs:w-auto xs:flex-1 shadow-lg hover:shadow-xl disabled:shadow-md disabled:cursor-not-allowed"
      >
        {isDownloading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        ) : (
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
        <span className="truncate">
          {isDownloading ? "Downloading..." : "Download Plans"}
        </span>
      </motion.button>

      {/* Resend Receipt Button */}
      <motion.button
        onClick={handleResendReceipt}
        disabled={isResending}
        variants={buttonVariants}
        initial="initial"
        whileHover={!isResending ? "hover" : "initial"}
        whileTap="tap"
        animate={isResending ? "loading" : "initial"}
        className="flex items-center justify-center gap-2 xs:gap-3 px-4 sm:px-6 py-3 bg-white/80 dark:bg-gray-700/80 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 disabled:border-gray-200 disabled:dark:border-gray-700 disabled:text-gray-400 disabled:dark:text-gray-500 text-gray-700 dark:text-gray-300 font-semibold rounded-xl sm:rounded-2xl transition-all duration-200 text-sm sm:text-base min-h-12 w-full xs:w-auto xs:flex-1 shadow-lg hover:shadow-xl disabled:shadow-md disabled:cursor-not-allowed"
      >
        {isResending ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
        ) : (
          <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
        <span className="truncate">
          {isResending ? "Sending..." : "Resend Receipt"}
        </span>
      </motion.button>
    </div>
  );
};

export default ActionButtons;
