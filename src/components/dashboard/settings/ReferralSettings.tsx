"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Copy,
  Check,
  Loader2,
  Users,
  Gift,
  TrendingUp,
  DollarSign,
} from "lucide-react";

interface ReferralInfo {
  referralCode: string;
  referredByCode: string | null;
  referralBonus: number;
  referralBonusConverted: number;
  _count: { referredUsers: number };
}

const ReferralSettings = () => {
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingCode, setApplyingCode] = useState(false);
  const [refereeCodeInput, setRefereeCodeInput] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchReferralInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/settings/referral");
      if (!response.ok) {
        throw new Error("Failed to fetch referral info");
      }
      const data: ReferralInfo = await response.json();
      setReferralInfo(data);
    } catch (error: any) {
      console.error("Error fetching referral info:", error);
      toast.error(`Failed to load referral information: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  const handleCopy = async () => {
    if (referralInfo?.referralCode) {
      try {
        await navigator.clipboard.writeText(referralInfo.referralCode);
        setCopied(true);
        toast.success("Referral code copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error("Failed to copy referral code");
      }
    }
  };

  const handleApplyRefereeCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyingCode(true);
    try {
      const response = await fetch("/api/settings/referral", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refereeCode: refereeCodeInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to apply referral code");
      }

      toast.success("Referral code applied successfully!");
      setRefereeCodeInput("");
      fetchReferralInfo();
    } catch (error: any) {
      console.error("Error applying referee code:", error);
      toast.error(`Failed to apply referral code: ${error.message}`);
    } finally {
      setApplyingCode(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 dark:bg-gray-700 rounded-xl p-4 animate-pulse"
            >
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-2"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!referralInfo) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-8 h-8 text-red-500 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Failed to Load
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Unable to load referral information
        </p>
        <button
          onClick={fetchReferralInfo}
          className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
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
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Referral Program
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Share your referral code and earn rewards with friends
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Referral Code */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Your Referral Code
          </h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                readOnly
                value={referralInfo.referralCode}
                className="w-full rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-lg font-bold h-14 px-4"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 rounded-xl h-14 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold shadow-sm hover:shadow-md transition-all min-w-[120px]"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
              {copied ? "Copied!" : "Copy"}
            </motion.button>
          </div>

          {referralInfo.referredByCode && (
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-3">
              You were referred by:{" "}
              <strong>{referralInfo.referredByCode}</strong>
            </p>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {referralInfo._count.referredUsers}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Referred Users
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Ksh {referralInfo.referralBonus.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Pending Bonus
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-center">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              Ksh {referralInfo.referralBonusConverted.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Converted Bonus
            </p>
          </div>
        </div>

        {/* Apply Referral Code */}
        {!referralInfo.referredByCode && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Have a referral code?
            </h3>
            <form
              onSubmit={handleApplyRefereeCode}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter referral code"
                  value={refereeCodeInput}
                  onChange={(e) => setRefereeCodeInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-base h-12 px-4"
                  disabled={applyingCode}
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={applyingCode}
                className="flex items-center justify-center gap-2 rounded-xl h-12 px-6 bg-gradient-to-r from-green-600 to-emerald-400 text-white font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              >
                {applyingCode ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {applyingCode ? "Applying..." : "Apply Code"}
              </motion.button>
            </form>
          </div>
        )}

        {/* Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            How it Works
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <li className="flex items-start gap-3">
              <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Share your referral code with friends and family
            </li>
            <li className="flex items-start gap-3">
              <Gift className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Earn bonuses when they make purchases
            </li>
            <li className="flex items-start gap-3">
              <DollarSign className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Bonuses convert to KES after purchase completion
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralSettings;
