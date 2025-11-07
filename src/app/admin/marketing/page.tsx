"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  FaGoogle,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";
import { FiGlobe } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Copy, Link2 } from "lucide-react";
import ReferralTrendsChart from "@/components/admin/marketing/ReferralTrendsChart";

interface GeneratedUrl {
  platform: string;
  url: string;
}

interface ReferralTrendData {
  date: string;
  source: string;
  count: number;
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "google":
      return <FaGoogle className="text-red-500" />;
    case "instagram":
      return <FaInstagram className="text-pink-500" />;
    case "facebook":
      return <FaFacebookF className="text-blue-600" />;
    case "linkedin":
      return <FaLinkedinIn className="text-blue-700" />;
    case "x":
      return <FaTwitter className="text-black dark:text-white" />;
    case "tiktok":
      return <FaTiktok className="text-black dark:text-white" />;
    case "whatsapp":
      return <FaWhatsapp className="text-green-500" />;
    default:
      return <FiGlobe className="text-gray-500" />;
  }
};

const getPlatformName = (platform: string) => {
  const names: { [key: string]: string } = {
    google: "Google",
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    x: "X (Twitter)",
    tiktok: "TikTok",
    whatsapp: "WhatsApp",
    other: "Other",
  };
  return names[platform] || platform;
};

const MarketingPage = () => {
  const [platform, setPlatform] = useState("google");
  const [generatedUrl, setGeneratedUrl] = useState<GeneratedUrl | null>(null);
  const [generatedUrls, setGeneratedUrls] = useState<GeneratedUrl[]>([]);
  const [referralTrendsData, setReferralTrendsData] = useState<
    ReferralTrendData[]
  >([]);
  const [referralTrendsLoading, setReferralTrendsLoading] = useState(true);
  const [referralTrendsError, setReferralTrendsError] = useState<string | null>(
    null
  );
  const [referralTrendsTimePeriod, setReferralTrendsTimePeriod] =
    useState("Last 6 Months");

  const generateUrl = () => {
    const domain = window.location.origin;
    const url = `${domain}/?referral=${platform}`;
    const newUrl = { platform, url };
    setGeneratedUrl(newUrl);
    setGeneratedUrls([newUrl, ...generatedUrls.slice(0, 9)]); // Keep only last 10 URLs
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  const fetchReferralTrends = useCallback(async () => {
    setReferralTrendsLoading(true);
    setReferralTrendsError(null);
    try {
      const response = await fetch(
        `/api/admin/marketing/referral-trends?timePeriod=${referralTrendsTimePeriod}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch referral trends");
      }
      const data = await response.json();
      setReferralTrendsData(data);
    } catch (err) {
      setReferralTrendsError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching referral trends:", err);
    } finally {
      setReferralTrendsLoading(false);
    }
  }, [referralTrendsTimePeriod]);

  useEffect(() => {
    fetchReferralTrends();
  }, [fetchReferralTrends]);

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Marketing URL Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Create referral links to track your marketing campaigns across
              different platforms.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
            <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {generatedUrls.length} URLs Generated
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 truncate">
                Track your campaign performance
              </p>
            </div>
          </div>
        </div>

        {/* URL Generator Form */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <label
              htmlFor="platform"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select Platform
            </label>
            <div className="relative">
              <select
                id="platform"
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10 transition-colors"
              >
                <option value="google">Google</option>
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="x">X (Twitter)</option>
                <option value="tiktok">TikTok</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="other">Other</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>

          <Button
            onClick={generateUrl}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 h-auto sm:h-[42px] font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            Generate URL
          </Button>
        </div>

        {/* Recent Generated URL */}
        {generatedUrl && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
              Most Recent URL
            </p>
            <div className="flex flex-col xs:flex-row xs:items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-xl flex-shrink-0">
                  {getPlatformIcon(generatedUrl.platform)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {getPlatformName(generatedUrl.platform)}
                  </p>
                  <input
                    type="text"
                    value={generatedUrl.url}
                    readOnly
                    className="w-full bg-transparent text-gray-600 dark:text-gray-300 text-xs sm:text-sm focus:outline-none mt-1 truncate"
                  />
                </div>
              </div>
              <Button
                onClick={() => copyToClipboard(generatedUrl.url)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 shrink-0 px-4 py-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy</span>
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* How to Use Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          How to Use
        </h2>
        <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base space-y-3">
          <p>
            Use these generated URLs in your social media posts, ads, or any
            other marketing materials.
          </p>
          <p>
            When a user clicks on one of these links, the referral source will
            be tracked in your analytics, allowing you to measure the
            effectiveness of each campaign.
          </p>
        </div>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                Track Performance
              </h3>
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Monitor which platforms drive the most traffic
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-green-900 dark:text-green-100">
                Optimize Campaigns
              </h3>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">
              Focus on high-performing channels
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <h3 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                Measure ROI
              </h3>
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Understand your marketing return on investment
            </p>
          </div>
        </div>
      </div>

      {/* Generated URLs List */}
      {generatedUrls.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Generated URLs
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
              {generatedUrls.length} total
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {generatedUrls.map((url, index) => (
              <div
                key={index}
                className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xl flex-shrink-0">
                    {getPlatformIcon(url.platform)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                      {getPlatformName(url.platform)}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs truncate mt-1">
                      {url.url}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => copyToClipboard(url.url)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 shrink-0 px-3 py-2 text-xs"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Referral Trends Chart Section */}
      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Referral Trends
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Track performance across different platforms over time
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <span className="truncate">{referralTrendsTimePeriod}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem
                onClick={() => setReferralTrendsTimePeriod("Today")}
              >
                Today
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setReferralTrendsTimePeriod("Last 7 Days")}
              >
                Last 7 Days
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setReferralTrendsTimePeriod("Last 1 Month")}
              >
                Last 1 Month
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setReferralTrendsTimePeriod("Last 6 Months")}
              >
                Last 6 Months
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setReferralTrendsTimePeriod("Last 1 Year")}
              >
                Last 1 Year
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setReferralTrendsTimePeriod("All Time")}
              >
                All Time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Chart Container */}
        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 min-h-[300px]">
          {referralTrendsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                  Loading referral trends...
                </p>
              </div>
            </div>
          ) : referralTrendsError ? (
            <div className="flex items-center justify-center h-64 text-center">
              <div className="max-w-sm">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-500 text-lg">!</span>
                </div>
                <p className="text-red-500 dark:text-red-400 font-medium mb-2">
                  Failed to load data
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {referralTrendsError}
                </p>
                <Button
                  variant="outline"
                  onClick={fetchReferralTrends}
                  className="mt-3"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-64 sm:h-80">
              <ReferralTrendsChart data={referralTrendsData} />
            </div>
          )}
        </div>

        {/* Chart Legend Info */}
        {!referralTrendsLoading && !referralTrendsError && (
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Hover over data points to see detailed metrics
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketingPage;
