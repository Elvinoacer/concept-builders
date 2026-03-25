"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CheckoutLinkProps {
  cart: any[];
  finalTotal: number;
  appliedDiscountAmount: number;
  appliedDiscountId: string | null;
  appliedDiscountCode: string | null;
}

const paymentMethods = [
  { name: "M-Pesa", image: "/payments/mpesa.png" },
  { name: "Visa/Mastercard", image: "/payments/visa-master.webp" },
  { name: "Apple Pay", image: "/payments/apple-pay.webp" },
  { name: "Google Pay", image: "/payments/google-pay.png" },
];

const PaymentMethodGallery = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 xs:gap-3 sm:gap-4 p-3 xs:p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg xs:rounded-xl">
      {paymentMethods.map((method) => (
        <div key={method.name} className="flex flex-col items-center">
          <div className="relative w-16 h-10 xs:w-20 xs:h-12 sm:w-24 sm:h-16 flex items-center justify-center rounded-md xs:rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            <Image
              src={method.image}
              alt={method.name}
              fill
              className="object-contain p-1 xs:p-2"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
              sizes="(max-width: 480px) 64px, (max-width: 640px) 80px, 96px"
            />
          </div>
          <span className="text-xs xs:text-sm text-gray-600 dark:text-gray-400 mt-1 xs:mt-2 hidden xs:block">
            {method.name}
          </span>
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

  const handleGenerateLink = async () => {
    setLoading(true);
    const loadingToastId = toast.loading("Generating payment link...", {
      duration: 10000,
    });

    try {
      const response = await fetch("/api/intasend/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalTotal,
          currency: "KES",
          discountCode: appliedDiscountCode,
          discountAmount: appliedDiscountAmount,
          discountId: appliedDiscountId,
          cart: cart,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setCheckoutUrl(result.url);
        toast.success("Payment link generated successfully!", {
          id: loadingToastId,
          duration: 4000,
        });
      } else {
        toast.error(result.error || "Failed to generate checkout link", {
          id: loadingToastId,
          duration: 5000,
        });
      }
    } catch {
      toast.error("Failed to generate checkout link", {
        id: loadingToastId,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 xs:p-5 sm:p-6 lg:p-8 rounded-xl xs:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="text-center mb-4 xs:mb-6">
        <div className="w-12 h-12 xs:w-16 xs:h-16 mx-auto mb-3 xs:mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 xs:w-8 xs:h-8 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        </div>
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Secure Payment Link
        </h2>
        <p className="text-sm xs:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Generate a secure payment link to pay via card, mobile money, or bank
          transfer
        </p>
      </div>

      {/* Payment Methods Gallery */}
      <div className="mb-4 xs:mb-6">
        <PaymentMethodGallery />
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

      {/* Action Section */}
      <div className="text-center">
        {!checkoutUrl ? (
          <button
            onClick={handleGenerateLink}
            disabled={loading || finalTotal <= 0 || isFetchingRate || rateError}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:hover:bg-gray-300 text-white font-bold py-3 xs:py-4 px-4 rounded-lg xs:rounded-xl disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 min-h-[3rem] xs:min-h-[3.5rem] text-sm xs:text-base"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </span>
            ) : isFetchingRate ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 xs:w-5 xs:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Fetching rate...
              </span>
            ) : rateError ? (
              "Error - Try Again"
            ) : (
              `Generate Payment Link - KES ${amountKES}`
            )}
          </button>
        ) : (
          <div className="space-y-3 xs:space-y-4">
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 xs:py-4 px-6 rounded-lg xs:rounded-xl transition-all duration-200 transform hover:scale-[1.02] text-sm xs:text-base min-h-[3rem] xs:min-h-[3.5rem] flex items-center justify-center"
            >
              <span>Proceed to Secure Checkout</span>
              <svg
                className="w-4 h-4 xs:w-5 xs:h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <p className="text-xs xs:text-sm text-gray-600 dark:text-gray-400">
              You will be redirected to a secure payment page
            </p>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-4 xs:mt-6 pt-4 xs:pt-5 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-center gap-2 text-xs xs:text-sm text-gray-600 dark:text-gray-400">
          <svg
            className="w-4 h-4 xs:w-5 xs:h-5 text-green-500 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>256-bit SSL Encrypted • Secure Payment Processing</span>
        </div>
      </div>
    </div>
  );
}
