"use client";

import { useState } from 'react';
import { toast } from 'sonner';

interface GeneratedUrl {
  platform: string;
  url: string;
}

const MarketingPage = () => {
  const [platform, setPlatform] = useState('google');
  const [generatedUrl, setGeneratedUrl] = useState<GeneratedUrl | null>(null);
  const [generatedUrls, setGeneratedUrls] = useState<GeneratedUrl[]>([]);

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
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Generated URLs</h2>
          <ul className="space-y-4">
            {generatedUrls.map((url, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{url.platform}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{url.url}</p>
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
    </div>
  );
};

export default MarketingPage;
