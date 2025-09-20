// components/dashboard/settings/SettingsHeader.jsx
"use client";
import React from "react";

const SettingsHeader = () => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
        Settings
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
        Manage your account settings and preferences.
      </p>
    </div>
  );
};

export default SettingsHeader;
