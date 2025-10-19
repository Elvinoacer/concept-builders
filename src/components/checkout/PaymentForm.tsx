import { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

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

    const onError = (err) => {
        setError(err.message);
    };

    const [{ isPending }] = usePayPalScriptReducer();

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
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
        </div>
    );
}
