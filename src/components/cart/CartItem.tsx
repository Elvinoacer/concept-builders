
'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';

const CartItem = ({ item, onRemove }) => {
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
          src={item.image}
          width={100}
          height={100}
        />
      </div>
      <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{item.name}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Digital Plan</p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <p className="text-lg font-medium text-slate-900 dark:text-white">${item.price.toFixed(2)}</p>
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

