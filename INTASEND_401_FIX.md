# IntaSend 401 Authentication Error - Fix Guide

## Error Analysis

You're getting a **401 Unauthorized** error from IntaSend. This means your API credentials are not being accepted.

## Quick Fix Options

### Option 1: Use Test Mode (Recommended for Testing)

Add this to your `.env` file:

```env
# IntaSend Test Mode
INTASEND_TEST_MODE=true
INTASEND_PUBLISHABLE_KEY=ISPubKey_test_xxxxxxxx
INTASEND_SECRET_KEY=ISSecretKey_test_xxxxxxxx
```

**Test credentials:** Get these from [IntaSend Dashboard → Settings → API Keys → Test Mode](https://dashboard.intasend.com/settings/api-keys)

### Option 2: Use Live Mode (For Production)

```env
# IntaSend Live Mode
INTASEND_TEST_MODE=false
INTASEND_PUBLISHABLE_KEY=ISPubKey_live_xxxxxxxx
INTASEND_SECRET_KEY=ISSecretKey_live_xxxxxxxx
```

**Requirements for live mode:**
1. Your IntaSend account must be **verified and approved**
2. You must have completed KYC (Know Your Customer)
3. Your business must be **registered on IntaSend**

## How to Get API Keys

### Test Keys (For Development)
1. Go to https://dashboard.intasend.com
2. Navigate to **Settings** → **API Keys**
3. Click **Test** tab
4. Copy **Publishable Key** (starts with `ISPubKey_test_`)
5. Copy **Secret Key** (starts with `ISSecretKey_test_`)

### Live Keys (For Production)
1. Complete account verification in IntaSend dashboard
2. Submit required business documents
3. Wait for approval (usually 1-2 business days)
4. Once approved, go to **Settings** → **API Keys** → **Live** tab
5. Copy **Publishable Key** (starts with `ISPubKey_live_`)
6. Copy **Secret Key** (starts with `ISSecretKey_live_`)

## Environment Variable Setup

Your `.env.local` file should have:

```env
# IntaSend Configuration
INTASEND_TEST_MODE=true  # Set to false for production
INTASEND_PUBLISHABLE_KEY=ISPubKey_test_your_key_here
INTASEND_SECRET_KEY=ISSecretKey_test_your_secret_here
INTASEND_WEBHOOK_SECRET=your_webhook_secret

# App URL (required for callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your domain in production
```

## Testing the Fix

### 1. Verify Environment Variables
```bash
# In your terminal
echo $INTASEND_TEST_MODE
echo $INTASEND_PUBLISHABLE_KEY
```

### 2. Restart Your Development Server
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### 3. Check the Logs
When you make a payment, look for this log:
```
🔧 Initializing IntaSend: {
  publishableKeyStart: 'ISPubKey_t...',  # Should show 'test' or 'live'
  testMode: true,  # Should match your .env setting
  ...
}
```

### 4. Test M-Pesa STK Push

**Test Mode:**
- Use test phone number: `254722000000`
- Any PIN will work (it's simulated)
- Check IntaSend dashboard for transaction

**Live Mode:**
- Use real M-Pesa number: `254XXXXXXXXX`
- Must enter correct M-Pesa PIN
- Real money will be charged

## Common Issues & Solutions

### Issue 1: "Keys start with ISPubKey_live but in test mode"
**Solution:** Make sure `INTASEND_TEST_MODE` matches your keys:
- Test keys → `INTASEND_TEST_MODE=true`
- Live keys → `INTASEND_TEST_MODE=false`

### Issue 2: "Account not verified"
**Solution:** Complete these steps in IntaSend dashboard:
1. Upload business registration documents
2. Verify email and phone
3. Complete KYC process
4. Wait for approval email

### Issue 3: "API keys not found"
**Solution:** 
1. Create a new `.env.local` file (don't use `.env`)
2. Copy format from `.env.example`
3. Paste your actual keys
4. Restart dev server

### Issue 4: Still getting 401
**Solution:**
1. Verify keys are copied correctly (no extra spaces)
2. Check you're not using keys from different accounts
3. Ensure webhook secret matches dashboard
4. Try regenerating keys in IntaSend dashboard

## Current Error Details

Based on your logs, the system is using:
- **Publishable Key:** `ISPubKey_l...` (appears to be live key)
- **Test Mode:** Not set (defaulting to live mode)
- **Error:** 401 Unauthorized

**Most Likely Cause:** You're using live keys but your account isn't approved yet, OR the keys are incorrect.

**Recommended Action:**
1. Switch to test mode for now
2. Get test keys from dashboard  
3. Set `INTASEND_TEST_MODE=true`
4. Test the payment flow
5. Once everything works, apply for live account approval

## Support

- **IntaSend Support:** [email protected]
- **Docs:** https://developers.intasend.com
- **Dashboard:** https://dashboard.intasend.com
- **Status:** https://status.intasend.com
