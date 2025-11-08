"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PayPalButtonProps {
  cart: any[];
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
}

export default function PayPalButton({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
}: PayPalButtonProps) {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPayPalReady, setIsPayPalReady] = useState(false);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      console.error("PayPal Client ID is missing in environment variables");
      setErrorMessage("PayPal configuration error: Client ID not found");
      setPaymentStatus("error");
    } else {
      setIsPayPalReady(true);
    }
  }, []);

  const createOrder = async () => {
    if (finalTotal <= 0) {
      throw new Error("Invalid order total");
    }

    try {
      setPaymentStatus("creating");
      const response = await fetch("/api/paypal/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          cart: cart,
          discountCode: appliedDiscountCode,
          discountAmount: appliedDiscountAmount,
          discountId: appliedDiscountId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      if (!data.orderID) {
        throw new Error("No order ID returned from server");
      }

      setPaymentStatus("idle");
      return data.orderID;
    } catch (error: any) {
      console.error("Create Order Error:", error.message);
      setErrorMessage(error.message || "Failed to create order");
      setPaymentStatus("error");
      toast.error(error.message || "Failed to create order");
      throw error;
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    setPaymentStatus("processing");
    toast.loading("Processing payment...");

    try {
      const response = await fetch("/api/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderID: data.orderID,
          discountCode: appliedDiscountCode,
          discountAmount: appliedDiscountAmount,
          discountId: appliedDiscountId,
          cart: cart,
        }),
      });

      const result = await response.json();
      console.log("PayPal capture result:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to capture order");
      }

      setPaymentStatus("success");
      toast.success("Payment successful!");

      // Redirect to success page
      if (result.redirect_url) {
        router.push(result.redirect_url);
      } else {
        router.push("/purchase-confirmation");
      }
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
    setErrorMessage(
      "An error occurred with PayPal. Please try another payment method."
    );
    toast.error(
      "An error occurred with PayPal. Please try another payment method."
    );
  };

  const onCancel = (data: any) => {
    setPaymentStatus("cancelled");
    toast.info("Payment cancelled");
  };

  if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
    return (
      <div className="text-center p-4 xs:p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="w-12 h-12 mx-auto mb-3 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h4 className="text-red-800 dark:text-red-300 font-semibold mb-2 text-sm xs:text-base">
          PayPal Not Available
        </h4>
        <p className="text-red-600 dark:text-red-400 text-xs xs:text-sm">
          PayPal payment is currently unavailable. Please try another payment
          method.
        </p>
      </div>
    );
  }

  if (finalTotal <= 0) {
    return (
      <div className="text-center p-4 xs:p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 dark:bg-yellow-800 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h4 className="text-yellow-800 dark:text-yellow-300 font-semibold mb-2 text-sm xs:text-base">
          Invalid Amount
        </h4>
        <p className="text-yellow-600 dark:text-yellow-400 text-xs xs:text-sm">
          The order total must be greater than $0 to proceed with payment.
        </p>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
        components: "buttons",
        enableFunding: ["card", "paylater"],
        disableFunding: ["venmo"],
      }}
    >
      <div className="space-y-3 xs:space-y-4">
        {/* Status Messages */}
        {paymentStatus === "error" && errorMessage && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 xs:p-4">
            <p className="text-red-700 dark:text-red-300 text-xs xs:text-sm text-center">
              {errorMessage}
            </p>
          </div>
        )}

        {paymentStatus === "creating" && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 xs:p-4">
            <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300 text-xs xs:text-sm">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Creating order...
            </div>
          </div>
        )}

        {paymentStatus === "processing" && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 xs:p-4">
            <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300 text-xs xs:text-sm">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Processing payment...
            </div>
          </div>
        )}

        {/* PayPal Buttons */}
        <div
          className={`transition-opacity duration-300 ${!isPayPalReady ? "opacity-50" : "opacity-100"}`}
        >
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "blue",
              shape: "rect",
              height: 48,
              label: "paypal",
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
            onCancel={onCancel}
            disabled={
              finalTotal <= 0 ||
              !isPayPalReady ||
              paymentStatus === "processing"
            }
            forceReRender={[finalTotal]}
          />
        </div>

        {/* Loading State */}
        {!isPayPalReady && (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-600 dark:text-gray-400 text-xs xs:text-sm">
              Loading PayPal...
            </p>
          </div>
        )}

        {/* Terms Notice */}
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
          </p>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
