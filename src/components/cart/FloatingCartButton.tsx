"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";

export default function FloatingCartButton() {
  const pathname = usePathname();
  const { status } = useSession();
  const { cartCount, cartTotal, fetchCart } = useCart();
  const previousCount = useRef(cartCount);
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    fetchCart(status === "authenticated" ? "authenticated" : "unauthenticated");
  }, [status, fetchCart]);

  useEffect(() => {
    if (status === "loading") return;

    const refreshCart = () => {
      fetchCart(
        status === "authenticated" ? "authenticated" : "unauthenticated",
      );
    };

    window.addEventListener("focus", refreshCart);
    window.addEventListener("storage", refreshCart);

    return () => {
      window.removeEventListener("focus", refreshCart);
      window.removeEventListener("storage", refreshCart);
    };
  }, [status, fetchCart]);

  useEffect(() => {
    if (previousCount.current !== cartCount) {
      setIsBumping(true);
      const timeout = window.setTimeout(() => setIsBumping(false), 430);
      previousCount.current = cartCount;
      return () => window.clearTimeout(timeout);
    }
    previousCount.current = cartCount;
  }, [cartCount]);

  if (pathname === "/cart" || pathname === "/checkout") {
    return null;
  }

  return (
    <Link
      href="/cart"
      aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}
      className="fixed right-4 z-[140] bottom-[max(1rem,env(safe-area-inset-bottom))] sm:right-5 sm:bottom-5"
    >
      <div
        className={`group relative flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--border-gold)] bg-[rgba(10,9,7,0.88)] px-3 py-2 shadow-[0_18px_36px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_20px_44px_rgba(0,0,0,0.45)] sm:gap-3 sm:px-4 sm:py-2.5 ${isBumping ? "animate-cart-bump" : ""}`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(200,137,42,0.18)] text-gold transition-colors group-hover:bg-[rgba(200,137,42,0.26)]">
          <ShoppingBag className="h-4 w-4" />
        </span>

        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-[11px] uppercase tracking-[0.12em] text-cream-dim">
            Cart
          </span>
          <span className="text-sm font-medium text-cream">
            {cartCount} item{cartCount === 1 ? "" : "s"}
          </span>
        </div>

        <span className="hidden sm:inline-flex rounded-full border border-[rgba(200,137,42,0.35)] bg-[rgba(200,137,42,0.14)] px-2.5 py-1 text-xs font-semibold text-gold">
          ${cartTotal.toFixed(0)}
        </span>

        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
            {cartCount}
          </span>
        )}
      </div>
    </Link>
  );
}
