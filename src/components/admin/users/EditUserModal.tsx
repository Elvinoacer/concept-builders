"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const EditUserModal = ({
  isOpen,
  onClose,
  onEditUser,
  user,
  isLoading = false,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("CLIENT");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setRole(user.role || "CLIENT");
    }
    // Clear errors when user data loads
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onEditUser({ ...user, name: name.trim(), email: email.trim(), role });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  if (!isOpen) return null;

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
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 xs:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">
                edit
              </span>
            </div>
            <div>
              <h2 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white">
                Edit User
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Update user information
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-xl xs:text-2xl">
              close
            </span>
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="p-4 xs:p-6 space-y-4 xs:space-y-6"
          >
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="edit-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }
                  }}
                  className={`block w-full rounded-xl border px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white transition-colors min-h-[48px] ${
                    errors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter full name"
                  required
                  disabled={isLoading}
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  person
                </span>
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    error
                  </span>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="edit-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  className={`block w-full rounded-xl border px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white transition-colors min-h-[48px] ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter email address"
                  required
                  disabled={isLoading}
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                  mail
                </span>
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    error
                  </span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-role"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="edit-role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (errors.role) {
                      setErrors((prev) => ({ ...prev, role: "" }));
                    }
                  }}
                  className={`block w-full rounded-xl border px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white appearance-none transition-colors min-h-[48px] cursor-pointer ${
                    errors.role
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  disabled={isLoading}
                >
                  <option value="CLIENT">Client</option>
                  <option value="TEAM">Team Member</option>
                  <option value="ADMIN">Administrator</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
                  expand_more
                </span>
              </div>
              {errors.role && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    error
                  </span>
                  {errors.role}
                </p>
              )}
            </div>

            {/* User Info Preview */}
            {user && (
              <div className="bg-gray-50 dark:bg-gray-750 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    info
                  </span>
                  Current Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Previous Name:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {user.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Previous Role:
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 xs:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 sticky bottom-0">
          <div className="flex flex-col xs:flex-row gap-3 xs:gap-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="order-2 xs:order-1 px-6 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-h-[48px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="order-1 xs:order-2 px-6 py-3.5 text-base font-medium text-white bg-gradient-to-r from-dark-blue to-primary rounded-xl hover:to-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-h-[48px] relative shadow-sm hover:shadow-md"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving Changes...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    save
                  </span>
                  <span>Save Changes</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EditUserModal;
