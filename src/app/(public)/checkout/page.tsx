"use client";

import IntasendPayment from "@/components/checkout/IntasendPayment";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCart } from "@/hooks/useCart";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

const CheckoutPage = () => {
  const { status } = useSession();
  const router = useRouter();
  const {
    cart,
    loading: isLoading,
    fetchCart,
    cartTotal,
    appliedDiscountAmount,
    appliedDiscountId,
    appliedDiscountCode,
    setAppliedDiscount,
  } = useCart();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth?callbackUrl=%2Fcheckout");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    void fetchCart("authenticated", { silent: true });
  }, [fetchCart, status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    if (isLoading) return;
    if (cart.length > 0) return;

    toast.info("Your cart is empty. Add a plan before checkout.");
    router.replace("/cart");
  }, [cart.length, isLoading, router, status]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-ink text-cream flex items-center justify-center px-6">
        <p className="text-sm sm:text-base text-cream-dim">
          Preparing secure checkout...
        </p>
      </div>
    );
  }

  const finalTotal = cartTotal - appliedDiscountAmount;

  return (
    <div className="min-h-screen bg-ink text-cream">
      <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8 lg:py-12">
        <header className="mb-8 text-center">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-gold">
            Secure M-Pesa Checkout
          </p>
          <h1
            className="text-3xl font-light leading-tight text-cream sm:text-4xl"
            style={{
              fontFamily:
                'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
            }}
          >
            Checkout
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-cream-dim">
            Review your order, then tap once to generate a secure checkout and
            continue directly to payment.
          </p>
        </header>

        <div className="mb-6 flex items-center justify-between text-xs text-cream-dim">
          <a className="transition-colors hover:text-cream" href="/cart">
            Cart
          </a>
          <span className="h-px flex-1 bg-cb-border mx-3" />
          <span className="text-gold">Checkout</span>
          <span className="h-px flex-1 bg-cb-border mx-3" />
          <span>Confirmation</span>
        </div>

        <div className="space-y-6">
          <section className="border border-cb-border bg-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-6">
            <OrderSummary
              items={cart}
              isLoading={isLoading}
              onDiscountApplied={(amount, id, code) =>
                setAppliedDiscount(amount, id, code)
              }
              cartTotal={cartTotal}
              appliedDiscountAmount={appliedDiscountAmount}
            />
          </section>

          <section className="border border-cb-border bg-card p-5 shadow-[0_20px_60px_rgba(0,0,0,0.28)] sm:p-6">
            <div className="mb-5 border-b border-cb-border pb-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-gold">
                Payment
              </p>
              <h2 className="mt-2 text-xl font-light text-cream">
                Pay with M-Pesa
              </h2>
              <p className="mt-1 text-sm text-cream-dim">
                Pay securely through IntaSend using M-Pesa, card, Apple Pay, or
                Google Pay.
              </p>
            </div>

            <IntasendPayment
              cart={cart}
              finalTotal={finalTotal}
              appliedDiscountAmount={appliedDiscountAmount}
              appliedDiscountId={appliedDiscountId}
              appliedDiscountCode={appliedDiscountCode}
            />
          </section>

          <aside className="border border-[rgba(200,137,42,0.35)] bg-[rgba(200,137,42,0.08)] p-4 text-sm text-cream-dim">
            Your payment is processed on an encrypted IntaSend checkout page.
            You will return automatically after payment is complete.
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
