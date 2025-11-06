"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { Globe, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const OrderSummary = ({ loading }) => {
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
      <div className="bg-white dark:bg-gray-800 rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700 animate-pulse sticky top-4 sm:top-6 lg:top-8">
        {/* Header Skeleton */}
        <div className="flex items-center gap-2 xs:gap-3 mb-6 xs:mb-8">
          <div className="w-8 h-8 xs:w-10 xs:h-10 bg-gray-200 dark:bg-gray-700 rounded-lg xs:rounded-xl"></div>
          <div className="h-6 xs:h-7 w-32 xs:w-48 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        </div>

        {/* Content Skeletons */}
        <div className="space-y-3 xs:space-y-4 sm:space-y-6 mb-6 xs:mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <div
                className={`h-3 xs:h-4 bg-gray-200 dark:bg-gray-700 rounded ${
                  item === 4 ? "w-24 xs:w-32" : "w-20 xs:w-28"
                }`}
              ></div>
              <div
                className={`h-4 xs:h-5 bg-gray-200 dark:bg-gray-700 rounded ${
                  item === 4 ? "w-16 xs:w-24" : "w-12 xs:w-20"
                }`}
              ></div>
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="mt-6 xs:mt-8 pt-4 xs:pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="h-10 xs:h-12 sm:h-14 w-full bg-gray-200 dark:bg-gray-700 rounded-xl xs:rounded-2xl"></div>
        </div>

        {/* Security Footer Skeleton */}
        <div className="flex items-center justify-center gap-2 xs:gap-3 mt-4 xs:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="w-4 h-4 xs:w-5 xs:h-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-3 xs:h-4 w-20 xs:w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl xs:rounded-3xl p-4 xs:p-5 sm:p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-4 sm:top-6 lg:top-8">
      {/* Header */}
      <div className="flex items-center gap-2 xs:gap-3 mb-4 xs:mb-6 sm:mb-8">
        <div className="p-1.5 xs:p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg xs:rounded-xl">
          <Zap className="w-4 h-4 xs:w-5 xs:h-5 text-white" />
        </div>
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-200 bg-clip-text text-transparent leading-tight">
          Order Summary
        </h2>
      </div>

      {/* Pricing Details */}
      <div className="space-y-2 xs:space-y-3 sm:space-y-4 mb-4 xs:mb-6 sm:mb-8">
        {/* Subtotal */}
        <div className="flex items-center justify-between py-2 xs:py-3">
          <dt className="text-sm xs:text-base text-gray-600 dark:text-gray-300 font-medium">
            Subtotal
          </dt>
          <dd className="font-semibold text-gray-900 dark:text-white text-base xs:text-lg sm:text-xl">
            ${subtotal.toFixed(2)}
          </dd>
        </div>

        {/* Discount */}
        {appliedDiscountAmount > 0 && (
          <div className="flex items-center justify-between py-2 xs:py-3 bg-green-50 dark:bg-green-900/20 rounded-lg xs:rounded-xl px-3 xs:px-4 -mx-2 xs:-mx-3">
            <dt className="text-xs xs:text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1 xs:gap-2">
              <Zap className="w-3 h-3 xs:w-4 xs:h-4" />
              Discount Applied
            </dt>
            <dd className="font-semibold text-green-600 dark:text-green-400 text-sm xs:text-base">
              -${appliedDiscountAmount.toFixed(2)}
            </dd>
          </div>
        )}

        {/* Total Amount */}
        <div className="flex items-center justify-between py-3 xs:py-4 border-t border-gray-200 dark:border-gray-700 pt-3 xs:pt-4">
          <dt className="text-lg xs:text-xl font-bold text-gray-900 dark:text-white">
            Total Amount
          </dt>
          <dd className="text-lg xs:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ${total.toFixed(2)}
          </dd>
        </div>

        {/* KES Conversion */}
        <div className="flex items-center justify-between py-2 xs:py-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg xs:rounded-xl px-3 xs:px-4 -mx-2 xs:-mx-3">
          <dt className="text-xs xs:text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 xs:gap-2">
            <Globe className="w-3 h-3 xs:w-4 xs:h-4" />
            Total (KES)
          </dt>
          <dd className="font-semibold text-blue-600 dark:text-blue-400 text-sm xs:text-base">
            {isFetchingRate ? (
              <span className="flex items-center gap-1 xs:gap-2">
                <div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs xs:text-sm">Loading...</span>
              </span>
            ) : rateError ? (
              <span className="text-red-500 dark:text-red-400 text-xs xs:text-sm">
                Rate Error
              </span>
            ) : (
              <span>KES {totalKES}</span>
            )}
          </dd>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mb-4 xs:mb-6">
        <Link href="/checkout" className="block">
          <Button className="w-full py-3 xs:py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl xs:rounded-2xl font-bold text-sm xs:text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] min-h-[44px] xs:min-h-[52px]">
            Proceed to Checkout
          </Button>
        </Link>
      </div>

      {/* Security Footer */}
      <div className="flex items-center justify-center gap-2 xs:gap-3 text-xs xs:text-sm text-gray-500 dark:text-gray-400 pt-3 xs:pt-4 border-t border-gray-200 dark:border-gray-700">
        <Shield className="w-4 h-4 xs:w-5 xs:h-5 text-green-500 flex-shrink-0" />
        <span className="font-medium text-center">
          Secure Checkout • 256-bit SSL Encrypted
        </span>
      </div>

      {/* Additional Trust Indicators - Hidden on smallest screens */}
      <div className="hidden xs:flex flex-wrap items-center justify-center gap-3 xs:gap-4 mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-100 dark:border-gray-600">
        <div className="flex items-center gap-1 xs:gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Instant Delivery
          </span>
        </div>
        <div className="flex items-center gap-1 xs:gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            24/7 Support
          </span>
        </div>
        <div className="flex items-center gap-1 xs:gap-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Money Back Guarantee
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
