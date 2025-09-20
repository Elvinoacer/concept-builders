'use client';
import React, { useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const OrderSummary = ({ items }) => {
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const taxes = subtotal * 0.08;
  const total = subtotal + taxes;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <div className="h-12 w-12 md:h-16 md:w-16 flex-shrink-0 rounded-md bg-cover bg-center">
              <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md" />
            </div>
            <div className="flex-grow">
              <p className="font-semibold text-gray-800 dark:text-white">{item.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
            </div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Shipping</span>
            <span>$0.00</span>
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
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white hover:from-blue-700 hover:to-cyan-500">
          Place Order
        </Button>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          By placing this order, you agree to our <a className="font-medium text-gray-700 underline dark:text-gray-300" href="#">Terms of Service</a>.
        </p>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
