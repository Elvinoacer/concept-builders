'use client';

import React from 'react';

const Marquee = () => {
  const marqueeItems = [
    'Architectural Excellence',
    'Innovative Designs',
    'Sustainable Building',
    'Client-Centric Approach',
    'Quality Craftsmanship',
    'Modern Solutions',
  ];

  return (
    <section className="py-4 bg-gray-100 dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="relative flex">
        <div className="flex animate-marquee whitespace-nowrap">
          {marqueeItems.map((item, index) => (
            <div key={index} className="flex items-center mx-6">
              <span className="material-symbols-outlined text-blue-500 text-xl">verified</span>
              <span className="ml-2 text-lg font-medium text-gray-700 dark:text-gray-300">{item}</span>
            </div>
          ))}
        </div>
        <div className="absolute top-0 flex animate-marquee2 whitespace-nowrap">
          {marqueeItems.map((item, index) => (
            <div key={index} className="flex items-center mx-6">
              <span className="material-symbols-outlined text-blue-500 text-xl">verified</span>
              <span className="ml-2 text-lg font-medium text-gray-700 dark:text-gray-300">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marquee;
