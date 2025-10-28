"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navSections = [
  {
    title: "Main",
    links: [
      { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
      { href: "/dashboard/purchases", label: "My Purchases", icon: "shopping_bag" },
      { href: "/dashboard/projects", label: "Projects", icon: "business_center" },
      { href: "/dashboard/wishlist", label: "Wishlist", icon: "favorite" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: "/designs", label: "Browse Designs", icon: "search" },
      { href: "/custom-design", label: "Custom Design", icon: "edit" },
    ],
  },
  {
    title: "Communication",
    links: [
      { href: "/dashboard/messages", label: "Messages", icon: "chat" },
      { href: "/dashboard/notifications", label: "Notifications", icon: "notifications" },
    ],
  },
];

const bottomLinks = [
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
  { href: "/dashboard/help", label: "Help and Support", icon: "help" },
  { href: "/dashboard/feedback", label: "Feedback", icon: "campaign" },
  { href: "/dashboard/my-feedback", label: "My Feedback", icon: "reviews" },
];


const Sidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}) => {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <aside
      className={`flex flex-col w-64 bg-white border-r border-gray-200 p-4 dark:bg-gray-800 dark:border-gray-700 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 fixed top-0 left-0 h-full z-40 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-4 text-gray-800 pb-4 border-b border-gray-200 dark:border-gray-700 dark:text-white">
        <Image
          src="/images/concept-builders-logo-free-bg.png"
          alt="Concept Builders Logo"
          width={40}
          height={40}
        />
        <h2 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400">
          Concept Builders
        </h2>
      </div>
      <nav className="flex flex-col gap-4 flex-1 pt-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
              {section.title}
            </h3>
            <div className="flex flex-col gap-1 mt-2">
              {section.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="material-symbols-outlined">{link.icon}</span>
                    <p>{link.label}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="flex flex-col gap-1 border-t border-gray-200 pt-4 dark:border-gray-700">
        {bottomLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <p>{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-auto">
        <Link
          href="/auth"
          onClick={handleLinkClick}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-all dark:text-gray-300 dark:hover:bg-gray-700"
        >
          <span className="material-symbols-outlined">logout</span>
          <p className="text-sm">Logout</p>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;