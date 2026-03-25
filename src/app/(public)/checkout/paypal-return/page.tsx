"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function PayPalReturnPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;

    const orderID = searchParams?.get("token");
    const payerID = searchParams?.get("PayerID");
    const discountCode = searchParams?.get("discountCode");

    if (status === "loading") return;

    if (status === "unauthenticated") {
      const callback = encodeURIComponent(
        window.location.pathname + window.location.search,
      );
      router.replace(`/auth?callbackUrl=${callback}`);
      return;
    }

    if (!orderID) {
      toast.error("Missing PayPal order reference.");
      router.replace("/checkout");
      return;
    }

    didRunRef.current = true;

    const capture = async () => {
      const loadingId = toast.loading("Finalizing your PayPal payment...", {
        duration: 12000,
      });

      try {
        const res = await fetch("/api/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderID,
            payerID,
            discountCode,
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success || !data.orderId) {
          throw new Error(data.error || "Could not confirm PayPal payment.");
        }

        toast.success("Payment successful!", { id: loadingId, duration: 3000 });
        router.replace(`/purchase-confirmation?purchaseId=${data.orderId}`);
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "PayPal confirmation failed.";
        toast.error(message, { id: loadingId, duration: 5000 });
        router.replace("/checkout");
      }
    };

    void capture();
  }, [router, searchParams, status]);

  return (
    <div className="min-h-screen bg-ink text-cream flex items-center justify-center px-6">
      <div className="border border-cb-border bg-card p-6 sm:p-8 text-center max-w-md w-full">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold mb-3">
          PayPal Return
        </p>
        <h1
          className="text-2xl sm:text-3xl font-light text-cream"
          style={{
            fontFamily:
              'var(--font-cormorant-garamond), "Cormorant Garamond", serif',
          }}
        >
          Finalizing Payment
        </h1>
        <p className="mt-3 text-sm text-cream-dim">
          Please wait while we confirm your order and prepare your receipt.
        </p>
      </div>
    </div>
  );
}
