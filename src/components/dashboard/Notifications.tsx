"use client";
import React from "react";

const Notifications = () => {
  return (
    <section className="mt-4 md:mt-8">
      <h3 className="text-gray-800 text-lg md:text-xl font-bold leading-tight tracking-[-0.015em] mb-2 md:mb-4 dark:text-white">
        Notifications
      </h3>
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:divide-gray-700">
        <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 flex items-center justify-center rounded-full bg-blue-100 shrink-0 size-10 md:size-12 dark:bg-blue-900">
            <span className="material-symbols-outlined">update</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 text-base font-medium dark:text-white">
              Project Update
            </p>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Your project 'Modern Retreat' has been updated.
            </p>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            2 hours ago
          </span>
        </div>
        <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
          <div className="text-green-500 flex items-center justify-center rounded-full bg-green-100 shrink-0 size-12 dark:bg-green-900 dark:text-green-200">
            <span className="material-symbols-outlined">new_releases</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 text-base font-medium dark:text-white">
              New Design
            </p>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              New design 'Coastal Breeze' is now available.
            </p>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            1 day ago
          </span>
        </div>
        <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
          <div className="text-yellow-500 flex items-center justify-center rounded-full bg-yellow-100 shrink-0 size-12 dark:bg-yellow-900 dark:text-yellow-200">
            <span className="material-symbols-outlined">redeem</span>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 text-base font-medium dark:text-white">
              Referral Bonus
            </p>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              Your referral bonus has been credited.
            </p>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            3 days ago
          </span>
        </div>
      </div>
    </section>
  );
};

export default Notifications;
