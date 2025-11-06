"use client";

import IntasendPayment from "@/components/checkout/IntasendPayment";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentMethodSelector from "@/components/checkout/PaymentMethodSelector";
import PaypalPayment from "@/components/checkout/PaypalPayment";
import { useCart } from "@/hooks/useCart";
import { useState } from "react";

const CheckoutPage = () => {
  const {
    cart,
    loading: isLoading,
    cartTotal,
    appliedDiscountAmount,
    appliedDiscountId,
    appliedDiscountCode,
    setAppliedDiscount,
  } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("paypal");

  const finalTotal = cartTotal - appliedDiscountAmount;

  const renderPaymentMethod = () => {
    switch (paymentMethod) {
      case "paypal":
      case "credit-card":
        return (
          <PaypalPayment
            cart={cart}
            finalTotal={finalTotal}
            appliedDiscountAmount={appliedDiscountAmount}
            appliedDiscountId={appliedDiscountId}
            appliedDiscountCode={appliedDiscountCode}
          />
        );
      case "mpesa":
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
      case "secure-url":
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
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm xs:text-base">
              Please select a payment method to continue
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-4 xs:py-6 sm:py-8">
        {/* Header */}
        <header className="text-center mb-6 xs:mb-8">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            Secure Checkout
          </h1>
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium mt-2 xs:mt-3 text-sm xs:text-base">
            <svg
              className="w-4 h-4 xs:w-5 xs:h-5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <span>Your payment information is secure and encrypted</span>
          </div>
        </header>

        {/* Progress Indicators - Hidden on mobile, visible on larger screens */}
        <div className="hidden sm:flex justify-center mb-6 xs:mb-8">
          <div className="flex items-center gap-2 xs:gap-4 text-sm xs:text-base">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 xs:w-8 xs:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs xs:text-sm font-bold">
                1
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                Cart
              </span>
            </div>
            <div className="w-8 xs:w-12 h-0.5 bg-blue-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 xs:w-8 xs:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs xs:text-sm font-bold">
                2
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                Checkout
              </span>
            </div>
            <div className="w-8 xs:w-12 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 xs:w-8 xs:h-8 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full flex items-center justify-center text-xs xs:text-sm font-bold">
                3
              </div>
              <span className="text-gray-500 dark:text-gray-400">
                Confirmation
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="sm:hidden mb-4 xs:mb-6">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span>Step 2 of 3</span>
            <span>Checkout</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full w-2/3"></div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-4 xs:gap-6 lg:gap-8">
          {/* Order Summary - Comes first on mobile for better UX */}
          <div className="lg:w-1/2 xl:w-2/5 2xl:w-2/5 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 xs:p-5 sm:p-6">
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

            {/* Trust Indicators - Mobile Only */}
            <div className="sm:hidden mt-4 xs:mt-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Secure & Protected
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Money Back</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Instant Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="lg:w-1/2 xl:w-3/5 2xl:w-3/5 order-1 lg:order-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl xs:rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 xs:p-5 sm:p-6">
              {/* Payment Method Selector */}
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelect={setPaymentMethod}
              />

              {/* Payment Method Render */}
              <div className="mt-4 xs:mt-6">{renderPaymentMethod()}</div>
            </div>

            {/* Additional Trust Indicators - Desktop Only */}
            <div className="hidden sm:block mt-4 xs:mt-6">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 xs:p-5 border border-gray-200 dark:border-gray-600">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">
                  Why shop with us?
                </h3>
                <div className="grid grid-cols-2 xs:grid-cols-4 gap-3 text-xs text-gray-600 dark:text-gray-400">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-1">
                      <svg
                        className="w-4 h-4 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-1">
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <span>Money Back</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-1">
                      <svg
                        className="w-4 h-4 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-1">
                      <svg
                        className="w-4 h-4 text-orange-600 dark:text-orange-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <span>Instant Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Footer Assistance */}
        <div className="sm:hidden mt-6 xs:mt-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Need Help?
            </h4>
            <p className="text-blue-800 dark:text-blue-200 text-xs mb-3">
              Our support team is here to help you complete your purchase.
            </p>
            <div className="flex gap-2">
              <a
                href="tel:+254700000000"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg text-center transition-colors"
              >
                Call Support
              </a>
              <a
                href="mailto:support@conceptbuilders.com"
                className="flex-1 bg-white hover:bg-gray-50 text-blue-600 text-xs font-medium py-2 px-3 rounded-lg border border-blue-600 text-center transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
