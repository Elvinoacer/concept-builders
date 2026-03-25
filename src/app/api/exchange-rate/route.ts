import { NextResponse } from "next/server";

const EXCHANGE_RATE_API_URL = "https://api.exchangerate-api.com/v4/latest/USD";
const RATE_TTL_MS = 60 * 60 * 1000;

let cachedRate: number | null = null;
let cachedAt = 0;

export async function GET() {
  const now = Date.now();
  const isFresh = cachedRate !== null && now - cachedAt < RATE_TTL_MS;

  if (isFresh && cachedRate !== null) {
    return NextResponse.json({
      usdToKesRate: cachedRate,
      stale: false,
      fetchedAt: new Date(cachedAt).toISOString(),
    });
  }

  try {
    const response = await fetch(EXCHANGE_RATE_API_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }

    const data = await response.json();
    const usdToKesRate = Number(data?.rates?.KES);

    if (!usdToKesRate || Number.isNaN(usdToKesRate)) {
      throw new Error("KES exchange rate not found in API response.");
    }

    cachedRate = usdToKesRate;
    cachedAt = now;

    return NextResponse.json({
      usdToKesRate,
      stale: false,
      fetchedAt: new Date(cachedAt).toISOString(),
    });
  } catch (error: unknown) {
    console.error("Error fetching USD to KES exchange rate:", error);
    const message = error instanceof Error ? error.message : "Unknown error";

    if (cachedRate !== null) {
      const staleResponse = NextResponse.json({
        usdToKesRate: cachedRate,
        stale: true,
        fetchedAt: new Date(cachedAt).toISOString(),
        message: "Using stale exchange rate due to upstream failure.",
      });
      staleResponse.headers.set("x-exchange-rate-stale", "true");
      return staleResponse;
    }

    return NextResponse.json(
      { message: "Failed to fetch exchange rate", error: message },
      { status: 500 },
    );
  }
}
