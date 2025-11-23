"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StkPushFormProps {
  cart: any[];
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
}

export default function StkPushForm({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
}: StkPushFormProps) {
  const { cartId } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const [usdToKesRate, setUsdToKesRate] = useState<number | null>(null);
  const [isFetchingRate, setIsFetchingRate] = useState(true);
  const [rateError, setRateError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      setIsFetchingRate(true);
      setRateError(null);
      try {
        const res = await fetch("/api/exchange-rate");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to fetch exchange rate");
        }
        const data = await res.json();
        setUsdToKesRate(data.usdToKesRate);
      } catch (err: any) {
        setRateError(err.message);
        toast.error(`Exchange rate error: ${err.message}`);
      } finally {
        setIsFetchingRate(false);
      }
    };
    fetchExchangeRate();
  }, []);

  const amountKES = usdToKesRate
    ? (finalTotal * usdToKesRate).toFixed(2)
    : "N/A";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Initiating M-Pesa payment...");

    const response = await fetch("/api/intasend/stk-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: session?.user?.name?.split(" ")[0],
        last_name: session?.user?.name?.split(" ")[1] || "User",
        email: session?.user?.email,
        amount: finalTotal,
        phone_number: phone,
        discountCode: appliedDiscountCode,
        discountAmount: appliedDiscountAmount,
        discountId: appliedDiscountId,
        cart: cart,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("STK Push initiated successfully! Check your phone.");
      // Start polling for order status
      const pollInterval = setInterval(async () => {
        const statusRes = await fetch(`/api/orders/status?cartId=${cartId}`);
        const statusData = await statusRes.json();

        if (statusData.status === "PAID" && statusData.orderId) {
          clearInterval(pollInterval);
          toast.success("Payment confirmed! Redirecting...");
          router.push(
            `/purchase-confirmation?purchaseId=${statusData.orderId}`
          );
        } else if (statusData.status === "FAILED") {
          clearInterval(pollInterval);
          toast.error("Payment failed. Please try again.");
        }
      }, 5000);

      // Set a timeout to stop polling after 5 minutes
      setTimeout(
        () => {
          clearInterval(pollInterval);
          toast.info(
            "Payment is still pending. Please check your phone or contact support."
          );
        },
        5 * 60 * 1000
      );
    } else {
      const errorMsg = result.details 
        ? `${result.error}: ${typeof result.details === 'string' ? result.details : JSON.stringify(result.details, null, 2)}`
        : result.error || "Failed to initiate STK Push";
      toast.error(errorMsg);
      console.error("M-Pesa Error Details:", result);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 xs:p-5 sm:p-6 lg:p-8 rounded-xl xs:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="text-center mb-4 xs:mb-6">
        <div className="w-12 h-12 xs:w-16 xs:h-16 mx-auto mb-3 xs:mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 xs:w-8 xs:h-8 text-green-600 dark:text-green-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Pay with M-Pesa
        </h2>
        <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400">
          Enter your M-Pesa phone number to receive a payment prompt
        </p>
      </div>

      {/* Exchange Rate Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 xs:p-4 mb-4 xs:mb-6">
        <div className="flex items-center justify-between text-sm xs:text-base">
          <span className="text-blue-700 dark:text-blue-300 font-medium">
            Total Amount:
          </span>
          <div className="text-right">
            <span className="text-blue-800 dark:text-blue-200 font-bold">
              KES {amountKES}
            </span>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              (${finalTotal.toFixed(2)} USD)
            </div>
          </div>
        </div>
      </div>

      {/* Phone Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm xs:text-base font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            M-Pesa Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <input
              id="phone"
              name="phone_number"
              type="tel"
              placeholder="2547XXXXXXXX"
              className="w-full pl-10 pr-4 py-3 xs:py-3.5 text-sm xs:text-base border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg xs:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Format: 2547XXXXXXXX (e.g., 254712345678)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            loading || finalTotal <= 0 || !phone || isFetchingRate || rateError
          }
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:hover:bg-gray-300 text-white font-bold py-3 xs:py-4 px-4 rounded-lg xs:rounded-xl disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 min-h-[3rem] xs:min-h-[3.5rem] text-sm xs:text-base"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : isFetchingRate ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Fetching rate...
            </span>
          ) : rateError ? (
            "Error - Try Again"
          ) : (
            `Pay KES ${amountKES}`
          )}
        </button>
      </form>

      {/* Help Text */}
      <div className="mt-4 xs:mt-6 pt-4 xs:pt-5 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-start gap-2 text-xs xs:text-sm text-gray-600 dark:text-gray-400">
          <svg
            className="w-4 h-4 xs:w-5 xs:h-5 text-green-500 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
              How it works:
            </p>
            <ul className="space-y-1">
              <li>• Enter your M-Pesa registered phone number</li>
              <li>• Click "Pay" to receive an STK push notification</li>
              <li>• Enter your M-Pesa PIN on your phone to complete payment</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
