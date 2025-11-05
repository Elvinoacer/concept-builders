'use client';
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const PurchaseListItem = ({ design }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col md:flex-row gap-4"
    >
      <div className="w-full md:w-48 flex-shrink-0 h-40 md:h-auto relative rounded-lg overflow-hidden">
        <Image src={design.images[0].url} alt={design.name} layout="fill" objectFit="cover" />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{design.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Purchased: {new Date(design.createdAt).toLocaleDateString()}</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Package</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{design.selectedPackage || 'Digital Download'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">File Type</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">{design.selectedFileType}</p>
            </div>
            {design.selectedExtras && (
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Add-ons</p>
                <div className="flex flex-wrap gap-1.5">
                  {JSON.parse(design.selectedExtras).map(extra => (
                    <span key={extra.name} className="flex items-center gap-1 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-sm text-green-500">check</span>
                      {extra.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-sm font-bold hover:shadow-lg transition-shadow">
            <span className="material-symbols-outlined text-base">download</span>
            Download
          </button>
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }} 
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl z-10 border border-gray-200 dark:border-gray-600 overflow-hidden"
                >
                  <button className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span className="material-symbols-outlined text-base">receipt_long</span>
                    View Invoice
                  </button>
                  <button className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">
                    <span className="material-symbols-outlined text-base">support</span>
                    Request Support
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PurchaseListItem;
