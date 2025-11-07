"use client";

import { motion } from "framer-motion";

const DeleteUserModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 xs:p-4 sm:p-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 xs:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">
                warning
              </span>
            </div>
            <div>
              <h2 className="text-lg xs:text-xl font-bold text-gray-800 dark:text-white">
                Delete User
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 xs:p-6">
          <div className="space-y-4">
            <p className="text-sm xs:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete the user{" "}
              <span className="font-semibold text-gray-800 dark:text-white bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded">
                {userName}
              </span>
              ? This will permanently remove all user data and cannot be
              recovered.
            </p>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 xs:p-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 dark:text-red-400 text-lg flex-shrink-0 mt-0.5">
                  error
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">
                    Critical Action
                  </h4>
                  <ul className="text-xs text-red-700 dark:text-red-400 mt-1 space-y-1">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      User account will be permanently deleted
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      All associated data will be removed
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                      This action cannot be undone
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 xs:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-2xl">
          <div className="flex flex-col xs:flex-row gap-3 xs:gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="order-2 xs:order-1 px-6 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-all focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-h-[48px]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isLoading}
              className="order-1 xs:order-2 px-6 py-3.5 text-base font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-xl hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-1 min-h-[48px] relative shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deleting...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    delete
                  </span>
                  <span>Delete User</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeleteUserModal;
