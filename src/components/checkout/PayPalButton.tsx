'use client';

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useCart } from "@/hooks/useCart";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function PayPalButton() {
  const { cart } = useCart();
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const newTotal = cart.reduce(
      (sum, item) => sum + item.basePrice * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      console.error("PayPal Client ID is missing in environment variables");
      setErrorMessage("PayPal configuration error: Client ID not found");
      setPaymentStatus("error");
    }
  }, []);

  const createOrder = async () => {
    try {
      const response = await fetch("/api/paypal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }
      if (!data.orderID) {
        throw new Error("No order ID returned from server");
      }
      return data.orderID;
    } catch (error: any) {
      console.error("Create Order Error:", error.message);
      setErrorMessage(error.message || "Failed to create order");
      setPaymentStatus("error");
      toast.error(error.message || "Failed to create order");
      return undefined; 
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    setPaymentStatus("processing");
    toast.loading("Processing payment...");
    try {
      const response = await fetch("/api/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderID: data.orderID }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to capture order");
      setPaymentStatus("success");
      toast.success("Payment successful!");
      router.push(`/purchase-confirmation?purchaseId=${result.orderId}`);
    } catch (error: any) {
      console.error("Capture Order Error:", error.message);
      setPaymentStatus("error");
      setErrorMessage(error.message || "Payment capture failed");
      toast.error(error.message || "Payment capture failed");
    }
  };

  const onError = (err: any) => {
    console.error("PayPal SDK Error:", err);
    setPaymentStatus("error");
    setErrorMessage("An error occurred with PayPal: " + err.message);
    toast.error("An error occurred with PayPal: " + err.message);
  };

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    return <div>Error: PayPal Client ID is not configured.</div>;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        disabled={total <= 0}
      />
    </PayPalScriptProvider>
  );
}
