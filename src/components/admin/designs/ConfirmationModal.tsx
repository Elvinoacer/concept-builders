"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CgSpinner } from "react-icons/cg";
import {
  FiAlertTriangle,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  type?: "danger" | "warning" | "info" | "success";
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  type = "danger",
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = true,
}: ConfirmationModalProps) => {
  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: FiAlertTriangle,
          iconColor: "text-red-500",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
          confirmColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          textColor: "text-red-800 dark:text-red-200",
        };
      case "warning":
        return {
          icon: FiAlertTriangle,
          iconColor: "text-amber-500",
          bgColor: "bg-amber-50 dark:bg-amber-900/20",
          borderColor: "border-amber-200 dark:border-amber-800",
          confirmColor: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
          textColor: "text-amber-800 dark:text-amber-200",
        };
      case "info":
        return {
          icon: FiInfo,
          iconColor: "text-blue-500",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800",
          confirmColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
          textColor: "text-blue-800 dark:text-blue-200",
        };
      case "success":
        return {
          icon: FiCheckCircle,
          iconColor: "text-green-500",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800",
          confirmColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
          textColor: "text-green-800 dark:text-green-200",
        };
      default:
        return {
          icon: FiAlertTriangle,
          iconColor: "text-red-500",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800",
          confirmColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          textColor: "text-red-800 dark:text-red-200",
        };
    }
  };

  const typeStyles = getTypeStyles();
  const IconComponent = typeStyles.icon;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && !isLoading) {
      onClose();
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onConfirm();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-auto flex flex-col max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          >
            {/* Header with Icon */}
            <div
              className={`p-4 sm:p-6 border-b ${typeStyles.borderColor} ${typeStyles.bgColor}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div
                    className={`p-3 rounded-xl ${typeStyles.bgColor} border ${typeStyles.borderColor}`}
                  >
                    <IconComponent
                      className={`w-6 h-6 sm:w-7 sm:h-7 ${typeStyles.iconColor}`}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white leading-tight">
                    {title}
                  </h3>
                  <p className={`text-sm ${typeStyles.textColor} mt-1`}>
                    {type === "danger"
                      ? "This action cannot be undone"
                      : type === "warning"
                        ? "Please review carefully"
                        : type === "info"
                          ? "Additional information"
                          : "Operation successful"}
                  </p>
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  {message}
                </p>

                {/* Additional Warning for Destructive Actions */}
                {destructive && type === "danger" && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <FiAlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-300">
                        This is a destructive action. Once confirmed, it cannot
                        be reversed.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 sm:p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${typeStyles.confirmColor}`}
              >
                {isLoading ? (
                  <>
                    <CgSpinner className="animate-spin w-4 h-4" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    {type === "danger" && <FiXCircle className="w-4 h-4" />}
                    {type === "warning" && (
                      <FiAlertTriangle className="w-4 h-4" />
                    )}
                    {type === "info" && <FiInfo className="w-4 h-4" />}
                    {type === "success" && (
                      <FiCheckCircle className="w-4 h-4" />
                    )}
                    <span>{confirmText}</span>
                  </>
                )}
              </button>
            </div>

            {/* Keyboard Shortcut Hint */}
            <div className="px-4 sm:px-6 pb-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Press{" "}
                <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded">
                  Esc
                </kbd>{" "}
                to cancel or{" "}
                <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded">
                  Ctrl/Cmd + Enter
                </kbd>{" "}
                to confirm
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
