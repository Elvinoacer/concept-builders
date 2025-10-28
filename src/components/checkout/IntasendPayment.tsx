'use client';
import React from 'react';
import StkPushForm from './StkPushForm';
import CheckoutLink from './CheckoutLink';

interface IntasendPaymentProps {
  cart: any[];
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
  paymentMethod: string; // Add paymentMethod to props
}

const IntasendPayment: React.FC<IntasendPaymentProps> = ({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
  paymentMethod,
}) => {

  if (paymentMethod === 'mpesa') {
    return (
      <StkPushForm
        cart={cart}
        finalTotal={finalTotal}
        appliedDiscountAmount={appliedDiscountAmount}
        appliedDiscountId={appliedDiscountId}
        appliedDiscountCode={appliedDiscountCode}
      />
    );
  }

  if (paymentMethod === 'secure-url') {
    return (
      <CheckoutLink
        cart={cart}
        finalTotal={finalTotal}
        appliedDiscountAmount={appliedDiscountAmount}
        appliedDiscountId={appliedDiscountId}
        appliedDiscountCode={appliedDiscountCode}
      />
    );
  }

  return null;
};

export default IntasendPayment;
