'use client';
import React from 'react';
import Image from 'next/image';
import { ModeToggle } from '../../ui/mode-toggle';

const AdminHeader = (props: { sidebarOpen: boolean, setSidebarOpen: (arg: boolean) => void}) => {
  return (
    <header className="sticky top-0 z-30 flex w-full bg-white drop-shadow-1 dark:bg-gray-800 dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 md:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-40 block rounded-sm border border-gray-200 bg-white p-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:hidden"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
        <h2 className="hidden md:block text-2xl font-bold dark:text-white">Dashboard</h2>
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"></span>
          </button>
          <ModeToggle />
          <div className="flex items-center gap-3">
            <Image
              src="https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div className="hidden md:block">
              <p className="font-semibold dark:text-white">Admin User</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">admin@concept.build</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
