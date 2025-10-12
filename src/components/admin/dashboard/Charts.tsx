'use client';
import React from 'react';

const Charts = ({ stats, monthlySales, clientAcquisition }) => {
  const maxSales = Math.max(...monthlySales.map((s) => s.sales));

  const chartData = monthlySales.map((sale, index) => {
    const y = 280 - (sale.sales / maxSales) * 260;
    const x = 60 + index * 70;
    return { x, y };
  });

  const pathData = chartData.reduce((acc, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${acc} L ${point.x} ${point.y}`;
  }, '');

  const totalClients = clientAcquisition.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base md:text-lg font-semibold dark:text-white">Sales Performance</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Last 6 Months</p>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white">${stats.totalSales.toLocaleString()}</p>
        </div>
        <div className="h-64 md:h-80 overflow-x-auto">
          <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 500 300" width="100%" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: 500 }}>
            <path d="M40 280 H460" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="2"></path>
            <path d="M40 20 V280" className="stroke-gray-200 dark:stroke-gray-700" strokeWidth="2"></path>
            <path d={pathData} fill="none" stroke="url(#salesGradient)" strokeLinecap="round" strokeWidth="3"></path>
            <defs>
              <linearGradient id="salesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
            </defs>
            <g fill="rgba(17, 147, 212, 0.1)">
              <path d={`${pathData} L ${chartData[chartData.length -1].x} 280 L ${chartData[0].x} 280 Z`} />
            </g>
            <g className="text-sm fill-gray-400 dark:fill-gray-500">
              {monthlySales.map((d, i) => (
                <text key={i} x={60 + i * 70} y="295">{d.month}</text>
              ))}
              <text x="5" y="280">0</text>
              <text x="5" y="205">{maxSales / 2}</text>
              <text x="5" y="130">{maxSales}</text>
              <text x="5" y="55">{maxSales * 1.5}</text>
            </g>
          </svg>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-md p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-base md:text-lg font-semibold dark:text-white">Client Acquisition</h3>
            <p className="text-gray-400 dark:text-gray-500 text-sm">Last 6 Months</p>
          </div>
          <p className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white">{totalClients}</p>
        </div>
        <div className="h-64 md:h-80 flex items-end justify-around">
          {clientAcquisition.map((source, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-6 sm:w-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-t-md" style={{ height: `${(source.count / totalClients) * 100}%` }}></div>
              <p className="text-xs text-gray-400 dark:text-gray-500">{source.source}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Charts;