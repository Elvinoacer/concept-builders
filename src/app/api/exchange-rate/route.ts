import { NextResponse } from 'next/server';

const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

export async function GET() {
  try {
    const response = await fetch(EXCHANGE_RATE_API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }
    const data = await response.json();
    const usdToKesRate = data.rates.KES;

    if (!usdToKesRate) {
      throw new Error('KES exchange rate not found in API response.');
    }

    return NextResponse.json({ usdToKesRate });
  } catch (error: any) {
    console.error('Error fetching USD to KES exchange rate:', error);
    return NextResponse.json(
      { message: 'Failed to fetch exchange rate', error: error.message },
      { status: 500 }
    );
  }
}
