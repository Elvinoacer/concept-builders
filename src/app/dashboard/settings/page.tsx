// app/dashboard/settings/page.jsx
"use client";
import React, { useState } from "react";
import SettingsHeader from "@/components/dashboard/settings/SettingsHeader";
import SettingsTabs from "@/components/dashboard/settings/SettingsTabs";
import ProfileSettings from "@/components/dashboard/settings/ProfileSettings";
import PasswordSettings from "@/components/dashboard/settings/PasswordSettings";
import ReferralSettings from "@/components/dashboard/settings/ReferralSettings";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "password":
        return <PasswordSettings />;
      case "referrals":
        return <ReferralSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <SettingsHeader />
      <div className="mt-4 md:mt-8">
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4 md:mt-8 bg-white dark:bg-gray-900 p-4 md:p-8 rounded-xl border border-gray-200 dark:border-gray-800">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
