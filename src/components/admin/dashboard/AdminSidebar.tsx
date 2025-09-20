'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
  { href: '/admin/designs', label: 'Designs', icon: 'folder' },
  { href: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
  { href: '/admin/users', label: 'Users', icon: 'group' },
  { href: '/admin/content', label: 'Content', icon: 'article' },
  { href: '/admin/costs', label: 'Costs', icon: 'attach_money' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'analytics' },
];

const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-80 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="p-6">
        <h1 className="text-gray-900 dark:text-white text-xl font-bold">Concept Builders</h1>
      </div>
      <nav className="flex-1 px-4 py-2 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? 'bg-gradient-to-r from-dark-blue to-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}>
              <span className="material-symbols-outlined">{link.icon}</span>
              <p>{link.label}</p>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-6 mt-auto">
        <div className="flex flex-col gap-1">
          <a className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" href="#">
            <span className="material-symbols-outlined">account_circle</span>
            <p className="text-sm font-medium">Profile</p>
          </a>
          <a className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700" href="#">
            <span className="material-symbols-outlined">settings</span>
            <p className="text-sm font-medium">Settings</p>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;