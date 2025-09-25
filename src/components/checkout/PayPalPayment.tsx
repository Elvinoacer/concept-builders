"use client";

import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

interface PayPalPaymentProps {
  amount: string; // The amount to charge
  onPaymentSuccess: (details: any) => void; // Callback for successful payment
  onPaymentError: (error: any) => void; // Callback for payment error
}

const PayPalPayment = ({ amount, onPaymentSuccess, onPaymentError }: PayPalPaymentProps) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const createOrder = async (data: any, actions: any) => {
    try {
      const response = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const order = await response.json();

      if (!response.ok) {
        throw new Error(order.error || "Failed to create order.");
      }
      
      return order.id;
    } catch (error) {
      console.error("Create order error:", error);
      onPaymentError(error);
      return "";
    }
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const response = await fetch("/api/paypal/capture-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderID: data.orderID }),
      });

      const details = await response.json();

      if (!response.ok) {
        throw new Error(details.error || "Failed to capture order.");
      }

      // Call the success callback with the transaction details
      onPaymentSuccess(details);
      
    } catch (error) {
      console.error("Capture order error:", error);
      onPaymentError(error);
    }
  };

  return (
    <>
      {isPending ? <h2>Loading...</h2> : (
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => {
            console.error("PayPal button error:", err);
            onPaymentError(err);
          }}
        />
      )}
    </>
  );
}

export default function PayPalPaymentWrapper(props: PayPalPaymentProps) {
  const initialOptions = {
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
    components: "buttons",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalPayment {...props} />
    </PayPalScriptProvider>
  )
}

