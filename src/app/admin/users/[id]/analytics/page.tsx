"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const UserAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchAnalytics = async () => {
        const response = await fetch(`/api/users/${id}/analytics`);
        const data = await response.json();
        setAnalytics(data);
        setLoading(false);
      };
      fetchAnalytics();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 p-4 md:p-8 dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-4">User Analytics</h1>
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Total Spending</h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">${analytics.totalSpending}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Total Downloads</h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.totalDownloads}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Referral Information</h2>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{analytics.referralCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAnalyticsPage;
