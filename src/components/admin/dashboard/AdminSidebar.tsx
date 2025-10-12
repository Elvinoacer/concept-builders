'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/designs', label: 'Designs', icon: 'folder' },
  { href: '/admin/categories', label: 'Categories', icon: 'category' },
  { href: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
  { href: '/admin/users', label: 'Users', icon: 'group' },
  { href: '/admin/content', label: 'Content', icon: 'article' },
  { href: '/admin/costs', label: 'Costs', icon: 'attach_money' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
  { href: '/admin/marketing', label: 'Marketing', icon: 'campaign' },
];

const AdminSidebar = ({ sidebarOpen, setSidebarOpen, isDesktopSidebarOpen, setIsDesktopSidebarOpen }: { sidebarOpen: boolean, setSidebarOpen: (arg: boolean) => void, isDesktopSidebarOpen: boolean, setIsDesktopSidebarOpen: (arg: boolean) => void}) => {
  const pathname = usePathname();
  const sidebar = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || sidebar.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-40 flex h-screen flex-col overflow-y-hidden bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 duration-300 ease-linear md:static md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isDesktopSidebarOpen ? 'w-80' : 'w-20'}`}>
      <div className="p-6 flex justify-between items-center">
        <h1 className={`text-gray-900 dark:text-white text-xl font-bold ${!isDesktopSidebarOpen && 'hidden'}`}>Concept Builders</h1>
        <button onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)} className="hidden md:block">
          <span className="material-symbols-outlined text-gray-900 dark:text-white">
            {isDesktopSidebarOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? 'bg-gradient-to-r from-dark-blue to-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              } ${!isDesktopSidebarOpen && 'justify-center'}`}>
              <span className="material-symbols-outlined">{link.icon}</span>
              <p className={`${!isDesktopSidebarOpen && 'hidden'}`}>{link.label}</p>
            </Link>
          );
        })}
      </nav>
      <div className={`px-4 py-6 mt-auto ${!isDesktopSidebarOpen && 'hidden'}`}>
        <div className="flex flex-col gap-1">
          <Link onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" href="/admin/profile">
            <span className="material-symbols-outlined">account_circle</span>
            <p className="text-sm font-medium">Profile</p>
          </Link>
          <Link onClick={() => setSidebarOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" href="/admin/settings">
            <span className="material-symbols-outlined">settings</span>
            <p className="text-sm font-medium">Settings</p>
          </Link>
          {/* New Logout Link */}
          <a
            onClick={() => {
              setSidebarOpen(false);
              signOut({ callbackUrl: '/' }); // Redirect to homepage after logout
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer"
          >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium">Logout</p>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
