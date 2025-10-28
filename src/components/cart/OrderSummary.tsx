"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shield, Zap, Globe } from "lucide-react";

const OrderSummary = ({ items, loading }) => {
  const { cartTotal, appliedDiscountAmount } = useCart();
  const [usdToKesRate, setUsdToKesRate] = useState<number | null>(null);
  const [isFetchingRate, setIsFetchingRate] = useState(true);
  const [rateError, setRateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsFetchingRate(true);
      setRateError(null);
      try {
        const res = await fetch("/api/exchange-rate");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch exchange rate");
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

  const subtotal = cartTotal;
  const total = cartTotal - appliedDiscountAmount;
  const totalKES = usdToKesRate ? (total * usdToKesRate).toFixed(2) : "N/A";

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 animate-pulse">
        <div className="h-7 w-48 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8"></div>
        <div className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
          Order Summary
        </h2>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center justify-between py-3">
          <dt className="text-gray-600 dark:text-gray-300 font-medium">
            Subtotal
          </dt>
          <dd className="font-semibold text-gray-900 dark:text-white text-lg">
            ${subtotal.toFixed(2)}
          </dd>
        </div>

        {appliedDiscountAmount > 0 && (
          <div className="flex items-center justify-between py-3 bg-green-50 dark:bg-green-900/20 rounded-xl px-4 -mx-2">
            <dt className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Discount
            </dt>
            <dd className="font-semibold text-green-600 dark:text-green-400 text-lg">
              -${appliedDiscountAmount.toFixed(2)}
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
          <dt className="text-xl font-bold text-gray-900 dark:text-white">
            Total Amount
          </dt>
          <dd className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${total.toFixed(2)}
          </dd>
        </div>

        <div className="flex items-center justify-between py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 -mx-2">
          <dt className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Total (KES)
          </dt>
          <dd className="font-semibold text-blue-600 dark:text-blue-400">
            {isFetchingRate ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : rateError ? (
              <span className="text-red-500 text-sm">Error</span>
            ) : (
              <span>KES {totalKES}</span>
            )}
          </dd>
        </div>
      </div>

      <div className="mb-6">
        <Link href="/checkout" className="block">
          <Button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-[1.02]">
            Proceed to Checkout
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Shield className="w-5 h-5 text-green-500" />
        <span className="font-medium">Secure Checkout</span>
      </div>
    </div>
  );
};

export default OrderSummary;
