"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save } from "lucide-react";
import { toast } from "sonner";

const ProfileSettings = () => {
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/settings/profile");
        if (response.ok) {
          const data = await response.json();
          setUserProfile({
            fullName: data.name || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
          });
        } else {
          throw new Error("Failed to fetch profile");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userProfile),
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Personal Information
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Update your personal details and contact information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              htmlFor="full-name"
            >
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-base h-12 px-4"
              id="full-name"
              name="fullName"
              type="text"
              value={userProfile.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              htmlFor="email"
            >
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-base h-12 px-4"
              id="email"
              name="email"
              type="email"
              value={userProfile.email}
              onChange={handleChange}
              placeholder="Enter your email address"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              htmlFor="phone-number"
            >
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-base h-12 px-4"
              id="phone-number"
              name="phoneNumber"
              type="tel"
              value={userProfile.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "Saving..." : "Update Profile"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileSettings;
