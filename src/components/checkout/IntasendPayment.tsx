"use client";
import React from "react";
import CheckoutLink from "./CheckoutLink";

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
  if (paymentMethod !== "mpesa") return null;

  return (
    <CheckoutLink
      cart={cart}
      finalTotal={finalTotal}
      appliedDiscountAmount={appliedDiscountAmount}
      appliedDiscountId={appliedDiscountId}
      appliedDiscountCode={appliedDiscountCode}
    />
  );
};

export default IntasendPayment;
