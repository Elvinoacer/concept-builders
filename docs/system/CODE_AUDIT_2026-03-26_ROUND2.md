# Code Audit Report (Round 2)

Date: 2026-03-26
Scope: Additional security, logical, and integration issues discovered after initial remediation.

## Summary

This second scan found 8 additional actionable issues:

- 6 Critical
- 2 High

---

## Findings

### 1) Critical: Unauthenticated user management and role assignment

- Area: Security / authorization
- Evidence:
  - src/app/api/users/route.ts:6 (unauthenticated GET users)
  - src/app/api/users/route.ts:23 (returns full User rows via findMany without select)
  - src/app/api/users/route.ts:30 (unauthenticated POST user create)
  - src/app/api/users/route.ts:45-46 (caller controls role and password creation)
  - src/app/api/users/[id]/route.ts:47 (unauthenticated PUT user update)
  - src/app/api/users/[id]/route.ts:65 (unauthenticated DELETE user delete)
  - src/app/api/users/[id]/edit/route.ts:4 (unauthenticated edit endpoint)
  - src/app/api/users/[id]/delete/route.ts:4 (unauthenticated delete endpoint)
- Impact:
  - Any public caller can enumerate users, create privileged accounts, modify user roles/profile fields, and delete users.
- Recommendation:
  - Require session + ADMIN/TEAM role checks on all user-admin endpoints and remove duplicate legacy endpoints.

### 2) Critical: Sensitive user data and login metadata exposure

- Area: Security / data privacy
- Evidence:
  - src/app/api/users/[id]/route.ts:4 (unauthenticated GET by user id)
  - src/app/api/users/[id]/route.ts:31-35 (returns loginHistory ipAddress + timestamps)
  - src/app/api/users/route.ts:23 (raw findMany returns full model fields if not selected)
- Impact:
  - Exposure of private account metadata and login telemetry to unauthenticated callers.
- Recommendation:
  - Enforce auth and least-privilege field selection. Never expose login IP data on public endpoints.

### 3) Critical: Unauthenticated account status control (block/unblock)

- Area: Security / account integrity
- Evidence:
  - src/app/api/users/[id]/block/route.ts:4 (unauthenticated block)
  - src/app/api/users/[id]/unblock/route.ts:4 (unauthenticated unblock)
- Impact:
  - Attackers can block or reactivate arbitrary accounts.
- Recommendation:
  - Require ADMIN/TEAM authorization and audit logging for account status transitions.

### 4) Critical: Runtime bug in block endpoint parameter handling

- Area: Logical correctness
- Evidence:
  - src/app/api/users/[id]/block/route.ts:6 (`params` typed as Promise)
  - src/app/api/users/[id]/block/route.ts:10 (`params.id` used without awaiting params)
- Impact:
  - `id` is undefined at runtime; endpoint behavior is broken and may return 500 for valid calls.
- Recommendation:
  - Await params (`const { id } = await params`) before use.

### 5) Critical: Unauthenticated outbound email send endpoints

- Area: Security / abuse risk / integration misuse
- Evidence:
  - src/app/api/users/send-email/route.ts:4 (unauthenticated POST)
  - src/app/api/users/send-email/route.ts:9-14 (sends arbitrary email payload through Resend)
  - src/app/api/test-email/route.ts:4 (unauthenticated GET triggers email send)
  - src/app/api/test-email/route.ts:16 (hardcoded recipient)
- Impact:
  - Public abuse of email provider, spam relay behavior, quota burn, and reputation damage.
- Recommendation:
  - Restrict to admin-only and disable/remove test-email route in production.

### 6) Critical: Unauthenticated destructive file deletion endpoints

- Area: Security / data integrity
- Evidence:
  - src/app/api/designs/delete-file/route.ts:5 (unauthenticated POST)
  - src/app/api/designs/delete-file/route.ts:18-19, 33-34 (deletes objects and DB rows)
  - src/app/api/files/cleanup/route.ts:4 (unauthenticated POST)
  - src/app/api/files/cleanup/route.ts:9-11 (deletes file DB row by supplied id)
- Impact:
  - Arbitrary file deletion from storage/database by unauthenticated callers.
- Recommendation:
  - Require admin authorization and ownership checks before deletion.

### 7) High: Unauthenticated package option mutation/deletion can erase storage assets

- Area: Security / integration integrity
- Evidence:
  - src/app/api/package-options/[optionId]/route.ts:25 (unauthenticated PUT)
  - src/app/api/package-options/[optionId]/route.ts:104 (unauthenticated DELETE)
  - src/app/api/package-options/[optionId]/route.ts:79, 122, 125 (deletes files from Spaces and DB versions)
- Impact:
  - Unauthorized callers can alter pricing/package data and remove linked files/versions.
- Recommendation:
  - Add session + ADMIN/TEAM guard and validate ownership/scope before destructive operations.

### 8) High: FAQ answer endpoint has params Promise misuse (runtime break)

- Area: Logical correctness
- Evidence:
  - src/app/api/designs/[id]/faq/[faqIndex]/route.ts:6 (`params` typed Promise)
  - src/app/api/designs/[id]/faq/[faqIndex]/route.ts:8 (`const { id, faqIndex } = params;` without await)
- Impact:
  - `id` and `faqIndex` resolve incorrectly; endpoint can fail on valid requests.
- Recommendation:
  - Use `const { id, faqIndex } = await params;` and keep strict runtime validation.

---

## Priority Fix Order

1. Lock down all unauthenticated user management routes (users, users/[id], block/unblock, edit/delete/refund/resend).
2. Lock down all unauthenticated email and destructive file/package routes.
3. Fix Promise params handling bugs in block and faqIndex endpoints.
4. Remove legacy duplicate routes after consolidated protected handlers are in place.

---

## Notes

- These findings are additive to docs/system/CODE_AUDIT_2026-03-26.md.
- No compiler diagnostics were reported by workspace diagnostics at scan time, so most issues are runtime security/logic defects rather than type errors.
