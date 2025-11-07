"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Shield, Smartphone, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (phoneNumber: string) => void;
}

const PhoneNumberModal: React.FC<PhoneNumberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePhoneNumber = (number: string | undefined): boolean => {
    if (!number) return false;
    return isPossiblePhoneNumber(number);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid phone number.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/user/phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      if (!response.ok) {
        throw new Error("Failed to save phone number.");
      }

      setIsSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(phoneNumber as string);
    } catch (err) {
      setError("Failed to save phone number. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    localStorage.setItem("hasDismissedPhoneModal", "true");
    onClose();
  };

  // Reset states when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber("");
      setError("");
      setIsLoading(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 safe-area-inset"
          onClick={handleClose}
          style={{
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
            paddingTop: "env(safe-area-inset-top)",
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 40,
              duration: 0.3,
            }}
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden flex flex-col max-h-[90vh] lg:max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Section */}
            <div className="flex-shrink-0 relative bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-xl bg-white/80 dark:bg-gray-800/80 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 backdrop-blur-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-700 shadow-sm border border-gray-200/50 dark:border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </motion.button>

              {/* Icon and Title */}
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg"
                  >
                    <Smartphone className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Success Checkmark */}
                  <AnimatePresence>
                    {isSuccess && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-lg"
                      >
                        <CheckCircle className="w-3 h-3 text-white fill-current" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {isSuccess ? "Number Saved!" : "Add Phone Number"}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
                    {isSuccess
                      ? "Your phone number has been saved successfully!"
                      : "Stay connected with seamless communication and important updates."}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Section - Scrollable if needed */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Phone Input */}
                  <div className="space-y-3">
                    <label
                      htmlFor="phone-input"
                      className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneInput
                        id="phone-input"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        placeholder="Enter phone number"
                        defaultCountry="KE"
                        className="phone-input-custom"
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-red-500 text-sm font-medium px-1"
                        >
                          {error}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Security Info */}
                  <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <Shield className="w-6 h-6 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-base font-semibold text-blue-800 dark:text-blue-300">
                        Your privacy matters
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-400/80 leading-relaxed">
                        We'll only use this for important updates and secure
                        communication. Your number is encrypted and protected.
                      </p>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading || !phoneNumber}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:shadow-none disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-3">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        Saving...
                      </span>
                    ) : (
                      "Save Phone Number"
                    )}
                  </motion.button>
                </form>
              ) : (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center text-center space-y-8 py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>

                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      All Set!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed max-w-md">
                      Your phone number has been verified and saved securely.
                      You'll now receive important updates and notifications.
                    </p>
                  </div>

                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-lg"
                  >
                    Continue to Dashboard
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Footer Note */}
            {!isSuccess && (
              <div className="flex-shrink-0 px-6 sm:px-8 pb-6 sm:pb-8 border-t border-gray-200/50 dark:border-gray-700/50 pt-5">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                  You can update this anytime in your account settings. We
                  respect your privacy and will never share your number with
                  third parties.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhoneNumberModal;
