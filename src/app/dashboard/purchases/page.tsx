'use client';
import React from 'react';
import { purchasedDesigns } from '@/lib/purchases-data';
import Image from 'next/image';
import { motion } from 'framer-motion';

const PurchasesPage = () => {
  return (
    <div className="dark:bg-gray-900 min-h-screen p-4 md:p-8">
      <header className="mb-8">
        <h2 className="text-gray-900 text-3xl md:text-4xl font-bold leading-tight dark:text-white">
          My Purchases
        </h2>
        <p className="text-gray-500 mt-0.5 md:mt-1 dark:text-gray-400">
          Here are all the designs you have purchased.
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedDesigns.map((design, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden group"
          >
            <div className="relative h-48">
              <Image
                src={design.images[0].url}
                alt={design.name}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">{design.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Purchased on: 22/10/2025</p>
              <div className="mt-4 flex gap-2">
                <button className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
                  <span className="material-symbols-outlined">download</span>
                  Download
                </button>
                <button className="w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-gray-200 text-gray-800 text-sm font-bold hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                  View Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PurchasesPage;