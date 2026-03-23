"use client";
import PasswordSettings from "@/components/dashboard/settings/PasswordSettings";
import ProfileSettings from "@/components/dashboard/settings/ProfileSettings";
import ReferralSettings from "@/components/dashboard/settings/ReferralSettings";
import SettingsTabs from "@/components/dashboard/settings/SettingsTabs";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");

  // Effect to read tab from URL on mount
  useEffect(() => {
    const tab = searchParams.get("tab");
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
    <div className="min-h-screen bg-ink px-4 min-[375px]:px-5 sm:px-6 md:px-8">
      <div className="max-w-4xl mx-auto py-6 sm:py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Settings className="w-6 h-6 text-gold" />
            </div>
            <div>
              <h1
                className="text-3xl xs:text-4xl sm:text-5xl font-bold text-cream leading-tight"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                Settings
              </h1>
              <p className="text-cream-dim mt-2 text-base sm:text-lg">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="bg-card rounded-2xl border border-cb-border overflow-hidden">
          {/* Tabs */}
          <SettingsTabs activeTab={activeTab} setActiveTab={handleTabChange} />

          {/* Content Panel */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            id={`panel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="p-4 sm:p-6 md:p-8"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
