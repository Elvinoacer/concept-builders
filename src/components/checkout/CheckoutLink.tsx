'use client';

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart"; // Keep cart for other potential uses, though total is now from prop
import { toast } from "sonner";

interface CheckoutLinkProps {
  cart: any[]; // Add cart to props
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
}

const paymentMethods = [
  { name: 'M-Pesa', image: '/payments/mpesa.png' },
  { name: 'Visa/Mastercard', image: '/payments/visa-master.webp' },
  { name: 'Apple Pay', image: '/payments/apple-pay.webp' },
  { name: 'Google Pay', image: '/payments/google-pay.png' },
];

const PaymentMethodGallery = () => {
  return (
    <div className="flex items-center justify-center space-x-4 p-4 bg-gray-100 rounded-lg">
      {paymentMethods.map((method) => (
        <div key={method.name} className="flex flex-col items-center">
          <div className="w-24 h-16 flex items-center justify-center rounded-md overflow-hidden border border-gray-200">
            <img src={method.image} alt={method.name} className="object-contain w-full h-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default function CheckoutLink({
  cart,
  finalTotal,
  appliedDiscountAmount,
  appliedDiscountId,
  appliedDiscountCode,
}: CheckoutLinkProps) {
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

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

  const handleGenerateLink = async () => {
    setLoading(true);
    toast.loading("Generating payment link...");

    const response = await fetch("/api/intasend/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: finalTotal, // Use finalTotal
        currency: "KES",
        discountCode: appliedDiscountCode,
        discountAmount: appliedDiscountAmount,
        discountId: appliedDiscountId,
        cart: cart, // Pass cart to Intasend API
      }),
    });

    const result = await response.json();

    if (response.ok) {
      setCheckoutUrl(result.url);
      toast.success("Payment link generated successfully!");
    } else {
      toast.error(result.error || "Failed to generate checkout link");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Generate Card/Bank Checkout Link
      </h2>
      <PaymentMethodGallery />
      {!checkoutUrl ? (
        <button
          onClick={handleGenerateLink}
          disabled={loading || finalTotal <= 0 || isFetchingRate || rateError}
          className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors mt-6"
        >
          {loading ? "Generating..." : isFetchingRate ? "Fetching rate..." : rateError ? "Error" : `Generate Link for KES ${amountKES}`}
        </button>
      ) : (
        <div className="mt-4 text-center">
          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors"
          >
            Proceed to Checkout
          </a>
        </div>
      )}
    </div>
  );
}
