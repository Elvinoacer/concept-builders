"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CheckoutLinkProps {
  cart: unknown[];
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

const paymentMethods = [
  { name: "M-Pesa", image: "/payments/mpesa.png" },
  { name: "Visa", image: "/payments/visa-master.webp" },
  { name: "Apple Pay", image: "/payments/apple-pay.webp" },
  { name: "Google Pay", image: "/payments/google-pay.png" },
];

export default function CheckoutLink({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
}: CheckoutLinkProps) {
  const [loading, setLoading] = useState(false);
  const [usdToKesRate, setUsdToKesRate] = useState<number | null>(null);
  const [isFetchingRate, setIsFetchingRate] = useState(true);
  const [rateError, setRateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsFetchingRate(true);
      setRateError(null);
      try {
        const res = await fetch("/api/exchange-rate");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch exchange rate");
        }
        const data = await res.json();
        setUsdToKesRate(data.usdToKesRate);
      } catch (err: unknown) {
        const message = getErrorMessage(err);
        setRateError(message);
        toast.error(`Exchange rate error: ${message}`);
      } finally {
        setIsFetchingRate(false);
      }
    };

    void fetchExchangeRate();
  }, []);

  const amountKES = usdToKesRate
    ? (finalTotal * usdToKesRate).toFixed(2)
    : "N/A";

  const handlePayNow = async () => {
    setLoading(true);
    const loadingToastId = toast.loading("Preparing secure checkout...", {
      duration: 10000,
    });

    try {
      const response = await fetch("/api/intasend/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          currency: "KES",
          discountCode: appliedDiscountCode,
          discountAmount: appliedDiscountAmount,
          discountId: appliedDiscountId,
          cart,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Failed to generate checkout link");
      }

      toast.success("Redirecting to secure checkout...", {
        id: loadingToastId,
        duration: 2500,
      });
      window.location.href = result.url;
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error) || "Failed to generate checkout link",
        {
          id: loadingToastId,
          duration: 5000,
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-cb-border bg-card p-4 sm:p-5">
      <div className="mb-4 border border-[var(--border-gold)] bg-[rgba(200,137,42,0.08)] p-3 sm:p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-gold">
          Instant Action
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-cream-dim">
            Tap once to generate your secure checkout and continue automatically.
          </p>
          <p className="text-sm font-semibold text-cream">
            KES {amountKES}
            <span className="ml-2 text-xs text-cream-dim">
              (${finalTotal.toFixed(2)})
            </span>
          </p>
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={() => {
              void handlePayNow();
            }}
            disabled={
              loading || finalTotal <= 0 || isFetchingRate || Boolean(rateError)
            }
            className="w-full border border-gold bg-gold px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Redirecting..."
              : isFetchingRate
                ? "Fetching Rate..."
                : rateError
                  ? "Rate Unavailable"
                  : "Pay with M-Pesa"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="border border-cb-border bg-surface p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream-dim">
            Accepted Methods
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="flex items-center gap-2 border border-cb-border bg-card px-2 py-1"
              >
                <div className="relative h-5 w-8 overflow-hidden">
                  <Image
                    src={method.image}
                    alt={method.name}
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
                <span className="text-[11px] text-cream-dim">
                  {method.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-cb-border bg-surface p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream-dim">
            Security
          </p>
          <ul className="mt-2 space-y-1 text-xs text-cream-dim">
            <li>256-bit SSL encrypted checkout</li>
            <li>Payment processed on secure gateway</li>
            <li>Automatic return after completion</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
