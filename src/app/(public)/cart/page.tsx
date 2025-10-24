"use client";
import CartItemList from "@/components/cart/CartItemList";
import OrderSummary from "@/components/cart/OrderSummary";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';
import { useEffect } from 'react';

const CartPage = () => {
  const { data: session, status } = useSession();
  const { cart, loading, error, fetchCart, removeItem } = useCart();

  useEffect(() => {
    if (status === 'authenticated') {
      fetchCart();
    }
  }, [status, fetchCart]);

  if (status === 'loading') {
    return (
      <div className="bg-slate-50 dark:bg-gray-950 min-h-screen py-12">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-12">
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

  if (status === 'unauthenticated') {
    return (
      <div className="bg-slate-50 dark:bg-gray-950 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white mb-4">
          Access Your Cart
        </h1>
        <p className="text-lg text-slate-700 dark:text-gray-300 mb-8">
          Please log in to view and manage your cart items. Authenticated users enjoy personalized cart benefits.
        </p>
        <Link href="/auth" className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-cyan-400 px-6 py-3 text-base font-medium text-white shadow-sm hover:from-blue-700 hover:to-cyan-500">
          Log In / Sign Up
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-slate-50 dark:bg-gray-950 min-h-screen py-12">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="flex flex-col lg:flex-row gap-12">
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

  if (error) {
    return (
      <div className="bg-slate-50 dark:bg-gray-950 min-h-screen flex items-center justify-center text-red-500">
        <p className="text-lg">Error loading cart: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Your Cart
          </h1>
        </div>
        {cart && cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <CartItemList
                items={cart}
                onRemove={removeItem}
              />
            </div>
            <div className="lg:w-1/3">
              <OrderSummary items={cart} loading={loading} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">Add some designs to get started!</p>
            <Link href="/design-showcase" className="mt-4 inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-cyan-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-cyan-500">
              Start Shopping
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;
