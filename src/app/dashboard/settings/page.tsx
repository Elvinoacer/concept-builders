'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useRouter and useSearchParams
import SettingsTabs from '@/components/dashboard/settings/SettingsTabs';
import ProfileSettings from '@/components/dashboard/settings/ProfileSettings';
import PasswordSettings from '@/components/dashboard/settings/PasswordSettings';
import ReferralSettings from '@/components/dashboard/settings/ReferralSettings';

const SettingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');

  // Effect to read tab from URL on mount
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Function to handle tab change and update URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/dashboard/settings?tab=${tab}`, undefined, { shallow: true });
  };

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
        <SettingsTabs activeTab={activeTab} setActiveTab={handleTabChange} />
        <div
          id={`panel-${activeTab}`} // ID for the tab panel
          role="tabpanel" // ARIA role for tab panel
          aria-labelledby={`tab-${activeTab}`} // Link to the tab button
          className="mt-4 md:mt-8 bg-white dark:bg-gray-800 p-4 md:p-8 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
