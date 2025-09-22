'use client';
import React from 'react';
import CartItem from './CartItem';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const CartItemList = ({ items, onRemove }) => {
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
