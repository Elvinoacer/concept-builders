'use client';

import { useState } from 'react';
import Link from "next/link";
import { navLinks } from "@/lib/data";
import Image from "next/image";
import { ModeToggle } from "./ui/mode-toggle";
import SearchModal from './SearchModal';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 px-4 md:px-10 py-4 dark:bg-gray-900 dark:border-b-gray-800 sticky top-0 z-50 bg-white">
        <div className="flex items-center gap-4 md:gap-10">
          <div className="flex items-center gap-3 text-slate-800">
            <Image
              src="/images/concept-builders-logo-free-bg.png"
              alt="Concept Builders Logo"
              width={40}
              height={40}
              className="md:w-[60px] md:h-[60px]"
            />
            <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text">
              Concept Builders
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                className="text-slate-600 text-base font-medium hover:text-[#1193d4] transition-colors dark:text-gray-300 dark:hover:text-primary"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchModalOpen(true)}
            className="flex items-center text-slate-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
          >
            <span className="material-symbols-outlined"> search </span>
          </motion.button>
          <ModeToggle />
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/dashboard/wishlist" className="text-slate-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">
              <span className="material-symbols-outlined">favorite</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/cart" className="text-slate-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">
              <span className="material-symbols-outlined">shopping_cart</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400">
              <span className="material-symbols-outlined">person</span>
            </Link>
          </motion.div>
          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-gray-900 z-50 p-6"
          >
            <div className="flex justify-end">
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <nav className="flex flex-col gap-6 mt-8">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  className="text-slate-600 text-lg font-medium hover:text-[#1193d4] transition-colors dark:text-gray-300 dark:hover:text-primary"
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>
  );
};

export default Header;
