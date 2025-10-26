"use client";

import React, { useState, useEffect } from "react";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import PaypalPayment from "@/components/checkout/PaypalPayment";
import IntasendPayment from "@/components/checkout/IntasendPayment";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

const CheckoutPage = () => {
  const {
    cart,
    isLoading,
    cartTotal,
    appliedDiscountAmount,
    appliedDiscountId,
    appliedDiscountCode,
    setAppliedDiscount,
  } = useCart();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [step, setStep] = useState("selection"); // 'selection' or 'payment'

  useEffect(() => {
    if (step === "payment") {
      window.scrollTo(0, 0);
    }
  }, [step]);

  const handleProceedToPayment = () => {
    if (paymentMethod) {
      setStep("payment");
    }
  };

  const renderContent = () => {
    if (step === "payment") {
      const finalTotal = cartTotal - appliedDiscountAmount;

      if (paymentMethod === "paypal") {
        return (
          <PaypalPayment
            cart={cart}
            finalTotal={finalTotal}
            appliedDiscountAmount={appliedDiscountAmount}
            appliedDiscountId={appliedDiscountId}
            appliedDiscountCode={appliedDiscountCode}
          />
        );
      }
      if (paymentMethod === "intasend") {
        return (
          <IntasendPayment
            cart={cart}
            finalTotal={finalTotal}
            appliedDiscountAmount={appliedDiscountAmount}
            appliedDiscountId={appliedDiscountId}
            appliedDiscountCode={appliedDiscountCode}
          />
        );
      }
    }

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800 mb-8">
          <OrderSummary
            items={cart}
            isLoading={isLoading}
            onDiscountApplied={(amount, id, code) =>
              setAppliedDiscount(amount, id, code)
            }
            cartTotal={cartTotal}
            appliedDiscountAmount={appliedDiscountAmount}
          />
        </div>
        <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </div>
        <div className="mt-8">
          <Button
            onClick={handleProceedToPayment}
            disabled={!paymentMethod}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-700 hover:to-cyan-500 h-12 text-lg"
          >
            Proceed to Payment
          </Button>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Upon successful purchase, you will be redirected to your dashboard
            to download all your files.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-white group/design-root overflow-x-hidden dark:bg-gray-950"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 justify-center bg-gray-50 py-8 md:py-12 dark:bg-gray-900">
          <div className="w-full max-w-6xl px-4">
            <div className="mb-6 md:mb-10 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <a
                className="hover:text-gray-900 dark:hover:text-white transition-colors"
                href="/cart"
              >
                Cart
              </a>
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <span className="text-gray-900 dark:text-white font-semibold">
                Checkout
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 md:mb-10">
              Secure Checkout
            </h1>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CheckoutPage;
