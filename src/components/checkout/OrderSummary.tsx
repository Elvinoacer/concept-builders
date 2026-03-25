import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Design, File } from "@/generated/prisma/browser";
import { calculateItemTotal } from "@/lib/calculate-total";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import IncludedItems from "./IncludedItems";

interface CartItem {
  quantity: number;
  cartItemId: string;
  selectedFileTypes: string[];
  selectedExtras?: any[];
  design: Design & { files?: File[]; images?: File[]; name: string };
}

interface OrderSummaryProps {
  items: CartItem[];
  isLoading?: boolean;
  onDiscountApplied?: (
    discountAmount: number,
    discountId: string,
    discountCode: string,
  ) => void;
  cartTotal: number;
  appliedDiscountAmount: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  isLoading,
  onDiscountApplied,
  cartTotal,
  appliedDiscountAmount,
}) => {
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

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

  const subtotal = cartTotal;
  const baseSubtotal = items.reduce(
    (sum, item) =>
      sum +
      (typeof item.design.basePrice === "number" ? item.design.basePrice : 0) *
        item.quantity,
    0,
  );
  const addOnsTotal = Math.max(subtotal - baseSubtotal, 0);
  const taxes = 0;
  const totalBeforeDiscount = baseSubtotal + addOnsTotal + taxes;
  const total = totalBeforeDiscount - appliedDiscountAmount;

  const totalKES = usdToKesRate ? (total * usdToKesRate).toFixed(2) : "N/A";

  const handleApplyDiscount = async () => {
    if (!discountCodeInput) {
      setDiscountError("Please enter a discount code.");
      return;
    }
    setIsApplyingDiscount(true);
    setDiscountError(null);

    try {
      const res = await fetch("/api/checkout/apply-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discountCode: discountCodeInput,
          cartTotal: totalBeforeDiscount,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to apply discount");
      }

      const data = await res.json();
      if (onDiscountApplied) {
        onDiscountApplied(
          data.discountAmount,
          data.discountId,
          discountCodeInput,
        );
      }
      toast.success(`Discount "${discountCodeInput}" applied!`);
    } catch (err: any) {
      if (onDiscountApplied) {
        onDiscountApplied(0, null, null);
      }
      setDiscountError(err.message);
      toast.error(err.message);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 xs:space-y-6">
        {/* Header Skeleton */}
        <Skeleton className="h-7 xs:h-8 w-32 xs:w-40 rounded-lg" />

        {/* Cart Items Skeletons */}
        {[...Array(2)].map((_, index) => (
          <div key={index} className="space-y-3 xs:space-y-4">
            <div className="flex items-start gap-3 xs:gap-4">
              <Skeleton className="h-14 xs:h-16 w-14 xs:w-16 rounded-md xs:rounded-lg flex-shrink-0" />
              <div className="flex-grow space-y-2 min-w-0">
                <Skeleton className="h-4 xs:h-5 w-3/4 xs:w-2/3 rounded" />
                <Skeleton className="h-3 xs:h-4 w-1/3 xs:w-1/4 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-1/2 rounded" />
                  <Skeleton className="h-3 w-2/3 rounded" />
                </div>
              </div>
              <Skeleton className="h-5 xs:h-6 w-12 xs:w-16 rounded flex-shrink-0" />
            </div>
            {index < 1 && <Separator />}
          </div>
        ))}

        {/* Pricing Skeletons */}
        <div className="space-y-2 xs:space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 xs:h-5 w-16 xs:w-20 rounded" />
            <Skeleton className="h-4 xs:h-5 w-12 xs:w-16 rounded" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 xs:h-5 w-12 xs:w-16 rounded" />
            <Skeleton className="h-4 xs:h-5 w-10 xs:w-12 rounded" />
          </div>
        </div>

        {/* Discount Code Skeleton */}
        <div className="mt-4 xs:mt-6">
          <Skeleton className="h-5 xs:h-6 w-24 xs:w-32 rounded mb-2 xs:mb-3" />
          <div className="flex gap-2">
            <Skeleton className="h-10 xs:h-11 flex-1 rounded-lg" />
            <Skeleton className="h-10 xs:h-11 w-20 xs:w-24 rounded-lg" />
          </div>
        </div>

        <Separator />

        {/* Total Skeletons */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-6 xs:h-7 w-20 xs:w-24 rounded" />
            <Skeleton className="h-6 xs:h-7 w-16 xs:w-20 rounded" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 xs:h-5 w-16 xs:w-20 rounded" />
            <Skeleton className="h-4 xs:h-5 w-12 xs:w-16 rounded" />
          </div>
        </div>

        {/* Footer Text Skeleton */}
        <div className="text-center space-y-2">
          <Skeleton className="h-4 w-full max-w-xs mx-auto rounded" />
          <Skeleton className="h-4 w-32 mx-auto rounded" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 xs:mb-6 leading-tight">
        Order Summary
      </h2>

      <div className="space-y-4 xs:space-y-6">
        {/* Cart Items */}
        {items && items.length > 0 ? (
          items.map((item, index) => (
            <div
              key={item.cartItemId}
              className={`flex items-start gap-3 xs:gap-4 pb-4 xs:pb-6 ${
                index < items.length - 1
                  ? "border-b border-gray-200 dark:border-gray-700"
                  : ""
              }`}
            >
              {/* Product Image */}
              <div className="h-14 xs:h-16 sm:h-20 w-14 xs:w-16 sm:w-20 flex-shrink-0 rounded-md xs:rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <Image
                  src={
                    item.design.images?.[0]?.url ||
                    "/images/category-placeholder.png"
                  }
                  alt={item.design.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8/x8AAuMB8Dt2fQcAAAAASUVORK5CYII="
                  sizes="(max-width: 480px) 56px, (max-width: 640px) 64px, 80px"
                />
              </div>

              {/* Product Details */}
              <div className="flex-grow min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm xs:text-base leading-tight line-clamp-2 mb-1">
                  {item.design.name}
                </p>
                <p className="text-xs xs:text-sm text-gray-500 dark:text-gray-400 mb-2 xs:mb-3">
                  Quantity: {item.quantity}
                </p>
                <div className="text-xs xs:text-sm">
                  <IncludedItems
                    selectedFileTypes={item.selectedFileTypes}
                    selectedExtras={item.selectedExtras}
                    design={item.design}
                  />
                </div>
              </div>

              {/* Price */}
              <p className="font-semibold text-gray-900 dark:text-white text-sm xs:text-base flex-shrink-0 ml-2">
                ${calculateItemTotal(item).toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-6 xs:py-8">
            <div className="w-16 h-16 xs:w-20 xs:h-20 mx-auto mb-3 xs:mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 xs:w-8 xs:h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm xs:text-base">
              Your cart is empty.
            </p>
          </div>
        )}

        <Separator className="my-4 xs:my-6" />

        {/* Pricing Breakdown */}
        <div className="space-y-2 xs:space-y-3">
          <div className="flex justify-between text-gray-700 dark:text-gray-300 text-sm xs:text-base">
            <span>Subtotal (Base Plans)</span>
            <span>${baseSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300 text-sm xs:text-base">
            <span>Add-ons Total</span>
            <span>${addOnsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300 text-sm xs:text-base">
            <span>Taxes</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          {appliedDiscountAmount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400 font-medium text-sm xs:text-base">
              <span className="flex items-center gap-1 xs:gap-2">
                <svg
                  className="w-3 h-3 xs:w-4 xs:h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Discount Applied
              </span>
              <span>-${appliedDiscountAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        {/* Discount Code Section */}
        <div className="mt-4 xs:mt-6">
          <h3 className="text-base xs:text-lg font-medium text-gray-900 dark:text-white mb-2 xs:mb-3">
            Discount Code
          </h3>
          <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
            <Input
              type="text"
              placeholder="Enter discount code"
              className="dark:bg-gray-700 dark:border-gray-600 text-sm xs:text-base py-2.5 xs:py-3 flex-1"
              value={discountCodeInput}
              onChange={(e) => setDiscountCodeInput(e.target.value)}
              disabled={isApplyingDiscount}
            />
            <Button
              variant="outline"
              className="dark:border-gray-600 dark:text-white dark:hover:bg-gray-600 text-sm xs:text-base py-2.5 xs:py-3 min-w-[80px] xs:min-w-[90px]"
              onClick={handleApplyDiscount}
              disabled={isApplyingDiscount || !discountCodeInput.trim()}
            >
              {isApplyingDiscount ? (
                <span className="flex items-center gap-1 xs:gap-2">
                  <div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden xs:inline">Applying</span>
                </span>
              ) : (
                "Apply"
              )}
            </Button>
          </div>
          {discountError && (
            <p className="text-red-500 text-xs xs:text-sm mt-2 flex items-center gap-1 xs:gap-2">
              <svg
                className="w-3 h-3 xs:w-4 xs:h-4 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {discountError}
            </p>
          )}
        </div>

        <Separator className="my-4 xs:my-6" />

        {/* Total Amount */}
        <div className="space-y-2">
          <div className="flex justify-between text-lg xs:text-xl font-bold text-gray-900 dark:text-white">
            <span>Total (USD)</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm xs:text-base text-gray-600 dark:text-gray-400">
            <span>Total (KES)</span>
            {isFetchingRate ? (
              <span className="flex items-center gap-1 xs:gap-2">
                <div className="w-3 h-3 xs:w-4 xs:h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </span>
            ) : rateError ? (
              <span className="text-red-500 flex items-center gap-1 xs:gap-2">
                <svg
                  className="w-3 h-3 xs:w-4 xs:h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Error
              </span>
            ) : (
              <span className="font-semibold">KES {totalKES}</span>
            )}
          </div>
        </div>

        {/* Footer Information */}
        <div className="text-center text-xs xs:text-sm text-gray-500 dark:text-gray-400 mt-4 xs:mt-6 space-y-2">
          <p className="leading-relaxed">
            You will get immediate access to the files after purchase.
          </p>
          <Link
            href={`/currency-converter?amount=${total}`}
            className="text-blue-500 hover:underline inline-flex items-center gap-1 xs:gap-2 transition-colors"
          >
            <span>View more currency conversions</span>
            <svg
              className="w-3 h-3 xs:w-4 xs:h-4"
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
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
