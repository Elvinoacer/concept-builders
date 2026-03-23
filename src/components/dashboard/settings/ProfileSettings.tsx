"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Save } from "lucide-react";
import { toast } from "sonner";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";

const ProfileSettings = () => {
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
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
            phone: data.phone || "",
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
        <div className="h-6 bg-surface rounded w-48 animate-pulse"></div>
        <div className="h-4 bg-surface rounded w-64 animate-pulse"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-surface rounded w-24 animate-pulse"></div>
              <div className="h-12 bg-surface rounded animate-pulse"></div>
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
        <div className="p-2 bg-gold/10 rounded-lg">
          <User className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-cream">
            Personal Information
          </h2>
          <p className="text-cream-dim mt-1 text-sm sm:text-base">
            Update your personal details and contact information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              className="flex items-center gap-2 text-sm font-medium text-cream-dim mb-3"
              htmlFor="full-name"
            >
              <User className="w-4 h-4" />
              Full Name
            </label>
            <input
              className="w-full rounded-xl border border-cb-border bg-surface text-cream shadow-sm focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-base h-12 px-4"
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
              className="flex items-center gap-2 text-sm font-medium text-cream-dim mb-3"
              htmlFor="email"
            >
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              className="w-full rounded-xl border border-cb-border bg-surface text-cream shadow-sm focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-base h-12 px-4"
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
              className="flex items-center gap-2 text-sm font-medium text-cream-dim mb-3"
              htmlFor="phone-number"
            >
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              className="w-full rounded-xl border border-cb-border bg-surface text-cream shadow-sm focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-base h-12 px-4"
              id="phone-number"
              name="phone"
              type="tel"
              value={userProfile.phone}
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
            className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-gold text-ink font-semibold shadow-sm hover:bg-gold-light hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-ink border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "Saving..." : "Update Profile"}
          </motion.button>

          {/* Notification Settings */}
          <div className="pt-6 border-t border-cb-border">
            <h3 className="text-lg font-semibold text-cream mb-4">
              Notification Preferences
            </h3>
            <NotificationSettings />
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileSettings;
