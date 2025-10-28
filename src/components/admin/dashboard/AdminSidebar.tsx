"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const categorizedNavLinks = [
  {
    title: "Dashboard",
    links: [{ href: "/admin", label: "Overview", icon: "dashboard" }],
  },
  {
    title: "Content Management",
    links: [
      { href: "/admin/content", label: "All Content", icon: "article" },
      { href: "/admin/content/editor", label: "Editor", icon: "edit_note" },
      { href: "/admin/content/import", label: "Import", icon: "upload_file" },
      { href: "/admin/editor", label: "Legacy Editor", icon: "edit" },
      { href: "/admin/feedback", label: "Feedback", icon: "feedback" },
    ],
  },
  {
    title: "Design Management",
    links: [
      { href: "/admin/designs", label: "All Designs", icon: "folder" },
      { href: "/admin/designs/new", label: "Add New Design", icon: "add_box" },
      { href: "/admin/categories", label: "Categories", icon: "category" },
    ],
  },
  {
    title: "User Management",
    links: [{ href: "/admin/users", label: "All Users", icon: "group" }],
  },
  {
    title: "Project Management",
    links: [
      { href: "/admin/projects", label: "All Projects", icon: "construction" },
      {
        href: "/admin/projects/new",
        label: "Create Project",
        icon: "add_task",
      },
    ],
  },
  {
    title: "Financials",
    links: [
      { href: "/admin/purchases", label: "Purchases", icon: "receipt_long" },
      { href: "/admin/costs", label: "Costs", icon: "attach_money" },
    ],
  },
  {
    title: "Analytics & Marketing",
    links: [
      { href: "/admin/analytics", label: "Site Analytics", icon: "analytics" },
      { href: "/admin/marketing", label: "Marketing Tools", icon: "campaign" },
    ],
  },
  {
    title: "Settings & Tools",
    links: [
      { href: "/admin/profile", label: "My Profile", icon: "account_circle" },
      { href: "/admin/settings", label: "General Settings", icon: "settings" },
      {
        href: "/admin/settings/discounts",
        label: "Discounts",
        icon: "discount",
      },
      {
        href: "/admin/notifications",
        label: "Notifications",
        icon: "notifications",
      },
      { href: "/admin/messages", label: "Messages", icon: "chat" },
    ],
  },
];

const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  isDesktopSidebarOpen,
  setIsDesktopSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (arg: boolean) => void;
}) => {
  const pathname = usePathname();
  const sidebar = useRef<any>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );

  // Initialize all categories as open by default
  useEffect(() => {
    const initialOpenState: Record<string, boolean> = {};
    categorizedNavLinks.forEach((category) => {
      initialOpenState[category.title] = true;
    });
    setOpenCategories(initialOpenState);
  }, []);

  // Improved active link detection
  const isLinkActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return (
      pathname === href ||
      (pathname.startsWith(href + "/") && href !== "/admin")
    );
  };

  const toggleCategory = (title: string) => {
    setOpenCategories((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || sidebar.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [setSidebarOpen]);

  // Close sidebar when ESC key is pressed (mobile only)
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-40 flex h-screen flex-col overflow-y-hidden bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 duration-300 ease-linear md:static md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } ${isDesktopSidebarOpen ? "w-80" : "w-20"}`}
    >
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <h1
          className={`text-gray-900 dark:text-white text-xl font-bold ${
            !isDesktopSidebarOpen && "hidden"
          }`}
        >
          Concept Builders
        </h1>
        <button
          onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
          className="hidden md:block p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label={
            isDesktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"
          }
        >
          <span className="material-symbols-outlined text-gray-900 dark:text-white">
            {isDesktopSidebarOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex-1 px-4 py-2 space-y-4 overflow-y-auto">
        {categorizedNavLinks.map((category) => (
          <div key={category.title}>
            <button
              onClick={() => toggleCategory(category.title)}
              className={`w-full flex justify-between items-center text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 ${
                !isDesktopSidebarOpen && "hidden"
              }`}
            >
              <span>{category.title}</span>
              <span className="material-symbols-outlined text-base">
                {openCategories[category.title] ? "expand_less" : "expand_more"}
              </span>
            </button>

            {(isDesktopSidebarOpen || sidebarOpen) &&
              openCategories[category.title] && (
                <ul className="space-y-1">
                  {category.links.map((link) => {
                    const isActive = isLinkActive(link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-gradient-to-r from-blue-600 to-cyan-400 text-white shadow-sm"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                          } ${!isDesktopSidebarOpen && "justify-center"}`}
                        >
                          <span className="material-symbols-outlined text-lg">
                            {link.icon}
                          </span>
                          <p className={`${!isDesktopSidebarOpen && "hidden"}`}>
                            {link.label}
                          </p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
          </div>
        ))}
      </nav>

      {/* Footer - Logout */}
      <div className={`px-4 py-6 mt-auto ${!isDesktopSidebarOpen && "hidden"}`}>
        <button
          onClick={() => {
            setSidebarOpen(false);
            signOut({ callbackUrl: "/" });
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 cursor-pointer w-full text-sm font-medium"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
