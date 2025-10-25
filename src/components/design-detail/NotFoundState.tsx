"use client";

import React from 'react';
import Link from 'next/link';

const NotFoundState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <div className="text-center">
        <svg
          className="w-16 h-16 mx-auto text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
          Design Not Found
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          We couldn't find the design you're looking for.
        </p>
        <Link href="/designs" className="mt-6 inline-block px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Explore Other Designs
        </Link>
      </div>
    </div>
  );
};

export default NotFoundState;
