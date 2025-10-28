'use client';
import React from 'react';
import CartItem from './CartItem';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const CartItemSkeleton = () => (
  <li className="flex items-center py-4 animate-pulse">
    <div className="h-20 w-20 flex-shrink-0 rounded-md bg-gray-200 dark:bg-gray-700"></div>
    <div className="ml-4 flex flex-1 flex-col justify-between">
      <div>
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      <div className="flex justify-between items-end mt-2">
        <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
    </div>
  </li>
);

const CartItemList = ({ items, onRemove, onUpdate, loading }) => {
  if (loading) {
    return (
      <div>
        <div className="hidden sm:grid grid-cols-4 gap-4 mb-4 text-sm font-medium text-slate-500 dark:text-gray-400">
          <div className="col-span-2">Product</div>
          <div className="text-right">Total</div>
          <div></div>
        </div>
        <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-gray-700 dark:border-gray-700" role="list">
          {[...Array(3)].map((_, i) => <CartItemSkeleton key={i} />)}
        </ul>
      </div>
    );
  }

  return (
    <div>
      <div className="hidden sm:grid grid-cols-4 gap-4 mb-4 text-sm font-medium text-slate-500 dark:text-gray-400">
        <div className="col-span-2">Product</div>
        <div className="text-right">Total</div>
        <div></div>
      </div>
      <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-gray-700 dark:border-gray-700" role="list">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={onRemove}
            onUpdate={onUpdate}
          />
        ))}
      </ul>
      <div className="mt-8">
        <Link href="/designs" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-500">
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartItemList;
