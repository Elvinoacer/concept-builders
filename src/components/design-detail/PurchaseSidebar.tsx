'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const PurchaseSidebar = ({ design }) => {
  const [selectedTier, setSelectedTier] = useState(design.designTiers[1]);

  const totalPrice = selectedTier.price;

  return (
    <div className="sticky-sidebar space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          {design.tags.map((tag, index) => (
            <span key={index} className={`bg-${tag.color}-100 text-${tag.color}-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-opacity-20 dark:text-${tag.color}-300`}>
              {tag.name}
            </span>
          ))}
        </div>

        <div className="space-y-4">
          {design.designTiers.map((tier) => (
            <div
              key={tier.name}
              className={`border rounded-lg p-4 cursor-pointer ${selectedTier.name === tier.name ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 dark:border-gray-600'}`}
              onClick={() => setSelectedTier(tier)}
            >
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg dark:text-white">{tier.name}</h4>
                <p className="text-lg font-bold text-[var(--primary-color)]">${tier.price.toLocaleString()}</p>
              </div>
              <ul className="list-disc pl-5 text-gray-600 mt-2 space-y-1 dark:text-gray-300">
                {tier.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 text-right">
          <p className="text-gray-600 text-sm dark:text-gray-400">Total Price:</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">${totalPrice.toLocaleString()}</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-base font-bold shadow-sm hover:from-blue-700 hover:to-cyan-500 transition-all"
          >
            Buy Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-gray-200 text-gray-800 text-base font-bold tracking-wide hover:bg-gray-300 transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 whitespace-nowrap"
          >
            <span className="material-symbols-outlined"> shopping_cart </span>
            Add to Cart
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSidebar;
