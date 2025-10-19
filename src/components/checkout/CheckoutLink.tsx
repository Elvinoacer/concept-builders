'use client';

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";

export default function CheckoutLink() {
  const { cart } = useCart();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  useEffect(() => {
    const newTotal = cart.reduce(
      (sum, item) => sum + item.basePrice * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

  const handleGenerateLink = async () => {
    setLoading(true);
    toast.loading("Generating payment link...");

    const response = await fetch("/api/intasend/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: total, currency: "KES" }),
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
      {!checkoutUrl ? (
        <button
          onClick={handleGenerateLink}
          disabled={loading || total <= 0}
          className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Generating..." : `Generate Link for KES ${total}`}
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
