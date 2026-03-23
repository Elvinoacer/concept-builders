I have a reference HTML file saved at public/reference/landing_page.html that contains a complete
landing page redesign for Concept Builders. Your job is to:

---

## TASK 1 — Update the Global Theme

Replace the current theme configuration to match these exact design tokens:

### Colors (add to tailwind.config or globals.css / CSS variables):

--ink: #0A0907 → primary background (darkest)
--surface: #111009 → secondary background
--card: #1A1813 → card/elevated surfaces
--cream: #F2EBD9 → primary text
--cream-dim: #C8BFA8 → secondary/muted text
--gold: #C8892A → primary accent (CTAs, highlights)
--gold-light: #E8A84A → hover state of gold
--muted: #5A5548 → disabled/subtle text
--border: rgba(200,185,168,0.1) → default borders
--border-gold: rgba(200,137,42,0.3) → accent borders

### Typography:

- Display/headings font: "Cormorant Garamond" (weights: 300, 400, 500, 600; also italic variants)
- Body font: "Outfit" (weights: 300, 400, 500, 600)
- Import both from Google Fonts in the root layout

Update tailwind.config.js to register these as custom colors and font families
so they are available as Tailwind utility classes across the entire project.
Update globals.css to define the CSS variables above on :root.
The dark background (#0A0907) should be the default page background.

---

## TASK 2 — Rebuild the Landing Page (app/page.tsx or pages/index.tsx)

Recreate the landing page from the reference HTML file in Next.js/React.
Preserve ALL visual design, layout, animations, and interactions exactly.

### Sections to implement (in order):

1. **Fixed Navigation** — logo with rotated diamond mark, nav links, gold-bordered CTA button.
   Becomes opaque with backdrop-blur on scroll (use useState + useEffect scroll listener).

2. **Hero Section** — full-viewport height. Layered background: dark base + real house image
   (use the existing hero image from the site) at 35% opacity + blueprint grid SVG overlay +
   bottom fade gradient. Animated headline using Cormorant Garamond (staggered CSS animation,
   words slide up on load). Bottom row: description text left, two CTA buttons right.

3. **Stats Strip** — 4 columns separated by borders: "500+ House Plans", "1200+ Happy Homeowners",
   "47 Counties Served", "12 Yrs Of Excellence". Implement count-up animation on scroll
   using IntersectionObserver (or a suitable React hook).

4. **Marquee Strip** — infinite horizontal scroll of brand values:
   "Architectural Excellence · Innovative Design Solutions · Sustainable Construction ·
   Client-Centred Approach · Kenyan Dream Homes · Bespoke Blueprints"
   Use CSS animation (animation: marquee linear infinite) — duplicate items for seamless loop.

5. **How It Works** — 3-column step layout with large ghost numbers (01, 02, 03),
   icon boxes with gold borders, step titles in Cormorant Garamond, descriptions in Outfit.
   Columns separated by 1px borders. Scroll-reveal animation on each card with staggered delay.

6. **Best Selling Plans** — asymmetric 3-column CSS grid (1.4fr 1fr 1fr). Fetch real plan data
   from the existing API/data source used by the current site. Each card: image with
   hover zoom + desaturation-to-color transition, "Best Seller" gold tag, title, category,
   arrow link. Below grid: plans count + "Explore All Designs" CTA.

7. **Testimonial** — 2-column layout: quote in large italic Cormorant Garamond with oversized
   decorative quotation mark, avatar + name + role. Right column: tall image with offset
   gold-border frame (::after pseudo-element positioned bottom-right).

8. **CTA Section** — centered, large Cormorant Garamond heading, description, two buttons.
   Subtle radial gold glow behind (background: radial-gradient).

9. **Footer** — 4-column grid: brand description + contact link, Explore links, Services links,
   Legal links. Bottom bar: copyright left, social links right. All links use existing site routes.

### Animation requirements:

- Hero text: CSS keyframe slideUp with staggered animation-delay per line (use className approach)
- Scroll reveal: Create a custom useReveal hook using IntersectionObserver.
  Apply opacity-0 + translateY(32px) → opacity-100 + translateY(0) on intersection.
- Count-up: Custom useCountUp hook triggered by IntersectionObserver
- Marquee: Pure CSS animation on a flex container with duplicated children
- Hover states: image zoom (scale-105 transition), button fill transitions, link arrow slides

### Custom cursor (desktop only):

Implement a global custom cursor component: small gold dot + larger trailing ring.
Ring expands on hover over interactive elements. Use useEffect + mousemove listener.
Set cursor: none on body. Render cursor only on non-touch devices (window.matchMedia check).
Add this to the root layout so it persists across all pages.

### Noise texture overlay:

Add a fixed full-viewport pseudo-element in globals.css with an SVG feTurbulence noise
texture at 2.5% opacity. This adds premium film grain to the entire site.

### Scrollbar:

Style ::-webkit-scrollbar to be 4px wide with var(--gold) thumb color.

---

## IMPORTANT CONSTRAINTS:

- Do NOT change any existing functionality, routing, data fetching, or backend logic
- Only modify: globals.css, tailwind.config.js, the root layout (for fonts + cursor),
  and the landing page component
- Use "use client" directive only where interactivity requires it
- All existing image sources, API routes, and href links must be preserved exactly
- The design must be fully responsive — stack to single column below 900px breakpoint
- Use next/image for all images (with appropriate width/height/priority props)
- Use next/link for all internal navigation links
