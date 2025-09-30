'use client';
import React from 'react';
import { wishlistDesigns } from '@/lib/dummydata/wishlist-data';
import Image from 'next/image';
import { motion } from 'framer-motion';

const WishlistPage = () => {
  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 sm:p-6 md:p-8">
      <header className="mb-6 md:mb-8">
        <h2 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          My Wishlist
        </h2>
        <p className="text-gray-500 mt-1 text-sm sm:text-base dark:text-gray-400">
          Here are the designs you have saved for later.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {wishlistDesigns.map((design, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden group"
          >
            <div className="relative h-40 sm:h-48">
              <Image
                src={design.images[0].url}
                alt={design.name}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-3 sm:p-4">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">{design.name}</h4>
              <div className="mt-3 sm:mt-4 flex flex-row md:flex-col gap-2">
                <button className="w-full flex items-center justify-center gap-2 rounded-lg h-9 sm:h-10 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-md hover:from-blue-700 hover:to-cyan-500 transition-colors">
                  <span className="material-symbols-outlined text-base sm:text-lg">shopping_cart</span>
                  <span>Add to Cart</span>
                </button>
                <button className="w-full flex items-center justify-center gap-2 rounded-lg h-9 sm:h-10 px-3 sm:px-4 bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
