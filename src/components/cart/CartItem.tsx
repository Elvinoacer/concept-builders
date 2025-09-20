'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row py-6"
    >
      <div className="h-16 w-16 sm:h-24 sm:w-24 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 dark:border-gray-700">
        <Image
          alt={item.name}
          className="h-full w-full object-cover object-center"
          src={item.image}
          width={100}
          height={100}
        />
      </div>
      <div className="ml-0 sm:ml-4 flex flex-1 flex-col mt-4 sm:mt-0">
        <div>
          <div className="flex justify-between text-base font-medium text-slate-900 dark:text-white">
            <h3>{item.name}</h3>
            <p className="ml-4">${item.price}</p>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">Digital Plan</p>
        </div>
        <div className="flex flex-col sm:flex-row flex-1 items-start sm:items-end justify-between text-sm mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <label className="text-slate-500 dark:text-gray-400" htmlFor={`quantity-${item.id}`}>
              Qty
            </label>
            <input
              className="w-16 rounded-md border-slate-300 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              id={`quantity-${item.id}`}
              min="1"
              type="number"
              value={item.quantity}
              onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
            />
          </div>
          <div className="flex mt-4 sm:mt-0">
            <button
              className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500"
              type="button"
              onClick={() => onRemove(item.id)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
};

export default CartItem;
