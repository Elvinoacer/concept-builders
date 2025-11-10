import { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function PaymentForm({ designId }: { designId: string }) {
    const router = useRouter();
    const [{ isPending }] = usePayPalScriptReducer();

    const createOrder = async (data: any, actions: any) => {
        try {
            const res = await fetch('/api/paypal/create-order', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ designId })
            });
            const { orderID } = await res.json();
            return orderID;
        } catch (err) {
            toast.error(err.message);
        }
    };

    const onApprove = async (data: any, actions: any) => {
        try {
            const res = await fetch('/api/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderID: data.orderID })
            });
            const captureData = await res.json();
            if (captureData.success) {
                toast.success('Payment successful!');
                router.push(captureData.redirect_url);
            } else {
                throw new Error(captureData.error || 'Payment not completed');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const onError = (err) => {
        toast.error(err.message);
    };

    if (isPending) {
        return (
            <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-2">Loading PayPal...</span>
            </div>
        );
    }

    return (
        <div>
            <h1>Pay $100 Securely</h1>
            <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
        </div>
    );
}
