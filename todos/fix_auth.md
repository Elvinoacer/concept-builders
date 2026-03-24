# Concept Builders — Authentication Audit & Fix Plan

> Full-stack audit covering: signup, email verification, forgot/reset password, JWT sessions, role enrichment, impersonation, login history, referral cookie capture, and the unauthenticated checkout/designs flow.
> Every finding maps to a specific file and line. Fixes are ready to implement.

---

## Summary

| Severity       | Count |
| -------------- | ----- |
| 🔴 Critical    | 4     |
| 🟠 High        | 6     |
| 🟡 Medium      | 5     |
| 🟢 Low / Info  | 4     |
| 🎨 Design / UX | 4     |

---

## 🔴 CRITICAL

---

### C-01 — Admin `reset-password` endpoint has **zero authentication**

**File:** `src/app/api/users/[id]/reset-password/route.ts`

**Problem:**
This endpoint nullifies a user's `hashedPassword` and sets their status to `ACTIVE` with no session check whatsoever. Any unauthenticated request to `POST /api/users/<any-id>/reset-password` locks any user out of their account permanently (password becomes `null`, credentials login breaks).

```ts
// CURRENT — no auth guard at all
export async function POST(request: Request, { params }) {
  const { id } = await params;
  const user = await prisma.user.update({
    where: { id },
    data: { hashedPassword: null, status: "ACTIVE" }, // ← wipes password for anyone
  });
  return NextResponse.json(user);
}
```

**Fix:**

```ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    (session.user.role !== "ADMIN" && session.user.role !== "TEAM")
  ) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = await params;

  // Generate a secure temporary password instead of nulling it
  const tempPassword = crypto.randomUUID().slice(0, 12);
  const hashedTemp = await bcrypt.hash(tempPassword, 10);

  const user = await prisma.user.update({
    where: { id },
    data: { hashedPassword: hashedTemp, status: "ACTIVE" },
  });

  // Return the temp password to the admin so they can share it with the user
  return NextResponse.json({ success: true, temporaryPassword: tempPassword });
}
```

---

### C-02 — Login history API has **zero authentication**

**File:** `src/app/api/users/[id]/login-history/route.ts`

**Problem:**
`GET /api/users/<any-id>/login-history` returns every login timestamp and IP address for any user ID with no session check. This is a full PII exposure endpoint — anyone can enumerate IP addresses of all users.

```ts
// CURRENT — no session check
export async function GET(req: NextRequest, { params }) {
  const { id } = await params;
  const loginHistory = await prisma.loginHistory.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(loginHistory);
}
```

**Fix:**

```ts
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Admins can view anyone. Clients can only view their own.
  if (
    session.user.role !== "ADMIN" &&
    session.user.role !== "TEAM" &&
    session.user.id !== id
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const loginHistory = await prisma.loginHistory.findMany({
    where: { userId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(loginHistory);
}
```

---

### C-03 — `globalThis.tempSignInIp` is a **concurrent-request race condition**

**File:** `src/app/api/auth/[...nextauth]/route.ts` — lines 119–121, 229, 245

**Problem:**
IP capture works by writing to `globalThis.tempSignInIp` in the HTTP handler, then reading it inside the `signIn` event. Under any concurrent load, two users signing in simultaneously will steal each other's IP addresses. User A's IP gets written, User B's overwrites it before User A's event fires — User A gets logged with User B's IP, or "Unknown". This is both incorrect and a privacy concern.

```ts
// CURRENT — global mutable shared state
globalThis.tempSignInIp = ip; // written in HTTP handler
const ipAddress = globalThis.tempSignInIp; // read in async signIn event — RACE
delete globalThis.tempSignInIp;
```

**Fix — use the NextAuth `req` object passed to the authorize callback instead:**

The cleanest solution is to capture IP directly inside the `authorize` function for credentials, and for Google OAuth capture it in the `signIn` callback which receives the `request` object in NextAuth v4 via `req`:

```ts
// In authOptions, add pages and use a custom signIn callback approach.
// Best pattern: store IP per-token using a Map keyed by a short-lived nonce.

// Option A (simpler): capture IP in authorize for credentials
async authorize(credentials, req) {
  // req.headers is available here
  const forwarded = req?.headers?.["x-forwarded-for"];
  const ip = Array.isArray(forwarded)
    ? forwarded[0]
    : forwarded?.split(",")[0] ?? "Unknown";

  // store on a WeakMap or pass via token
  (credentials as any)._ip = ip;
  // ...rest of authorize
}

// Option B (recommended for both providers): use a per-request Map
const ipMap = new Map<string, string>(); // nonce → ip, cleared after use

// In getHandler/postHandler, generate a nonce, store ip, pass nonce via cookie
// In signIn event, read nonce from cookie, look up ip, delete entry
```

For immediate safe fix with minimal change — use a `Map` instead of `globalThis`:

```ts
// Replace globalThis with a short-lived Map (safe under concurrency)
const pendingIps = new Map<string, string>(); // requestId → ip

// In getHandler / postHandler:
const requestId = crypto.randomUUID();
res?.setHeader?.("x-request-id", requestId); // if available
pendingIps.set(requestId, ip);
setTimeout(() => pendingIps.delete(requestId), 10_000); // safety cleanup

// In signIn event — pass requestId via a signed cookie instead of globalThis
```

> **Immediate mitigation:** capture IP in the `authorize` callback for credentials (has access to `req`). For Google OAuth the `signIn` callback in NextAuth v4 receives `req` when using the `pages` option — use that.

---

### C-04 — `callbacks.signOut` does **not exist** in NextAuth — impersonation state is **never cleared on logout**

**File:** `src/app/api/auth/[...nextauth]/route.ts` — line 146

**Problem:**
`signOut` is placed inside the `callbacks` block. NextAuth v4 has no `callbacks.signOut` — only `events.signOut`. This means when an admin who is impersonating a user logs out, `impersonatingUserId` in the database is **never set to null**. On next login, the JWT callback will still read `impersonatingUserId` from the DB and immediately re-enter impersonation mode — the admin is permanently stuck impersonating the last user they were impersonating.

```ts
// CURRENT — dead code, never called
callbacks: {
  async signIn(...) { ... },
  async signOut({ token }) {   // ← THIS DOES NOT EXIST in NextAuth callbacks
    await prisma.user.update({ data: { impersonatingUserId: null } });
  },
  async jwt(...) { ... },
}
```

**Fix — move it to `events`:**

```ts
events: {
  async signIn({ user, isNewUser }) {
    // ... existing login history + referral logic
  },
  async signOut({ token }) {
    // This is the CORRECT location. events.signOut fires reliably.
    const userId = (token?.impersonator as { id: string })?.id ?? (token?.id as string);
    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { impersonatingUserId: null },
      }).catch(() => {}); // don't throw on logout
    }
  },
},
```

---

## 🟠 HIGH

---

### H-01 — `params.id` used **without awaiting** in impersonate route

**File:** `src/app/api/users/[id]/impersonate/route.ts` — line 18

**Problem:**
In Next.js 15+, route params are a `Promise`. `params.id` without `await` returns `undefined`, causing the `prisma.user.findUnique` call to silently fail (`user = null`) and the endpoint to always return 404.

```ts
// CURRENT — params not awaited
const targetUser = await prisma.user.findUnique({
  where: { id: params.id }, // params is Promise<{id}>, params.id = undefined
});
```

**Fix:**

```ts
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // ← await first

  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const targetUser = await prisma.user.findUnique({ where: { id } });
  // ...
}
```

---

### H-02 — `accessTokenExpires` calculation is **mathematically wrong**

**File:** `src/app/api/auth/[...nextauth]/route.ts` — line 165–166

**Problem:**
`account.expires_at` from OAuth providers is an **absolute Unix timestamp in seconds** (e.g., `1727000000`). The code multiplies it by 1000 and adds `Date.now()`:

```ts
token.accessTokenExpires = Date.now() + (account.expires_at ?? 0) * 1000;
// = ~1.7 trillion ms + ~1.7 trillion ms = ~year 2124
```

This means `Date.now() < token.accessTokenExpires` is always true, so the token **never refreshes**. Users will eventually get stale/revoked Google access tokens silently.

**Fix:**

```ts
// account.expires_at is already an absolute Unix timestamp (seconds)
token.accessTokenExpires = (account.expires_at ?? 0) * 1000; // convert to ms, don't add Date.now()
```

---

### H-03 — Email verification **leaks user existence** on resend endpoint

**File:** `src/app/api/auth/verify-email/route.ts` — lines 19–25

**Problem:**
The forgot-password endpoint correctly returns a generic message for unknown emails. But the `POST /api/auth/verify-email` (resend verification) endpoint returns `404 { message: "User not found" }` for unknown emails. This allows enumeration of registered email addresses.

```ts
// CURRENT — leaks existence
if (!user) {
  return NextResponse.json(
    { success: false, message: "User not found" },
    { status: 404 }, // ← tells attacker this email is NOT registered
  );
}
```

**Fix — match the forgot-password pattern:**

```ts
if (!user) {
  // Same response regardless — don't reveal whether email exists
  return NextResponse.json(
    {
      success: true,
      message: "If this account exists, a verification link has been sent.",
    },
    { status: 200 },
  );
}

// Also check if already verified — don't re-issue token needlessly
if (user.emailVerified) {
  return NextResponse.json(
    {
      success: true,
      message: "This email is already verified. Please log in.",
    },
    { status: 200 },
  );
}
```

---

### H-04 — Credential login **ignores email verification status**

**File:** `src/app/api/auth/[...nextauth]/route.ts` — `authorize` callback (lines 71–99)

**Problem:**
A user who registers with email/password but never verifies their email can log in immediately. The `authorize` function checks password correctness but never checks `user.emailVerified`. This means the email verification step is purely cosmetic — it has zero enforcement.

```ts
// CURRENT — no emailVerified check
const isCorrectPassword = await bcrypt.compare(
  credentials.password,
  user.hashedPassword,
);
if (!isCorrectPassword) throw new Error("Incorrect password");
return user; // ← returns unverified user, login succeeds
```

**Fix:**

```ts
if (!isCorrectPassword) {
  throw new Error("Incorrect password");
}

if (!user.emailVerified) {
  throw new Error("EMAIL_NOT_VERIFIED"); // use a code, not a message
}

return user;
```

Then in `LoginForm.tsx`, detect this error code and show a targeted message with a "Resend verification" link:

```ts
// In LoginForm handleSubmit
if (result?.error === "EMAIL_NOT_VERIFIED") {
  setError("Please verify your email before logging in.");
  setShowResendVerification(true); // trigger resend UI
}
```

---

### H-05 — `handleBuyNow` forces **Google OAuth only** for unauthenticated checkout

**File:** `src/app/(public)/designs/[id]/page.tsx` — line 376

**Problem:**
When an unauthenticated user clicks "Buy Now", the code hard-codes `signIn("google", ...)`. Users who registered with email/password are forced into a Google sign-in flow, which either creates a duplicate account or fails with `allowDangerousEmailAccountLinking: false`. There is no way for a credentials user to complete "Buy Now" without first navigating to `/auth` manually.

```ts
// CURRENT — forces Google, breaks credentials users
} else {
  signIn("google", { callbackUrl: "/checkout" });
}
```

**Fix — redirect to `/auth` with callbackUrl and intent:**

```ts
} else {
  // Preserve cart item added to localStorage, then send to auth page
  router.push(`/auth?callbackUrl=${encodeURIComponent("/checkout")}`);
}
```

This lets the user choose their sign-in method. After login, `CartSync` handles merging the local cart automatically.

---

### H-06 — Referral cookie capture is broken for **social (Google) signups**

**File:** `src/components/auth/SocialLogins.tsx` — line 11–12  
**File:** `src/app/api/auth/[...nextauth]/route.ts` — lines 130–137

**Problem:**
`SocialLogins.tsx` reads `sessionStorage.getItem("referral")` and passes it as a parameter to `signIn("google", { referral })`. However, NextAuth does not forward custom `signIn()` options to the server-side `signIn` event. The event handler reads `cookies().get("referral")` — an HTTP cookie that was **never set**. The referral source is silently dropped for every Google signup.

Additionally, `sessionStorage` is wiped when the Google OAuth redirect happens (cross-origin navigation), so even if the code were correct, the value would be gone.

**Fix — set a proper HTTP cookie on the server before redirecting:**

Step 1 — Add an API endpoint to set the referral cookie:

```ts
// src/app/api/auth/set-referral/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { referral } = await req.json();
  if (!referral || typeof referral !== "string") {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set("referral", referral.slice(0, 64), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days — survives OAuth redirect
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
```

Step 2 — In `SocialLogins.tsx`, call the endpoint before `signIn`:

```ts
const handleSignIn = async (provider: string) => {
  const referral =
    new URLSearchParams(window.location.search).get("referral") ??
    sessionStorage.getItem("referral");

  if (referral) {
    await fetch("/api/auth/set-referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referral }),
    });
  }

  signIn(provider, { callbackUrl });
};
```

Step 3 — The existing `signIn` event in `[...nextauth]/route.ts` already reads the cookie correctly. No change needed there.

---

## 🟡 MEDIUM

---

### M-01 — `verify-email/confirm` redirects to the **API route's own origin**, not the app

**File:** `src/app/api/auth/verify-email/confirm/route.ts` — line 41

**Problem:**

```ts
return NextResponse.redirect(new URL("/auth?verified=true", request.url));
```

`request.url` is the URL of the API route itself: `https://domain.com/api/auth/verify-email/confirm?token=...`. `new URL("/auth?verified=true", request.url)` correctly strips the path — but **only if `NEXTAUTH_URL` is set correctly**. If the app is behind a reverse proxy and `request.url` resolves to an internal address, the redirect goes to the wrong host. Use `process.env.NEXTAUTH_URL` explicitly:

```ts
const appUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
return NextResponse.redirect(new URL("/auth?verified=true", appUrl));
```

---

### M-02 — `auth/page.tsx` is a **Server Component wrapping Client Components that use `useSearchParams`** — no Suspense boundary

**File:** `src/app/(public)/auth/page.tsx`  
**Affected:** `LoginForm.tsx` (line 17), `SocialLogins.tsx` (line 7)

**Problem:**
Both `LoginForm` and `SocialLogins` call `useSearchParams()` directly. In Next.js App Router, `useSearchParams` requires the component to be wrapped in `<Suspense>`. Without it, the entire auth page will throw a hydration error or fail to render `callbackUrl` correctly in production builds (static rendering breaks).

**Fix — wrap in Suspense in `AuthForm.tsx`:**

```tsx
import { Suspense } from "react";

// In AuthForm renderForm():
case "login":
  return (
    <Suspense fallback={<div className="h-10" />}>
      <LoginForm setAuthMode={setAuthMode} />
    </Suspense>
  );

// And wrap SocialLogins at the bottom:
{authMode !== "emailVerification" && (
  <Suspense fallback={null}>
    <SocialLogins />
  </Suspense>
)}
```

---

### M-03 — `addToCart` returns a **synchronous boolean** but `handleBuyNow` `await`s it

**File:** `src/app/(public)/designs/[id]/page.tsx` — lines 371–373  
**File:** `src/lib/store/useCartStore.ts` — `addToCart` function

**Problem:**
`addToCart` in the store fires an async IIFE internally but returns a synchronous `boolean`. `handleBuyNow` does `await addToCart(...)` — this `await` resolves immediately (awaiting a non-Promise returns it as-is), so `router.push("/checkout")` runs **before** the API call to add the item has completed. The user arrives at checkout with a potentially empty server-side cart.

```ts
// CURRENT — store returns sync bool, but API call is fire-and-forget
addToCart: (design, selectedFileTypes, selectedExtras, status) => {
  // ...
  (async () => {
    const response = await fetch("/api/cart/items", { method: "POST", ... });
    // ^ this completes AFTER handleBuyNow already pushed to /checkout
  })();
  return true; // ← sync return
}
```

**Fix — make `addToCart` return a real Promise:**

```ts
addToCart: async (design, selectedFileTypes, selectedExtras, status) => {
  // ...
  if (status === "authenticated") {
    const response = await fetch("/api/cart/items", { ... });
    if (response.ok) {
      const updatedCart = await response.json();
      setCart(updatedCart);
      toast.success("Added to cart!");
      return true;
    } else {
      toast.error("Failed to add to cart.");
      return false;
    }
  } else {
    // local storage path (sync is fine here)
    const newCart = [...cart, newItem];
    setCart({ items: newCart, id: null });
    localStorage.setItem("cart", JSON.stringify(newCart));
    toast.success("Added to cart!");
    return true;
  }
}
```

Update the `CartStore` interface to reflect `Promise<boolean>`.

---

### M-04 — JWT `jwt` callback hits the **database on every single request**

**File:** `src/app/api/auth/[...nextauth]/route.ts` — lines 172–196

**Problem:**
Every time a token is validated (i.e., every authenticated API call, every page load), the JWT callback does `prisma.user.findUnique` — and if impersonation is active, up to **three** DB queries in a single token validation. This creates significant latency on high-traffic pages and is entirely avoidable.

```ts
// CURRENT — DB hit on every token check
if (Date.now() < token.accessTokenExpires) {
  const dbUser = await prisma.user.findUnique(...)  // query 1
  const impersonatedUser = await prisma.user.findUnique(...)  // query 2 (if impersonating)
}
```

**Fix — embed role and impersonation state in the JWT itself, only re-fetch on explicit change:**

The role and `impersonatingUserId` rarely change. Store them in the token. Only re-query the DB when:

- The access token has expired (refresh cycle)
- The user triggers an explicit role/impersonation change

```ts
async jwt({ token, user, account, trigger }) {
  if (account && user) {
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    return {
      ...token,
      id: dbUser!.id,
      role: dbUser!.role,
      impersonatingUserId: dbUser!.impersonatingUserId,
      accessToken: account.access_token,
      refreshToken: account.refresh_token,
      accessTokenExpires: (account.expires_at ?? 0) * 1000,
    };
  }

  // Only hit DB if token has expired OR an explicit update is needed
  if (trigger === "update" || Date.now() >= (token.accessTokenExpires as number)) {
    return refreshAccessToken(token); // refresh also re-fetches role
  }

  // Otherwise, serve from the token — no DB call
  return token;
}
```

For impersonation, call `update({ trigger: "update" })` after the impersonate/unimpersonate API call succeeds on the client.

---

### M-05 — No rate limiting on **forgot-password** and **verify-email resend**

**Files:** `src/app/api/auth/forgot-password/route.ts`, `src/app/api/auth/verify-email/route.ts`

**Problem:**
Both endpoints accept unlimited unauthenticated POST requests. An attacker can spam any email address with password reset or verification emails, abusing the email provider quota and harassing users.

**Fix — add simple IP-based rate limiting using `upstash/ratelimit` or an in-memory map:**

```ts
// Simple in-process rate limiter (use Upstash for multi-instance deployments)
const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(
  ip: string,
  limit = 5,
  windowMs = 15 * 60 * 1000,
): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

// In the route handler:
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }
  // ...rest of handler
}
```

---

## 🟢 LOW / INFO

---

### L-01 — `session.error` is typed too narrowly in `next-auth.d.ts`

**File:** `src/next-auth.d.ts` — line 32  
**File:** `src/app/api/auth/[...nextauth]/route.ts` — line 178

**Problem:**
The type declaration only allows `error?: "RefreshAccessTokenError"`, but the JWT callback can also set `error: "UserNotFound"`. TypeScript will reject any code that checks `session.error === "UserNotFound"`.

**Fix:**

```ts
interface Session extends DefaultSession {
  error?: "RefreshAccessTokenError" | "UserNotFound";
  // ...
}
```

Also add corresponding handling in client components:

```ts
// In any layout/provider that consumes session
if (session?.error === "UserNotFound") {
  signOut({ callbackUrl: "/auth?error=account-deleted" });
}
```

---

### L-02 — `next-auth.d.ts` does **not declare `impersonator` or `accessToken`** on `Session`

**File:** `src/next-auth.d.ts`

**Problem:**
The `session` callback sets `session.accessToken` and `session.impersonator`, but neither is declared in the type extension. All consumer code either uses `// @ts-ignore` or implicitly casts to `any`.

**Fix:**

```ts
interface Session extends DefaultSession {
  accessToken?: string;
  impersonator?: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: "ADMIN" | "TEAM" | "CLIENT";
  };
  error?: "RefreshAccessTokenError" | "UserNotFound";
  user: {
    id: string;
    role: "ADMIN" | "TEAM" | "CLIENT";
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
```

Remove all `// @ts-ignore` comments in the impersonate routes once this is done.

---

### L-03 — `signupEmail` state is **lost on hard navigation** to `/auth?verified=true`

**File:** `src/components/auth/AuthForm.tsx` — `handleSignupSuccess`  
**File:** `src/app/api/auth/verify-email/confirm/route.ts` — line 41

**Problem:**
After email verification, the confirm route redirects to `/auth?verified=true`. This causes a full page navigation, destroying all React state including `signupEmail`. The `AuthForm` component doesn't read `verified=true` from the URL, so there's no success message. The user lands on the default login view with no feedback that verification succeeded.

**Fix — read the `verified` param in `AuthForm`:**

```tsx
"use client";
import { useSearchParams } from "next/navigation";

const AuthForm = () => {
  const searchParams = useSearchParams();
  const [authMode, setAuthMode] = useState(() =>
    searchParams.get("verified") === "true" ? "login" : "login",
  );
  const [verifiedBanner, setVerifiedBanner] = useState(
    () => searchParams.get("verified") === "true",
  );

  // In the render, show a success banner when verifiedBanner is true:
  // <div className="...success banner...">Email verified! You can now log in.</div>
};
```

---

### L-04 — Password strength is only **6 characters minimum** with no complexity check

**Files:** `src/app/api/auth/signup/route.ts`, `src/app/api/auth/reset-password/route.ts`

**Problem:**
6 characters is below modern security standards. There is no check for complexity (uppercase, numbers, special chars). Passwords like `aaaaaa` or `123456` pass.

**Fix:**

```ts
function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(password))
    return "Password must contain at least one number.";
  return null; // valid
}

// In both signup and reset-password routes:
const passwordError = validatePassword(newPassword);
if (passwordError) {
  return NextResponse.json(
    { success: false, message: passwordError },
    { status: 400 },
  );
}
```

Update the `minLength` attribute in `SignupForm.tsx` from `6` to `8` and update the hint text.

---

## 🎨 DESIGN / UX — Unauthenticated Checkout Flow

The current pattern is: unauthenticated user browses designs → adds to localStorage cart → clicks "Buy Now" → gets forced into Google OAuth → lands on checkout. This has four problems.

---

### UX-01 — "Add to Cart" works silently for unauthenticated users with **no indication they'll need to log in**

**Problem:**
An unauthenticated user can add items to cart with no friction. The cart icon increments normally. Only when they click "Buy Now" or navigate to `/checkout` do they hit the auth wall — after potentially spending time selecting options. No message sets expectations.

**Recommended fix — show a soft auth prompt on "Add to Cart" for unauthenticated users:**

```tsx
const handleAddToCart = async () => {
  if (!design || isAddingToCart || isBuyingNow) return;
  setIsAddingToCart(true);
  try {
    const added = await addToCart(design, selectedFileTypes, selectedExtras);
    if (added && status === "unauthenticated") {
      // Show a non-blocking toast explaining they'll need to log in at checkout
      toast.info(
        "Item saved! You'll need to sign in when you're ready to checkout.",
        {
          action: {
            label: "Sign in now",
            onClick: () => router.push("/auth?callbackUrl=/checkout"),
          },
          duration: 6000,
        },
      );
    }
  } finally {
    setIsAddingToCart(false);
  }
};
```

---

### UX-02 — `/checkout` page has **no client-side auth guard** — the page renders fully with an empty cart

**File:** `src/app/(public)/checkout/page.tsx`

**Problem:**
The middleware (`proxy.ts`) correctly redirects unauthenticated users away from `/checkout`. But `checkout/page.tsx` itself has no session check. If session resolution is slow (loading state), the page renders with an empty cart and payment components momentarily. The cart page (`/cart/page.tsx`) correctly checks `status === "unauthenticated"` but checkout does not.

**Fix — add an explicit session gate at the top of `CheckoutPage`:**

```tsx
const CheckoutPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth?callbackUrl=/checkout");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <CheckoutSkeleton />; // or null
  }

  // ... rest of checkout
};
```

---

### UX-03 — Guest cart **does not sync** if the user logs in via **credentials** (only Google triggers sync)

**File:** `src/components/cart/CartSync.tsx`

**Problem:**
`CartSync` triggers `syncCart()` when `status` transitions to `"authenticated"`. This fires correctly for all login methods. However, the `syncCart` function in the store calls `POST /api/cart/sync` and on success does `localStorage.removeItem("cart")` but does **not** update the store's in-memory cart with the server response. If the sync API returns the merged server cart, the store still holds the old local items until the next `fetchCart` call.

**Fix:**

```ts
syncCart: async () => {
  const { cart, setCart } = get();
  if (cart.length === 0) return;

  try {
    const response = await fetch("/api/cart/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cart),
    });

    if (response.ok) {
      const serverCart = await response.json(); // merged server cart
      setCart(serverCart); // ← update store with canonical server state
      localStorage.removeItem("cart");
      window.dispatchEvent(new CustomEvent("cart-synced"));
    }
  } catch (error) {
    console.error("Error syncing guest cart:", error);
  }
},
```

---

### UX-04 — The auth page `AuthForm` is a **Server Component** but `AuthPage` constrains its container width incorrectly

**File:** `src/app/(public)/auth/page.tsx`

**Problem:**

```tsx
<div className="w-full max-w-md lg:max-w-xl mx-auto">
  <AuthForm />
</div>
```

`AuthForm` itself declares `max-w-xs xs:max-w-sm sm:max-w-md md:max-w-4xl` — so on `md` breakpoints, the form wants `max-w-4xl` (the split layout with the sidebar image) but the page wrapper caps it at `max-w-xl`. The branding/logo sidebar panel is clipped and never fully renders. Remove the width constraint from the page wrapper and let `AuthForm` control its own size:

```tsx
const AuthPage = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-ink px-4 py-12 safe-area-inset">
      <AuthForm /> {/* AuthForm owns its own max-width */}
    </div>
  );
};
```

---

## Implementation Priority Order

1. **C-01** — Add auth guard to admin reset-password endpoint _(15 min)_
2. **C-02** — Add auth guard to login-history endpoint _(10 min)_
3. **C-04** — Move `signOut` from `callbacks` to `events` _(5 min)_
4. **H-01** — Await `params` in impersonate route _(2 min)_
5. **H-04** — Block unverified emails from credentials login _(20 min)_
6. **H-02** — Fix `accessTokenExpires` calculation _(5 min)_
7. **H-05** — Replace forced Google OAuth in `handleBuyNow` with `/auth` redirect _(5 min)_
8. **H-06** — Fix referral cookie capture for social signups _(30 min)_
9. **C-03** — Replace `globalThis.tempSignInIp` with safer approach _(45 min)_
10. **M-01** — Fix `verify-email/confirm` redirect URL _(5 min)_
11. **M-02** — Add `Suspense` boundaries around `useSearchParams` _(10 min)_
12. **M-03** — Make `addToCart` return a real `Promise` _(30 min)_
13. **M-04** — Reduce JWT callback DB queries _(45 min)_
14. **M-05** — Add rate limiting to auth endpoints _(30 min)_
15. **H-03** — Fix user enumeration on verify-email resend _(5 min)_
16. **L-01 to L-04** — Type fixes, password strength, verified banner _(1 hr total)_
17. **UX-01 to UX-04** — Unauthenticated checkout UX improvements _(2 hrs total)_
