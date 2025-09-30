import { cart } from '@/lib/dummydata/cart';

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${process.env.PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store", // Ensure we always get a fresh token
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to get access token: ${data.error_description}`);
  }

  return data.access_token;
}

export const createOrder = async (data: any, actions: any) => {
    const res = await fetch('/api/paypal/create-order', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ designId: cart.items[0].id })
    });
    const { orderID } = await res.json();
    return orderID;
};

export const onApprove = async (data: any, actions: any, setPaymentStatus: (status: string) => void, setError: (error: any) => void) => {
    try {
        const res = await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderID: data.orderID })
        });
        const captureData = await res.json();
        if (captureData.status === 'COMPLETED') {
            alert('Payment successful! Capture ID: ' + captureData.captureID);
            setPaymentStatus('Payment successful! Capture ID: ' + captureData.captureID);
        } else {
            throw new Error('Payment not completed');
        }
    } catch (err) {
        setError(err.message);
    }
};