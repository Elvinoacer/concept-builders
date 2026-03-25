import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
  const configured = clientId.trim().length > 0;

  const envMode = (process.env.PAYPAL_ENV || "").toLowerCase();
  const mode =
    envMode === "live" || envMode === "sandbox"
      ? envMode
      : process.env.NODE_ENV === "production"
        ? "live"
        : "sandbox";

  return NextResponse.json({
    configured,
    mode,
    clientId,
  });
}
