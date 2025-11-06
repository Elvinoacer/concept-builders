"use client";
import React, { useState, useEffect } from "react";
import PayPalButton from "./PayPalButton";
import { Skeleton } from "@/components/ui/skeleton";

interface PaypalPaymentProps {
  cart: any[];
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
}

const PaypalPayment: React.FC<PaypalPaymentProps> = ({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-4 xs:mb-6">
        <div className="w-12 h-12 xs:w-16 xs:h-16 mx-auto mb-3 xs:mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 xs:w-8 xs:h-8 text-blue-600 dark:text-blue-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7.5 14.25c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8.25 6c-.41 0-.75.34-.75.75v3.75c0 .41.34.75.75.75s.75-.34.75-.75V15c0-.41-.34-.75-.75-.75zm3-6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
          PayPal Payment
        </h3>
        <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400">
          Securely pay with your PayPal account or credit card
        </p>
      </div>

      {/* Amount Display */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg xs:rounded-xl p-3 xs:p-4 mb-4 xs:mb-6">
        <div className="flex items-center justify-between text-sm xs:text-base">
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            Total Amount:
          </span>
          <div className="text-right">
            <span className="text-blue-800 dark:text-blue-200 font-bold">
              ${finalTotal.toFixed(2)}
            </span>
            {appliedDiscountAmount > 0 && (
              <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                Discount: -${appliedDiscountAmount.toFixed(2)} applied
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PayPal Button Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg xs:rounded-xl border border-gray-200 dark:border-gray-700 p-4 xs:p-6">
        {!isClient ? (
          // Skeleton Loading State
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-4 flex-1 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </div>
        ) : (
          <PayPalButton
            cart={cart}
            finalTotal={finalTotal}
            appliedDiscountAmount={appliedDiscountAmount}
            appliedDiscountId={appliedDiscountId}
            appliedDiscountCode={appliedDiscountCode}
          />
        )}
      </div>

      {/* Security & Info Section */}
      <div className="mt-4 xs:mt-6 space-y-3 xs:space-y-4">
        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-xs xs:text-sm text-gray-600 dark:text-gray-400">
          <svg
            className="w-4 h-4 xs:w-5 xs:h-5 text-green-500 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>256-bit SSL encrypted • Secure payment processing</span>
        </div>

        {/* Accepted Methods */}
        <div className="flex flex-wrap items-center justify-center gap-3 xs:gap-4 text-xs xs:text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Accepts:
          </span>
          <div className="flex items-center gap-2">
            <span>PayPal Balance</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <div className="flex items-center gap-2">
            <span>Credit Cards</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
          <span>Debit Cards</span>
        </div>

        {/* Help Text */}
        <div className="text-center text-xs xs:text-sm text-gray-500 dark:text-gray-400">
          <p>
            You'll be redirected to PayPal to complete your payment securely
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaypalPayment;
