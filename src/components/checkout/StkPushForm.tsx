'use client';

import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function StkPushForm() {
  const { cart } = useCart();
  const { data: session } = useSession();
  const [total, setTotal] = useState(0);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newTotal = cart.reduce(
      (sum, item) => sum + item.basePrice * item.quantity,
      0
    );
    setTotal(newTotal);
  }, [cart]);

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
        amount: total,
        phone_number: phone,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      toast.success("STK Push initiated successfully! Check your phone.");
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
          disabled={loading || total <= 0 || !phone}
          className="w-full bg-green-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-800 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Processing..." : `Pay KES ${total}`}
        </button>
      </form>
    </div>
  );
}
