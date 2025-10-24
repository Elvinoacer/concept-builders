'use client';
import React from 'react';
import PayPalButton from './PayPalButton';

interface PaypalPaymentProps {
  cart: any[]; // Add cart to props
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
}

const PaypalPayment: React.FC<PaypalPaymentProps> = ({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
}) => {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Pay with PayPal</h1>
      <div className="p-4 border rounded-lg">
        <PayPalButton
          cart={cart} // Pass cart to PayPalButton
          finalTotal={finalTotal}
          appliedDiscountAmount={appliedDiscountAmount}
          appliedDiscountId={appliedDiscountId}
          appliedDiscountCode={appliedDiscountCode}
        />
      </div>
    </div>
  );
};

export default PaypalPayment;