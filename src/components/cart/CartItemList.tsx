"use client";
import React from "react";
import CartItem from "./CartItem";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CartItemSkeleton = () => (
  <div className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-4 animate-pulse">
    <div className="h-24 w-24 rounded-xl bg-gray-200 dark:bg-gray-700"></div>
    <div className="ml-6 flex-1 space-y-3">
      <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="flex justify-between">
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
    </div>
  </div>
);

const CartItemList = ({ items, onRemove, onUpdate, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="hidden sm:grid grid-cols-4 gap-6 mb-6 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
          <div className="col-span-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            PRODUCT
          </div>
          <div className="text-right text-sm font-semibold text-blue-600 dark:text-blue-400">
            TOTAL
          </div>
          <div></div>
        </div>
        {[...Array(3)].map((_, i) => (
          <CartItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="hidden sm:grid grid-cols-4 gap-6 mb-6 px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
        <div className="col-span-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
          PRODUCT DETAILS
        </div>
        <div className="text-right text-sm font-semibold text-blue-600 dark:text-blue-400">
          TOTAL
        </div>
        <div></div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="transform transition-transform duration-200 hover:scale-[1.02]"
          >
            <CartItem item={item} onRemove={onRemove} onUpdate={onUpdate} />
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/designs"
          className="inline-flex items-center gap-3 px-6 py-3 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 border border-blue-100 dark:border-blue-800/30 hover:shadow-lg"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartItemList;
