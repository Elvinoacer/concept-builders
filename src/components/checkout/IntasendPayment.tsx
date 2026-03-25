"use client";
import React, { useState } from "react";
import CheckoutLink from "./CheckoutLink";
import StkPushForm from "./StkPushForm";

interface IntasendPaymentProps {
  cart: any[];
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
  paymentMethod: string;
}

const IntasendPayment: React.FC<IntasendPaymentProps> = ({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
  paymentMethod,
}) => {
  const [mode, setMode] = useState<"stk" | "link">("stk");

  if (paymentMethod !== "mpesa") return null;

  return (
    <div className="space-y-4">
      <div className="border border-cb-border bg-surface p-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream-dim">
          M-Pesa Checkout
        </p>
        <p className="mt-1 text-sm text-cream">
          Use STK Push first. If your prompt delays, switch to checkout link.
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setMode("stk")}
            className={`border px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
              mode === "stk"
                ? "border-gold bg-[rgba(200,137,42,0.12)] text-gold"
                : "border-cb-border bg-card text-cream-dim hover:text-cream"
            }`}
          >
            STK Push
          </button>
          <button
            type="button"
            onClick={() => setMode("link")}
            className={`border px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors ${
              mode === "link"
                ? "border-gold bg-[rgba(200,137,42,0.12)] text-gold"
                : "border-cb-border bg-card text-cream-dim hover:text-cream"
            }`}
          >
            Checkout Link
          </button>
        </div>
      </div>

      {mode === "stk" ? (
        <StkPushForm
          cart={cart}
          finalTotal={finalTotal}
          appliedDiscountAmount={appliedDiscountAmount}
          appliedDiscountId={appliedDiscountId}
          appliedDiscountCode={appliedDiscountCode}
        />
      ) : (
        <CheckoutLink
          cart={cart}
          finalTotal={finalTotal}
          appliedDiscountAmount={appliedDiscountAmount}
          appliedDiscountId={appliedDiscountId}
          appliedDiscountCode={appliedDiscountCode}
        />
      )}
    </div>
  );
};

export default IntasendPayment;
