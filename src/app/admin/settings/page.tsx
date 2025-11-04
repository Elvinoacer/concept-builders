"use client";

import BannerManagement from "@/components/admin/settings/BannerManagement";
import FaqManagement from "@/components/admin/settings/FaqManagement";
import FeaturedDesignManagement from "@/components/admin/settings/FeaturedDesignManagement";
import MarqueeManagement from "@/components/admin/settings/MarqueeManagement";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("banners");

  const renderContent = () => {
    switch (activeTab) {
      case "banners":
        return <BannerManagement />;
      case "featured-designs":
        return <FeaturedDesignManagement />;
      case "marquee":
        return <MarqueeManagement />;
      case "faq":
        return <FaqManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Settings
      </h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="lg:w-1/4">
          <Card className="p-0">
            <nav className="flex flex-col p-4 space-y-1">
              <Button
                variant={activeTab === "banners" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("banners")}
                className="w-full justify-start"
              >
                Banners
              </Button>
              <Button
                variant={
                  activeTab === "featured-designs" ? "secondary" : "ghost"
                }
                onClick={() => setActiveTab("featured-designs")}
                className="w-full justify-start"
              >
                Featured Designs
              </Button>
              <Button
                variant={activeTab === "marquee" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("marquee")}
                className="w-full justify-start"
              >
                Marquee
              </Button>
              <Button
                variant={activeTab === "faq" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("faq")}
                className="w-full justify-start"
              >
                FAQ Management
              </Button>
            </nav>
          </Card>
        </aside>
        <main className="lg:w-3/4">{renderContent()}</main>
      </div>
    </div>
  );
};

export default SettingsPage;
