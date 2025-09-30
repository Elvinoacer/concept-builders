// components/dashboard/settings/PasswordSettings.jsx
"use client";
import React, { useState } from "react";
import { passwordFields } from "@/lib/dummydata/settings-data";

const PasswordSettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const stateMap = {
    "current-password": {
      state: showCurrentPassword,
      setter: setShowCurrentPassword,
    },
    "new-password": {
      state: showNewPassword,
      setter: setShowNewPassword,
    },
    "confirm-password": {
      state: showConfirmPassword,
      setter: setShowConfirmPassword,
    },
  };

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
        Change Password
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
        Update your password here.
      </p>
      <form className="mt-4 md:mt-6 grid grid-cols-1 gap-x-6 gap-y-6 max-w-2xl">
        {passwordFields.map(({ id, label }) => (
          <div key={id} className="relative">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor={id}
            >
              {label}
            </label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-11 px-4 pr-12"
              id={id}
              name={id}
              type={stateMap[id].state ? "text" : "password"}
            />
            <button
              type="button"
              onClick={() => stateMap[id].setter(!stateMap[id].state)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400 top-4 md:top-6"
            >
              <span className="material-symbols-outlined">
                {stateMap[id].state ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        ))}
        <div className="pt-4">
          <button
            className="flex items-center justify-center rounded-md h-10 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-sm font-semibold shadow-sm hover:from-blue-700 hover:to-cyan-500"
            type="submit"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordSettings;
