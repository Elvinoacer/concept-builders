'use client';
import React, { useMemo } from 'react';

const OrderSummary = ({ items }) => {
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const total = subtotal; // For now, total is the same as subtotal

  return (
    <div>
      <h2 className="text-lg font-medium text-slate-900 dark:text-white">Order summary</h2>
      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-slate-600 dark:text-gray-400">Subtotal</dt>
          <dd className="text-sm font-medium text-slate-900 dark:text-white">${subtotal.toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-gray-700">
          <dt className="text-base font-medium text-slate-900 dark:text-white">Order total</dt>
          <dd className="text-base font-medium text-slate-900 dark:text-white">${total.toFixed(2)}</dd>
        </div>
      </dl>
      <div className="mt-6">
        <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3 text-base font-medium text-white shadow-sm hover:from-blue-700 hover:to-cyan-500 transition-colors">
          Proceed to Checkout
        </button>
      </div>
      <div className="mt-6 flex items-center justify-center text-center text-sm text-slate-500 dark:text-gray-400">
        <p>
          <span className="material-symbols-outlined mr-1 align-bottom text-base"> lock </span>
          You need to be signed in to complete your purchase.
        </p>
      </div>
    </div>
  );
};

export default OrderSummary;
