'use client';
import React from 'react';
import Image from 'next/image';
import { ModeToggle } from '../../ui/mode-toggle';
import { useSession } from 'next-auth/react';

const AdminHeader = (props: { sidebarOpen: boolean, setSidebarOpen: (arg: boolean) => void, isDesktopSidebarOpen: boolean, setIsDesktopSidebarOpen: (arg: boolean) => void}) => {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-30 flex w-full bg-white drop-shadow-1 dark:bg-gray-800 dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
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
          <button
            onClick={() => props.setIsDesktopSidebarOpen(!props.isDesktopSidebarOpen)}
            className="hidden md:block"
          >
            <span className="material-symbols-outlined text-gray-900 dark:text-white">
              {props.isDesktopSidebarOpen ? 'close' : 'menu'}
            </span>
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
            {status === 'loading' ? (
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <Image
                src={session?.user?.image || "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <div className="hidden md:block">
              {status === 'loading' ? (
                <div>
                  <div className="h-4 w-24 rounded bg-gray-200 animate-pulse mb-1" />
                  <div className="h-3 w-32 rounded bg-gray-200 animate-pulse" />
                </div>
              ) : (
                <div>
                  <p className="font-semibold dark:text-white">{session?.user?.name}</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">{session?.user?.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
