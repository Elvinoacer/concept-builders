'use client';

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Added useRouter

interface StkPushFormProps {
  cart: any[]; // Add cart to props
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
        const res = await fetch('/api/exchange-rate');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch exchange rate');
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

  const amountKES = usdToKesRate ? (finalTotal * usdToKesRate).toFixed(2) : 'N/A';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Initiating M-Pesa payment...");

    const response = await fetch("/api/intasend/stk-push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: session?.user?.name?.split(' ')[0],
        last_name: session?.user?.name?.split(' ')[1] || 'User',
        email: session?.user?.email,
        amount: finalTotal, // Use finalTotal
        phone_number: phone,
        discountCode: appliedDiscountCode,
        discountAmount: appliedDiscountAmount,
        discountId: appliedDiscountId,
        cart: cart, // Pass cart to Intasend API
      }),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("STK Push initiated successfully! Check your phone.");
      // Start polling for order status
      const pollInterval = setInterval(async () => {
        const statusRes = await fetch(`/api/orders/status?cartId=${cartId}`); // Assuming cart.id is available and unique
        const statusData = await statusRes.json();

        if (statusData.status === 'PAID' && statusData.orderId) {
          clearInterval(pollInterval);
          toast.success("Payment confirmed! Redirecting...");
          router.push(`/purchase-confirmation?purchaseId=${statusData.orderId}`);
        } else if (statusData.status === 'FAILED') { // Assuming webhook can set a FAILED status
          clearInterval(pollInterval);
          toast.error("Payment failed. Please try again.");
        }
        // Add a timeout to stop polling after a certain period
      }, 5000); // Poll every 5 seconds

      // Set a timeout to stop polling after a certain period (e.g., 5 minutes)
      setTimeout(() => {
        clearInterval(pollInterval);
        // Optionally, show a message to the user if payment is still pending
        toast.info("Payment is still pending. Please check your phone or contact support.");
      }, 5 * 60 * 1000); // 5 minutes
    } else {
      toast.error(result.error || "Failed to initiate STK Push");
    }
    setLoading(false);
  };
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Pay with M-Pesa STK Push
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="phone_number"
          placeholder="Phone Number (e.g., 2547...)"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-500 text-gray-900"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading || finalTotal <= 0 || !phone || isFetchingRate || rateError}
          className="w-full bg-green-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Processing..." : isFetchingRate ? "Fetching rate..." : rateError ? "Error" : `Pay KES ${amountKES}`}
        </button>
      </form>
    </div>
  );
}