"use client";
import CartItemList from "@/components/cart/CartItemList";
import OrderSummary from "@/components/cart/OrderSummary";
import { cart as initialCart } from "@/lib/cart";
import Link from "next/link";
import { useState } from "react";

const CartPage = () => {
  const [cart, setCart] = useState(initialCart);

  const handleRemoveItem = (id: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.filter((item) => item.id !== id),
    }));
  };

  return (
    <div className="bg-slate-50 dark:bg-gray-950 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            Your Cart
          </h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3">
            <CartItemList
              items={cart.items}
              onRemove={handleRemoveItem}
            />
          </div>
          <div className="lg:w-1/3">
            <OrderSummary items={cart.items} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CartPage;
