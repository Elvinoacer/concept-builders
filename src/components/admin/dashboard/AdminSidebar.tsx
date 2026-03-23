"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

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
        href: "/admin/ongoing-projects",
        label: "Ongoing Projects",
        icon: "construction",
      },
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
        icon: "local_offer",
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
  isMobile,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
  isDesktopSidebarOpen: boolean;
  setIsDesktopSidebarOpen: (arg: boolean) => void;
  isMobile: boolean;
}) => {
  const pathname = usePathname();
  const sidebar = useRef<any>(null);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {},
  );
  const [isHovered, setIsHovered] = useState(false);

  // Auto-expand categories based on active route
  useEffect(() => {
    let bestMatch: string | null = null;
    let activeCategoryTitle: string | null = null;

    for (const category of categorizedNavLinks) {
      for (const link of category.links) {
        if (pathname.startsWith(link.href)) {
          if (bestMatch === null || link.href.length > bestMatch.length) {
            bestMatch = link.href;
            activeCategoryTitle = category.title;
          }
        }
      }
    }

    if (activeCategoryTitle) {
      setOpenCategories((prev) => ({ ...prev, [activeCategoryTitle]: true }));
    }
  }, [pathname]);

  const toggleCategory = (title: string) => {
    setOpenCategories((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || sidebar.current.contains(target)) return;
      if (isMobile) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, [isMobile, setSidebarOpen]);

  // Close sidebar on escape key
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  const currentSidebarWidth = isMobile ? 320 : isDesktopSidebarOpen ? 320 : 80;

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        ref={sidebar}
        variants={sidebarVariants}
        initial="closed"
        animate={sidebarOpen || !isMobile ? "open" : "closed"}
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col overflow-y-auto bg-surface border-r border-cb-border transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${
          isDesktopSidebarOpen ? "w-80" : "w-20"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 min-[375px]:p-5 sm:p-6 border-b border-cb-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 min-[375px]:gap-4">
            <h1
              className={`text-cream text-xl min-[375px]:text-2xl font-bold transition-all duration-300 ${
                !isDesktopSidebarOpen && !isHovered
                  ? "opacity-0 w-0"
                  : "opacity-100 w-auto"
              }`}
            >
              Concept Builders
            </h1>
          </Link>

          {/* Desktop Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            className="hidden md:flex items-center justify-center w-8 h-8 min-[375px]:w-9 min-[375px]:h-9 rounded-lg bg-card hover:bg-surface transition-colors duration-200 focus:outline-none"
            aria-label={
              isDesktopSidebarOpen ? "Collapse sidebar" : "Expand sidebar"
            }
          >
            <span className="material-symbols-outlined text-cream-dim text-lg min-[375px]:text-xl">
              {isDesktopSidebarOpen ? "chevron_left" : "chevron_right"}
            </span>
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 min-[375px]:px-4 sm:px-5 py-4 min-[375px]:py-5 space-y-4 min-[375px]:space-y-5 overflow-y-auto">
          {categorizedNavLinks.map((category) => (
            <div key={category.title} className="space-y-2">
              {/* Category Header */}
              {(isDesktopSidebarOpen || isHovered || isMobile) && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => toggleCategory(category.title)}
                  className={`w-full flex justify-between items-center text-xs font-semibold uppercase text-cream-dim px-2 py-2 rounded-lg hover:text-cream hover:bg-card transition-colors duration-200 ${
                    !isDesktopSidebarOpen && !isHovered && !isMobile
                      ? "hidden"
                      : "flex"
                  }`}
                >
                  <span className="truncate">{category.title}</span>
                  <span className="material-symbols-outlined text-base min-[375px]:text-lg transition-transform duration-200 flex-shrink-0">
                    {openCategories[category.title]
                      ? "expand_less"
                      : "expand_more"}
                  </span>
                </motion.button>
              )}

              {/* Category Links */}
              <AnimatePresence>
                {openCategories[category.title] && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1 min-[375px]:space-y-1.5 overflow-hidden"
                  >
                    {category.links.map((link) => {
                      const isActive = pathname === link.href;
                      const showLabel =
                        isDesktopSidebarOpen || isHovered || isMobile;

                      return (
                        <motion.li
                          key={link.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <Link
                            href={link.href}
                            onClick={handleLinkClick}
                            className={`flex items-center gap-3 min-[375px]:gap-4 px-3 py-2.5 min-[375px]:py-3 rounded-lg text-sm min-[375px]:text-base font-medium transition-all duration-200 group relative ${
                              isActive
                                ? "bg-gold text-ink shadow-lg shadow-gold/25"
                                : "text-cream-dim hover:text-cream hover:bg-card"
                            } ${showLabel ? "justify-start" : "justify-center"}`}
                            title={!showLabel ? link.label : undefined}
                          >
                            <span className="material-symbols-outlined text-xl min-[375px]:text-2xl flex-shrink-0">
                              {link.icon}
                            </span>
                            <span
                              className={`transition-all duration-300 ${
                                showLabel
                                  ? "opacity-100 w-auto"
                                  : "opacity-0 w-0 hidden"
                              } truncate`}
                            >
                              {link.label}
                            </span>

                            {/* Active indicator for collapsed state */}
                            {isActive && !showLabel && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gold rounded-full"
                              />
                            )}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Logout Button */}
        <div
          className={`p-4 min-[375px]:p-5 sm:p-6 border-t border-cb-border mt-auto flex-shrink-0 ${
            !isDesktopSidebarOpen && !isHovered && !isMobile
              ? "hidden"
              : "block"
          }`}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-3 min-[375px]:gap-4 w-full px-3 py-2.5 min-[375px]:py-3 rounded-lg text-sm min-[375px]:text-base font-medium text-cream-dim hover:bg-destructive/10 hover:text-destructive transition-all duration-200 group"
          >
            <span className="material-symbols-outlined text-xl min-[375px]:text-2xl flex-shrink-0">
              logout
            </span>
            <span className="truncate">Logout</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default AdminSidebar;
