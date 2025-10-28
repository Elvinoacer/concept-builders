'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { useSearch } from '@/lib/SearchContext';
import { useSession } from 'next-auth/react';

const DashboardHeader = ({ 
  setIsSidebarOpen
}: { 
  setIsSidebarOpen: (isOpen: boolean) => void
}) => {
  const { searchQuery, setSearchQuery, resultsRef } = useSearch();
  const { data: session } = useSession();
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/notifications/unread-count");
          if (response.ok) {
            const data = await response.json();
            setUnreadNotificationCount(data.unreadCount);
          }
        } catch (error) {
          console.error("Failed to fetch unread notification count:", error);
        }
      }
    };

    fetchUnreadCount();

    // Poll for new notifications every 30 seconds (adjust as needed)
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [session]);

  return (
    <header className="flex-shrink-0 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 px-4 sm:px-6 lg:px-8 h-16 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-gray-600 dark:text-gray-300" 
          onClick={() => setIsSidebarOpen(true)}
        >
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
        <form className="relative hidden sm:block" onSubmit={handleSearchSubmit}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/cart" className="text-slate-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">
              <span className="material-symbols-outlined">shopping_cart</span>
            </Link>
          </motion.div>
        <Link href="/dashboard/notifications" className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
            <span className="material-symbols-outlined text-2xl">notifications</span>
            {unreadNotificationCount > 0 && (
              <div className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 border-2 border-white dark:border-gray-800"></div>
            )}
        </Link>
        {session?.user?.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name || 'User Avatar'}
            width={40}
            height={40}
            className="rounded-full border-2 border-gray-200 dark:border-gray-600"
          />
        ) : session?.user?.name ? (
          <span className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-sm font-bold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
            {session.user.name.charAt(0).toUpperCase()}
          </span>
        ) : (
          <Image
            src="https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-man-avatar-image-for-profile-png-image_9197908.png"
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full border-2 border-gray-200 dark:border-gray-600"
          />
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
