'use client';
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
      <RadioGroup
        value={selectedMethod}
        onValueChange={onSelect}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="paypal" id="paypal-radio" />
          <Label htmlFor="paypal">PayPal</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="intasend" id="intasend" />
          <Label htmlFor="intasend">Other Payment Options (Intasend)</Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
