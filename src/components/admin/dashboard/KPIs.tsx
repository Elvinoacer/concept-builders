'use client';
import React from 'react';
import { adminStats } from '@/lib/dummydata';

const KPIs = () => {
  return (
    <section className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4 md:mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Sales</p>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 dark:text-white">${adminStats.totalSales.toLocaleString()}</p>
        <div className="flex items-center text-sm mt-2 text-green-500">
          <span className="material-symbols-outlined text-base">arrow_upward</span>
          <span>10% vs last month</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Trending Product</p>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 dark:text-white">{adminStats.trendingProducts[0].name}</p>
        <div className="flex items-center text-sm mt-2 text-green-500">
          <span className="material-symbols-outlined text-base">arrow_upward</span>
          <span>5% sales increase</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Top Traffic Source</p>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 dark:text-white">{adminStats.trafficSources[0].source}</p>
        <div className="flex items-center text-sm mt-2 text-green-500">
          <span className="material-symbols-outlined text-base">arrow_upward</span>
          <span>8% vs last month</span>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Conversion Rate</p>
        <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 dark:text-white">{adminStats.conversionRate}%</p>
        <div className="flex items-center text-sm mt-2 text-red-500">
          <span className="material-symbols-outlined text-base">arrow_downward</span>
          <span>2% vs last month</span>
        </div>
      </div>
    </section>
  );
};

export default KPIs;
