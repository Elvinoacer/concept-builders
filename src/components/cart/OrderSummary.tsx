
'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart'; // Import useCart

const OrderSummary = ({ items, loading }) => {
  const { cartTotal, appliedDiscountAmount } = useCart(); // Use cartTotal and appliedDiscountAmount from useCart
  const [usdToKesRate, setUsdToKesRate] = useState<number | null>(null);
  const [isFetchingRate, setIsFetchingRate] = useState(true);
  const [rateError, setRateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsFetchingRate(true);
      setRateError(null);
      try {
        const res = await fetch('/api/exchange-rate');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch exchange rate');
        }
        const data = await res.json();
        setUsdToKesRate(data.usdToKesRate);
      } catch (err: any) {
        setRateError(err.message);
        toast.error(`Exchange rate error: ${err.message}`);
      } finally {
        setIsFetchingRate(false);
      }
    };
    fetchExchangeRate();
  }, []);

  const subtotal = cartTotal; // Use cartTotal as subtotal
  const total = cartTotal - appliedDiscountAmount; // Apply discount
  const totalKES = usdToKesRate ? (total * usdToKesRate).toFixed(2) : 'N/A';

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-gray-700">
            <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-1/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="mt-8">
          <div className="h-5 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="flex gap-2">
            <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
        <div className="mt-8">
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
        <div className="mt-6 flex items-center justify-center text-center text-sm text-slate-500 dark:text-gray-400">
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

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
          <dt className="text-sm text-slate-600 dark:text-gray-400">Total (KES)</dt>
          <dd className="text-sm font-medium text-slate-900 dark:text-white">
            {isFetchingRate ? (
              <span>Loading...</span>
            ) : rateError ? (
              <span className="text-red-500">Error</span>
            ) : (
              <span>KES {totalKES}</span>
            )}
          </dd>
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

