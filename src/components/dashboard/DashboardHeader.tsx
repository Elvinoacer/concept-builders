'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ModeToggle } from '@/components/ui/mode-toggle';

const DashboardHeader = () => {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 px-10 h-16 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            type="text"
            placeholder="Search for designs..."
            className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex flex-1 justify-end items-center gap-6">
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Link href="/dashboard/notifications">
            <button className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
              <span className="material-symbols-outlined text-2xl">
                notifications
              </span>
              <div className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 border-2 border-white dark:border-gray-800"></div>
            </button>
          </Link>
          <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            <span className="material-symbols-outlined text-2xl">
              help_outline
            </span>
          </button>
          <Image
            src="https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
