# Concept Builders: cinematic landing page plan

Date: 24 October 2026

Status: the image-based cinematic hero and browsing foundation are implemented and verified; the production build passes. The continuous model-based 3D stage remains dependent on reconstruction references and model production.

Confirmed asset constraint: the user has architectural renders or photographs only, with no original editable 3D model supplied. The plan therefore distinguishes the immediately buildable image-based cinematic foundation from the model reconstruction needed to complete a continuous true-3D journey.

### Hero direction update — 24 October 2026

The supplied reference video (`the_hero_i_need_act.mp4`) updates the opening direction below. The hero now occupies one viewport, with a translucent navigation bar over full-bleed architectural imagery. A brief curtain reveal opens directly onto that same scene; there is no second hero or repeated scroll stage. Homes dissolve smoothly into one another, with restrained camera drift and staggered word reveals for each actual plan name. The header changes to a light surface after scrolling. Manual navigation, pause, reduced-motion support, and off-screen suspension accompany the timed slideshow.

This full-bleed crop applies to the atmospheric hero only. Customers can open the existing complete-image gallery, move through perspectives, and switch homes without leaving the page. Featured plans, search/filter browsing, projects, the design process, and contact remain available below. CB3023's real front exterior now opens the hero; the additional editorial homes retain their own truthful names. Continuous reconstructed 3D remains an asset-production stage.

## Design intent

Elevate the existing dark, warm, architectural identity into an experience of a real home. Use FIVE BEDROOM VILLA MAISONETTE (CB3023) as the proposed lead design. The emotional arc is calm arrival → growing discovery → architectural peak → calm browsing and a clear next step.

The house should be the main visual, large enough to understand and presented completely. Typography, navigation, captions, and calls to action support it. Other plans remain quick to discover and inspect directly on the landing page.

Success means visitors remember a house, understand what Concept Builders offers, and can quickly find a suitable plan or request a custom design.

## What the current code establishes

| Area | Observed behavior | Implication |
| --- | --- | --- |
| `src/app/(public)/page.tsx` | Composes hero, featured plans, explorer, design journey, ongoing projects, design ideas, and contact. Uses cached database queries with a five minute revalidation interval. | Preserve the useful content and cached catalog data while revising presentation and sequence. |
| `src/components/landing/hero.tsx` | Seven overlapping portrait cards; independently timed card changes and background slides. Backgrounds come from a fixed image list rather than the selected database design. | Replace the competing hero motions with one consistent house and one authored timeline. |
| `src/components/landing/Featured.tsx` | Uses the first display image for each plan and navigates to its detail page on selection. | Add an explicit quick preview action while preserving a normal detail link. |
| `src/components/landing/Explorer.tsx` | Displays up to 24 designs in a moving horizontal rail; continuously reads card positions and changes parallax in an animation loop. Selection navigates to the detail page. | Offer stable, easy browsing and suspend unnecessary background work. |
| `src/components/landing/DesignModal.tsx` | Existing single-image dialog uses `object-fit: cover`. | It needs a complete-image gallery and proper dialog behavior, rather than being reused unchanged. |
| `src/app/api/designs/[id]/route.ts` | Public `?preview=true` response already returns all `IMAGE` records and basic design information. | Reuse this public preview boundary for on-demand image galleries. The preview currently excludes floor plans and purchase availability. |
| Landing data queries | Select up to four images per design, although the initial components mainly use one. | Keep the initial page payload small and fetch a complete gallery only when requested. |
| `src/components/Header.tsx` | The active shared header includes an animated decorative vine canvas. `LandingNav.tsx` is separate from the active public shell. | Refine the active header; coordinate its decorative motion with the house experience. |
| Landing CSS and root layout | Multiple font families, global selectors, independent reveal effects, and repeated hero-like sections. | Establish a consistent type hierarchy and scope changed styles to avoid collisions. |
| `prisma/schema.prisma` | Designs have images, floor plans, and generic files; no dedicated cinematic media configuration. | Introduce an explicit media manifest linked to a verified design ID. A schema migration is not required for the first curated experience. |

These are code observations, not measured performance results.

### CB3023 verification status

Verified on 24 October 2026 through a read-only database query: `cmtw3ljrq001b04leoivjo3py` is FIVE BEDROOM VILLA MAISONETTE (CB3023), with 17 current, completed public render images. The first four exterior views were visually inspected. The initial `A_2 - Photo.jpg` is a front elevation; an optimized 1920px WebP copy is stored at `public/images/landing/cb3023-arrival.webp` (approximately 418 KB). It is the immediate hero poster, with current catalog facts streamed into the stable scene and the full public gallery fetched on demand. Earlier connection failures were transient during this audit.

The checked repository contains catalog image lists, including multiple views of other houses, but no local GLB, glTF, FBX, SketchUp, Blender, MP4, or WebM house asset was found. The verified renders do not provide editable geometry. Poster provenance is the published CB3023 image `uploads/f2462146-6c37-49c7-a29f-bdf6ae1a3e2a-A_2 - Photo.jpg` on the existing Concept Builders CDN.

## 1. Art direction and scroll storyboard

Retain the charcoal, cream, warm gold, serif headlines, and restrained navigation. Use a single display serif and supporting sans serif consistently within the landing page. Keep captions concise and move detailed information below the cinematic stage. Give the architecture more space and stronger visibility than the current low-opacity backgrounds.

Use the following target storyboard. Percentages describe progress within the cinematic section, not the whole page. In the image-based foundation, each scene uses an existing verified render and a restrained transition; the continuous camera movements describe the final model-based production.

| Progress | Scene | Camera and composition | Content |
| --- | --- | --- | --- |
| 0–20% | Arrive, calm | A complete eye-level three-quarter view in a believable setting. The first view is an immediately available still, with the whole building visible. | Existing main promise, CB3023 identification once verified, Explore House Plans, and Design My Home. |
| 20–45% | Discover | A slow, continuous arc reveals the entrance and a second facade of the same house. Keep a stable horizon and modest perspective changes. | One short chapter caption; confirmed design facts stay legible outside the building silhouette. |
| 45–70% | Architectural peak | The camera rises to an elevated three-quarter view that communicates the building's overall form and relationship to its plot. Give the strongest composition a readable hold. | A clear house identity and a small Preview this home action. Specific feature callouts require verified evidence. |
| 70–100% | Settle | Ease down to a balanced exterior view and hold it. The stage releases naturally into the next section. | An invitation to explore other homes, followed immediately by the featured gallery. |

The peak comes from composition and discovery. Keep camera speed controlled; avoid spins, abrupt cuts, flashing light changes, and text repeatedly flying across the house. Do not introduce interiors, pools, gardens, cutaways, or room arrangements that are unsupported by the actual design.

Begin with a total cinematic section of roughly four viewport heights on desktop and two to three on mobile, including its opening view. Tune this through the prototype. For the image-based foundation, shorten the section to match the number of genuinely useful available angles; do not repeat views simply to fill four scenes. Visitors can always use Explore House Plans to skip directly to browsing. Preserve normal wheel, keyboard, and touch scrolling; do not intercept them to force scene completion.

Keep the complete building inside a safe composition area after allowing for navigation and captions. Detail views, if later included, need a clearly selected detail mode and an immediate return to the complete house.

## 2. Faithful 3D and the asset decision

Build in two explicit stages:

**Image-based cinematic foundation, using the available assets.** Curate the strongest complete views of CB3023. Give each view a full-width presentation with scroll-linked captions, controlled dissolves, a readable hold, and an intentional calm-to-peak-to-calm sequence. The building stays fully visible. Keep the images geometrically intact; do not warp facades or synthesize unsupported camera angles to suggest a continuous orbit. This stage delivers the elevated page, complete previews, and fast browsing, but it does not close the true-3D requirement.

**Final continuous 3D journey, requiring a reconstructed model.** Rebuild the house from verified architectural references, check it against the approved renders, author the camera path, and render it ahead of time for scroll-controlled playback. This supplies the requested video-like camera movement while keeping real-time lighting and a heavy 3D engine off the initial page. Exterior photographs alone do not establish exact hidden geometry or dimensions; any unavailable architectural details remain an explicit asset-production dependency.

The final sequence is playback of an authored 3D render. Free camera rotation is a separate interaction and should be named accordingly.

Asset production steps:

1. Resolve CB3023 through a working data source, record its immutable design ID, and verify its published facts and render ownership.
2. Inventory every approved exterior render and published floor-plan preview. Record resolution, aspect ratio, file size, angle, and whether the whole building is visible.
3. Select the actual image-based chapters and build the browsing foundation while reconstruction inputs are assembled. An aerial chapter is conditional on having an actual aerial render at this stage.
4. Establish the references needed for reconstruction: dimensioned floor plans/elevations if available, facade/roof views, and material information. Record unknowns instead of presenting guesses as the real design.
5. Reconstruct and verify the model, preserving dimensions, roof form, openings, materials, and supported site features. Review a small set of key frames before rendering the full sequence. This catches architectural inconsistency, bad framing, and mobile composition problems early.

Store the experience in a typed, versioned manifest keyed to the verified design ID, with an explicit `stills` or `sequence` mode: poster, named views, dimensions, chapter ranges, and angle labels; add desktop/mobile sequence variants, frame counts, and an optional model URL when produced. Keep editorial ordering explicit rather than sorting images by upload date or guessing angles from filenames. A later admin editor can manage the same manifest if frequent updates justify it.

After model production, an optional Explore in 3D mode may load an optimized GLB with bounded orbit controls when the visitor requests it. Use one canvas, baked lighting, compressed geometry/textures, capped pixel ratio, and rendering only while controls or the scene change. Enable this only after the prototype meets the device budgets. The optional viewer must not delay or destabilize the main browsing experience.

## 3. Full previews and fast discovery

All house presentation surfaces should prioritize a complete image. Use aspect-ratio-aware media areas and `object-fit: contain`, with a quiet matte for unused space. Put names and metadata below images or in reserved caption space. Avoid fitting a landscape house into a narrow portrait crop, covering the entrance with text, or cutting off the roof to fill a card.

Provide a shared landing-page preview from the cinematic house, featured designs, and explorer:

- Open an accessible, near-full-viewport dialog. The main image fits completely within the available space and remains easy to inspect on mobile.
- Fetch all published render images through the existing preview API when opened. Include thumbnail navigation, angle labels when known, previous/next controls, image count, and an optional full-screen view with zoom and reset-to-fit.
- Support touch and keyboard controls, Escape, a visible close button, focus trapping, and focus restoration. Do not make essential actions depend on hovering.
- Keep the selected design, image index, and the landing page's scroll position when opening or closing. Suspend the underlying cinema while the dialog is open.
- Allow Previous home and Next home across the current featured/filter results inside the same dialog. Customers can experience several homes without opening detail pages.
- Show verified name, beds, baths, area and units, and supported pricing. Unknown values should be omitted or identified clearly. Confirm the application's actual currency and area conventions before copying existing formatting.
- Offer View plan details and Request a similar design. Preserve existing purchase behavior and the original detail-page URLs.
- Add floor-plan previews only when they are explicitly approved for public display. Fetch an allowlisted public response; purchase documents and CAD downloads are outside the quick preview payload.
- Show recoverable loading/error states and abort stale requests when users move quickly between houses. Cache the current gallery and prefetch only the adjacent preview when useful.

Replace the explorer's automatic horizontal drift with a stable responsive gallery or manually controlled rail. Retain category/bedroom filtering and the path to the full catalog. Keep featured homes prominent so the cinematic lead does not imply the business offers only luxury villas.

## 4. Page information and conversion flow

| Order | Section | Treatment |
| --- | --- | --- |
| 1 | Shared navigation | Preserve Plans, Categories, Showcase, Projects, and Start a Project. Use the active shared header rather than creating duplicate navigation. |
| 2 | CB3023 cinematic introduction | Replace the stacked-card hero and unrelated moving backgrounds with the single-house story. Keep the core value proposition and both existing main actions. |
| 3 | Featured designs and quick preview | Present a compact, diverse selection of complete homes, with category controls and one clear path to the wider catalog. |
| 4 | Plan explorer | Preserve filtering, verified plan information, full previews, and View all designs. |
| 5 | Design journey | Preserve the four useful process steps. Condense its repeated introductory hero into one clear process section. |
| 6 | Ongoing projects and proof | Retain real project images, project links, and verified evidence. Keep it visually calmer than the lead experience. |
| 7 | Collections and design guidance | Preserve useful collections and article destinations; unify spacing and typography. |
| 8 | Consultation and footer | Preserve the functioning contact form, custom-design entry, contact links, and footer navigation. |

Any consolidation removes duplicate presentation, not unique customer information. Preserve existing anchors such as `#explorer` and `#consultation-form`. Validate each CTA destination after changing the structure.

## 5. Performance and fallback design

Treat these as initial engineering budgets to validate, not achieved results or promises about arbitrary devices.

| Measure | Initial target |
| --- | --- |
| Field Core Web Vitals | LCP ≤ 2.5 seconds; INP ≤ 200 ms; CLS ≤ 0.1 at the 75th percentile, assessed separately for mobile and desktop. |
| First-view media | A responsive poster around 150–250 KiB on mobile and 250–400 KiB on desktop; subsequent stills or sequence frames are excluded from the critical load. |
| Additional initial JavaScript | Aim for ≤ 60 KiB compressed beyond the existing measured landing baseline; defer the gallery dialog and optional real-time viewer. |
| Image-based foundation | Aim for ≤ 1.5 MiB mobile / ≤ 2.5 MiB desktop across its curated chapter images, progressively loaded. Fetch only the next likely view after the opening image. |
| Final sequence experiment | Start with 60–96 authored desktop frames and a lower-density mobile variant. Target ≤ 8 MiB desktop and ≤ 3 MiB mobile total compressed sequence media, fetched progressively. Increase density only if measured quality and loading budgets allow it. |
| Final sequence decoded cache | Bound by bytes: initially ≤ 32 MiB desktop and ≤ 12 MiB mobile. Account separately for canvas and browser overhead; do not decode the entire sequence. |
| Motion responsiveness | Aim for 60 fps on the selected desktop test device and a stable ≥ 30 fps on a representative midrange phone during the cinema. Adapt down when sustained performance falls below the target. |
| Idle/offscreen behavior | No continuously scheduled cinematic drawing when the frame is unchanged, the section is offscreen, the preview is open, or the tab is hidden. |

Implementation rules:

The still-image mode needs only responsive images and compositor-friendly transitions. Keep the frame decoder and canvas module deferred until sequence mode is actually configured. The following buffering and decoded-cache rules apply to the final sequence.

1. Server-render meaningful text, links, dimensions, and the poster. Use a real image element for the initial visual, then progressively enhance it. A visitor must never wait at a loading gate to see the house or browse.
2. Start sequence loading after critical content, with a small window around the current position. Use cancellation, limited decode concurrency, and direction-aware priorities. Reuse downloaded compressed assets without retaining every decoded frame.
3. Keep scroll progress in refs/motion values. Coalesce drawing through a single scheduled animation frame and draw only when the target frame changes. Keep frame-by-frame work out of React state.
4. If a requested frame is unavailable, keep the last valid image or an appropriate verified key frame. Never show a blank canvas or block scrolling to buffer. Fast scrolling should reach the end immediately.
5. Dispose of evicted `ImageBitmap` resources, and resize the canvas to the needed display size with a conservative pixel ratio cap. Benchmark decode and memory behavior on Safari as well as Chromium.
6. Use versioned CDN URLs and explicit dimensions. Verify CDN CORS headers if the renderer fetches images as blobs or creates image bitmaps. Serve broadly compatible compressed images; benchmark decode cost before selecting a codec for the sequence.
7. Remove or suspend competing decorative loops in the hero, explorer, shared header, and nearby sections. Scope landing CSS and reduce redundant font use as part of the same pass.
8. Keep catalog summaries cached and small. Avoid a gallery fetch for every visible card and do not make the first visual wait for a large catalog query. Preserve existing cache invalidation behavior.
9. Reduced-motion users receive a shorter static presentation with complete key views and the same information/actions. Offer a visible motion preference and persist it for return visits. Save-Data, asset failure, weak runtime performance, and missing renderer capabilities should also lead to a useful static gallery. Capability hints are optional; use runtime results and user preference when hints are absent.

Validate whether this sequence gives sufficient visual continuity within its budgets before committing to the full media export. A small frame count cannot guarantee movie-like smoothness. If continuity requires too many frames, compare a carefully encoded short video on the actual Safari/Android test devices. Do not depend on untested video seeking or WebCodecs as a universal fallback.

## 6. Implementation sequence and concrete outputs

| Stage | Work | Completion evidence |
| --- | --- | --- |
| A. Asset and baseline audit | Verify read access to CB3023; inventory the available images; capture current desktop/mobile page, request waterfall, route JavaScript, and memory behavior. | Verified design ID and still-image manifest; baseline measurements; explicit reconstruction input list. |
| B. Storyboard and composition | Select actual views of the same approved design, including an aerial only if available. Compose the opening, strongest reveal, and settled view for desktop/mobile. | Complete-house story frames and a reviewable page composition using actual assets, with all CTA positions established. |
| C. Complete image-based foundation | Implement the scroll-linked still-image story, shared multi-image dialog, cross-home navigation, full-image featured/explorer, and calmer supporting sections. | A complete elevated landing page using existing renders; all published angles and other homes remain easy to inspect. Clearly identify the pending continuous 3D stage. |
| D. Model production and cinematic prototype | Establish sufficient architectural references, reconstruct/verify the model, and render a small sequence sample. Build scroll mapping, buffering, and static mode. | Faithful architecture, visual continuity, and device performance demonstrated before the full export. This stage depends on sufficient reconstruction inputs. |
| E. Final continuous 3D integration | Export final media and replace still-image mode through the same manifest/renderer interface. | The requested continuous camera journey in the complete landing page, including fallback states and preserved destinations. |
| F. Verification and delivery | Run after C and E: validate browser behavior, supported devices, production build, relevant types/checks, accessibility, performance, and contact/purchase navigation. | Screenshot evidence, trace/budget results, known limitations, and a reviewable implementation diff. Observe field metrics after release. |

Expected existing touchpoints: the public landing page, `hero.tsx`/`DreamPlan.css`, `Featured.tsx`/`Featured.css`, `Explorer.tsx`/`Explorer.css`, `DesignModal.tsx`, the public preview API if its safe response needs extending, and targeted shared-header adjustments. New modules should isolate the cinematic manifest, scroll renderer, media buffering, and shared preview state. Reuse the installed Framer Motion where useful; the primary sequence does not require adding a full 3D engine to the route.

Do not estimate final cinematic asset production until the reconstruction references and required fidelity are established. Model reconstruction and interface implementation are distinct pieces of work. The image-based foundation is valuable on its own, and the continuous 3D requirement stays open until its asset-dependent stage is delivered.

## 7. Acceptance checks

- Every displayed house image fits fully in its presentation area at 360, 390, 768, 1440, and 1920 px widths; no roof, facade, or building edge is lost merely to fill the layout.
- CB3023 remains recognizably the same building throughout the timeline, with no unsupported architectural changes between views.
- The emotional arc is clear at ordinary scrolling speed, and fast forward/reverse scrolling never traps the visitor or produces blank frames.
- Opening a preview at any chapter, switching homes, and closing it restores the underlying position without a page jump.
- Full image galleries, filters, normal detail-page navigation, custom-design links, consultation anchors, and existing form behavior remain usable.
- Keyboard-only users can browse, open/close previews, switch images, and return focus. Mobile taps, swipes, rotation, and browser Back behave predictably. Essential content remains visible without animation or JavaScript.
- Slow loading, offline media failure, reduced motion, hidden-tab transitions, and repeated preview opening are handled. Memory stays bounded instead of growing with the number of viewed frames/houses.
- Measure a production build with network/CPU throttling and real iOS Safari/Android Chrome checks. A development render is insufficient performance evidence. Use the existing Speed Insights integration to observe field results after release; lab results cannot establish field percentile compliance.
- Capture the complete landing page and each key cinematic composition for visual review, including the calm sections below the hero.

## Technical references

### Implementation record

The landing page now opens with a single full-viewport photographic scene, a translucent header, a brief curtain reveal, gentle camera drift, image dissolves, and animated plan names. Persistent motion controls, featured-home previews, a searchable/filterable library, and a shared complete-image gallery remain available. The original process steps, project proof, collections, design guidance, consultation form, cart, and navigation remain available in a calmer layout. Homepage loading boundaries defer to the hero's single entrance instead of introducing additional spinner screens.

The catalog streams into an already-rendered shell so an unavailable database does not delay the opening presentation. The verified CB3023 poster renders immediately; exact live selection uses the `(CB3023)` code in the stored design name. Its 17 public images have optimized WebP copies served locally on demand, mapped by original source URL so ordering changes remain safe. Other curated exterior renders retain their own truthful names. They do not carry invented prices, bedroom counts, or catalog IDs. Catalog thumbnails that happen to show roof views or drawings stay in the library rather than being selected automatically for the atmospheric hero.

Public preview responses contain only completed, current images and the existing basic design fields. Gallery requests are cancelled when switching homes, successful galleries are cached with a bounded entry count, and failed requests preserve the available image with a retry action. Decorative header/cursor/carousel loops have been removed from the landing experience; supporting content is rendered without those client animation engines. The existing footer vine now renders only while visible and suspends in hidden tabs or under reduced-motion preferences.

CB3023's 17 source images total 33,007,156 bytes; their uncropped WebP copies total 7,587,080 bytes, a 77% reduction before the responsive image optimizer. Four additional curated hero exteriors also have local optimized copies. Gallery assets remain lazy-loaded rather than entering the initial hero payload.

The implementation uses verified renders. It does not claim a continuous 3D orbit or a reconstructed model. Model production remains separate outstanding work.

### Verification record — 24 October 2026

- Browser checks at 1280×800 and 390×844: full-screen hero, translucent navigation, scrolled header, mobile menu, complete-image preview, 17 CB3023 perspectives, and switching homes inside the gallery.
- Seven passing Jest checks cover image-ready slideshow transitions, reduced-motion manual navigation, late catalog delivery, preview suspension, stale gallery cancellation, gallery failure recovery, and the public preview response boundary.
- Scoped TypeScript diagnostics pass for all 21 implementation and support files checked. ESLint passes for the changed React components, helpers, and tests. This does not assert that unrelated repository-wide type errors have been repaired.
- The optimized production build passes, including compilation, page-data collection, and generation of all 179 static pages. The Next.js configuration skips repository-wide build-time type checking; the scoped TypeScript check above is reported separately.

### Reference documentation

- [Google Web Vitals: metrics, thresholds, and field percentiles](https://web.dev/articles/vitals)
- [React Three Fiber: on-demand rendering and performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [MDN: releasing decoded image resources with ImageBitmap.close()](https://developer.mozilla.org/en-US/docs/Web/API/ImageBitmap/close)
- [MDN: respecting reduced motion preferences](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
