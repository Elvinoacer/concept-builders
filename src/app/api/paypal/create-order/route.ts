const paypal = require('@paypal/checkout-server-sdk');

// Helper to get PayPal client
function getPaypalClient() {
    const environment = new paypal.core.SandboxEnvironment(
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
    );
    return new paypal.core.PayPalHttpClient(environment);
}

export async function POST(req: Request) {
    const { designId } = await req.json();

    try {
        const client = getPaypalClient();
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer('return=representation');
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'USD',
                    value: '100.00'  // Fixed $100
                },
                custom_id: designId
            }]
        });

        const order = await client.execute(request);
        return new Response(JSON.stringify({ orderID: order.result.id }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'Failed to create order' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
