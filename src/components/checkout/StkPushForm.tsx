"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StkPushFormProps {
  cart: any[];
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
}

export default function StkPushForm({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
}: StkPushFormProps) {
  const { cartId } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "awaiting" | "success" | "failed" | "timeout"
  >("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      } catch (err: any) {
        setRateError(err.message);
        toast.error(`Exchange rate error: ${err.message}`);
      } finally {
        setIsFetchingRate(false);
      }
    };
    fetchExchangeRate();
  }, []);

  const amountKES = usdToKesRate
    ? (finalTotal * usdToKesRate).toFixed(2)
    : "N/A";

  const isBusy = status === "sending" || status === "awaiting";

  const normalizedPhone = useMemo(() => {
    const digits = phone.replace(/\D/g, "").trim();
    if (!digits) return "";
    if (digits.startsWith("0")) return `254${digits.slice(1)}`;
    return digits;
  }, [phone]);

  const isPhoneValid =
    normalizedPhone.length === 12 &&
    (normalizedPhone.startsWith("2547") || normalizedPhone.startsWith("2541"));

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const startOrderPolling = (
    targetCartId: string,
    toastId: string | number,
  ) => {
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes @ 5 seconds

    pollIntervalRef.current = setInterval(async () => {
      attempts += 1;
      try {
        const statusRes = await fetch(
          `/api/orders/status?cartId=${targetCartId}`,
          { cache: "no-store" },
        );
        const statusData = await statusRes.json();

        if (statusData.status === "PAID" && statusData.orderId) {
          stopPolling();
          setStatus("success");
          setStatusMessage(
            "Payment successful. Redirecting to confirmation...",
          );
          toast.success("Payment successful. Redirecting...", {
            id: toastId,
            duration: 3500,
          });
          router.push(
            `/purchase-confirmation?purchaseId=${statusData.orderId}`,
          );
          return;
        }

        if (statusData.status === "FAILED") {
          stopPolling();
          setStatus("failed");
          setStatusMessage(
            "Payment failed. Please retry or use the secure checkout link.",
          );
          toast.error("Payment failed. Please try again.", {
            id: toastId,
            duration: 5000,
          });
          return;
        }

        if (attempts >= maxAttempts) {
          stopPolling();
          setStatus("timeout");
          setStatusMessage(
            "Still waiting for confirmation. You can retry or complete the prompt on your phone.",
          );
          toast.info("Still waiting for M-Pesa confirmation.", {
            id: toastId,
            duration: 6000,
          });
          return;
        }

        if (attempts % 3 === 0) {
          setStatusMessage("Waiting for confirmation from M-Pesa...");
        }
      } catch {
        if (attempts >= maxAttempts) {
          stopPolling();
          setStatus("timeout");
          setStatusMessage(
            "Could not confirm payment in time. Please check your phone and try again.",
          );
          toast.info("Confirmation delayed. Please retry if needed.", {
            id: toastId,
            duration: 6000,
          });
        }
      }
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    stopPolling();

    if (!isPhoneValid) {
      setStatus("failed");
      setStatusMessage("Use format 2547XXXXXXXX or 2541XXXXXXXX.");
      toast.error("Invalid phone format. Use 2547XXXXXXXX.", {
        duration: 4000,
      });
      return;
    }

    setStatus("sending");
    setStatusMessage("Sending STK request to your phone...");
    const loadingToastId = toast.loading(
      "Sending STK request to your phone...",
      {
        duration: 10000,
      },
    );

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 25000);

      const response = await fetch("/api/intasend/stk-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          first_name: session?.user?.name?.split(" ")[0],
          last_name: session?.user?.name?.split(" ")[1] || "User",
          email: session?.user?.email,
          amount: finalTotal,
          phone_number: normalizedPhone,
          discountCode: appliedDiscountCode,
          discountAmount: appliedDiscountAmount,
          discountId: appliedDiscountId,
          cart: cart,
        }),
      });

      clearTimeout(timeout);
      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || "Failed to initiate STK Push";
        setStatus("failed");
        setStatusMessage(errorMsg);
        toast.error(errorMsg, { id: loadingToastId, duration: 5000 });
        return;
      }

      if (!cartId) {
        setStatus("failed");
        setStatusMessage("Could not track cart for payment confirmation.");
        toast.error("Unable to track payment status. Please reload checkout.", {
          id: loadingToastId,
          duration: 5000,
        });
        return;
      }

      setStatus("awaiting");
      setStatusMessage(
        "STK request sent. Waiting for your phone confirmation...",
      );
      toast.success("STK request sent. Approve on your phone.", {
        id: loadingToastId,
        duration: 4500,
      });

      startOrderPolling(cartId, loadingToastId);
    } catch (error) {
      const isAbort =
        error instanceof DOMException && error.name === "AbortError";
      const message = isAbort
        ? "STK request timed out. Please check your network and retry."
        : "Could not initiate STK request. Please retry.";
      setStatus("failed");
      setStatusMessage(message);
      toast.error(message, { id: loadingToastId, duration: 5000 });
    }
  };

  return (
    <div className="bg-card p-4 xs:p-5 sm:p-6 lg:p-8 rounded-xl xs:rounded-2xl shadow-lg border border-cb-border">
      {/* Header */}
      <div className="text-center mb-4 xs:mb-6">
        <div className="w-12 h-12 xs:w-16 xs:h-16 mx-auto mb-3 xs:mb-4 bg-[rgba(200,137,42,0.14)] rounded-full flex items-center justify-center border border-[var(--border-gold)]">
          <svg
            className="w-6 h-6 xs:w-8 xs:h-8 text-gold"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-cream mb-2">
          Pay Now with M-Pesa
        </h2>
        <p className="text-sm xs:text-base text-cream-dim">
          Enter your M-Pesa phone number to receive a payment prompt
        </p>
      </div>

      {/* Exchange Rate Info */}
      <div className="bg-surface rounded-lg p-3 xs:p-4 mb-4 xs:mb-6 border border-cb-border">
        <div className="flex items-center justify-between text-sm xs:text-base">
          <span className="text-cream-dim font-medium">Total Amount:</span>
          <div className="text-right">
            <span className="text-gold font-bold">KES {amountKES}</span>
            <div className="text-xs text-cream-dim">
              (${finalTotal.toFixed(2)} USD)
            </div>
          </div>
        </div>
      </div>

      {status !== "idle" && (
        <div
          className={`mb-4 xs:mb-6 rounded-lg border px-3 py-2.5 text-sm ${
            status === "success"
              ? "border-green-500/40 bg-green-500/10 text-green-300"
              : status === "failed" || status === "timeout"
                ? "border-red-500/40 bg-red-500/10 text-red-300"
                : "border-[var(--border-gold)] bg-[rgba(200,137,42,0.12)] text-gold"
          }`}
        >
          {status === "awaiting" ? (
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
              <div>
                <p className="text-sm font-semibold text-gold">
                  Waiting for M-Pesa confirmation
                </p>
                <p className="text-xs text-cream-dim mt-0.5">
                  Check your phone and enter your PIN
                </p>
              </div>
            </div>
          ) : (
            statusMessage
          )}
        </div>
      )}

      {/* Phone Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm xs:text-base font-medium text-cream mb-2"
          >
            M-Pesa Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-cream-dim"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              id="phone"
              name="phone_number"
              type="tel"
              placeholder="2547XXXXXXXX"
              className="w-full pl-10 pr-4 py-3 xs:py-3.5 text-sm xs:text-base border border-cb-border bg-surface rounded-lg xs:rounded-xl focus:ring-2 focus:ring-gold focus:border-gold transition placeholder-cream-dim text-cream"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <p className="mt-1 text-xs text-cream-dim">
            Format: 2547XXXXXXXX (e.g., 254712345678)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            isBusy ||
            finalTotal <= 0 ||
            !isPhoneValid ||
            isFetchingRate ||
            !!rateError
          }
          className="w-full bg-gold hover:bg-gold-light disabled:bg-[rgba(200,137,42,0.4)] disabled:hover:bg-[rgba(200,137,42,0.4)] text-ink font-bold py-3 xs:py-4 px-4 rounded-lg xs:rounded-xl disabled:text-ink/70 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 min-h-[3rem] xs:min-h-[3.5rem] text-sm xs:text-base"
        >
          {status === "sending" ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
              Sending STK Request...
            </span>
          ) : status === "awaiting" ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
              Waiting for Confirmation...
            </span>
          ) : isFetchingRate ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-ink border-t-transparent rounded-full animate-spin"></div>
              Fetching rate...
            </span>
          ) : rateError ? (
            "Error - Try Again"
          ) : (
            `Pay Now - KES ${amountKES}`
          )}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-4 xs:mt-6 pt-4 xs:pt-5 border-t border-cb-border">
        <div className="flex items-start gap-2 text-xs xs:text-sm text-cream-dim">
          <svg
            className="w-4 h-4 xs:w-5 xs:h-5 text-gold flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-medium text-cream mb-1">How it works:</p>
            <ul className="space-y-1">
              <li>• Enter your M-Pesa registered phone number</li>
              <li>• Click Pay Now to receive an STK push notification</li>
              <li>• Enter your M-Pesa PIN on your phone to complete payment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
