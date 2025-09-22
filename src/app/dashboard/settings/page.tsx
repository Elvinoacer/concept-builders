'use client';
import React, { useState } from 'react';
import SettingsTabs from '@/components/dashboard/settings/SettingsTabs';
import ProfileSettings from '@/components/dashboard/settings/ProfileSettings';
import PasswordSettings from '@/components/dashboard/settings/PasswordSettings';
import ReferralSettings from '@/components/dashboard/settings/ReferralSettings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'password':
        return <PasswordSettings />;
      case 'referrals':
        return <ReferralSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          Settings
        </h2>
        <p className="text-gray-500 mt-0.5 md:mt-1 dark:text-gray-400">
          Manage your account settings.
        </p>
      </header>
      <div className="max-w-4xl mx-auto">
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-4 md:mt-8 bg-white dark:bg-gray-800 p-4 md:p-8 rounded-xl border border-gray-200 dark:border-gray-700">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
