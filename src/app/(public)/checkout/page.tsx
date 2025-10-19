'use client';

import React, { useState, useEffect } from "react";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import PaypalPayment from "@/components/checkout/PaypalPayment";
import IntasendPayment from "@/components/checkout/IntasendPayment";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

const CheckoutPage = () => {
  const { cart, isLoading } = useCart();
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [step, setStep] = useState('selection'); // 'selection' or 'payment'

  useEffect(() => {
    if (step === 'payment') {
      window.scrollTo(0, 0);
    }
  }, [step]);

  const handleProceedToPayment = () => {
    if (paymentMethod) {
      setStep('payment');
    }
  };

  const renderContent = () => {
    if (step === 'payment') {
      if (paymentMethod === 'paypal') {
        return <PaypalPayment cart={cart} />;
      }
      if (paymentMethod === 'intasend') {
        return <IntasendPayment cart={cart} />;
      }
    }

    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800 mb-8">
          <OrderSummary items={cart} isLoading={isLoading} />
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
          <div className="w-full max-w-4xl px-4">
            <div className="mb-4 md:mb-8 flex items-center gap-2 text-sm font-medium">
              <a
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                href="/cart"
              >
                Cart
              </a>
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <span className="text-gray-900 dark:text-white">Checkout</span>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CheckoutPage;
