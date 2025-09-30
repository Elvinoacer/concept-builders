import { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

export default function PaymentForm({ designId }: { designId: string }) {
    const [error, setError] = useState(null);

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
            setError(err.message);
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
            if (captureData.status === 'COMPLETED') {
                alert('Payment successful! Capture ID: ' + captureData.captureID);
            } else {
                throw new Error('Payment not completed');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const initialOptions = {
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
        currency: "USD",
        intent: "capture",
        components: "buttons",
      };

    return (
        <div>
            <h1>Pay $100 Securely</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
            </PayPalScriptProvider>
        </div>
    );
}
