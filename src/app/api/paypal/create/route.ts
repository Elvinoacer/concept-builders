import { client } from "@/lib/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
 const body = await request.json();
 const { amount } = body;

 if (!amount || isNaN(amount) || amount <= 0) {
   return NextResponse.json(
     { error: "Valid amount is required" },
     { status: 400 }
   );
 }

 try {
   const PaypalClient = client();
   const req = new paypal.orders.OrdersCreateRequest();
   req.headers["Prefer"] = "return=representation";
   req.requestBody({
     intent: "CAPTURE",
     purchase_units: [
       {
         amount: {
           currency_code: "USD",
           value: amount.toFixed(2),
         },
       },
     ],
   });

   const response = await PaypalClient.execute(req);
   console.log("PayPal API Response:", response); // Debug log
   if (response.statusCode !== 201) {
     return NextResponse.json(
       {
         error: `Failed to create order: ${
           response.result?.message || "Unknown error"
         }`,
       },
       { status: 500 }
     );
   }

   return NextResponse.json({ orderID: response.result.id });
 } catch (error: any) {
   console.error("PayPal API Error:", error.message, error); // Enhanced error logging
   return NextResponse.json(
     { error: `Internal server error: ${error.message}` },
     { status: 500 }
   );
 }
}