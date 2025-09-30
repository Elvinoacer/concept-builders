'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cart } from '@/lib/dummydata/cart';
import { checkoutForm } from '@/lib/dummydata/checkout';
import PayPalButton from '@/components/PayPalButton';

const CheckoutForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePaymentSuccess = (order) => {
    console.log('Payment successful:', order);
    // Handle successful payment, e.g., redirect to order confirmation page
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // Handle payment error
  };

  const totalAmount = cart.items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div>
      <h2 className="mb-4 md:mb-6 text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{checkoutForm.title}</h2>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{checkoutForm.shippingInformation.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">{checkoutForm.shippingInformation.address.label}</Label>
              <Input id="address" placeholder={checkoutForm.shippingInformation.address.placeholder} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">{checkoutForm.shippingInformation.city.label}</Label>
                <Input id="city" placeholder={checkoutForm.shippingInformation.city.placeholder} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">{checkoutForm.shippingInformation.state.label}</Label>
                <Input id="state" placeholder={checkoutForm.shippingInformation.state.placeholder} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zip">{checkoutForm.shippingInformation.zip.label}</Label>
              <Input id="zip" placeholder={checkoutForm.shippingInformation.zip.placeholder} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{checkoutForm.paymentMethod.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue="card" className="space-y-4" onValueChange={setPaymentMethod}>
              <div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">{checkoutForm.paymentMethod.creditCard}</Label>
                </div>
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pl-7 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{checkoutForm.paymentMethod.nameOnCard.label}</Label>
                      <Input id="name" placeholder={checkoutForm.paymentMethod.nameOnCard.placeholder} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="card-number">{checkoutForm.paymentMethod.cardNumber.label}</Label>
                      <Input id="card-number" placeholder={checkoutForm.paymentMethod.cardNumber.placeholder} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiration">{checkoutForm.paymentMethod.expiration.label}</Label>
                        <Input id="expiration" placeholder={checkoutForm.paymentMethod.expiration.placeholder} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">{checkoutForm.paymentMethod.cvv.label}</Label>
                        <Input id="cvv" placeholder={checkoutForm.paymentMethod.cvv.placeholder} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal">{checkoutForm.paymentMethod.paypal}</Label>
              </div>
              {paymentMethod === 'paypal' && (
                <div className="p-4">
                  <PayPalButton
                    amount={totalAmount}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    designId="placeholder-design-id" // Placeholder for now
                  />
                </div>
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intasend" id="intasend" />
                <Label htmlFor="intasend">{checkoutForm.paymentMethod.intasend}</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutForm;
