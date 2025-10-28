'use client';

import React, { useState, useEffect } from "react";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import PaypalPayment from "@/components/checkout/PaypalPayment";
import IntasendPayment from "@/components/checkout/IntasendPayment";
import { useCart } from "@/hooks/useCart";

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
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const finalTotal = cartTotal - appliedDiscountAmount;

  const renderPaymentMethod = () => {
    switch (paymentMethod) {
      case 'paypal':
      case 'credit-card':
        return (
          <PaypalPayment
            cart={cart}
            finalTotal={finalTotal}
            appliedDiscountAmount={appliedDiscountAmount}
            appliedDiscountId={appliedDiscountId}
            appliedDiscountCode={appliedDiscountCode}
          />
        );
      case 'mpesa':
        return (
          <IntasendPayment
            cart={cart}
            finalTotal={finalTotal}
            appliedDiscountAmount={appliedDiscountAmount}
            appliedDiscountId={appliedDiscountId}
            appliedDiscountCode={appliedDiscountCode}
            paymentMethod={paymentMethod}
          />
        );
      case 'secure-url':
        return (
          <IntasendPayment
            cart={cart}
            finalTotal={finalTotal}
            appliedDiscountAmount={appliedDiscountAmount}
            appliedDiscountId={appliedDiscountId}
            appliedDiscountCode={appliedDiscountCode}
            paymentMethod={paymentMethod}
          />
        );
      default:
        return <p>Please select a payment method.</p>;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Secure Checkout</h1>
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium mt-2">
            <i className="fas fa-lock"></i>
            <span>Your payment information is secure</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
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

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <PaymentMethodSelector
              selectedMethod={paymentMethod}
              onSelect={setPaymentMethod}
            />
            <div className="mt-6">
              {renderPaymentMethod()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;