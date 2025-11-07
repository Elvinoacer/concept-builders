"use client";

import BannerManagement from "@/components/admin/settings/BannerManagement";
import FaqManagement from "@/components/admin/settings/FaqManagement";
import FeaturedDesignManagement from "@/components/admin/settings/FeaturedDesignManagement";
import MarqueeManagement from "@/components/admin/settings/MarqueeManagement";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Star,
  Scissors,
  HelpCircle,
  ChevronRight,
  Menu,
  X,
  Settings,
} from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("banners");
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const tabs = [
    {
      id: "banners",
      label: "Banners",
      icon: Image,
      description: "Manage homepage banners and promotions",
      component: <BannerManagement />,
    },
    {
      id: "featured-designs",
      label: "Featured Designs",
      icon: Star,
      description: "Curate featured design selections",
      component: <FeaturedDesignManagement />,
    },
    {
      id: "marquee",
      label: "Marquee",
      icon: Scissors,
      description: "Configure scrolling text announcements",
      component: <MarqueeManagement />,
    },
    {
      id: "faq",
      label: "FAQ Management",
      icon: HelpCircle,
      description: "Manage frequently asked questions",
      component: <FaqManagement />,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  const renderContent = () => {
    return activeTabData?.component || null;
  };

  // Mobile Tab Selector
  const MobileTabSelector = () => (
    <div className="lg:hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between mb-4 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeTabData?.label}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="w-10 h-10 rounded-xl"
        >
          {showMobileMenu ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileMenu(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 z-50 lg:hidden shadow-2xl"
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Settings Menu
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileMenu(false)}
                  className="w-8 h-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Menu Items */}
              <nav className="p-4 space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowMobileMenu(false);
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
                          : "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activeTab === tab.id
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                            : "bg-white text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{tab.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {tab.description}
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 flex-shrink-0 ${
                          activeTab === tab.id
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400"
                        }`}
                      />
                    </motion.button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block lg:w-80 xl:w-96"
    >
      <Card className="p-0 border-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Settings
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Manage your platform configuration
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 group ${
                  activeTab === tab.id
                    ? "bg-blue-50 border border-blue-200 shadow-sm text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:group-hover:bg-gray-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">
                    {tab.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {tab.description}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    activeTab === tab.id
                      ? "text-blue-600 dark:text-blue-400 rotate-90"
                      : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  }`}
                />
              </motion.button>
            );
          })}
        </nav>
      </Card>
    </motion.aside>
  );

  // Mobile Tab Indicator (for horizontal scroll on mobile alternative)
  const MobileTabIndicator = () => (
    <div className="lg:hidden mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-3 xs:p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Mobile Navigation */}
        <MobileTabSelector />

        {/* Alternative Mobile Tab Indicator (uncomment if you prefer this approach) */}
        {/* <MobileTabIndicator /> */}

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <DesktopSidebar />

          {/* Main Content */}
          <motion.main
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 min-w-0"
          >
            {/* Content Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center lg:hidden">
                  {activeTabData && (
                    <activeTabData.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {activeTabData?.label}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base max-w-3xl">
                {activeTabData?.description}
              </p>
            </div>

            {/* Content */}
            <Card className="border-0 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 xs:p-6 sm:p-8">{renderContent()}</div>
            </Card>

            {/* Bottom Spacing */}
            <div className="h-6 sm:h-8 lg:h-12"></div>
          </motion.main>
        </div>
      </div>

      {/* Custom styles for scrollbar hiding */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;
