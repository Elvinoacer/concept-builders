import { client } from "@/lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { cart } = body;

  const totalAmount = cart.reduce((total: number, item: any) => {
    return total + (item.design?.basePrice || 0) * item.quantity;
  }, 0);

  // Enhanced validation
  if (isNaN(totalAmount) || totalAmount <= 0) {
    return NextResponse.json(
      { error: "Valid total amount is required and must be greater than 0" },
      { status: 400 }
    );
  }

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    return NextResponse.json(
      { error: "Cart is empty or invalid" },
      { status: 400 }
    );
  }

  if (totalAmount < 0.01) {
    return NextResponse.json(
      { error: "Total amount must be at least $0.01" },
      { status: 400 }
    );
  }

  try {
    const PaypalClient = client();
    const req = new paypal.orders.OrdersCreateRequest();
    req.headers["Prefer"] = "return=representation";

    // Enhanced order creation with better item details
    const itemTotal = cart.reduce((total: number, item: any) => {
      return total + (item.design?.basePrice || 0) * item.quantity;
    }, 0);

    req.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: itemTotal.toFixed(2),
              },
            },
          },
          items: cart.map((item: any, index: number) => ({
            name: item.design?.title || `Design Item ${index + 1}`,
            description: item.design?.description || "Digital design product",
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: "USD",
              value: (item.design?.basePrice || 0).toFixed(2),
            },
          })),
        },
      ],
      application_context: {
        brand_name: "Concept Builders",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${process.env.NEXTAUTH_URL}/purchase-confirmation`,
        cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
      },
    });

    const response = await PaypalClient.execute(req);

    if (response.statusCode !== 201) {
      console.error("PayPal Order Creation Failed:", {
        status: response.statusCode,
        error: response.result,
      });

      return NextResponse.json(
        {
          error: `Failed to create order: ${
            response.result?.message ||
            `PayPal API error (${response.statusCode})`
          }`,
        },
        { status: 500 }
      );
    }

    console.log("PayPal Order Created Successfully:", {
      orderID: response.result.id,
      amount: amount,
      status: response.result.status,
    });

    return NextResponse.json({
      orderID: response.result.id,
      status: response.result.status,
    });
  } catch (error: any) {
    console.error("PayPal Order Creation Error:", {
      message: error.message,
      stack: error.stack,
      amount: totalAmount,
    });

    let errorMessage = "Internal server error during order creation";
    if (error.message?.includes("currency")) {
      errorMessage = "Currency not supported for payment";
    } else if (error.message?.includes("authentication")) {
      errorMessage = "Payment authentication failed";
    }

    return NextResponse.json(
      { error: `${errorMessage}: ${error.message}` },
      { status: 500 }
    );
  }
}
