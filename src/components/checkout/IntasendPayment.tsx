"use client";
import React from "react";
import CheckoutLink from "./CheckoutLink";

interface IntasendPaymentProps {
  cart: unknown[];
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
}

const IntasendPayment: React.FC<IntasendPaymentProps> = ({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
}) => {
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
