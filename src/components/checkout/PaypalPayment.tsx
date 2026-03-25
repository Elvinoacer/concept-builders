"use client";
import React, { useState, useEffect } from "react";
import PayPalButton from "@/components/checkout/PayPalButton";
import { Skeleton } from "@/components/ui/skeleton";

interface PaypalPaymentProps {
  cart: unknown[];
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
  paypalConfigured: boolean;
  paypalMode: "sandbox" | "live";
}

const PaypalPayment: React.FC<PaypalPaymentProps> = ({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
  paypalConfigured,
  paypalMode,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-4 xs:mb-6">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center border border-cb-border bg-surface xs:mb-4 xs:h-16 xs:w-16">
          <svg
            className="h-6 w-6 text-gold xs:h-8 xs:w-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M7.5 14.25c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm8.25 6c-.41 0-.75.34-.75.75v3.75c0 .41.34.75.75.75s.75-.34.75-.75V15c0-.41-.34-.75-.75-.75zm3-6c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-light text-cream xs:text-xl sm:text-2xl">
          PayPal Redirect Checkout
        </h3>
        <p className="text-sm xs:text-base text-cream-dim">
          Continue to PayPal and return automatically after payment
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-gold">
          Mode: {paypalMode}
        </p>
      </div>

      {/* Amount Display */}
      <div className="mb-4 border border-cb-border bg-surface p-3 xs:mb-6 xs:p-4">
        <div className="flex items-center justify-between text-sm xs:text-base">
          <span className="font-medium text-cream-dim">Total Amount:</span>
          <div className="text-right">
            <span className="font-bold text-cream">
              ${finalTotal.toFixed(2)}
            </span>
            {appliedDiscountAmount > 0 && (
              <div className="mt-1 text-xs text-gold">
                Discount: -${appliedDiscountAmount.toFixed(2)} applied
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PayPal Button Container */}
      <div className="border border-cb-border bg-card p-4 xs:p-6">
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
            paypalConfigured={paypalConfigured}
          />
        )}
      </div>

      {/* Security & Info Section */}
      <div className="mt-4 xs:mt-6 space-y-3 xs:space-y-4">
        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 text-xs xs:text-sm text-cream-dim">
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
        <div className="flex flex-wrap items-center justify-center gap-3 xs:gap-4 text-xs xs:text-sm text-cream-dim">
          <span className="font-medium text-cream">Accepts:</span>
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
        <div className="text-center text-xs xs:text-sm text-cream-dim">
          <p>You&apos;ll complete payment on PayPal and return here securely</p>
        </div>

        {!paypalConfigured && (
          <div className="border border-[rgba(200,137,42,0.35)] bg-[rgba(200,137,42,0.08)] p-3 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-gold">
            PayPal client id is missing in runtime configuration.
          </div>
        )}
      </div>
    </div>
  );
};

export default PaypalPayment;
