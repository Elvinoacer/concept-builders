'use client';
import React from 'react';
import Image from 'next/image';
import { ModeToggle } from '../../ui/mode-toggle'; // Added import

const AdminHeader = () => {
  return (
    <header className="flex items-center justify-between p-6 border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-2xl font-bold dark:text-white">Dashboard</h2>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"></span>
        </button>
        <ModeToggle /> {/* Added ModeToggle */}
        <div className="flex items-center gap-3">
          <Image
            src="https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold dark:text-white">Admin User</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">admin@concept.build</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
