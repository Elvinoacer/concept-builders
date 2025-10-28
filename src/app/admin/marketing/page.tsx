"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  FaGoogle,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaTiktok,
  FaWhatsapp,
} from 'react-icons/fa';
import { FiGlobe } from 'react-icons/fi';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
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
    case 'google':
      return <FaGoogle className="text-red-500" />;
    case 'instagram':
      return <FaInstagram className="text-pink-500" />;
    case 'facebook':
      return <FaFacebookF className="text-blue-600" />;
    case 'linkedin':
      return <FaLinkedinIn className="text-blue-700" />;
    case 'x':
      return <FaTwitter className="text-black dark:text-white" />;
    case 'tiktok':
      return <FaTiktok className="text-black dark:text-white" />;
    case 'whatsapp':
      return <FaWhatsapp className="text-green-500" />;
    default:
      return <FiGlobe className="text-gray-500" />;
  }
};

const MarketingPage = () => {
  const [platform, setPlatform] = useState('google');
  const [generatedUrl, setGeneratedUrl] = useState<GeneratedUrl | null>(null);
  const [generatedUrls, setGeneratedUrls] = useState<GeneratedUrl[]>([]);
  const [referralTrendsData, setReferralTrendsData] = useState<ReferralTrendData[]>([]);
  const [referralTrendsLoading, setReferralTrendsLoading] = useState(true);
  const [referralTrendsError, setReferralTrendsError] = useState<string | null>(null);
  const [referralTrendsTimePeriod, setReferralTrendsTimePeriod] = useState("Last 6 Months");

  const generateUrl = () => {
    const domain = window.location.origin;
    const url = `${domain}/?referral=${platform}`;
    const newUrl = { platform, url };
    setGeneratedUrl(newUrl);
    setGeneratedUrls([newUrl, ...generatedUrls]);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  const fetchReferralTrends = useCallback(async () => {
    setReferralTrendsLoading(true);
    setReferralTrendsError(null);
    try {
      const response = await fetch(`/api/admin/marketing/referral-trends?timePeriod=${referralTrendsTimePeriod}`);
      if (!response.ok) {
        throw new Error("Failed to fetch referral trends");
      }
      const data = await response.json();
      setReferralTrendsData(data);
    } catch (err) {
      setReferralTrendsError(err instanceof Error ? err.message : "An unknown error occurred");
      console.error("Error fetching referral trends:", err);
    } finally {
      setReferralTrendsLoading(false);
    }
  }, [referralTrendsTimePeriod]);

  useEffect(() => {
    fetchReferralTrends();
  }, [fetchReferralTrends]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Marketing URL Generator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Create referral links to track your marketing campaigns.</p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-auto">
            <label htmlFor="platform" className="sr-only">Platform</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="google">Google</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="x">X</option>
              <option value="tiktok">Tiktok</option>
              <option value="whatsapp">Whatsapp</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button 
            onClick={generateUrl} 
            className="w-full sm:w-auto text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
          >
            Generate URL
          </button>
        </div>

        {generatedUrl && (
          <div className="mt-8">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">Most Recent URL:</p>
            <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <span className="text-xl">{getPlatformIcon(generatedUrl.platform)}</span>
              <input 
                type="text" 
                value={generatedUrl.url} 
                readOnly 
                className="flex-grow bg-transparent text-gray-900 dark:text-white text-sm focus:outline-none"
              />
              <button 
                onClick={() => copyToClipboard(generatedUrl.url)} 
                className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">How to Use</h2>
        <p className="text-gray-600 dark:text-gray-300">Use these generated URLs in your social media posts, ads, or any other marketing materials. When a user clicks on one of these links, the referral source will be tracked in your analytics, allowing you to measure the effectiveness of each campaign.</p>
      </div>

      {generatedUrls.length > 0 && (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Generated URLs</h2>
          <ul className="space-y-4">
            {generatedUrls.map((url, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getPlatformIcon(url.platform)}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{url.platform}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{url.url}</p>
                  </div>
                </div>
                <button 
                  onClick={() => copyToClipboard(url.url)} 
                  className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Referral Trends Chart Section */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Referral Trends</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {referralTrendsTimePeriod} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setReferralTrendsTimePeriod("Today")}>Today</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setReferralTrendsTimePeriod("Last 7 Days")}>Last 7 Days</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setReferralTrendsTimePeriod("Last 1 Month")}>Last 1 Month</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setReferralTrendsTimePeriod("Last 6 Months")}>Last 6 Months</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setReferralTrendsTimePeriod("Last 1 Year")}>Last 1 Year</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setReferralTrendsTimePeriod("All Time")}>All Time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {referralTrendsLoading ? (
          <div>Loading referral trends...</div>
        ) : referralTrendsError ? (
          <div className="text-red-500">Error: {referralTrendsError}</div>
        ) : (
          <ReferralTrendsChart data={referralTrendsData} />
        )}
      </div>
    </div>
  );
};

export default MarketingPage;
