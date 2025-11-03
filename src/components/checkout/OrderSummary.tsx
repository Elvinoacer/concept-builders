import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Design, File } from "@/generated/prisma";
import { toast } from "sonner";
import IncludedItems from "./IncludedItems";
import { calculateItemTotal } from "@/lib/calculate-total";

interface CartItem {
  quantity: number;
  cartItemId: string;
  selectedFileTypes: string[];
  selectedExtras?: any[];
  design: Design & { files: File[]; images: File[]; name: string }; // Updated to reflect nested design
}

interface OrderSummaryProps {
  items: CartItem[];
  isLoading?: boolean;
  onDiscountApplied?: (
    discountAmount: number,
    discountId: string,
    discountCode: string
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
  const taxes = 0; // 0% tax
  const totalBeforeDiscount = subtotal + taxes;
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
          discountCodeInput
        );
      }
      toast.success(`Discount "${discountCodeInput}" applied!`);
    } catch (err: any) {
      if (onDiscountApplied) {
        onDiscountApplied(0, null, null); // Reset discount in parent
      }
      setDiscountError(err.message);
      toast.error(err.message);
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-grow space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-1/5" />
            </div>
            <div className="mt-2 pl-20 space-y-2">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/5" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/5" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-1/4" />
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Order Summary
      </h2>
      <div className="space-y-4">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            >
              <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={
                    item.design.images?.[0]?.url ||
                    "/images/category-placeholder.png"
                  }
                  alt={item.design.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {item.design.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Quantity: {item.quantity}
                </p>
                <IncludedItems
                  selectedFileTypes={item.selectedFileTypes}
                  selectedExtras={item.selectedExtras}
                  design={item.design}
                />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                ${calculateItemTotal(item).toFixed(2)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Your cart is empty.
          </p>
        )}

        <Separator className="my-4" />

        <div className="space-y-2">
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Taxes</span>
            <span>${taxes.toFixed(2)}</span>
          </div>
          {appliedDiscountAmount > 0 && (
            <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
              <span>Discount</span>
              <span>-${appliedDiscountAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Discount Code
          </h3>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter discount code"
              className="dark:bg-gray-700 dark:border-gray-600"
              value={discountCodeInput}
              onChange={(e) => setDiscountCodeInput(e.target.value)}
              disabled={isApplyingDiscount}
            />
            <Button
              variant="outline"
              className="dark:border-gray-600 dark:text-white"
              onClick={handleApplyDiscount}
              disabled={isApplyingDiscount}
            >
              {isApplyingDiscount ? "Applying..." : "Apply"}
            </Button>
          </div>
          {discountError && (
            <p className="text-red-500 text-sm mt-2">{discountError}</p>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
          <span>Total (USD)</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span>Total (KES)</span>
          {isFetchingRate ? (
            <span>Loading...</span>
          ) : rateError ? (
            <span className="text-red-500">Error</span>
          ) : (
            <span>KES {totalKES}</span>
          )}
        </div>
        <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          <p>You will get immediate access to the files after purchase.</p>
          <Link
            href={`/currency-converter?amount=${total}`}
            className="text-blue-500 hover:underline"
          >
            View more conversions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
