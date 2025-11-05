"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/dummydata/index";
import Image from "next/image";
import { ModeToggle } from "./ui/mode-toggle";
import SearchModal from "./SearchModal";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";

const Header = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const { cartCount } = useCart();

  return (
    <>
      <header className="flex items-center justify-between border-b border-solid border-b-gray-200 px-3 xs:px-4 sm:px-5 md:px-8 lg:px-10 py-3 xs:py-4 dark:bg-gray-900 dark:border-b-gray-800 sticky top-0 z-50 bg-white backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <div className="flex items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 xs:gap-3 text-slate-800"
          >
            <Image
              src="/images/concept-builders-logo-free-bg.png"
              alt="Concept Builders Logo"
              width={48}
              height={48}
              className="w-10 h-10 xs:w-12 xs:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
              priority
            />
            <h1 className="text-lg xs:text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text hidden xs:block whitespace-nowrap">
              Concept Builders
            </h1>
          </Link>

          {/* Desktop Navigation - Responsive gap and text sizing */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                className="text-slate-600 text-xs lg:text-sm xl:text-base font-medium hover:text-blue-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-cyan-400 whitespace-nowrap px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 md:gap-4">
          {/* Search Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 p-1.5 xs:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <span className="material-symbols-outlined text-lg xs:text-xl">
              search
            </span>
          </motion.button>

          {/* Theme Toggle */}
          <div className="flex items-center">
            <ModeToggle />
          </div>

          {/* Cart with Badge */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/cart"
              className="relative flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 p-1.5 xs:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined text-lg xs:text-xl">
                shopping_cart
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 xs:-top-0.5 xs:-right-0.5 w-4 h-4 xs:w-4.5 xs:h-4.5 flex items-center justify-center rounded-full text-[10px] xs:text-xs text-white bg-gradient-to-r from-blue-600 to-cyan-400 leading-none font-bold shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </motion.div>

          {/* User Avatar */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/dashboard"
              className="flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 p-1 xs:p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={20}
                  height={20}
                  className="rounded-full w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8"
                />
              ) : session?.user?.name ? (
                <span className="flex items-center justify-center w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full text-xs xs:text-sm font-bold text-white shadow-sm">
                  {session.user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="material-symbols-outlined text-lg xs:text-xl">
                  account_circle
                </span>
              )}
            </Link>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 p-1.5 xs:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="material-symbols-outlined text-lg xs:text-xl">
                menu
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full screen with safe area handling */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40"
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 40,
                duration: 0.3,
              }}
              className="fixed top-0 right-0 h-full w-full max-w-xs xs:max-w-sm bg-white dark:bg-gray-950 z-50 p-4 xs:p-5 sm:p-6 shadow-2xl border-l border-gray-200 dark:border-gray-800 safe-area-inset-bottom"
              style={{
                // Ensure safe area for notched devices
                paddingTop: "env(safe-area-inset-top)",
                paddingBottom: "env(safe-area-inset-bottom)",
                paddingLeft: "env(safe-area-inset-left)",
                paddingRight: "env(safe-area-inset-right)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 xs:mb-8">
                <h2 className="text-xl xs:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
                  Menu
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center text-slate-600 hover:text-blue-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="material-symbols-outlined text-xl xs:text-2xl">
                    close
                  </span>
                </motion.button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col gap-3 xs:gap-4 mb-6 xs:mb-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      className="block text-slate-600 text-base xs:text-lg font-medium hover:text-blue-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-cyan-400 py-2.5 xs:py-3 px-3 xs:px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800 border border-transparent hover:border-blue-200 dark:hover:border-gray-700"
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* User Section */}
              <div className="mt-auto pt-4 xs:pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-3 xs:gap-4">
                  {/* Cart Link for Mobile */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/cart"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="relative flex items-center gap-3 xs:gap-4 text-slate-600 text-base xs:text-lg font-medium hover:text-blue-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-cyan-400 py-2.5 xs:py-3 px-3 xs:px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800"
                    >
                      <span className="material-symbols-outlined text-xl xs:text-2xl">
                        shopping_cart
                      </span>
                      <span>Cart</span>
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 xs:-top-0.5 xs:-right-0.5 w-5 h-5 xs:w-5.5 xs:h-5.5 flex items-center justify-center rounded-full text-xs xs:text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-400 leading-none font-bold shadow-sm">
                          {cartCount > 9 ? "9+" : cartCount}
                        </span>
                      )}
                    </Link>
                  </motion.div>

                  {/* User Profile Link */}
                  {session && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 xs:gap-4 text-slate-600 text-base xs:text-lg font-medium hover:text-blue-600 transition-colors duration-300 dark:text-gray-300 dark:hover:text-cyan-400 py-2.5 xs:py-3 px-3 xs:px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800"
                      >
                        <span className="material-symbols-outlined text-xl xs:text-2xl">
                          account_circle
                        </span>
                        <span>Dashboard</span>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
};

export default Header;
