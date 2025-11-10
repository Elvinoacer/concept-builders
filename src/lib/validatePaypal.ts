
import { client } from './paypal';
import paypal from '@paypal/checkout-server-sdk';

export async function validatePayPalCredentials() {
  try {
    const request = new paypal.core.AccessTokenRequest(client().environment);
    const response = await client().execute(request);
    console.log('PayPal access token:', response.result.access_token);
    return { success: true, data: response.result };
  } catch (error) {
    console.error('Failed to get PayPal access token:', error);
    return { success: false, error: error };
  }
}
