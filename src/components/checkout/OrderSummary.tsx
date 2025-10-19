'use client';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from "@/components/ui/skeleton";
import { Design } from '@/lib/dummydata';

interface CartItem extends Design {
  quantity: number;
}

interface OrderSummaryProps {
  items: CartItem[];
  isLoading?: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, isLoading }) => {
  const subtotal = useMemo(() => {
    if (!items) return 0;
    return items.reduce((acc, item) => acc + item.basePrice * item.quantity, 0);
  }, [items]);

  const taxes = 0; // 0% tax
  const total = subtotal + taxes;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Design Purchase Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-grow space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-1/5" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-md" />
              <div className="flex-grow space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-6 w-1/5" />
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-1/5" /></div>
            <div className="flex justify-between"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-1/5" /></div>
            <div className="flex justify-between"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-1/5" /></div>
          </div>
          <Separator />
          <div className="flex justify-between"><Skeleton className="h-6 w-1/3" /><Skeleton className="h-6 w-1/4" /></div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
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
            <div key={item.id} className="flex items-center gap-4">
              <div className="h-12 w-12 md:h-16 md:w-16 flex-shrink-0 rounded-md bg-cover bg-center">
                <Image 
                  src={item.images?.[0] || '/images/category-placeholder.png'} 
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
              <p className="text-lg font-semibold text-gray-900 dark:text-white">${(item.basePrice * item.quantity).toFixed(2)}</p>
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
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;