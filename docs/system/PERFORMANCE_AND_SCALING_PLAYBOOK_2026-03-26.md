# Performance and Scaling Playbook (UI + API)

## What was fixed now

### 1) Public Ongoing Projects: moved filtering/pagination to API

- API optimized: src/app/api/ongoing-projects/route.ts
- UI updated to incremental loading: src/app/(public)/ongoing-projects/page.tsx

Changes:

- Added server-side query params: search, category, status, page, limit.
- Added pagination metadata (currentPage, totalPages, totalProjects, hasMore).
- Added filter metadata (categories, statuses).
- Limited payload to list-card fields only.
- Added cache headers for public read path.

Impact:

- Prevents loading all projects into browser memory.
- Keeps time-to-interactive stable as data volume grows.
- Reduces DB and network load under high traffic.

### 2) Ongoing project detail endpoint correctness and cacheability

- Fixed Promise params usage and added cache headers:
  - src/app/api/ongoing-projects/[slug]/route.ts

Impact:

- Avoids runtime route param bug.
- Faster repeat reads for frequently viewed detail pages.

### 3) Featured feedback payload reduction

- Endpoint optimized: src/app/api/featured-feedback/route.ts

Changes:

- Replaced include user with narrow select.
- Added cache headers.

Impact:

- Smaller response payload.
- Better cache hit effectiveness for homepage traffic.

### 4) Homepage “best-selling plans” signal corrected

- Page updated: src/app/(public)/page.tsx

Changes:

- Use views for ranking instead of orderItems length that was not present in payload.

Impact:

- Removes unnecessary relationship assumption in client ranking logic.
- More deterministic and cheap ranking path.

### 5) Designs sales path optimization (list + detail)

- List API optimized: src/app/api/designs/route.ts
- Infinite grid consumer updated: src/components/design-showcase/PublicDesignsInfiniteGrid.tsx
- Homepage list consumer updated: src/app/(public)/page.tsx
- Featured list consumer updated: src/components/design-showcase/FeaturedDesigns.tsx
- Design detail page optimized: src/app/(public)/designs/[id]/page.tsx
- Design tabs count endpoint optimized: src/app/api/designs/tabs-count/route.ts

Changes:

- Added cursor-first public list mode for faster first and subsequent pages.
- Added includeTotals=false mode to skip expensive count queries for feed consumers.
- Added lite=true mode for minimal card payloads in high-traffic lists.
- Added cached query path for public design detail page with tags.
- Removed unused heavy relations from public design detail query.
- Parallelized tab count queries via transaction and added cache headers.

Impact:

- Better throughput for design listing requests (the platform core path).
- Lower DB work and payload size for homepage, featured strip, and grids.
- Faster repeat detail page responses under high traffic.

## API best practices for massive growth

1. Always bound result size

- Enforce hard upper limits (for example max 24/50/100 depending on endpoint class).
- Use cursor pagination for infinite feeds, offset pagination for admin tables.

2. Return only fields needed by UI

- Prefer select over include on public APIs.
- Keep list endpoints “card-level” and fetch details lazily on item view.

3. Add caching policy intentionally

- Public list/detail reads: Cache-Control with s-maxage + stale-while-revalidate.
- Auth/admin/personalized data: private, no-store.

4. Push filtering/sorting to DB

- Do not fetch entire datasets and filter on client.
- Keep query predicates index-friendly (exact/startsWith/range when possible).

5. Prevent expensive N+1 patterns

- Use aggregate/groupBy only where needed.
- Avoid nested include trees in list endpoints.

6. Set explicit API contracts

- Include pagination block in all list responses.
- Keep shape consistent across endpoints: items + pagination + filters(optional).

## UI best practices for instant-feel UX

1. Debounced query input (250ms to 400ms)

- Use debounced search state before making network requests.

2. Incremental loading

- Use load-more or infinite pagination for large feeds.
- Preserve previous data while fetching next page.

3. Skeletons + optimistic continuity

- Keep current data visible while next request is in flight.
- Use lightweight skeleton placeholders only for initial load.

4. Prefetch likely next interactions

- Preload detail endpoints when cards enter viewport.

5. Avoid overfetch on first paint

- Fetch only above-the-fold data initially.
- Defer secondary widgets until main content is rendered.

## Database/index best practices for this project

For large growth, add/validate indexes for high-cardinality filter paths:

- OngoingProject(published, createdAt DESC)
- OngoingProject(published, category, status, createdAt DESC)
- OngoingProject(slug) unique index (if not already unique)
- Design(isFeatured, createdAt DESC)
- Design(categoryId, createdAt DESC)
- Design(views DESC) for popular sorts

Note:

- Keep composite indexes aligned to most common where + orderBy combinations.
- Re-check query plans if filters evolve.

## High-priority next optimization targets in this codebase

1. Admin heavy tables

- src/app/api/admin/users/route.ts
- src/app/api/admin/projects/route.ts
- src/app/api/admin/custom-design-requests/route.ts
- Ensure all are paginated, searchable, and field-limited.

2. Content/admin posts endpoint

- src/app/api/posts/route.ts
- Move to paginated contract and avoid full-table reads for large blog volumes.

3. Count-heavy dashboards

- src/app/api/admin/dashboard/kpis/route.ts
- src/app/api/admin/analytics/route.ts
- Consider short-lived server cache for aggregate metrics.

## Rollout safety checklist

- Verify endpoint contract changes with consuming pages before rollout.
- Keep backward-compatible fields where consumers still depend on old shape.
- Track p95 latency and payload size for changed endpoints.
- Add regression tests for pagination and filter behaviors.
- Add load test scenarios for public list routes.
