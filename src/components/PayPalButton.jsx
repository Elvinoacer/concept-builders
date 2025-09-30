// components/PayPalButton.jsx
'use client';

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";

export default function PayPalButton({ amount, onPaymentSuccess, onPaymentError, designId }) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (data, actions) => {
    try {
      const res = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId: designId || "test-design-id", amount }) // Pass amount to the API
      });
      const { orderID } = await res.json();
      return orderID;
    } catch (err) {
      setError(err.message);
      onPaymentError(err);
    }
  };

  const onApprove = async (data, actions) => {
    try {
      const res = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID: data.orderID })
      });
      const captureData = await res.json();
      if (captureData.status === 'COMPLETED') {
        setPaid(true);
        onPaymentSuccess(captureData);
      } else {
        throw new Error('Payment not completed');
      }
    } catch (err) {
      setError(err.message);
      onPaymentError(err);
    }
  };

  const onError = (err) => {
    setError(err.message);
    onPaymentError(err);
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading PayPal...</span>
      </div>
    );
  }

  if (paid) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        Payment successful! Thank you for your purchase.
      </div>
    );
  }

  return (
    <div className="paypal-button-container">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <PayPalButtons
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        style={{
          layout: "vertical",
          shape: "rect",
          color: "blue",
        }}
      />
    </div>
  );
}