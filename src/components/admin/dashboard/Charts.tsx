'use client';
import React from 'react';
import { adminStats } from '@/lib/admin';

const Charts = () => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold dark:text-white">Sales Performance</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Last 6 Months</p>
          </div>
          <p className="text-3xl font-bold dark:text-white">${adminStats.totalSales.toLocaleString()}</p>
        </div>
        <div className="h-80">
          <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 500 300" width="100%" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 280 H460" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="2"></path>
            <path d="M40 20 V280" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="2"></path>
            <path d="M40 250 C 80 200, 120 150, 160 180 S 240 250, 280 200 S 360 100, 400 120 S 440 180, 460 150" fill="none" stroke="url(#salesGradient)" strokeLinecap="round" strokeWidth="3"></path>
            <defs>
              <linearGradient id="salesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <g fill="rgba(17, 147, 212, 0.1)">
              <path d="M40 280 V 250 C 80 200, 120 150, 160 180 S 240 250, 280 200 S 360 100, 400 120 S 440 180, 460 150 V 280 Z"></path>
            </g>
            <g className="text-sm fill-gray-400 dark:fill-gray-500">
              {adminStats.monthlySales.map((d, i) => (
                <text key={i} x={60 + i * 70} y="295">{d.month}</text>
              ))}
              <text x="5" y="280">0</text>
              <text x="5" y="205">50k</text>
              <text x="5" y="130">100k</text>
              <text x="5" y="55">150k</text>
            </g>
          </svg>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold dark:text-white">Client Acquisition</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Last 6 Months</p>
          </div>
          <p className="text-3xl font-bold dark:text-white">120</p>
        </div>
        <div className="h-80 flex items-end justify-around">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 bg-gray-100 dark:bg-gray-700 rounded-t-md" style={{ height: '20%' }}></div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Jan</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-t-md" style={{ height: '80%' }}></div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Feb</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 bg-gray-100 dark:bg-gray-700 rounded-t-md" style={{ height: '10%' }}></div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Mar</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-t-md" style={{ height: '40%' }}></div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Apr</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 bg-gray-100 dark:bg-gray-700 rounded-t-md" style={{ height: '20%' }}></div>
            <p className="text-xs text-gray-400 dark:text-gray-500">May</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-t-md" style={{ height: '60%' }}></div>
            <p className="text-xs text-gray-400 dark:text-gray-500">Jun</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Charts;