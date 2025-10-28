'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const categorizedNavLinks = [
  {
    title: 'Dashboard',
    links: [
      { href: '/admin', label: 'Overview', icon: 'dashboard' },
    ],
  },
  {
    title: 'Content Management',
    links: [
      { href: '/admin/content', label: 'All Content', icon: 'article' },
      { href: '/admin/content/editor', label: 'Editor', icon: 'edit_note' },
      { href: '/admin/content/import', label: 'Import', icon: 'upload_file' },
      { href: '/admin/editor', label: 'Legacy Editor', icon: 'edit' },
      { href: '/admin/feedback', label: 'Feedback', icon: 'feedback' },
    ],
  },
  {
    title: 'Design Management',
    links: [
      { href: '/admin/designs', label: 'All Designs', icon: 'folder' },
      { href: '/admin/designs/new', label: 'Add New Design', icon: 'add_box' },
      { href: '/admin/categories', label: 'Categories', icon: 'category' },
      // Dynamic design pages like /admin/designs/[id] will be accessed via All Designs
      // Dynamic category pages like /admin/categories/[id] will be accessed via Categories
      // Dynamic folder pages like /admin/designs/folders/[folderId] will be accessed via All Designs
    ],
  },
  {
    title: 'User Management',
    links: [
      { href: '/admin/users', label: 'All Users', icon: 'group' },
      { href: '/admin/custom-design-requests', label: 'Custom Requests', icon: 'design_services' },
      // Dynamic user pages like /admin/users/[id] will be accessed via All Users
      // Dynamic user sub-pages like /admin/users/[id]/edit, /admin/users/[id]/analytics, /admin/users/[id]/login-history, /admin/users/[id]/purchases will be accessed via All Users
    ],
  },
  {
    title: 'Project Management',
    links: [
      { href: '/admin/projects', label: 'All Projects', icon: 'construction' },
      { href: '/admin/projects/new', label: 'Create Project', icon: 'add_task' },
      // Dynamic project pages will be accessed via All Projects
    ],
  },
  {
    title: 'Financials',
    links: [
      { href: '/admin/purchases', label: 'Purchases', icon: 'receipt_long' },
      { href: '/admin/costs', label: 'Costs', icon: 'attach_money' },
    ],
  },
  {
    title: 'Analytics & Marketing',
    links: [
      { href: '/admin/analytics', label: 'Site Analytics', icon: 'analytics' },
      { href: '/admin/marketing', label: 'Marketing Tools', icon: 'campaign' },
    ],
  },
  {
    title: 'Settings & Tools',
    links: [
      { href: '/admin/profile', label: 'My Profile', icon: 'account_circle' },
      { href: '/admin/settings', label: 'General Settings', icon: 'settings' },
      { href: '/admin/settings/discounts', label: 'Discounts', icon: 'discount' },
      { href: '/admin/notifications', label: 'Notifications', icon: 'notifications' },
    ],
  },
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
      <nav className="flex-1 px-4 py-2 space-y-4">
        {categorizedNavLinks.map((category) => (
          <div key={category.title}>
            <h3 className={`text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 ${!isDesktopSidebarOpen && 'hidden'}`}>
              {category.title}
            </h3>
            <ul className="space-y-1">
              {category.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-400 text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      } ${!isDesktopSidebarOpen && 'justify-center'}`}>
                      <span className="material-symbols-outlined">{link.icon}</span>
                      <p className={`${!isDesktopSidebarOpen && 'hidden'}`}>{link.label}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className={`px-4 py-6 mt-auto ${!isDesktopSidebarOpen && 'hidden'}`}>
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
    </aside>
  );
};

export default AdminSidebar;
