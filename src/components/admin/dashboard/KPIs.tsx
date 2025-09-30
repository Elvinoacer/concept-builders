'use client';
import React from 'react';
import { adminStats } from '@/lib/dummydata';

const KPIs = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {adminStats.kpis.map((kpi) => {
        const value = adminStats[kpi.key];
        const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
        const changeIsPositive = kpi.change.startsWith('+');

        return (
          <div key={kpi.title} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-4">
              <div className={`bg-${changeIsPositive ? 'green' : 'red'}-100 dark:bg-opacity-20 p-2 rounded-full`}>
                <span className={`material-symbols-outlined text-2xl text-${changeIsPositive ? 'green' : 'red'}-600 dark:text-${changeIsPositive ? 'green' : 'red'}-400`}>
                  {kpi.icon}
                </span>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{kpi.title}</p>
                <p className="text-2xl md:text-3xl font-bold mt-1 dark:text-white">
                  {kpi.prefix}{formattedValue}{kpi.suffix}
                </p>
              </div>
            </div>
            <div className={`flex items-center text-sm mt-3 ${changeIsPositive ? 'text-green-500' : 'text-red-500'}`}>
              <span className="material-symbols-outlined text-base">
                {changeIsPositive ? 'arrow_upward' : 'arrow_downward'}
              </span>
              <span>{kpi.change} vs last month</span>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default KPIs;
