"use client";

import BannerManagement from "@/components/admin/settings/BannerManagement";
import FeaturedDesignManagement from "@/components/admin/settings/FeaturedDesignManagement";
import MarqueeManagement from "@/components/admin/settings/MarqueeManagement";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  const renderContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your site's general information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" placeholder="Concept Builders" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteLogo">Site Logo URL</Label>
                <Input
                  id="siteLogo"
                  type="url"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => toast.success("General settings saved!")}>
                Save General Settings
              </Button>
            </CardFooter>
          </Card>
        );
      case "payments":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Settings</CardTitle>
              <CardDescription>
                Configure your payment processors.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paypalClientId">PayPal Client ID</Label>
                <Input
                  id="paypalClientId"
                  placeholder="YOUR_PAYPAL_CLIENT_ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="intasendApiKey">Intasend API Key</Label>
                <Input
                  id="intasendApiKey"
                  placeholder="YOUR_INTASEND_API_KEY"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => toast.success("Payment settings saved!")}>
                Save Payment Settings
              </Button>
            </CardFooter>
          </Card>
        );
      case "email":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Manage your email service configuration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resendApiKey">Resend API Key</Label>
                <Input id="resendApiKey" placeholder="YOUR_RESEND_API_KEY" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => toast.success("Email settings saved!")}>
                Save Email Settings
              </Button>
            </CardFooter>
          </Card>
        );
      case "storage":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
              <CardDescription>
                Configure your DigitalOcean Spaces storage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="doSpacesKey">DigitalOcean Spaces Key</Label>
                <Input id="doSpacesKey" placeholder="YOUR_DO_SPACES_KEY" />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button onClick={() => toast.success("Storage settings saved!")}>
                Save Storage Settings
              </Button>
            </CardFooter>
          </Card>
        );
      case "banners":
        return <BannerManagement />;
      case "featured-designs":
        return <FeaturedDesignManagement />;
      case "marquee":
        return <MarqueeManagement />;
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
                variant={activeTab === "general" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("general")}
                className="w-full justify-start"
              >
                General
              </Button>
              <Button
                variant={activeTab === "payments" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("payments")}
                className="w-full justify-start"
              >
                Payments
              </Button>
              <Button
                variant={activeTab === "email" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("email")}
                className="w-full justify-start"
              >
                Email
              </Button>
              <Button
                variant={activeTab === "storage" ? "secondary" : "ghost"}
                onClick={() => setActiveTab("storage")}
                className="w-full justify-start"
              >
                Storage
              </Button>
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
            </nav>
          </Card>
        </aside>
        <main className="lg:w-3/4">{renderContent()}</main>
      </div>
    </div>
  );
};

export default SettingsPage;
