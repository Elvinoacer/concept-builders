"use client";
import React from "react";
import Image from "next/image";
import { ModeToggle } from "../../ui/mode-toggle";
import { useSession } from "next-auth/react";

const AdminHeader = (props: {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (arg: boolean) => void;
}) => {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-30 flex w-full bg-gradient-to-r from-blue-50 to-cyan-50 drop-shadow-1 dark:from-gray-800 dark:to-gray-900 dark:drop-shadow-none border-b border-blue-200 dark:border-gray-700">
      <div className="flex flex-grow items-center justify-between px-4 py-4 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-40 block rounded-lg border border-blue-200 bg-blue-50 p-2 shadow-sm transition-all duration-200 hover:bg-blue-100 hover:shadow-md dark:border-blue-800 dark:bg-gray-800 dark:hover:bg-gray-700 md:hidden"
          >
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
              menu
            </span>
          </button>

          {/* Welcome message with animated waving hand */}
          <div className="flex items-center gap-2">
            <span className="text-2xl hidden sm:block">
              <span className="inline-block animate-wave origin-[70%_70%] text-blue-500 dark:text-blue-400">
                👋
              </span>
              <style jsx>{`
                @keyframes wave {
                  0% {
                    transform: rotate(0deg);
                  }
                  10% {
                    transform: rotate(14deg);
                  }
                  20% {
                    transform: rotate(-8deg);
                  }
                  30% {
                    transform: rotate(14deg);
                  }
                  40% {
                    transform: rotate(-4deg);
                  }
                  50% {
                    transform: rotate(10deg);
                  }
                  60% {
                    transform: rotate(0deg);
                  }
                  100% {
                    transform: rotate(0deg);
                  }
                }
                .animate-wave {
                  animation: wave 2.5s infinite;
                  transform-origin: 70% 70%;
                }
              `}</style>
            </span>
            <div className="hidden sm:block">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Welcome back,
              </p>
              <div>
                  {status === "loading" ? (
                    <div className="h-4 w-24 bg-blue-200 dark:bg-blue-800 rounded animate-pulse" />
                  ) : (
                    <p className="font-semibold text-blue-800 dark:text-blue-300">
                      {session?.user?.name?.split(" ")[0] || "Admin"}
                    </p>
                  )}
                </div>
            </div>
          </div>
        </div>

        {/* Centered dashboard title with blue-cyan gradient */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 hidden md:block">
            dashboard
          </span>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300">
            Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications button */}
          <button className="relative p-2.5 rounded-xl bg-white border border-blue-100 shadow-sm transition-all duration-200 hover:shadow-md hover:bg-blue-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 group">
            <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 group-hover:scale-110 transition-transform">
              notifications
            </span>
            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 ring-2 ring-white dark:ring-gray-800"></span>
          </button>

          <ModeToggle />

          {/* User profile with blue-cyan styling */}
          <div className="flex items-center gap-3">
            {status === "loading" ? (
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 animate-pulse" />
            ) : (
              <div className="relative">
                <Image
                  src={
                    session?.user?.image ||
                    "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
                  }
                  alt="User Avatar"
                  width={44}
                  height={44}
                  className="rounded-full border-2 border-blue-200 shadow-sm hover:border-blue-300 transition-colors duration-200"
                />
                {/* Online indicator */}
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 border-2 border-white dark:border-gray-800"></span>
              </div>
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
