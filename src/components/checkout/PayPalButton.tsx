"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PayPalButtonProps {
  cart: unknown[];
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
  paypalConfigured: boolean;
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

export default function PayPalButton({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
  paypalConfigured,
}: PayPalButtonProps) {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "creating" | "redirecting" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const validatePaymentData = () => {
    if (finalTotal <= 0) {
      throw new Error("Invalid order total. Amount must be greater than $0.");
    }

    if (!cart || cart.length === 0) {
      throw new Error("Your cart is empty. Please add items before payment.");
    }

    if (finalTotal < 0.01) {
      throw new Error("Order total is too small for payment processing.");
    }
  };

  const startPayPalRedirect = async (): Promise<void> => {
    try {
      setPaymentStatus("creating");
      setErrorMessage("");
      validatePaymentData();

      const response = await fetch("/api/paypal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          cart,
          discountCode: appliedDiscountCode,
          discountAmount: appliedDiscountAmount,
          discountId: appliedDiscountId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg =
          data.error || `Failed to create order (${response.status})`;
        throw new Error(errorMsg);
      }

      if (!data.orderID || !data.approveUrl) {
        throw new Error("Missing PayPal approval link");
      }

      setPaymentStatus("redirecting");
      toast.success("Redirecting to PayPal...", { duration: 2500 });
      window.location.href = data.approveUrl;
    } catch (error: unknown) {
      const message = getErrorMessage(error, "Failed to start PayPal checkout");
      setErrorMessage(message);
      setPaymentStatus("error");
      toast.error(message, { duration: 5000 });
    }
  };

  if (!paypalConfigured) {
    return (
      <div className="border border-[rgba(200,137,42,0.35)] bg-[rgba(200,137,42,0.08)] p-4 text-center xs:p-6">
        <h4 className="mb-2 text-sm font-semibold text-gold xs:text-base">
          PayPal Not Available
        </h4>
        <p className="text-xs text-cream-dim xs:text-sm">
          PayPal payment is currently unavailable due to configuration issues.
        </p>
      </div>
    );
  }

  if (finalTotal <= 0) {
    return (
      <div className="border border-[rgba(200,137,42,0.35)] bg-[rgba(200,137,42,0.08)] p-4 text-center xs:p-6">
        <h4 className="mb-2 text-sm font-semibold text-gold xs:text-base">
          Invalid Amount
        </h4>
        <p className="text-xs text-cream-dim xs:text-sm">
          The order total must be greater than $0 to proceed with payment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 xs:space-y-4">
      {paymentStatus === "error" && errorMessage && (
        <div className="border border-red-500/35 bg-red-500/10 p-3 text-xs text-red-200 xs:p-4 xs:text-sm">
          {errorMessage}
        </div>
      )}

      {(paymentStatus === "creating" || paymentStatus === "redirecting") && (
        <div className="border border-blue-500/35 bg-blue-500/10 p-3 text-xs text-blue-200 xs:p-4 xs:text-sm">
          {paymentStatus === "creating"
            ? "Preparing PayPal checkout..."
            : "Redirecting to PayPal..."}
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          void startPayPalRedirect();
        }}
        disabled={
          paymentStatus === "creating" || paymentStatus === "redirecting"
        }
        className="w-full border border-cb-border bg-[#0070ba] px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#005ea6] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {paymentStatus === "creating" || paymentStatus === "redirecting"
          ? "Connecting..."
          : "Continue to PayPal"}
      </button>

      <button
        type="button"
        onClick={() => router.push("/checkout")}
        className="w-full border border-cb-border bg-surface px-4 py-3 text-xs font-medium uppercase tracking-[0.12em] text-cream-dim transition-colors hover:text-cream"
      >
        Cancel and Stay on Checkout
      </button>

      <div className="text-center text-xs xs:text-sm text-gray-500 dark:text-gray-400 pt-2">
        <p>
          By continuing, you agree to our{" "}
          <a
            href="/terms"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
