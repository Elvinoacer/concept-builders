'use client';
import React from 'react';
import PayPalButton from './PayPalButton';

const PaypalPayment = () => {

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Pay with PayPal</h1>
      <div className="p-4 border rounded-lg">
        <PayPalButton />
      </div>
    </div>
  );
};

export default PaypalPayment;