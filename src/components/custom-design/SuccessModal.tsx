"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, X } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-xl w-full max-w-xs xs:max-w-sm sm:max-w-md mx-auto p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-green-500" />
              <h2 className="mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Request Submitted!
              </h2>
              <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Thank you for your custom design request. We have received your
                details and will get back to you shortly.
              </p>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Want to track your request and manage your designs?
              </p>
              <div className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4">
                <Button
                  asChild
                  className="w-full min-h-[44px] text-sm sm:text-base"
                >
                  <Link href="/auth">Login to Your Account</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full min-h-[44px] text-sm sm:text-base"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;
