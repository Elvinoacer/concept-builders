const paypal = require('@paypal/checkout-server-sdk');

// Reuse the same getPaypalClient function from above
function getPaypalClient() {
    const environment = new paypal.core.SandboxEnvironment(
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
    );
    return new paypal.core.PayPalHttpClient(environment);
}

export async function POST(req: Request) {
    const { orderID } = await req.json();

    if (!orderID) {
        return new Response(JSON.stringify({ error: 'Order ID required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const client = getPaypalClient();
        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});

        const capture = await client.execute(request);
        // Here, you can save capture details to your DB, send email receipt, etc.
        return new Response(JSON.stringify({ captureID: capture.result.id, status: capture.result.status }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to capture order' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
