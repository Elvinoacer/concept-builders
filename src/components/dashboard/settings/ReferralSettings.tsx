'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Copy, Check, Loader2 } from 'lucide-react'; // Import Lucide icons

interface ReferralInfo {
  referralCode: string;
  referredByCode: string | null;
  referralBonus: number;
  referralBonusConverted: number;
  _count: { referredUsers: number };
}

const ReferralSettings = () => {
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingCode, setApplyingCode] = useState(false);
  const [refereeCodeInput, setRefereeCodeInput] = useState('');

  const fetchReferralInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings/referral');
      if (!response.ok) {
        throw new Error('Failed to fetch referral info');
      }
      const data: ReferralInfo = await response.json();
      setReferralInfo(data);
    } catch (error: any) {
      console.error('Error fetching referral info:', error);
      toast.error(`Failed to load referral information: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  const handleCopy = () => {
    if (referralInfo?.referralCode) {
      navigator.clipboard.writeText(referralInfo.referralCode);
      toast.success('Referral code copied to clipboard!');
    }
  };

  const handleApplyRefereeCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyingCode(true);
    try {
      const response = await fetch('/api/settings/referral', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refereeCode: refereeCodeInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply referral code');
      }

      toast.success('Referral code applied successfully!');
      setRefereeCodeInput('');
      fetchReferralInfo(); // Re-fetch to update referral info
    } catch (error: any) {
      console.error('Error applying referee code:', error);
      toast.error(`Failed to apply referral code: ${error.message}`);
    } finally {
      setApplyingCode(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        Loading referral information...
      </div>
    );
  }

  if (!referralInfo) {
    return (
      <div className="text-center text-red-500 dark:text-red-400">
        Failed to load referral information.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
        Referral Program
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
        Share your referral link and earn rewards.
      </p>
      <div className="mt-4 md:mt-6 space-y-6">
        {/* Your Referral Code */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Referral Code
          </p>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              readOnly
              value={referralInfo.referralCode}
              className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 sm:text-base h-12 px-5"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <Copy className="w-4 h-4 mr-2" /> Copy
            </button>
          </div>
          {referralInfo.referredByCode && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              You were referred by: <strong>{referralInfo.referredByCode}</strong>
            </p>
          )}
        </div>

        {/* Referral Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Referred Users</p>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              {referralInfo._count.referredUsers}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Referral Bonus (Pending)</p>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Ksh {referralInfo.referralBonus.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Bonus Converted (KES)</p>
            <p className="mt-1 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Ksh {referralInfo.referralBonusConverted.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Apply Referee Code */}
        {!referralInfo.referredByCode && (
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Have a referral code?
            </p>
            <form onSubmit={handleApplyRefereeCode} className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                placeholder="Enter referee code"
                value={refereeCodeInput}
                onChange={(e) => setRefereeCodeInput(e.target.value)}
                className="flex-1 block w-full rounded-none rounded-l-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 sm:text-base h-12 px-5"
                disabled={applyingCode}
                required
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-700 bg-blue-600 text-white text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                disabled={applyingCode}
              >
                {applyingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />} Apply
              </button>
            </form>
          </div>
        )}

        {/* Withdrawal Section (Future Enhancement) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Withdrawal</p>
          <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
            Withdrawal functionality will be available once your earned bonus is converted to KES after referred users make a purchase.
          </p>
          {/* Future: Withdrawal button and form */}
        </div>

      </div>
    </div>
  );
};

export default ReferralSettings;

