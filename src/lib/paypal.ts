import paypal from "@paypal/checkout-server-sdk";

function environment() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured properly");
  }

  // Use live environment in production, sandbox in development
  if (process.env.NODE_ENV === "production") {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
}

export function client() {
  try {
    return new paypal.core.PayPalHttpClient(environment());
  } catch (error) {
    console.error("Failed to create PayPal client:", error);
    throw new Error("PayPal client initialization failed");
  }
}
