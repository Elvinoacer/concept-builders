"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Key, Shield } from "lucide-react";
import { toast } from "sonner";

const PasswordSettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const passwordFields = [
    {
      id: "current-password",
      label: "Current Password",
      name: "currentPassword",
      state: showCurrentPassword,
      setter: setShowCurrentPassword,
      icon: Lock,
    },
    {
      id: "new-password",
      label: "New Password",
      name: "newPassword",
      state: showNewPassword,
      setter: setShowNewPassword,
      icon: Key,
    },
    {
      id: "confirm-password",
      label: "Confirm New Password",
      name: "confirmPassword",
      state: showConfirmPassword,
      setter: setShowConfirmPassword,
      icon: Shield,
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      !passwords.confirmPassword
    ) {
      toast.error("Please fill in all password fields");
      setLoading(false);
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/settings/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Password updated successfully!");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const data = await response.json();
        toast.error(data.message || data.error || "Failed to update password");
      }
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(`An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gold/10 rounded-lg">
          <Shield className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-cream">
            Change Password
          </h2>
          <p className="text-cream-dim mt-1 text-sm sm:text-base">
            Update your password to keep your account secure
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="space-y-6">
          {passwordFields.map(
            ({ id, label, name, state, setter, icon: Icon }) => (
              <div key={id}>
                <label
                  className="flex items-center gap-2 text-sm font-medium text-cream-dim mb-3"
                  htmlFor={id}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </label>
                <div className="relative">
                  <input
                    className="w-full rounded-xl border border-cb-border bg-surface text-cream shadow-sm focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-base h-12 px-4 pr-12"
                    id={id}
                    name={name}
                    type={state ? "text" : "password"}
                    value={passwords[name as keyof typeof passwords]}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                  />
                  <button
                    type="button"
                    onClick={() => setter(!state)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cb-muted hover:text-cream transition-colors p-1"
                    disabled={loading}
                  >
                    {state ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )
          )}

          {/* Password Requirements */}
          <div className="bg-gold/5 border border-border-gold rounded-xl p-4">
            <h4 className="text-sm font-medium text-cream mb-2">
              Password Requirements
            </h4>
            <ul className="text-xs text-cream-dim space-y-1">
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${passwords.newPassword.length >= 8 ? "bg-emerald-500" : "bg-gold"}`}
                />
                At least 8 characters long
              </li>
              <li className="flex items-center gap-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${passwords.newPassword === passwords.confirmPassword && passwords.newPassword ? "bg-emerald-500" : "bg-gold"}`}
                />
                Passwords must match
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl h-12 px-8 bg-gold text-ink font-semibold shadow-sm hover:bg-gold-light hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Shield className="w-5 h-5" />
            )}
            {loading ? "Updating..." : "Update Password"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default PasswordSettings;
