import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { orderId, amount, product } = await request.json();

    // Verify payment with PayPal
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const verificationResponse = await fetch(
      `${process.env.PAYPAL_API_BASE_URL}/v2/checkout/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const orderDetails = await verificationResponse.json();

    if (orderDetails.status === 'COMPLETED') {
      // Payment is verified
      // Save to database, send confirmation email, etc.
      
      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified successfully',
        order: orderDetails 
      });
    } else {
      return NextResponse.json(
        { success: false, message: 'Payment not completed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}