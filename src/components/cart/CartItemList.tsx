"use client";
import React from "react";
import CartItem from "./CartItem";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CartItemSkeleton = () => (
  <div className="flex items-start xs:items-center p-4 xs:p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-3 xs:mb-4 animate-pulse">
    {/* Image Skeleton */}
    <div className="h-16 w-16 xs:h-20 xs:w-20 sm:h-24 sm:w-24 rounded-lg xs:rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0"></div>

    {/* Content Skeleton */}
    <div className="ml-4 xs:ml-5 sm:ml-6 flex-1 space-y-2 xs:space-y-3 min-w-0">
      <div className="h-4 xs:h-5 sm:h-6 w-3/4 xs:w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-3 xs:h-4 w-1/2 xs:w-2/5 bg-gray-200 dark:bg-gray-700 rounded"></div>

      {/* File Types Skeleton */}
      <div className="space-y-1 xs:space-y-2 mt-2 xs:mt-3">
        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="flex flex-wrap gap-1 xs:gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-6 xs:h-7 w-16 xs:w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"
            ></div>
          ))}
        </div>
      </div>

      {/* Price and Actions */}
      <div className="flex justify-between items-center mt-3 xs:mt-4">
        <div className="h-5 xs:h-6 w-16 xs:w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-8 xs:h-9 w-8 xs:w-9 bg-gray-200 dark:bg-gray-700 rounded-lg xs:rounded-xl"></div>
      </div>
    </div>
  </div>
);

const CartItemList = ({ items, onRemove, onUpdate, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3 xs:space-y-4 sm:space-y-6">
        {/* Desktop Table Header Skeleton */}
        <div className="hidden sm:grid grid-cols-4 gap-4 xs:gap-6 mb-4 xs:mb-6 px-4 xs:px-5 py-3 xs:py-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl xs:rounded-2xl">
          <div className="col-span-2 text-sm xs:text-base font-semibold text-blue-600 dark:text-blue-400">
            PRODUCT
          </div>
          <div className="text-right text-sm xs:text-base font-semibold text-blue-600 dark:text-blue-400">
            TOTAL
          </div>
          <div></div>
        </div>

        {/* Loading Skeletons */}
        {[...Array(3)].map((_, i) => (
          <CartItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 xs:space-y-6 sm:space-y-8">
      {/* Desktop Table Header */}
      <div className="hidden sm:grid grid-cols-4 gap-4 xs:gap-6 mb-4 xs:mb-6 px-4 xs:px-5 py-3 xs:py-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl xs:rounded-2xl border border-blue-100 dark:border-blue-800/30">
        <div className="col-span-2 text-sm xs:text-base font-semibold text-blue-600 dark:text-blue-400">
          PRODUCT DETAILS
        </div>
        <div className="text-right text-sm xs:text-base font-semibold text-blue-600 dark:text-blue-400">
          TOTAL
        </div>
        <div></div>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 xs:space-y-4 sm:space-y-6">
        {items.map((item) => (
          <div
            key={item.cartItemId}
            className="transform transition-transform duration-200 hover:scale-[1.01] sm:hover:scale-[1.02]"
          >
            <CartItem item={item} onRemove={onRemove} onUpdate={onUpdate} />
          </div>
        ))}
      </div>

      {/* Continue Shopping Button */}
      <div className="pt-4 xs:pt-5 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/designs"
          className="inline-flex items-center justify-center xs:justify-start gap-2 xs:gap-3 px-4 xs:px-5 sm:px-6 py-2.5 xs:py-3 text-xs xs:text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 rounded-lg xs:rounded-xl transition-all duration-200 border border-blue-100 dark:border-blue-800/30 hover:shadow-lg w-full xs:w-auto"
        >
          <ArrowLeft size={16} className="xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
          <span className="text-center xs:text-left">Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};

export default CartItemList;
