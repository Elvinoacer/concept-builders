# UI Consistency & Theming Implementation Plan

### Concept Builders — Full Execution Roadmap

---

## Project Context

**Stack:** Next.js 14 App Router · TypeScript · Tailwind CSS · shadcn/ui · next-themes  
**Theme system:** CSS custom properties in `globals.css` + Tailwind token mapping  
**Page count:** 24 public · 18 dashboard · 50+ admin (see `PAGES.md`)  
**Design truth:** `src/app/(public)/page.tsx` (landing page) — the gold standard for all visual decisions

---

## Audit Findings (Pre-work)

Before building anything, here's what the codebase audit revealed. These are the root causes driving every inconsistency.

### 🔴 Critical Issues

| #   | Issue                                                                                                                                                            | Location                         | Impact                                                                           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------------------------------------------------------------------------- |
| 1   | **Dual theme providers** — `src/lib/theme.tsx` (custom context) and `src/components/theme-provider.tsx` (next-themes) both exist and conflict                    | `Providers.tsx`                  | Theme toggling is unpredictable across different component trees                 |
| 2   | **Dark and light CSS vars are identical** — `:root` and `.dark` in `globals.css` share the same values. No actual light mode exists                              | `globals.css` lines 22–63        | "Light mode" renders the same dark background, making dual-theme unimplementable |
| 3   | **Hardcoded hex values in globals.css** — Phone input styles use raw hex (`#e5e7eb`, `#3b82f6`, `#374151`, etc.) that don't reference any design token           | `globals.css` lines 152–210      | These won't respond to theme switching                                           |
| 4   | **Orphaned Tailwind colors** — `background-light: #f6f7f8`, `background-dark: #101c22`, `dark-blue: #0B2545` are hardcoded in `tailwind.config.ts`, not CSS vars | `tailwind.config.ts` lines 47–49 | Cannot be theme-controlled                                                       |

### 🟡 Structural Issues

| #   | Issue                                                                                                           | Location                                             |
| --- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 5   | No shared component for page section wrappers — every page reinvents max-width containers and padding           | All pages                                            |
| 6   | `reveal` / scroll-animation pattern exists only on the landing page, not abstracted into a reusable hook        | `(public)/page.tsx`                                  |
| 7   | Dashboard and admin panels have their own ad hoc card/stat styles that don't reference landing page card tokens | `src/components/admin/`, `src/components/dashboard/` |
| 8   | Admin sidebar (`AdminSidebar.tsx`) and dashboard sidebar (`Sidebar.tsx`) have parallel but divergent styling    | Both sidebar files                                   |

---

## Phase 0 — Foundation Cleanup

**Goal:** Fix the critical blockers before touching any page.  
**Time estimate:** 1–2 days  
**Files touched:** ~4

### 0.1 — Consolidate Theme Providers

**Problem:** Two providers exist — eliminate the custom one, keep next-themes.

**Action:**

1. Delete `src/lib/theme.tsx` entirely.
2. Audit all files importing from `src/lib/theme.tsx` — replace `useTheme` from there with `useTheme` from `next-themes`.
3. Ensure `src/app/Providers.tsx` wraps only `<ThemeProvider>` from `src/components/theme-provider.tsx` with these props:
   ```tsx
   <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
   ```
4. Verify `src/components/ui/mode-toggle.tsx` (already uses next-themes) is the single toggle implementation.

**Why:** Until this is resolved, theme state is split between two systems and nothing will work reliably.

---

### 0.2 — Define True Light & Dark Token Sets

**Problem:** `:root` and `.dark` are identical in `globals.css`. Light mode has no definition.

**Action — update `globals.css`:**

The landing page design is dark-first. The light mode should be an inverted, warm-paper version of the same palette. Define these clearly separated:

```css
@layer base {
  /* === DARK MODE (default / landing page truth) === */
  :root {
    --ink: #0a0907;
    --surface: #111009;
    --card: #1a1813;
    --cream: #f2ebd9;
    --cream-dim: #c8bfa8;
    --gold: #c8892a;
    --gold-light: #e8a84a;
    --muted: #5a5548;
    --border-color: rgba(200, 185, 168, 0.1);
    --border-gold: rgba(200, 137, 42, 0.3);

    /* shadcn/ui HSL tokens — dark */
    --background: 30 18% 3%;
    --foreground: 42 45% 90%;
    --card-bg: 36 23% 7%;
    --card-foreground: 42 45% 90%;
    --popover: 36 23% 7%;
    --popover-foreground: 42 45% 90%;
    --primary: 36 66% 47%;
    --primary-foreground: 30 18% 3%;
    --secondary: 35 20% 8%;
    --secondary-foreground: 42 32% 74%;
    --muted-bg: 35 20% 8%;
    --muted-foreground: 35 13% 45%;
    --accent: 36 66% 47%;
    --accent-foreground: 30 18% 3%;
    --destructive: 0 62.8% 50%;
    --destructive-foreground: 0 0% 98%;
    --border: 35 18% 20%;
    --input: 35 18% 20%;
    --ring: 36 66% 47%;
    --radius: 0.5rem;
  }

  /* === LIGHT MODE === */
  .light {
    --ink: #faf7f2;
    --surface: #f2ece0;
    --card: #ffffff;
    --cream: #2c2520;
    --cream-dim: #5a4e44;
    --gold: #b07820;
    --gold-light: #c89030;
    --muted: #9e9488;
    --border-color: rgba(80, 65, 50, 0.15);
    --border-gold: rgba(176, 120, 32, 0.3);

    /* shadcn/ui HSL tokens — light */
    --background: 42 30% 97%;
    --foreground: 30 18% 12%;
    --card-bg: 0 0% 100%;
    --card-foreground: 30 18% 12%;
    --popover: 0 0% 100%;
    --popover-foreground: 30 18% 12%;
    --primary: 36 66% 41%;
    --primary-foreground: 0 0% 100%;
    --secondary: 42 20% 92%;
    --secondary-foreground: 30 18% 20%;
    --muted-bg: 42 20% 94%;
    --muted-foreground: 35 13% 42%;
    --accent: 36 66% 41%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 72% 45%;
    --destructive-foreground: 0 0% 100%;
    --border: 35 20% 82%;
    --input: 35 20% 82%;
    --ring: 36 66% 41%;
  }
}
```

> **Rule:** Every new color decision must either use an existing token or add a new one here. No raw hex in component files.

---

### 0.3 — Replace Hardcoded Colors with Tokens

**Action:**

1. In `globals.css`, replace phone input hardcoded hex with CSS var references.
2. In `tailwind.config.ts`, convert `background-light`, `background-dark`, `dark-blue` to reference CSS vars:
   ```ts
   "page-bg": "var(--ink)",
   "page-surface": "var(--surface)",
   ```
3. Search the entire codebase for inline `style={{ color: '#...', background: '#...' }}` and `className` values containing literal hex — migrate all to token classes.

```bash
# Find hardcoded hex colors across components
grep -r "#[0-9a-fA-F]\{3,6\}" src/components --include="*.tsx" -l
grep -r "#[0-9a-fA-F]\{3,6\}" src/app --include="*.tsx" -l
```

---

## Phase 1 — Design System Extraction

**Goal:** Pull the landing page's visual language into reusable primitives.  
**Time estimate:** 2–3 days  
**Files to create:** ~6 new files

### 1.1 — Create `src/lib/design-tokens.ts`

A single source-of-truth TypeScript export of all token names, for use in JavaScript contexts (e.g. chart colors, canvas, dynamic styles):

```ts
export const tokens = {
  ink: "var(--ink)",
  surface: "var(--surface)",
  card: "var(--card)",
  cream: "var(--cream)",
  creamDim: "var(--cream-dim)",
  gold: "var(--gold)",
  goldLight: "var(--gold-light)",
  muted: "var(--muted)",
  border: "var(--border-color)",
  borderGold: "var(--border-gold)",
} as const;
```

This prevents string literal drift when referencing tokens in Recharts, canvas, or framer-motion.

---

### 1.2 — Extract Scroll Reveal into `src/hooks/useReveal.ts`

The landing page defines `useReveal` inline. Lift it out so every page can use it:

```ts
// src/hooks/useReveal.ts
export function useReveal<T extends HTMLElement>(delay = 0) { ... }
```

**Consumers after extraction:** About page, Designs page, Contact page, Blog page.

---

### 1.3 — Create Shared Layout Primitives in `src/components/ui/`

Extract these patterns from the landing page into reusable wrappers:

| Component          | What it standardises                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| `<PageSection>`    | `max-w-7xl mx-auto px-6 md:px-12 py-20` — the standard section wrapper                             |
| `<SectionHeading>` | Font display (Cormorant Garamond), size, gold accent line beneath                                  |
| `<GoldDivider>`    | The `border-gold` thin separator used between sections                                             |
| `<GlassCard>`      | `bg-card border border-[var(--border-gold)] rounded-xl backdrop-blur` — the recurring card pattern |
| `<GoldButton>`     | Primary CTA button: gold background, ink text, hover state                                         |
| `<OutlineButton>`  | Secondary: transparent, gold border, cream text                                                    |

These become the building blocks. No page should define its own container widths or heading styles.

---

### 1.4 — Audit Existing shadcn/ui Components

The `/components/ui/` directory already has 20+ shadcn components. Ensure each one:

- Has no hardcoded colors — only uses `hsl(var(--...))` tokens
- Has explicit dark/light variant styles via Tailwind's `dark:` prefix or CSS var switching
- Matches the landing page's border radius (`--radius: 0.5rem`)

Files to inspect and update if needed:

```
button.tsx
- [x] privacy/page.tsx
- [x] terms/page.tsx
- [x] refund/page.tsx
- [x] about/page.tsx
- [x] contact/page.tsx · card.tsx · input.tsx · badge.tsx ·
dialog.tsx · dropdown-menu.tsx · select.tsx ·
textarea.tsx · alert.tsx · skeleton.tsx
```

---

## Phase 2 — Light & Dark Mode Implementation

**Goal:** Both modes work correctly, are accessible, and persist.  
**Time estimate:** 2–3 days

### 2.1 — Validate the Token Swap Visually

After Phase 0.2 tokens are in place:

1. Toggle to light mode.
2. Walk through landing page, auth page, and dashboard — check every section.
3. Every element that is readable in dark should be readable in light.

**Checklist per page:**

- [ ] Background contrasts with text (WCAG AA minimum 4.5:1)
- [ ] Gold accents are visible on both light and dark backgrounds
- [ ] Cards have visible boundaries in both modes
- [ ] Input borders are visible in light mode (currently the same dark surface value)
- [ ] Charts (Recharts) update — ensure chart colors reference `var(--chart-*)` not hardcoded

### 2.2 — Accessibility Validation

Use the browser's accessibility inspector or a tool like axe-core on both modes for:

- Text contrast ratio on body, headings, muted text, placeholders
- Focus ring visibility (currently `--ring: var(--gold)` — verify this passes in light mode)
- Icon-only buttons have `aria-label` or `sr-only` text

---

## Phase 3 — Page-by-Page Alignment

**Goal:** Every page uses only tokens and shared components. No visual outliers.  
**Strategy:** Work by layout group, not individual page, since groups share layouts.  
**Time estimate:** 5–8 days

### Priority Order

Align in this order — highest user-visibility first:

#### Tier 1 — Public-facing pages (brand impression)

```
/ (landing)          ← already the truth; do not touch styles
/designs             ← high traffic, design showcase
/designs/[id]        ← conversion page
/cart                ← conversion path
/checkout            ← conversion path
/auth                ← first impression on signup
/about               ← brand credibility
/contact             ← lead capture
```

#### Tier 2 — Post-purchase user pages (retention)

```
/dashboard
/dashboard/purchases
/dashboard/projects/[id]
/dashboard/settings
/dashboard/messages
/dashboard/wishlist
```

#### Tier 3 — Content & utility pages

```
/blog
/blog/[slug]
/faq
/privacy · /terms · /refund
/cost-calculator
/custom-design
/ongoing-projects
```

#### Tier 4 — Admin panel

```
/admin (dashboard)
/admin/designs
/admin/users
/admin/orders
/admin/analytics
/admin/settings
... (remaining admin routes)
```

> Admin panel can have a slightly more utilitarian aesthetic, but must still use the same token palette — ink backgrounds, gold accents, cream text.

---

### Per-Page Checklist

Apply this checklist to every page during Tier 1–4 work:

```
[ ] Background uses var(--ink) or var(--surface), not hardcoded
[ ] All text uses var(--cream), var(--cream-dim), or var(--muted)
[ ] Headings use font-display (Cormorant Garamond) for h1/h2
[ ] Body text uses font-body (Outfit)
[ ] CTA buttons use <GoldButton> or <OutlineButton> components
[ ] Cards use <GlassCard> component
[ ] Section wrappers use <PageSection> component
[ ] All borders reference var(--border-color) or var(--border-gold)
[ ] No inline style={{ color: '...' }} or style={{ background: '...' }}
[ ] Hover/focus states use gold ring or gold border
[ ] Responsive breakpoints preserved (existing responsive logic stays)
[ ] Dark mode toggling verified with the ModeToggle button
[ ] Light mode checked — no white-on-white or black-on-black text
```

---

## Phase 4 — Enforcement & Scalability

**Goal:** Make deviations structurally impossible.  
**Time estimate:** 1 day

### 4.1 — ESLint Rule: No Inline Hardcoded Colors

Add to `eslint.config.mjs`:

```js
// Warn on inline hex color usage in JSX style props
// Use eslint-plugin-no-restricted-syntax or a custom rule
"no-restricted-syntax": [
  "warn",
  {
    "selector": "Property[key.name='color'][value.type='Literal'][value.value=/^#/]",
    "message": "Use a CSS variable token instead of a hardcoded hex color."
  }
]
```

### 4.2 — Component Ownership Comments

Every shared component in `src/components/ui/` should have a JSDoc header:

```tsx
/**
 * GoldButton — Primary CTA button.
 * Part of the Concept Builders design system.
 * ⚠️ Do not override background or text colors inline.
 * Use `variant` prop for style variants.
 */
```

### 4.3 — Theme Test Page (Dev Only)

Create `src/app/(public)/theme-test/page.tsx` — a dev-only page that renders every token, every button variant, every card type, and every typography style side by side in both modes. Delete before production deploy.

This catches regressions instantly during future development.

---

## Execution Summary

| Phase | Focus                                                                      | Est. Days | Output                                                                                      |
| ----- | -------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------- |
| **0** | Fix critical blockers (dual providers, empty light mode, hardcoded values) | 1–2       | Stable foundation                                                                           |
| **1** | Extract design system from landing page into shared components and hooks   | 2–3       | `useReveal`, `PageSection`, `SectionHeading`, `GlassCard`, `GoldButton`, `design-tokens.ts` |
| **2** | Implement and validate light/dark mode end-to-end                          | 2–3       | Full dual-mode support, WCAG-checked                                                        |
| **3** | Align all pages tier by tier using the per-page checklist                  | 5–8       | Visual consistency across all 90+ routes                                                    |
| **4** | Add enforcement layer (ESLint, JSDoc, theme test page)                     | 1         | Deviations are impossible to accidentally introduce                                         |

**Total: ~12–17 focused working days**

---

## Rules of the Road

These are non-negotiable during execution:

1. **The landing page is read-only** — it is the design truth. Never refactor its styles; only extract from them.
2. **A new visual pattern means a new shared component** — if you write the same `className` string in two places, it needs to become a component.
3. **A deviation is a bug** — treat visual inconsistency with the same urgency as a broken API call.
4. **Phase 0 must be complete before Phase 1** — building on an unresolved theme provider conflict will corrupt all subsequent work.
5. **Test every change in both modes** — one mode passing is not done.
