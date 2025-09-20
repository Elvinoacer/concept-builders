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

  const handleQuantityChange = (id: number, quantity: number) => {
    setCart((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  };

  return (
    <div
      className="relative flex h-auto min-h-screen w-full flex-col bg-slate-50 group/design-root overflow-x-hidden dark:bg-gray-950"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <nav aria-label="Breadcrumb" className="flex text-sm">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li className="inline-flex items-center">
                    <Link
                      className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-blue-600 to-cyan-400 dark:text-gray-400 dark:hover:text-transparent"
                      href="/designs"
                    >
                      Designs
                    </Link>
                  </li>
                  <li>
                    <div className="flex items-center">
                      <svg
                        aria-hidden="true"
                        className="mx-1 h-3 w-3 text-slate-400 rtl:rotate-180"
                        fill="none"
                        viewBox="0 0 6 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="m1 9 4-4-4-4"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        ></path>
                      </svg>
                      <span className="ms-1 text-sm font-medium text-slate-800 md:ms-2 dark:text-white">
                        Cart
                      </span>
                    </div>
                  </li>
                </ol>
              </nav>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                Your Cart
              </h1>
            </div>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <section className="lg:col-span-2">
                <CartItemList
                  items={cart.items}
                  onRemove={handleRemoveItem}
                  onQuantityChange={handleQuantityChange}
                />
              </section>
              <aside className="rounded-lg bg-white p-6 shadow-sm lg:col-span-1 h-fit dark:bg-gray-800">
                <OrderSummary items={cart.items} />
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CartPage;
