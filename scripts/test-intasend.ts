// Test script to verify IntaSend API keys
// Run with: npx tsx scripts/test-intasend.ts

import IntaSend from 'intasend-node';

async function testIntaSendKeys() {
  console.log('🧪 Testing IntaSend API Keys...\n');
  
  const publishableKey = process.env.INTASEND_PUBLISHABLE_KEY;
  const secretKey = process.env.INTASEND_SECRET_KEY;
  
  if (!publishableKey || !secretKey) {
    console.error('❌ API keys not found in environment variables');
    process.exit(1);
  }
  
  console.log('✓ Keys found:');
  console.log(`  Publishable: ${publishableKey.substring(0, 20)}...`);
  console.log(`  Secret: ${secretKey.substring(0, 25)}...\n`);
  
  // Test with false (live mode)
  console.log('Testing with live mode (false)...');
  const intasendLive = new IntaSend(publishableKey, secretKey, false);
  
  try {
    const collection = intasendLive.collection();
    
    // Try a simple test - this will fail but we want to see the auth error details
    await collection.mpesaStkPush({
      first_name: 'Test',
      last_name: 'User',
      email: '[email protected]',
      host: 'https://example.com',
      amount: 10,
      phone_number: '254722000000',
      api_ref: 'test_' + Date.now(),
    });
    
    console.log('✅ Authentication successful!');
  } catch (error: any) {
    console.error('\n❌ Error occurred:');
    console.error('Status:', error.response?.status);
    console.error('Message:', error.message);
    
    if (error.response?.data) {
      const data = error.response.data;
      if (Buffer.isBuffer(data)) {
        console.error('Data (decoded):', data.toString('utf-8'));
      } else {
        console.error('Data:', JSON.stringify(data, null, 2));
      }
    }
    
    if (error.response?.status === 401) {
      console.log('\n💡 Suggestions:');
      console.log('1. Verify keys are from the correct IntaSend account');
      console.log('2. Check if keys have been regenerated in the dashboard');
      console.log('3. Ensure your IntaSend account is approved for live payments');
      console.log('4. Try regenerating the API keys in IntaSend dashboard');
      console.log('\n📍 Dashboard: https://dashboard.intasend.com/settings/api-keys');
    }
  }
}

testIntaSendKeys();
