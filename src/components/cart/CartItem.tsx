
'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { designDetailPageData } from "@/lib/dummydata/designDetailPage";

const CartItem = ({ item, onRemove }) => {
  const fileTypePrice = item.selectedPackage
    ? designDetailPageData.purchaseSidebar.fileTypePrices[item.selectedPackage] || 0
    : 0;

  const itemTotalPrice = item.basePrice +
    fileTypePrice +
    (item.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row items-center py-6 gap-4"
    >
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-slate-200 dark:border-gray-700">
        <Image
          alt={item.name}
          className="h-full w-full object-cover object-center"
          src={item.images && item.images.length > 0 ? item.images[0].url : '/images/category-placeholder.png'} // Use first image or placeholder
          width={100}
          height={100}
        />
      </div>
      <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.name}</h3>
          {item.selectedPackage && (
            <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
              File Type: {item.selectedPackage.toUpperCase()} (+${fileTypePrice.toFixed(2)})
            </p>
          )}
          {item.selectedExtras && item.selectedExtras.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-slate-700 dark:text-gray-300">Extras:</p>
              <ul className="list-disc list-inside text-sm text-slate-500 dark:text-gray-400 ml-4">
                {item.selectedExtras.map((extra, index) => (
                  <li key={index}>{extra.name} (+${extra.price.toFixed(2)})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <p className="text-lg font-medium text-slate-900 dark:text-white">${itemTotalPrice.toFixed(2)}</p>
          <button
            className="text-slate-500 hover:text-red-500 transition-colors"
            type="button"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 size={20} />
            <span className="sr-only">Remove</span>
          </button>
        </div>
      </div>
    </motion.li>
  );
};

export default CartItem;

