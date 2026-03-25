"use client";

import React, { useEffect } from "react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";

export default function CheckoutClientPage() {
  const { cart, isLoading, fetchCart } = useCart();
  const { status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      fetchCart(status);
    }
  }, [status, fetchCart]);

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-ink text-cream group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex flex-1 justify-center bg-background py-8 md:py-12">
          <div className="w-full max-w-4xl px-4">
            <div className="mb-4 md:mb-8 flex items-center gap-2 text-sm font-medium">
              <a className="text-cream-dim hover:text-cream" href="/cart">
                Cart
              </a>
              <span className="text-cream-dim">/</span>
              <span className="text-cream">Checkout</span>
            </div>
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              <div className="flex flex-col gap-8">
                <CheckoutForm />
              </div>
              <div className="rounded-xl bg-card p-8 shadow-lg border border-cb-border">
                <OrderSummary items={cart} isLoading={isLoading} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
