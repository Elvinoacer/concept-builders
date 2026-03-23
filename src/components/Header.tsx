"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { navLinks } from "@/lib/dummydata";
import { ModeToggle } from "./ui/mode-toggle";
import SearchModal from "./SearchModal";
import { useCart } from "@/hooks/useCart";
import {
  ChevronDown,
  Menu,
  // Close,
  XCircle,
  Search,
  ShoppingCart,
  // AccountCircle,
  UserCircle2Icon,
} from "lucide-react";

const Header = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Single state for desktop links with more efficient structure
  const [desktopLinks, setDesktopLinks] = useState({
    visible: navLinks,
    overflow: [] as typeof navLinks,
  });

  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const desktopContainerRef = useRef<HTMLDivElement | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const { data: session } = useSession();
  const { cartCount } = useCart();

  // Enhanced scroll handler with throttle
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Enhanced link calculation with better measurement
  const calculateVisibleLinks = useCallback(() => {
    const container = desktopContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const availableWidth = containerRect.width - 120; // Reserve space for more button + padding

    const children = Array.from(container.children) as HTMLElement[];
    const moreButtonIndex = children.findIndex((child) =>
      child.contains(moreButtonRef.current),
    );

    // Filter out the more button from measurements
    const linkElements =
      moreButtonIndex >= 0
        ? children.filter((_, index) => index !== moreButtonIndex)
        : children;

    let totalWidth = 0;
    const visibleLinks = [];
    const overflowLinks = [];

    for (let i = 0; i < linkElements.length; i++) {
      const child = linkElements[i];
      const childWidth = child.getBoundingClientRect().width + 8; // +8 for margin/padding

      if (totalWidth + childWidth <= availableWidth) {
        totalWidth += childWidth;
        visibleLinks.push(navLinks[i]);
      } else {
        // Once we find one that doesn't fit, the rest don't fit either
        overflowLinks.push(...navLinks.slice(i));
        break;
      }
    }

    // If we have overflow links but no visible links, show at least one
    if (visibleLinks.length === 0 && navLinks.length > 0) {
      visibleLinks.push(navLinks[0]);
      overflowLinks.splice(0, 1);
    }

    setDesktopLinks({
      visible: visibleLinks,
      overflow: overflowLinks,
    });
  }, []);

  // Enhanced resize observer with debouncing
  useEffect(() => {
    const updateDesktopLinks = () => {
      requestAnimationFrame(calculateVisibleLinks);
    };

    const debouncedUpdate = debounce(updateDesktopLinks, 100);

    const observer = new ResizeObserver(debouncedUpdate);
    if (desktopContainerRef.current) {
      observer.observe(desktopContainerRef.current);
    }

    window.addEventListener("resize", debouncedUpdate);

    // Initial calculation
    updateDesktopLinks();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", debouncedUpdate);
    };
  }, [calculateVisibleLinks]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        moreButtonRef.current &&
        !moreButtonRef.current.contains(event.target as Node)
      ) {
        setShowMoreDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Simple debounce function
  function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Mobile menu links - show all by default in mobile
  const mobileLinks = navLinks;

  return (
    <>
      <header
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "border-b border-cb-border/50 bg-card/95 backdrop-blur-xl shadow-sm"
            : "border-b border-cb-border bg-card/98 backdrop-blur-md"
        } py-3 sm:py-4 sticky top-0 z-50`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 text-cream hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <Image
                src="/images/concept-builders-logo-free-bg.png"
                alt="Concept Builders Logo"
                width={56}
                height={56}
                className="w-10 h-10 sm:w-14 sm:h-14 flex-shrink-0"
                priority
              />
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-gold to-gold-light text-transparent bg-clip-text hidden sm:block whitespace-nowrap">
                Concept Builders
              </h1>
            </Link>

            {/* Desktop Navigation with Ultimate Responsiveness */}
            <nav
              className="hidden md:flex items-center flex-1 min-w-0 max-w-[65vw] xl:max-w-[70vw]"
              ref={desktopContainerRef}
              aria-label="Primary"
            >
              {/* Always visible links */}
              {desktopLinks.visible.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-cream-dim text-sm lg:text-base font-medium hover:text-gold transition-all whitespace-nowrap px-3 py-2 rounded-xl hover:bg-card flex-shrink-0"
                >
                  {link.label}
                </Link>
              ))}

              {/* More dropdown for overflow links */}
              {desktopLinks.overflow.length > 0 && (
                <div className="relative flex-shrink-0" ref={dropdownRef}>
                  <button
                    ref={moreButtonRef}
                    aria-haspopup="menu"
                    aria-expanded={showMoreDropdown}
                    onMouseEnter={() => setShowMoreDropdown(true)}
                    onMouseLeave={() => setShowMoreDropdown(false)}
                    onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                    className="flex items-center gap-1 text-cream-dim hover:text-gold px-3 py-2 rounded-xl hover:bg-card transition-all flex-shrink-0"
                  >
                    More{" "}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${showMoreDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showMoreDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={() => setShowMoreDropdown(true)}
                        onMouseLeave={() => setShowMoreDropdown(false)}
                        className="absolute top-full left-0 mt-2 bg-card border border-cb-border rounded-xl shadow-lg z-50 min-w-[180px] backdrop-blur-sm"
                      >
                        {desktopLinks.overflow.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setShowMoreDropdown(false)}
                            className="block px-4 py-2.5 text-sm text-cream hover:text-gold hover:bg-card transition-all first:rounded-t-xl last:rounded-b-xl"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </nav>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
            {/* Search */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 rounded-xl text-cream-dim hover:text-gold hover:bg-card focus:outline-none"
              aria-label="Search"
            >
              <Search size={20} />
            </motion.button>

            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ModeToggle />
            </div>

            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/cart"
                className="relative p-2 rounded-xl text-cream-dim hover:text-gold hover:bg-card focus:outline-none"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold text-ink bg-gradient-to-r from-gold to-gold-light shadow-lg">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* User Avatar */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/dashboard"
                className="flex items-center p-2 rounded-xl text-cream-dim hover:text-gold hover:bg-card"
              >
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8"
                  />
                ) : session?.user?.name ? (
                  <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-gold to-gold-light text-ink font-bold rounded-full text-sm">
                    {session.user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserCircle2Icon size={20} />
                )}
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-xl text-cream-dim hover:text-gold hover:bg-card"
              >
                <Menu size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface border-l border-cb-border z-50 p-6 shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gold to-gold-light text-transparent bg-clip-text">
                  Menu
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-cream-dim hover:text-gold hover:bg-card"
                >
                  <XCircle size={20} />
                </motion.button>
              </div>

              {/* Mobile Navigation - Show all links */}
              <nav className="mb-6" aria-label="Mobile primary">
                <div className="flex flex-col gap-1">
                  {mobileLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-lg font-medium text-cream-dim hover:text-gold py-3 px-4 rounded-2xl hover:bg-card transition-all"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Mobile user actions */}
              <div className="border-t border-cb-border pt-6">
                <nav className="flex flex-col gap-1 mb-6">
                  <Link
                    href="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium text-cream-dim hover:text-gold py-3 px-4 rounded-2xl hover:bg-card transition-all"
                  >
                    <ShoppingCart size={20} />
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium text-cream-dim hover:text-gold py-3 px-4 rounded-2xl hover:bg-card transition-all"
                  >
                    <UserCircle2Icon size={20} />
                    Dashboard
                  </Link>
                </nav>

                {/* Theme toggle for mobile */}
                <div className="px-4 py-3">
                  <ModeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default Header;
