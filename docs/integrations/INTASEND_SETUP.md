# IntaSend STK Push Payment Flow - Setup & Documentation

## Overview
The system is fully configured to handle M-Pesa STK Push payments through IntaSend. Here's how it works:

## Payment Flow

### 1. Customer Initiates Payment
**File:** `src/components/checkout/StkPushForm.tsx`

- Customer enters M-Pesa phone number
- Frontend sends request to `/api/intasend/stk-push`
- Customer receives STK Push prompt on phone

### 2. STK Push API Processes Request
**File:** `src/app/api/intasend/stk-push/route.ts`

- Validates customer details and cart
- Fetches USD to KES exchange rate
- Calculates total in KES
- Formats phone number (254XXXXXXXXX)
- Sends STK Push request to IntaSend
- Returns success response to frontend

### 3. IntaSend Webhook Receives Payment Confirmation
**File:** `src/app/api/intasend/webhook/route.ts`

When payment is complete, IntaSend calls: `https://your-domain.com/api/intasend/webhook`

Webhook:
- Verifies signature using `INTASEND_WEBHOOK_SECRET`
- Extracts cart ID from `api_ref` (format: `cart_{cartId}_{timestamp}`)
- Creates Order with status "PAID"
- Creates OrderItems from cart
- Increments discount usage if applicable
- Creates notification for user
- Sends email notifications
- Sends push notifications (admin & user)

### 4. Frontend Polls for Order Status
**File:** `src/components/checkout/StkPushForm.tsx` (lines 86-111)

- Polls `/api/orders/status?cartId={cartId}` every 5 seconds
- Checks if order status is "PAID"
- Stops polling after 5 minutes or when status changes

### 5. Redirect to Confirmation Page
When order status is "PAID":
- Stops polling
- Shows success toast
- Redirects to `/purchase-confirmation?purchaseId={orderId}`

## Required Environment Variables

```env
# IntaSend Credentials
INTASEND_PUBLISHABLE_KEY=ISPubKey_live_...
INTASEND_SECRET_KEY=ISSecretKey_live_...
INTASEND_WEBHOOK_SECRET=your_webhook_secret

# App URL (for webhook callback)
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

## IntaSend Dashboard Setup

### 1. Get API Keys
1. Log in to [IntaSend Dashboard](https://dashboard.intasend.com)
2. Go to **Settings** → **API Keys**
3. Copy **Publishable Key** and **Secret Key**
4. Save them to your `.env` file

### 2. Configure Webhook
1. Go to **Settings** → **Webhooks**
2. Add webhook URL: `https://your-domain.com/api/intasend/webhook`
3. Select events to track: **Payment Complete**, **Payment Failed**
4. Copy the **Webhook Secret**
5. Save it to your `.env` as `INTASEND_WEBHOOK_SECRET`

### 3. Test vs Live Mode
- **Test Mode**: Use test keys (free, uses fake payments)
  - Test phone: `254722000000`
  - IntaSend dashboard shows test transactions
- **Live Mode**: Use live keys (real payments)
  - Requires IntaSend account approval
  - Real M-Pesa transactions

## Testing Checklist

- [ ] Environment variables configured
- [ ] Webhook URL registered in IntaSend dashboard
- [ ] Test STK Push with test credentials
- [ ] Verify webhook receives payment notification
- [ ] Check order created in database
- [ ] Confirm redirect to purchase confirmation page
- [ ] Test with real M-Pesa number (live mode)

## Troubleshooting

### STK Push Not Working
- Check API keys are correct (live vs test)
- Verify phone number format: `254XXXXXXXXX`
- Check IntaSend dashboard for errors
- Review server logs for API errors

### Webhook Not Receiving Notifications
- Verify webhook URL is publicly accessible
- Check `INTASEND_WEBHOOK_SECRET` matches dashboard
- Test webhook signature verification
- Review IntaSend dashboard webhook logs

### Order Not Created
- Check webhook is receiving notifications
- Verify cart ID format in `api_ref`
- Check database for order creation errors
- Review webhook logs in server console

## Recent Fixes

### 1. Fixed STK Push Parameters (2025-12-07)
**Issue:** STK Push was failing due to incorrect parameters

**Fix:** Removed unsupported parameters from `mpesaStkPush()`:
- ❌ Removed `currency: "KES"` (automatically set)
- ❌ Removed `callback_url` (configured in dashboard)
- ❌ Removed `narrative` (not supported by Node SDK)

✅ Now only sends required parameters per IntaSend Node SDK documentation

### 2. Fixed Cart Item Params (2025-12-07)
**Issue:** Cart edit/delete was failing with "Item ID is required"

**Fix:** Updated `/api/cart/items/[itemId]/route.ts` to await params Promise per Next.js 16

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/intasend/stk-push` | POST | Initiate M-Pesa STK Push |
| `/api/intasend/webhook` | POST | Receive payment notifications |
| `/api/orders/status` | GET | Check order status by cart ID |
| `/api/exchange-rate` | GET | Get current USD to KES rate |
