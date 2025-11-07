"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiShield,
  FiSave,
  FiX,
  FiArrowLeft,
  FiEdit3,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

const EditUserPage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    role: false,
  });
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          setError("");
          const response = await fetch(`/api/users/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const data = await response.json();
          setUser(data);
          setName(data.name || "");
          setEmail(data.email || "");
          setRole(data.role || "CLIENT");
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "An unknown error occurred"
          );
          console.error("Error fetching user:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateForm = () => {
    const newTouched = {
      name: true,
      email: true,
      role: true,
    };
    setTouched(newTouched);

    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email address";
    if (!role) return "Role is required";

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/users/${id}/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      // Success - redirect to users list
      router.push("/admin/users");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error updating user:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/admin/users");
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          {/* Header Skeleton */}
          <div className="flex items-center gap-3 mb-6 xs:mb-8">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div>
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>

          {/* Form Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6 animate-pulse">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            ))}
            <div className="flex gap-3 pt-4">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex-1"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State (failed to load user)
  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6 xs:mb-8">
            <button
              onClick={() => router.push("/admin/users")}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white">
                Edit User
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Error loading user
              </p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 xs:p-6 text-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
              Failed to Load User
            </h3>
            <p className="text-red-700 dark:text-red-400 mb-4">{error}</p>
            <div className="flex flex-col xs:flex-row gap-2 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <FiUser className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={() => router.push("/admin/users")}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back to Users
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6"
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 xs:mb-8">
          <button
            onClick={handleCancel}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl xs:text-2xl font-bold text-gray-800 dark:text-white">
              Edit User
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Update {user?.name || "user"}'s information
            </p>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 xs:p-6 border border-gray-200 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-name"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <FiUser className="w-4 h-4" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="edit-name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError("");
                  }}
                  onBlur={() => handleBlur("name")}
                  className={`w-full rounded-xl border px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white transition-colors min-h-[48px] ${
                    touched.name && !name.trim()
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter full name"
                  disabled={saving}
                />
                {touched.name && name.trim() && (
                  <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                )}
              </div>
              {touched.name && !name.trim() && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  Name is required
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-email"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <FiMail className="w-4 h-4" />
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="edit-email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  onBlur={() => handleBlur("email")}
                  className={`w-full rounded-xl border px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white transition-colors min-h-[48px] ${
                    touched.email &&
                    (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Enter email address"
                  disabled={saving}
                />
                {touched.email &&
                  email.trim() &&
                  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                    <FiCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5" />
                  )}
              </div>
              {touched.email && !email.trim() && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  Email is required
                </p>
              )}
              {touched.email &&
                email.trim() &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    Please enter a valid email address
                  </p>
                )}
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <label
                htmlFor="edit-role"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <FiShield className="w-4 h-4" />
                User Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="edit-role"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value);
                    if (error) setError("");
                  }}
                  onBlur={() => handleBlur("role")}
                  className={`w-full rounded-xl border px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-white appearance-none transition-colors min-h-[48px] cursor-pointer ${
                    touched.role && !role
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500 dark:border-red-600"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  disabled={saving}
                >
                  <option value="">Select a role</option>
                  <option value="CLIENT">Client</option>
                  <option value="TEAM">Team Member</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
                <FiEdit3 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
              {touched.role && !role && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  Role is required
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="order-2 xs:order-1 px-6 py-3.5 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-h-[48px] flex items-center justify-center gap-2"
              >
                <FiX className="w-5 h-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="order-1 xs:order-2 px-6 py-3.5 text-base font-medium text-white bg-gradient-to-r from-dark-blue to-primary rounded-xl hover:to-primary-dark transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex-1 min-h-[48px] flex items-center justify-center gap-2 relative shadow-sm hover:shadow-md"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Current Information Card */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 xs:p-6 mt-4 xs:mt-6"
          >
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
              <FiUser className="w-5 h-5" />
              Current Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-blue-800">
                <span className="text-blue-700 dark:text-blue-400">Name:</span>
                <span className="font-medium text-blue-900 dark:text-blue-300">
                  {user.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-200 dark:border-blue-800">
                <span className="text-blue-700 dark:text-blue-400">Role:</span>
                <span className="font-medium text-blue-900 dark:text-blue-300 capitalize">
                  {user.role?.toLowerCase().replace("_", " ")}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-blue-700 dark:text-blue-400">Email:</span>
                <span className="font-medium text-blue-900 dark:text-blue-300 text-right break-all">
                  {user.email}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EditUserPage;
