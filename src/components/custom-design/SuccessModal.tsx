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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,9,7,0.8)] p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            className="relative mx-auto w-full max-w-xs border border-cb-border bg-card p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] xs:max-w-sm sm:max-w-md sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-3 top-3 text-cream-dim transition-colors hover:text-gold sm:right-4 sm:top-4"
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-gold sm:h-16 sm:w-16" />
              <h2
                className="mt-4 text-2xl font-light text-cream sm:text-3xl"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                Request Submitted!
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-cream-dim sm:mt-3 sm:text-base">
                Thank you for your custom design request. We have received your
                details and will get back to you shortly.
              </p>
              <p className="mt-3 text-xs text-muted sm:mt-4 sm:text-sm">
                Want to track your request and manage your designs?
              </p>
              <div className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4">
                <Button
                  asChild
                  className="min-h-[44px] w-full border border-gold bg-gold text-sm uppercase tracking-[0.14em] text-ink hover:bg-gold-light sm:text-base"
                >
                  <Link href="/auth">Login to Your Account</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="min-h-[44px] w-full border-cb-border bg-surface text-sm text-cream-dim hover:border-gold hover:bg-surface hover:text-gold sm:text-base"
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
