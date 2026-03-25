# Cart & Checkout System — Fix & Overhaul Plan

> Codebase: `concept-builders-main` (Next.js App Router, TypeScript, Prisma, IntaSend, PayPal SDK)
> Priority: Revenue-critical. All payment issues block conversions.

---

## 1. Audit Findings — Bugs Identified

Before the plan, here is every specific issue found in the current code.

### 1.1 STK Push (IntaSend M-Pesa)

| #     | File                                  | Bug                                                                                                                                                                                                                                                                                                                   | Severity     |
| ----- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| STK-1 | `api/intasend/webhook/route.ts`       | HMAC verification uses `x-intasend-signature` header — IntaSend's actual webhook header name must be verified against their current docs. If wrong, every callback returns 401 and no order is ever created.                                                                                                          | **Critical** |
| STK-2 | `api/intasend/webhook/route.ts`       | The `api_ref` split logic does `parts.split("_")[1]` to extract `cartId`. If a future DB ID type ever contains underscores this silently extracts the wrong value and the order is never created.                                                                                                                     | Medium       |
| STK-3 | `api/intasend/stk-push/route.ts`      | No database record (e.g. a `PendingPayment` or similar) is written at STK initiation time. If the user navigates away during polling and the webhook fires, the confirmation email and redirect are correct — but the user never gets redirected because polling stopped. The order exists but the user doesn't know. | High         |
| STK-4 | `components/checkout/StkPushForm.tsx` | The `loadingToastId` approach passes the toast ID to subsequent success/error toasts correctly, but if the user clicks submit twice before the first resolves, a second polling interval is started and never cleaned up.                                                                                             | Medium       |
| STK-5 | `api/intasend/stk-push/route.ts`      | Exchange rate fallback is `130` (hardcoded). If the exchange rate API is down repeatedly, users could be charged the wrong KES amount without any warning surfaced to the UI.                                                                                                                                         | Medium       |
| STK-6 | `api/intasend/webhook/route.ts`       | On `FAILED` state, a notification is created but no `PaymentAttempt` or log record is written to the DB. There is no way to audit how many STK failures are occurring.                                                                                                                                                | Low          |

### 1.2 PayPal

| #    | File                                   | Bug                                                                                                                                                                                                                                                                                                                                        | Severity              |
| ---- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| PP-1 | `api/payment/verify/route.js`          | **Dead/stale file.** This `.js` file verifies a PayPal order via Basic auth but **never writes to the database**. It is not called anywhere in the current flow. It will silently succeed and return `{ success: true }` without creating an order. If anything ever routes traffic here, orders will be confirmed in UI but not recorded. | **Critical (remove)** |
| PP-2 | `api/paypal/create/route.ts`           | `application_context.return_url` and `cancel_url` are set. These are for the old redirect-based PayPal flow. The app uses the React JS SDK buttons (inline flow), so these fields are irrelevant but create confusion in PayPal dashboard and could cause issues if PayPal triggers a redirect fallback.                                   | Low                   |
| PP-3 | `api/paypal/capture/route.ts`          | Discount validation logic is **duplicated verbatim** across `create`, `capture`, and `stk-push` routes — roughly 60 lines each. If discount logic changes (e.g. per-user limits), it must be updated in 3 places. One place will inevitably be missed.                                                                                     | Medium                |
| PP-4 | `components/checkout/PayPalButton.tsx` | The `PayPalScriptProvider` is mounted inside the payment method selector. Every time the user switches payment methods and returns to PayPal, a new `PayPalScriptProvider` mounts, re-initialising the SDK. This can cause flicker and double-load of the PayPal JS bundle.                                                                | Medium                |
| PP-5 | `api/paypal/capture/route.ts`          | Amount mismatch tolerance is `0.01`. PayPal rounds to 2 decimal places. If the calculated total has floating-point drift (e.g. `$99.999999`), the comparison `Math.abs(captured - calculated) > 0.01` could flag a valid payment. Should round both values before comparing.                                                               | Low                   |

### 1.3 Cart Page & UX

| #    | File                                         | Bug                                                                                                                                                                                                                                                                                                     | Severity     |
| ---- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| UX-1 | `components/cart/CartItem.tsx`               | File type checkboxes use `flex flex-wrap gap-x-4 gap-y-2` with `sm:whitespace-nowrap`. On viewports between `xs` and `sm`, labels such as "Bill of Quantities (Excel)" wrap inside the flex row, creating misaligned checkbox/label pairs.                                                              | High         |
| UX-2 | `components/cart/CartItem.tsx`               | The "Selected Options Breakdown" section is good but shows zero-price options as "Included" in green with no visual separation from paid options. On small screens the table collapses awkwardly.                                                                                                       | Medium       |
| UX-3 | `components/checkout/CheckoutClientPage.tsx` | The checkout wrapper uses `bg-gray-50 / bg-white / dark:bg-gray-900` — the default Tailwind palette — completely inconsistent with the app's design system (`bg-card`, `text-cream`, `border-cb-border`, etc.). Checkout looks like a different product.                                                | High         |
| UX-4 | `lib/store/useCartStore.ts`                  | Inside `syncCart`, the code calls `setCart(serverCart)` but `setCart` at that point is an **undefined closure reference** — it should be `get().setCart(serverCart)`. Guest cart sync silently fails after login.                                                                                       | **Critical** |
| UX-5 | `lib/store/useCartStore.ts`                  | `persist` middleware is used with `name: "cart-storage"`. The entire store state (including `loading`, `error`) is persisted to `localStorage`. On next load, `loading: true` is the initial state but the persisted value could be `false`, causing a race between the hydrated value and `fetchCart`. | Medium       |

### 1.4 Toast & Feedback

| #       | File                         | Bug                                                                                                                                                                                                                                                                                                                                                                                                              | Severity |
| ------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| TOAST-1 | `StkPushForm.tsx`            | The loading toast has `duration: 10000` (10 seconds). If the STK request resolves in 2 seconds, the loading toast is replaced correctly. But on error path, two toasts can briefly overlap.                                                                                                                                                                                                                      | Low      |
| TOAST-2 | Multiple checkout components | No auto-dismiss on success toasts in the PayPal flow. `toast.success("Order created successfully")` inside `createOrder` lingers indefinitely — users see stale "order created" messages even after errors occur later in the same flow. All success toasts should have `duration: 4000`.                                                                                                                        | Medium   |
| TOAST-3 | `PayPalButton.tsx`           | `toast.dismiss(loadingToast)` is called before `toast.success(...)` on success. On error, `toast.dismiss(loadingToast)` is called before `toast.error(...)`. This is correct, but the loadingToast variable is inside `onApprove` — if `onError` fires (PayPal SDK-level error, not fetch error), `loadingToast` from the outer scope is not accessible. Error toasts stack on top of a lingering loading toast. | Medium   |

---

## 2. Fix Plan — Phased Implementation

Phases are ordered by revenue impact. Do not skip Phase 1 before Phase 2.

---

### Phase 1 — Critical Fixes (Do First)

#### 1.1 Remove Dead Payment Verification File

**File:** `src/app/api/payment/verify/route.js`

Delete this file entirely. It is not wired to any UI component and does not write to the database. Its existence is a liability.

```bash
rm src/app/api/payment/verify/route.js
```

Verify no imports reference it:

```bash
grep -r "payment/verify" src/
```

---

#### 1.2 Fix Guest Cart Sync (`syncCart` broken closure)

**File:** `src/lib/store/useCartStore.ts`

**Current (broken):**

```ts
syncCart: async () => {
  const { cart } = get();
  // ...
  const serverCart = await response.json();
  setCart(serverCart);  // ❌ setCart is undefined here
```

**Fix:**

```ts
syncCart: async () => {
  const { cart, setCart } = get();   // ✅ destructure from get()
  // ...
  const serverCart = await response.json();
  setCart(serverCart);
```

---

#### 1.3 Fix IntaSend Webhook Signature Header

**File:** `src/app/api/intasend/webhook/route.ts`

Verify the correct header name against IntaSend's current webhook documentation. The code currently reads:

```ts
const signature = req.headers.get("x-intasend-signature");
```

Cross-check the IntaSend dashboard under **Webhooks → Security**. If the header differs (e.g. `x-intasend-hmac-signature` or similar), update accordingly. If HMAC signature verification is failing, every M-Pesa payment completes on the user's phone but the order is never created in your database.

**Add explicit logging to confirm verification is working in staging:**

```ts
console.log("🔐 Webhook signature check:", {
  received: signature?.substring(0, 20),
  calculated: calculatedSignature.substring(0, 20),
  match: crypto.timingSafeEqual(provided, expected),
});
```

---

#### 1.4 Extract Shared Discount Validation Utility

**New file:** `src/lib/validate-discount.ts`

The 60-line discount validation block is duplicated in `api/intasend/stk-push/route.ts`, `api/paypal/create/route.ts`, and `api/paypal/capture/route.ts`. Extract it:

```ts
// src/lib/validate-discount.ts
import prisma from "@/lib/prisma";
import { DiscountType } from "@/generated/prisma/client";

export type DiscountResult =
  | { valid: true; discount: any; appliedAmount: number; finalTotal: number }
  | { valid: false; error: string };

export async function validateAndApplyDiscount(
  discountCode: string,
  calculatedTotal: number,
  userId: string,
): Promise<DiscountResult> {
  const discount = await prisma.discount.findUnique({
    where: { code: discountCode },
  });

  if (!discount) return { valid: false, error: "Invalid discount code" };

  if (!discount.isActive)
    return { valid: false, error: "Discount is not active" };
  if (discount.expiresAt && new Date(discount.expiresAt) < new Date())
    return { valid: false, error: "Discount has expired" };
  if (discount.maxUses && discount.uses >= discount.maxUses)
    return { valid: false, error: "Discount has reached its maximum uses" };
  if (
    discount.minPurchaseAmount &&
    calculatedTotal < discount.minPurchaseAmount
  )
    return {
      valid: false,
      error: `Minimum purchase of $${discount.minPurchaseAmount.toFixed(2)} required`,
    };

  const alreadyUsed = await prisma.order.findFirst({
    where: {
      userId,
      discountId: discount.id,
      status: { in: ["PAID", "REFUND_REQUESTED"] },
    },
  });
  if (alreadyUsed)
    return { valid: false, error: "You have already used this discount code" };

  let appliedAmount =
    discount.type === DiscountType.PERCENTAGE
      ? calculatedTotal * (discount.value / 100)
      : discount.value;

  appliedAmount = Math.min(appliedAmount, calculatedTotal);

  return {
    valid: true,
    discount,
    appliedAmount,
    finalTotal: calculatedTotal - appliedAmount,
  };
}
```

Then replace all three duplicated blocks with a call to this function.

---

#### 1.5 Fix PayPal Amount Comparison Precision

**File:** `src/app/api/paypal/capture/route.ts`

**Current:**

```ts
const capturedAmount = parseFloat(capture.amount.value);
if (Math.abs(capturedAmount - calculatedTotal) > 0.01) {
```

**Fix — round both sides to 2 decimal places before comparing:**

```ts
const capturedAmount = parseFloat(parseFloat(capture.amount.value).toFixed(2));
const expectedAmount = parseFloat(calculatedTotal.toFixed(2));
if (Math.abs(capturedAmount - expectedAmount) > 0.01) {
```

---

### Phase 2 — STK Push Reliability

#### 2.1 Persist a `PaymentAttempt` on STK Initiation

**File:** `src/app/api/intasend/stk-push/route.ts`

Add this immediately after a successful `mpesaStkPush` response. This requires either a new Prisma model or using the existing `Order` table with a `PENDING` status.

**Recommended: Add a `PaymentAttempt` model to `schema.prisma`:**

```prisma
model PaymentAttempt {
  id          String   @id @default(cuid())
  cartId      String
  userId      String
  apiRef      String   @unique
  gateway     String   // "INTASEND" | "PAYPAL"
  amountKES   Float?
  amountUSD   Float
  status      String   @default("PENDING") // PENDING | COMPLETE | FAILED | TIMEOUT
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  cart        Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

**In `stk-push/route.ts`, after a successful push:**

```ts
await prisma.paymentAttempt.create({
  data: {
    cartId: userCart.id,
    userId,
    apiRef,
    gateway: "INTASEND",
    amountKES: amountKES,
    amountUSD: calculatedTotal,
    status: "PENDING",
  },
});
```

**In `webhook/route.ts`, update it on COMPLETE/FAILED:**

```ts
await prisma.paymentAttempt.updateMany({
  where: { apiRef },
  data: { status: state === "COMPLETE" ? "COMPLETE" : "FAILED" },
});
```

This gives you a full audit trail and allows users who lose their polling session to be emailed once confirmation arrives.

---

#### 2.2 Add Idempotency to the Webhook Order Creation

**File:** `src/app/api/intasend/webhook/route.ts`

The existing check `await prisma.order.findUnique({ where: { paymentId } })` is correct but happens **after** the cart lookup. If two webhook deliveries arrive simultaneously (IntaSend retries), both can pass the idempotency check before either creates the order.

**Fix — move the idempotency check inside the `$transaction`:**

```ts
const order = await prisma.$transaction(async (tx) => {
  // Re-check inside the transaction for true idempotency
  const existing = await tx.order.findUnique({ where: { paymentId } });
  if (existing) return existing; // Already processed

  const order = await tx.order.create({ ... });
  // rest of transaction
  return order;
});
```

---

#### 2.3 Harden `apiRef` Parsing

**File:** `src/app/api/intasend/webhook/route.ts`

Make the `api_ref` → `cartId` extraction more robust. Instead of splitting on `_` and taking `parts[1]`, use a regex:

```ts
// api_ref format: cart_{cartId}_{timestamp}
const match = apiRef?.match(/^cart_(.+)_\d+$/);
const cartId = match ? match[1] : apiRef;
```

This correctly handles any cartId format regardless of internal characters.

---

#### 2.4 Prevent Duplicate STK Polling Intervals

**File:** `src/components/checkout/StkPushForm.tsx`

Add a guard at the top of `handleSubmit` to stop any existing interval before starting a new one:

```ts
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  stopPolling(); // ← Stop any existing poll before starting a new one
  // ...rest of handler
```

---

### Phase 3 — Checkout UX Overhaul

#### 3.1 Align Checkout to Design System

**File:** `src/components/checkout/CheckoutClientPage.tsx`

Replace all Tailwind default palette classes with the app's CSS variable–based design system:

| Current class      | Replace with                          |
| ------------------ | ------------------------------------- |
| `bg-white`         | `bg-card`                             |
| `bg-gray-50`       | `bg-background`                       |
| `dark:bg-gray-900` | _(remove — handled by CSS variables)_ |
| `dark:bg-gray-800` | `bg-surface`                          |
| `text-gray-500`    | `text-cream-dim`                      |
| `text-gray-900`    | `text-cream`                          |
| `shadow-md`        | `shadow-lg border border-cb-border`   |
| `rounded-lg`       | `rounded-xl`                          |

---

#### 3.2 Introduce Step Indicator

Add a 3-step progress indicator to `CheckoutClientPage.tsx` and wire step state to a local `useState`:

```
[1] Review Order  →  [2] Payment Method  →  [3] Confirm & Pay
```

Each step should be a clearly labeled pill. Step 1 is the order summary. Step 2 is the payment method selector. Step 3 is the active payment form (STK or PayPal). The user can go back from step 2 or 3.

**State shape:**

```ts
const [step, setStep] = useState<1 | 2 | 3>(1);
```

Mount the correct panel per step. Slide between steps using a CSS transition (`transform: translateX`).

---

#### 3.3 Improve Payment Method Selector UI

**File:** `src/components/checkout/PaymentMethodSelector.tsx`

Replace ambiguous buttons with bordered radio-card style selectors. Each option should:

- Display the payment logo image (already in `public/payments/`)
- Display a one-line description ("Pay via M-Pesa STK Push" / "Pay via PayPal or Card")
- Show a radio indicator on the right
- Use `border-gold` on the selected card, `border-cb-border` otherwise

```tsx
const methods = [
  {
    id: "mpesa",
    label: "M-Pesa",
    description: "STK Push to your phone",
    logo: "/payments/mpesa.png",
  },
  {
    id: "paypal",
    label: "PayPal / Card",
    description: "Credit card or PayPal account",
    logo: "/payments/paypal.png",
  },
];
```

---

#### 3.4 Move `PayPalScriptProvider` Up the Tree

**File:** `src/components/checkout/PayPalButton.tsx` and `CheckoutClientPage.tsx`

Move `PayPalScriptProvider` to the checkout page level so it mounts once and persists regardless of which payment tab is active. Pass `paypalClientId` as a prop down into the button.

```tsx
// In CheckoutClientPage.tsx
<PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD", ... }}>
  {step === 3 && selectedMethod === "paypal" && <PayPalButton ... />}
</PayPalScriptProvider>
```

Remove the `PayPalScriptProvider` from inside `PayPalButton.tsx` — it should only render `<PayPalButtons>`.

---

### Phase 4 — Cart Page UX Fixes

#### 4.1 Fix File Type Checkbox Layout

**File:** `src/components/cart/CartItem.tsx`

The current `flex flex-wrap` layout for file type options breaks on narrow screens. Swap to a 2-column responsive grid:

```tsx
{/* Replace the wrapping div around the file type map */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
  {fileTypeOptions.map((opt) => (
    <label key={opt.type} className="flex items-center gap-2.5 text-sm cursor-pointer">
      <input type="checkbox" ... />
      <span className="leading-snug">
        {opt.label}
        <span className={opt.isBase ? "text-emerald-400" : "text-gold"}>
          {opt.isBase ? " — Included" : ` — +$${getFileTypePrice(opt.type).toFixed(2)}`}
        </span>
      </span>
    </label>
  ))}
</div>
```

This prevents wrapping by giving each option its own grid cell.

---

#### 4.2 Improve the Options Breakdown Table

**File:** `src/components/cart/CartItem.tsx`

The "Selected Options Breakdown" block already has good bones. Add:

1. **File type badge** — a small pill label ("PDF", "CAD", "BOQ") to the left of each row
2. **Visual separation** between file type rows and extras rows (a subtle divider with label "File Types" and "Add-ons")
3. **Base price row** at the top showing the design's base price as the anchor

```tsx
{
  /* Top of the breakdown table */
}
<li className="flex items-center justify-between gap-3 py-2.5 opacity-70">
  <span className="text-sm text-cream-dim">
    Base Design (Architectural PDF)
  </span>
  <span className="text-sm font-semibold text-emerald-400">Included</span>
</li>;
```

---

#### 4.3 Pricing Hierarchy in the Summary

Ensure the cart summary (`OrderSummary.tsx`) shows:

1. Subtotal (sum of all items at base price)
2. Add-ons total (sum of all selected extras)
3. Discount line (if applied, shown in green with the code)
4. **Total** (bold, large)

This replaces the current single-line total that gives no breakdown.

---

### Phase 5 — Toast & Feedback Standardisation

#### 5.1 Add Duration to All Success Toasts

Search for all `toast.success(...)` calls in checkout components and add `{ duration: 4000 }` where missing:

```bash
grep -rn "toast.success(" src/components/checkout/
```

Affected: `PayPalButton.tsx` line with `"Order created successfully"`.

---

#### 5.2 Fix Loading Toast Leak in PayPal `onError`

**File:** `src/components/checkout/PayPalButton.tsx`

Move `loadingToast` to component state so it is accessible from `onError`:

```ts
const loadingToastRef = useRef<string | number | null>(null);

// In onApprove:
loadingToastRef.current = toast.loading("Processing payment...");
// On success/error:
if (loadingToastRef.current) toast.dismiss(loadingToastRef.current);

// In onError:
if (loadingToastRef.current) toast.dismiss(loadingToastRef.current);
toast.error(userFriendlyError);
```

---

#### 5.3 Add Inline Inline Status Panel for M-Pesa

The `StkPushForm.tsx` already renders an inline status banner when `status !== "idle"`. This is correct. Ensure the banner is also shown (with a pulsing indicator) during the `"awaiting"` state rather than relying solely on the toast:

```tsx
{
  status === "awaiting" && (
    <div className="flex items-center gap-3 rounded-lg border border-[var(--border-gold)] bg-[rgba(200,137,42,0.12)] px-4 py-3">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      <div>
        <p className="text-sm font-semibold text-gold">
          Waiting for M-Pesa confirmation
        </p>
        <p className="text-xs text-cream-dim mt-0.5">
          Check your phone and enter your PIN
        </p>
      </div>
    </div>
  );
}
```

---

### Phase 6 — System Reliability & Observability

#### 6.1 Persist Zustand `loading` State Outside Store

**File:** `src/lib/store/useCartStore.ts`

Exclude transient state from `localStorage` persistence. Use the `partialize` option:

```ts
persist(
  (set, get) => ({ ... }),
  {
    name: "cart-storage",
    partialize: (state) => ({
      cart: state.cart,
      cartId: state.cartId,
      appliedDiscountAmount: state.appliedDiscountAmount,
      appliedDiscountId: state.appliedDiscountId,
      appliedDiscountCode: state.appliedDiscountCode,
      // Do NOT persist: loading, error
    }),
  }
)
```

---

#### 6.2 Add Structured Payment Logging

In both `stk-push/route.ts` and `paypal/capture/route.ts`, replace ad-hoc `console.log` calls with a structured logger that includes a consistent set of fields:

```ts
// src/lib/payment-logger.ts
export function logPaymentEvent(event: string, data: Record<string, unknown>) {
  const entry = {
    timestamp: new Date().toISOString(),
    event,
    ...data,
  };
  console.log(`[PAYMENT] ${JSON.stringify(entry)}`);
}
```

Key events to log:

- `STK_PUSH_INITIATED` — `{ userId, cartId, apiRef, amountKES, amountUSD }`
- `STK_PUSH_SUCCESS` — `{ apiRef }`
- `STK_PUSH_FAILED` — `{ apiRef, error }`
- `WEBHOOK_RECEIVED` — `{ state, apiRef, paymentId }`
- `WEBHOOK_ORDER_CREATED` — `{ orderId, cartId, amountUSD }`
- `PAYPAL_CAPTURE_SUCCESS` — `{ orderId, capturedAmount, userId }`
- `PAYPAL_CAPTURE_FAILED` — `{ orderID, error }`

---

#### 6.3 Validate Exchange Rate Staleness

**File:** `src/app/api/exchange-rate/route.ts` (or wherever this is implemented)

Add a cache timestamp check. If the stored exchange rate is older than 1 hour, force a refresh. If the refresh fails, log an error and respond with the stale value **plus a warning header** so the STK push route can surface a UI warning:

```ts
// In stk-push/route.ts
if (exchangeRateData.stale) {
  console.warn("Using stale exchange rate. Live rate unavailable.");
}
```

---

## 3. File Change Summary

| File                                                | Change Type                                                          | Phase |
| --------------------------------------------------- | -------------------------------------------------------------------- | ----- |
| `src/app/api/payment/verify/route.js`               | **Delete**                                                           | 1     |
| `src/lib/store/useCartStore.ts`                     | Fix `syncCart` closure; fix `partialize`                             | 1, 6  |
| `src/app/api/intasend/webhook/route.ts`             | Fix header check; idempotency; `apiRef` regex; logging               | 1, 2  |
| `src/lib/validate-discount.ts`                      | **New file** — shared discount utility                               | 1     |
| `src/app/api/intasend/stk-push/route.ts`            | Use shared discount; add `PaymentAttempt`; logging                   | 1, 2  |
| `src/app/api/paypal/create/route.ts`                | Use shared discount; remove `application_context` redirect URLs      | 1, 3  |
| `src/app/api/paypal/capture/route.ts`               | Use shared discount; fix amount rounding; logging                    | 1     |
| `src/components/checkout/StkPushForm.tsx`           | Fix duplicate polling; improve awaiting banner                       | 2, 5  |
| `src/components/checkout/CheckoutClientPage.tsx`    | Design system alignment; step indicator; move `PayPalScriptProvider` | 3     |
| `src/components/checkout/PaymentMethodSelector.tsx` | Radio-card UI redesign                                               | 3     |
| `src/components/checkout/PayPalButton.tsx`          | Remove `PayPalScriptProvider`; fix toast leak via ref                | 3, 5  |
| `src/components/cart/CartItem.tsx`                  | Grid layout for file types; improved breakdown table                 | 4     |
| `src/components/checkout/OrderSummary.tsx`          | Pricing hierarchy (subtotal → add-ons → discount → total)            | 4     |
| `src/lib/payment-logger.ts`                         | **New file** — structured logging utility                            | 6     |
| `prisma/schema.prisma`                              | Add `PaymentAttempt` model                                           | 2     |

---

## 4. Testing Checklist

Run this manually after each phase in the staging environment before deploying.

### M-Pesa (STK Push)

- [ ] Submit valid phone number → STK notification arrives on phone
- [ ] Approve on phone → polling detects PAID, redirects to confirmation
- [ ] Decline on phone → polling detects FAILED, shows retry message
- [ ] Close tab mid-flow → reopen checkout → order exists and confirmation email was sent
- [ ] Trigger duplicate webhook delivery → only one order created (idempotency)
- [ ] Submit with invalid phone → inline error, no STK sent
- [ ] Click submit twice rapidly → only one polling interval running

### PayPal

- [ ] Complete a PayPal payment → order created with correct amount, redirect fires
- [ ] Cancel PayPal popup → toast shows "cancelled", no order created
- [ ] Simulate `INSTRUMENT_DECLINED` → correct error message surfaced
- [ ] Discount code applied → captured amount matches discounted total
- [ ] Confirm `api/payment/verify/route.js` is deleted and no 404s appear in logs

### Cart

- [ ] Add item with all file types checked → breakdown shows all rows with prices
- [ ] View cart on mobile (375px) → no wrapping or overflow in file type list
- [ ] Apply discount → summary shows discount line in green
- [ ] Remove item → cart updates, total recalculates
- [ ] Log in as guest with items → guest cart syncs to account on login

### General

- [ ] Rapid double-click on any payment CTA → only one request sent (button disabled state)
- [ ] Navigate away during checkout → no console errors, no zombie intervals
- [ ] Toast count on checkout page never exceeds 2 at once
