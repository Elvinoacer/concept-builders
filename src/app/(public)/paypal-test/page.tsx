'use client';

import PaymentForm from "@/components/checkout/PaymentForm";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export default function PaypalTestPage() {
    const initialOptions = {
        "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <div>
                <PaymentForm designId="test-design-id" />
            </div>
        </PayPalScriptProvider>
    )
}