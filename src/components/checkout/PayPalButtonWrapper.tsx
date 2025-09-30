'use client';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { createOrder, onApprove } from '@/lib/paypal';

export default function PayPalButtonWrapper({ setPaymentStatus, setError, paymentStatus, error }: { setPaymentStatus: (status: string) => void, setError: (error: any) => void, paymentStatus: string | null, error: any }) {
    const [{ isPending }] = usePayPalScriptReducer();

    return (
        <>
            {isPending ? (
                <p>Loading...</p>
            ) : (
                <>
                    {paymentStatus && <div>{paymentStatus}</div>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <PayPalButtons createOrder={createOrder} onApprove={(data, actions) => onApprove(data, actions, setPaymentStatus, setError)} />
                </>
            )}
        </>
    );
}