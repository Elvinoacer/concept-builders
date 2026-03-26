# Code Audit Report

Date: 2026-03-26
Scope: Data integrity, logical correctness, and integration/security checks across payment and admin APIs.

## Summary

This audit found **6 actionable issues**:

- 2 Critical
- 2 High
- 2 Medium

---

## Findings

### 1) Critical: IntaSend webhook uses `order.id` before initialization

- Area: Logical correctness / payment completion
- Evidence:
  - `src/app/api/intasend/webhook/route.ts:142`
  - `src/app/api/intasend/webhook/route.ts:165`
  - `src/app/api/intasend/webhook/route.ts:167`
- What is wrong:
  - Inside the transaction callback, `createdOrder` is created, but `orderItem.createMany` references `order.id` (outer variable) instead of `createdOrder.id`.
- Impact:
  - Runtime failure during webhook processing on successful payment callbacks, preventing order item creation and likely failing full order finalization.
- Recommendation:
  - Replace `order.id` with `createdOrder.id` in the `createMany` payload.

### 2) Critical: Cart deletion conflicts with `PaymentAttempt` foreign key restriction

- Area: Data integrity / payment workflow
- Evidence:
  - `src/app/api/intasend/stk-push/route.ts:286` (creates `PaymentAttempt` tied to `cartId`)
  - `src/app/api/intasend/webhook/route.ts:197` (deletes cart)
  - `prisma/migrations/20251122192828_payment_format/migration.sql:25` (`PaymentAttempt_cartId_fkey` has `ON DELETE RESTRICT`)
- What is wrong:
  - A `PaymentAttempt` row is created for a cart, then webhook transaction later deletes that cart without deleting/re-linking attempts.
- Impact:
  - Foreign key violation can block transaction completion, causing paid webhook processing to fail and leaving orders inconsistent.
- Recommendation:
  - One of:
    1. Change FK to `ON DELETE SET NULL` and make `cartId` nullable in `PaymentAttempt`.
    2. Keep FK strict, but update attempts to point to `orderId` (new field) and delete attempts before cart delete.
    3. Avoid cart delete; mark cart archived/checked out.

### 3) High: Multiple admin mutation APIs are unauthenticated

- Area: Integration/security
- Evidence:
  - `src/proxy.ts:64` and `src/proxy.ts:74` (middleware explicitly excludes `/api` routes)
  - Example mutation routes without `getServerSession`/role checks:
    - `src/app/api/admin/categories/route.ts:80` (`POST` creates categories)
    - `src/app/api/admin/banners/route.ts:15` (`POST` creates banners)
    - `src/app/api/admin/marquee-items/[id]/route.ts:5` (`PUT`) and `:31` (`DELETE`)
  - Additional admin API files missing session checks (from repository scan):
    - `src/app/api/admin/digitalocean-costs/route.ts`
    - `src/app/api/admin/analytics/route.ts`
    - `src/app/api/admin/marquee-items/route.ts`
    - `src/app/api/admin/marquee-items/[id]/route.ts`
    - `src/app/api/admin/banners/route.ts`
    - `src/app/api/admin/banners/[id]/route.ts`
    - `src/app/api/admin/stats/route.ts`
    - `src/app/api/admin/content/static-content/route.ts`
    - `src/app/api/admin/monthly-sales/route.ts`
    - `src/app/api/admin/custom-design-requests/route.ts`
    - `src/app/api/admin/categories/route.ts`
    - `src/app/api/admin/categories/[id]/route.ts`
    - `src/app/api/admin/historical-costs/route.ts`
    - `src/app/api/admin/client-acquisition/route.ts`
- Impact:
  - Public callers can read or mutate admin data if route handlers do not self-enforce auth/role checks.
- Recommendation:
  - Add centralized API guard helper (session + `ADMIN|TEAM` role check) and apply to all `/api/admin/*` handlers.

### 4) High: `PaymentAttempt.apiRef` is not unique, but webhook updates by `apiRef`

- Area: Data integrity / idempotency
- Evidence:
  - `prisma/schema.prisma:587` (`apiRef` field present)
  - `prisma/schema.prisma:579`-`597` (no unique constraint/index on `apiRef`)
  - `src/app/api/intasend/webhook/route.ts:199` (`updateMany({ where: { apiRef } ... })`)
- What is wrong:
  - Webhook state updates are applied by `apiRef` using `updateMany`, allowing accidental multi-row updates if duplicates occur.
- Impact:
  - Ambiguous payment attempt audit trail; multiple records may be marked complete/failed by one callback.
- Recommendation:
  - Add `@unique` on `PaymentAttempt.apiRef` and use `update`/`findUnique` flows.

### 5) Medium: IntaSend checkout route uses weaker/duplicated discount and extras handling

- Area: Logical/data consistency
- Evidence:
  - `src/app/api/intasend/checkout/route.ts:50` (`selectedExtras: item.selectedExtras as any[]`)
  - `src/app/api/intasend/checkout/route.ts:58` onward (duplicated custom discount logic)
- What is wrong:
  - This route bypasses shared `validateAndApplyDiscount` used in other payment routes and uses unsafe `any[]` cast for extras.
- Impact:
  - Risk of mismatch between checkout totals across payment methods and potential miscalculation with malformed extras JSON.
- Recommendation:
  - Reuse shared `validateAndApplyDiscount` and normalize `selectedExtras` consistently (same approach as STK/PayPal routes).

### 6) Medium: Dead/unused date calculations in admin stats route

- Area: Logic quality / maintainability
- Evidence:
  - `src/app/api/admin/stats/route.ts:6`-`8` (mutated `now`, `thirtyDaysAgo`, `sixtyDaysAgo` never used)
- What is wrong:
  - Unused and mutating date logic remains, while actual calculations are performed later with a separate date setup.
- Impact:
  - Increases confusion and risk of future regressions when editing analytics windows.
- Recommendation:
  - Remove dead date code and keep one canonical period-calculation block.

---

## Quick Fix Priority

1. Fix webhook `order.id` reference bug immediately.
2. Resolve `PaymentAttempt` ↔ cart deletion FK conflict.
3. Lock down all admin API handlers with session+role checks.
4. Add `apiRef` uniqueness and tighten webhook update logic.
5. Refactor IntaSend checkout to shared discount/normalization logic.
6. Cleanup admin stats dead date code.

---

## Notes

- Historical file `src/app/api/payment/verify/route.js` is not present in current workspace (already removed).
- Local `.env` appears not tracked by git in this repository check.
