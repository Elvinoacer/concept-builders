'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import StkPushForm from './StkPushForm';
import CheckoutLink from './CheckoutLink';

const IntasendPayment = () => {
  const [view, setView] = useState('options'); // 'options', 'stk', 'checkout'

  const renderView = () => {
    switch (view) {
      case 'stk':
        return <StkPushForm />;
      case 'checkout':
        return <CheckoutLink />;
      default:
        return (
          <div className="flex flex-col space-y-4">
            <Button onClick={() => setView('stk')} className="w-full bg-green-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-800">
              Pay with M-Pesa
            </Button>
            <Button onClick={() => setView('checkout')} className="w-full bg-blue-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-800">
              Get a secure payment link
            </Button>
          </div>
        );
    }
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-4">Pay with Intasend</h1>
      <div className="p-4 border rounded-lg">
        {renderView()}
      </div>
    </div>
  );
};

export default IntasendPayment;