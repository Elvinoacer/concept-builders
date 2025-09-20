// components/dashboard/settings/ProfileSettings.jsx
"use client";
import React from "react";
import { userProfile } from "@/lib/settings";

const ProfileSettings = () => {
  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
        Personal Information
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
        Update your personal details here.
      </p>
      <form className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 max-w-2xl">
        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="full-name"
          >
            Full Name
          </label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-11 px-4"
            id="full-name"
            name="full-name"
            type="text"
            defaultValue={userProfile.fullName}
          />
        </div>
        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-11 px-4"
            id="email"
            name="email"
            type="email"
            defaultValue={userProfile.email}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="phone-number"
          >
            Phone Number
          </label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-11 px-4"
            id="phone-number"
            name="phone-number"
            type="tel"
            defaultValue={userProfile.phoneNumber}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="company"
          >
            Company
          </label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 sm:text-base h-12 px-5"
            id="company"
            name="company"
            type="text"
            defaultValue={userProfile.company}
          />
        </div>
        <div className="md:col-span-2 pt-4">
          <button
            className="flex items-center justify-center rounded-md h-10 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-sm font-semibold shadow-sm hover:from-blue-700 hover:to-cyan-500"
            type="submit"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
