"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ui/mode-toggle";

const DashboardHeader = () => {
  const navLinks = [
    { href: "#", label: "Explore" },
    { href: "#", label: "Design" },
    { href: "#", label: "Build" },
    { href: "#", label: "Finance" },
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 px-10 h-16 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div></div>
      <div className="flex flex-1 justify-end items-center gap-6">
        <nav className="flex items-center gap-8">
          {navLinks.map((link, index) => (
            <Link
              key={index}
              className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-blue-600 to-cyan-400 text-sm font-medium dark:text-gray-300 dark:hover:text-blue-400"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
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
