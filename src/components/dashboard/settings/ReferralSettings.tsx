// components/dashboard/settings/ReferralSettings.jsx
"use client";
import React from "react";
import { referralInfo } from "@/lib/dummydata/settings-data";

const ReferralSettings = () => {
  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
        Referral Program
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
        Share your referral link and earn rewards.
      </p>
      <div className="mt-4 md:mt-6 space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Referral Code
          </p>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              readOnly
              value={referralInfo.referralCode}
              className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 sm:text-base h-12 px-5"
            />
            <button className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Copy
            </button>
          </div>
        </div>
        {[
          { label: "Total Referrals", value: referralInfo.totalReferrals },
          {
            label: "Earned Bonus",
            value: `${referralInfo.earnedBonus.toFixed(2)}`,
          },
          {
            label: "Pending Bonus",
            value: `${referralInfo.pendingBonus.toFixed(2)}`,
          },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </p>
            <p className="mt-1 text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferralSettings;
