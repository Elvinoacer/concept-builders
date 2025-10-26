import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from "@/components/ui/skeleton";
import { Design, File } from '@/generated/prisma';
import { toast } from 'sonner';
import IncludedItems from './IncludedItems';

interface CartItem extends Design {
  quantity: number;
  files: File[];
}

interface OrderSummaryProps {
  items: CartItem[];
  isLoading?: boolean;
  onDiscountApplied?: (discountAmount: number, discountId: string, discountCode: string) => void;
  cartTotal: number;
  appliedDiscountAmount: number; // Add appliedDiscountAmount to props
}

const getFileTypeName = (fileType: string) => {
  switch (fileType) {
    case 'CAD':
      return 'CAD File';
    case 'PDF':
      return 'PDF Document';
    case 'IMAGE':
      return '3D Renderings';
    case 'FLOOR_PLAN':
      return 'Floor Plan';
    default:
      return 'File';
  }
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, isLoading, onDiscountApplied, cartTotal, appliedDiscountAmount }) => {
  const [discountCodeInput, setDiscountCodeInput] = useState('');
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

  const subtotal = cartTotal;

  const taxes = 0; // 0% tax
  const totalBeforeDiscount = subtotal + taxes;
  const total = totalBeforeDiscount - appliedDiscountAmount; // Use appliedDiscountAmount prop

  const totalKES = usdToKesRate ? (total * usdToKesRate).toFixed(2) : 'N/A';

  const handleApplyDiscount = async () => {
    if (!discountCodeInput) {
      setDiscountError('Please enter a discount code.');
      return;
    }
    setIsApplyingDiscount(true);
    setDiscountError(null);

    try {
      const res = await fetch('/api/checkout/apply-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discountCode: discountCodeInput, cartTotal: totalBeforeDiscount }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to apply discount');
      }

      const data = await res.json();
      if (onDiscountApplied) {
        onDiscountApplied(data.discountAmount, data.discountId, discountCodeInput);
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
      <Card>
        <CardHeader>
          <CardTitle>Design Purchase Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <div className="flex justify-between"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-1/5" /></div>
            <div className="flex justify-between"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-1/5" /></div>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-1/4" />
            </div>
          </div>
          <Separator />
          <div className="flex justify-between"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-6 w-1/4" /></div>
          <div className="flex justify-between"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-1/4" /></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Design Purchase Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div key={item.id}>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 md:h-16 md:w-16 flex-shrink-0 rounded-md bg-cover bg-center">
                  <Image 
                    src={item.files?.[0]?.url || '/images/category-placeholder.png'} 
                    alt={item.name} 
                    width={64} 
                    height={64} 
                    className="rounded-md object-cover h-full w-full"
                  />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">${(item.basePrice * item.quantity + (item.selectedFileType === 'pdf' ? item.pdfPrice || 0 : item.selectedFileType === 'cad' ? item.cadPrice || 0 : item.selectedFileType === 'pdf-and-cad' ? item.pdfAndCadPrice || 0 : 0) + (item.selectedExtras?.reduce((sum, extra) => sum + extra.price, 0) || 0)).toFixed(2)}</p>
              </div>
              <IncludedItems selectedPackage={item.selectedPackage} selectedExtras={item.selectedExtras} />
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Your cart is empty.</p>
        )}
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Taxes</span>
            <span>${taxes.toFixed(2)}</span>
          </div>

          {appliedDiscountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600 dark:text-green-400 font-medium">
              <span>Discount ({discountCodeInput})</span>
              <span>-${appliedDiscountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Discount Code</h3>
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
                {isApplyingDiscount ? 'Applying...' : 'Apply'}
              </Button>
            </div>
            {discountError && <p className="text-red-500 text-sm mt-2">{discountError}</p>}
          </div>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
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
          <Link href={`/currency-converter?amount=${total}`} className="text-blue-500 hover:underline">
            View more conversions
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;