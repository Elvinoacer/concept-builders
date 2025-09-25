
'use client';
import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const OrderSummary = ({ items }) => {
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price, 0);
  }, [items]);

  const total = subtotal;
  const exchangeRateUSDToKES = 130; // 1 USD = 130 KES (placeholder)
  const totalKES = total * exchangeRateUSDToKES;

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-slate-600 dark:text-gray-400">Subtotal</dt>
          <dd className="font-medium text-slate-900 dark:text-white">${subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-gray-700">
          <dt className="text-lg font-bold text-slate-900 dark:text-white">Order total</dt>
          <dd className="text-lg font-bold text-slate-900 dark:text-white">${total.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-sm text-slate-600 dark:text-gray-400"></dt>
          <dd className="text-sm font-medium text-slate-900 dark:text-white">KES {totalKES.toFixed(2)}</dd>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Discount Code</h3>
        <div className="flex gap-2">
          <Input type="text" placeholder="Enter discount code" className="dark:bg-gray-700 dark:border-gray-600" />
          <Button variant="outline" className="dark:border-gray-600 dark:text-white">Apply</Button>
        </div>
      </div>

      <div className="mt-8">
        <Link href="/checkout">
          <Button className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-700 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105">
            Proceed to Checkout
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-center text-center text-sm text-slate-500 dark:text-gray-400">
        <p>
          <span className="material-symbols-outlined mr-1 align-bottom text-base"> lock </span>
          Secure checkout
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;

