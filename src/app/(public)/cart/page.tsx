"use client";
import CartItemList from "@/components/cart/CartItemList";
import OrderSummary from "@/components/cart/OrderSummary";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { useEffect } from "react";

const CartPage = () => {
  const { cart, fetchCart, removeItem, updateItem, loading, error } = useCart();
  const { data: session, status } = useSession();
  useEffect(() => {
    fetchCart("authenticated");
  }, [fetchCart]);

  // Enhanced loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-ink">
        <main className="container mx-auto px-6 lg:px-8 py-12">
          {/* Skeleton Header */}
          <div className="mb-8 lg:mb-10 text-center">
            <div className="h-10 sm:h-12 bg-surface rounded-2xl animate-pulse max-w-xs mx-auto mb-2"></div>
            <div className="h-5 bg-surface rounded-lg animate-pulse max-w-sm mx-auto"></div>
          </div>

          {/* Skeleton Content */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Cart Items Skeleton */}
            <div className="lg:w-2/3">
              <div className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-cb-border">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="flex gap-4 pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-cb-border last:border-b-0 last:mb-0 last:pb-0"
                  >
                    {/* Image Skeleton */}
                    <div className="w-24 sm:w-28 h-24 sm:h-28 bg-surface rounded-xl sm:rounded-2xl animate-pulse flex-shrink-0"></div>

                    {/* Content Skeleton */}
                    <div className="flex-1 space-y-3">
                      <div className="h-5 sm:h-6 bg-surface rounded animate-pulse w-3/4"></div>
                      <div className="h-4 bg-surface rounded animate-pulse w-1/2"></div>
                      <div className="h-10 bg-surface rounded-lg animate-pulse w-32"></div>
                    </div>

                    {/* Price Skeleton */}
                    <div className="text-right space-y-2">
                      <div className="h-6 bg-surface rounded animate-pulse w-20"></div>
                      <div className="h-9 bg-surface rounded-lg animate-pulse w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Skeleton */}
            <div className="lg:w-1/3">
              <div className="bg-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg border border-cb-border sticky top-6">
                <div className="h-7 sm:h-8 bg-surface rounded animate-pulse mb-4 sm:mb-6"></div>
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3"
                  >
                    <div className="h-5 bg-surface rounded animate-pulse w-1/3"></div>
                    <div className="h-5 bg-surface rounded animate-pulse w-20"></div>
                  </div>
                ))}
                <div className="border-t border-cb-border mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-surface rounded animate-pulse w-1/4"></div>
                    <div className="h-6 bg-surface rounded animate-pulse w-24"></div>
                  </div>
                </div>
                <div className="h-14 bg-surface rounded-xl animate-pulse mt-6"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="text-center w-full max-w-md">
          <div className="bg-card rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-xl border border-cb-border">
            <h1
              className="text-3xl sm:text-4xl font-light text-cream mb-4"
              style={{
                fontFamily:
                  'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
              }}
            >
              Sign In Required
            </h1>
            <p className="text-cream-dim text-base sm:text-lg mb-8 leading-relaxed">
              Please log in to view and manage your cart items.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-3 bg-gold text-ink rounded-xl font-medium hover:bg-gold-light transition-all duration-200 shadow-lg w-full"
            >
              Log In / Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-6">
        <div className="text-center w-full max-w-md">
          <div className="bg-card rounded-2xl sm:rounded-3xl p-8 shadow-xl border border-destructive/50">
            <div className="w-16 h-16 mx-auto mb-4 text-destructive">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-destructive text-lg sm:text-xl mb-6 font-medium">
              {error}
            </p>
            <button
              onClick={() => fetchCart("authenticated")}
              className="px-8 py-3 bg-gold text-ink rounded-xl font-medium hover:bg-gold-light transition-colors w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink">
      <main className="container mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 lg:mb-10 text-center">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-light text-cream leading-tight"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            Your Cart
          </h1>
          <p className="text-cream-dim mt-3 text-base sm:text-lg">
            Review your selected designs
          </p>
        </div>

        {cart && cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Cart Items - Main Content */}
            <div className="lg:w-2/3 xl:w-7/12 2xl:w-2/3">
              <CartItemList
                loading={loading}
                items={cart}
                onRemove={removeItem}
                onUpdate={updateItem}
              />
            </div>

            {/* Order Summary - Sidebar */}
            <div className="lg:w-1/3 xl:w-5/12 2xl:w-1/3">
              <div className="sticky top-4 sm:top-6 lg:top-8">
                <OrderSummary items={cart} loading={loading} />
              </div>
            </div>
          </div>
        ) : (
          // Empty Cart State
          <div className="flex flex-col items-center justify-center px-4">
            <div className="bg-card rounded-2xl sm:rounded-3xl p-8 sm:p-10 lg:p-12 text-center shadow-xl border border-cb-border w-full max-w-md sm:max-w-lg">
              <div className="w-20 sm:w-24 mx-auto mb-6 text-cream-dim">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2
                className="text-2xl sm:text-3xl font-light text-cream mb-3"
                style={{
                  fontFamily:
                    'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
                }}
              >
                Your Cart is Empty
              </h2>
              <p className="text-cream-dim text-base sm:text-lg mb-8 leading-relaxed">
                Discover amazing designs and start building your collection
              </p>
              <Link
                href="/design-showcase"
                className="inline-flex items-center justify-center px-8 py-3 bg-gold text-ink rounded-xl font-medium hover:bg-gold-light transition-all duration-200 shadow-lg w-full"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
