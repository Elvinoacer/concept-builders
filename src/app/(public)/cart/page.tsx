"use client";
import CartItemList from "@/components/cart/CartItemList";
import OrderSummary from "@/components/cart/OrderSummary";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";
import { useEffect } from "react";

const CartPage = () => {
  const { data: session, status } = useSession();
  const { cart, loading, error, fetchCart, removeItem, updateItem } = useCart();

  useEffect(() => {
    if (status === "authenticated") {
      fetchCart();
    }
  }, [status, fetchCart]);

  // Simple loading state
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10">
        <main className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <CartItemList items={[]} onRemove={() => {}} loading={true} />
            </div>
            <div className="lg:w-1/3">
              <OrderSummary items={[]} loading={true} />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Sign In Required
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Please log in to view and manage your cart items.
            </p>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-red-200 dark:border-red-800">
            <p className="text-red-600 dark:text-red-400 text-lg mb-4">
              Error: {error}
            </p>
            <button
              onClick={fetchCart}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900/10">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
            Your Cart
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Review your selected designs
          </p>
        </div>

        {cart && cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <CartItemList
                items={cart}
                onRemove={removeItem}
                onUpdate={updateItem}
              />
            </div>
            <div className="lg:w-1/3">
              <OrderSummary items={cart} loading={loading} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-xl border border-gray-100 dark:border-gray-700 max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Your Cart is Empty
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Discover amazing designs and start building your collection
              </p>
              <Link
                href="/design-showcase"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
