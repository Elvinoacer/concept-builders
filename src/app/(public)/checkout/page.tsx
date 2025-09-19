"use client";
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { cart } from "@/lib/cart";

const CheckoutPage = () => {
  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-white group/design-root overflow-x-hidden dark:bg-gray-950"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 justify-center bg-gray-50 py-12 dark:bg-gray-900">
          <div className="w-full max-w-4xl px-4">
            <div className="mb-8 flex items-center gap-2 text-sm font-medium">
              <a className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white" href="/cart">
                Cart
              </a>
              <span className="text-gray-400 dark:text-gray-600">/</span>
              <span className="text-gray-900 dark:text-white">Checkout</span>
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="flex flex-col gap-8">
                <CheckoutForm />
              </div>
              <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
                <OrderSummary items={cart.items} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CheckoutPage;