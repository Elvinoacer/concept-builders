# Concept Builders Web - Full Feature Audit

Last audited: 2026-03-24
Audit basis: source code under src/app, src/components, src/lib, prisma/schema.prisma, scripts, and existing docs

## 1. System Overview

Concept Builders is a full-stack architecture/design marketplace and project management platform built on Next.js App Router + Prisma/PostgreSQL. It combines:

- Public storefront for browsing and buying house plans
- Authenticated client dashboard for purchases, projects, communication, and settings
- Admin control center for operations, content, analytics, support, and delivery workflows
- Multi-gateway payments (PayPal + IntaSend/M-Pesa)
- File-heavy delivery flows (architectural/structural/BOQ documents, versioning, uploads)
- In-app + push notifications, messaging, and realtime online presence

Core runtime layers:

- UI: Next.js pages/components, framer-motion UI states
- API: Next.js route handlers under /api
- Data: Prisma models (users, designs, orders, projects, messaging, etc.)
- Storage/integrations: DigitalOcean Spaces/S3 APIs, Firebase, PayPal, IntaSend, Google APIs, Resend

## 2. Roles, Access, and Route Protection

Role model:

- CLIENT
- TEAM
- ADMIN

User status model:

- ACTIVE
- BLOCKED

Protection and redirect behavior (src/proxy.ts):

- Unauthenticated users are redirected to /auth when visiting:
  - /dashboard/\*
  - /admin/\*
  - /cart
  - /checkout
- Authenticated users visiting /auth are redirected to:
  - /dashboard for CLIENT
  - /admin for ADMIN/TEAM
- Admin section access restricted away from CLIENT
- Dashboard section restricted away from non-CLIENT
- Cart/checkout restricted away from non-CLIENT

Authentication providers:

- Google OAuth
- Credentials (email/password)

Auth lifecycle features:

- Signup, forgot password, reset password
- Email verification request + confirmation token flow
- JWT sessions with role enrichment and impersonation support
- Login history capture on sign-in callback
- Referral cookie capture for new social signups

## 3. Complete UI Route Catalog

### Public pages

- /
- /about
- /auth
- /auth/reset-password
- /blog
- /blog/[slug]
- /cart
- /categories
- /categories/[id]
- /checkout
- /contact
- /cost-calculator
- /currency-converter
- /custom-design
- /custom-design/[id]
- /design-showcase
- /designs
- /designs/[id]
- /faq
- /maintenance
- /ongoing-projects
- /ongoing-projects/[slug]
- /paypal-test
- /privacy
- /purchase-confirmation
- /refund
- /terms
- /theme-test

### Client dashboard pages

- /dashboard
- /dashboard/feedback
- /dashboard/help
- /dashboard/help/articles/account-setup-guide
- /dashboard/help/articles/creating-first-project
- /dashboard/help/articles/payment-methods
- /dashboard/help/articles/system-requirements
- /dashboard/help/articles/troubleshooting
- /dashboard/invoice/[invoiceId]
- /dashboard/messages
- /dashboard/my-feedback
- /dashboard/notifications
- /dashboard/projects
- /dashboard/projects/[id]
- /dashboard/projects/new
- /dashboard/purchases
- /dashboard/purchases/[orderId]
- /dashboard/settings
- /dashboard/wishlist

### Admin pages

- /admin
- /admin/analytics
- /admin/categories
- /admin/categories/[id]
- /admin/content
- /admin/content/editor
- /admin/content/import
- /admin/costs
- /admin/custom-design-requests/[id]
- /admin/designs
- /admin/designs/folders/[folderId]
- /admin/designs/[id]
- /admin/designs/[id]/edit
- /admin/designs/new
- /admin/designs/new/demo
- /admin/editor
- /admin/feedback
- /admin/inquiries
- /admin/inquiries/[id]
- /admin/marketing
- /admin/messages
- /admin/notifications
- /admin/ongoing-projects
- /admin/ongoing-projects/[id]/edit
- /admin/orders/[orderId]
- /admin/profile
- /admin/projects
- /admin/projects/[id]
- /admin/projects/[id]/costs/[costId]/edit
- /admin/projects/[id]/costs/new
- /admin/projects/[id]/edit
- /admin/projects/[id]/feedback/[feedbackId]/edit
- /admin/projects/[id]/feedback/new
- /admin/projects/[id]/invoices/[invoiceId]/edit
- /admin/projects/[id]/invoices/new
- /admin/projects/[id]/milestones/[milestoneId]/edit
- /admin/projects/[id]/milestones/new
- /admin/projects/[id]/requirements/new
- /admin/projects/[id]/requirements/[requirementId]/edit
- /admin/projects/new
- /admin/purchases
- /admin/settings
- /admin/settings/discounts
- /admin/users
- /admin/users/[id]
- /admin/users/[id]/analytics
- /admin/users/[id]/edit
- /admin/users/[id]/login-history
- /admin/users/[id]/purchases

## 4. Primary Navigation Flows (UI)

### Public shopper flow

1. Landing page / header nav -> /designs or /categories or /design-showcase.
2. Category browse -> /categories/[id] -> /designs/[id].
3. Design detail configuration:
   - choose document file types
   - choose add-on package options
   - add to cart or buy now
4. Buy now behavior:
   - authenticated CLIENT: route to /checkout
   - unauthenticated: sign-in then callback to /checkout
5. Checkout:
   - payment method selector (PayPal, M-Pesa STK push, IntaSend secure URL)
   - discount application
6. Post payment: /purchase-confirmation
7. Fulfillment visibility: /dashboard/purchases and /dashboard/purchases/[orderId]

### Custom design inquiry flow

1. /custom-design form submit with optional attachments.
2. Success modal confirms request submitted.
3. Request tracked under /custom-design/[id] for owner email.
4. Admin reviews request at /admin/custom-design-requests/[id].
5. Admin status updates notify client (in-app + email).

### Client project flow

1. /dashboard/projects/new shows purchased designs.
2. Client selects purchased design -> POST /api/projects/initialize.
3. Redirect to /dashboard/projects list.
4. Project details in /dashboard/projects/[id]:
   - overview
   - milestones
   - requirements
   - costs
   - feedback
   - invoices

### Messaging flow

1. /dashboard/messages opens conversation list + chat panel.
2. User selects conversation and exchanges messages.
3. Socket events update online users and message state.
4. Seen status updates propagate via API/socket.

### Notifications flow

1. /dashboard/notifications lists user notifications.
2. User filters all/unread, marks read, clears or deletes.
3. Push opt-in via browser permission + FCM token save.

### Admin operational flow

1. /admin dashboard for KPIs and overview.
2. Content management at /admin/content + editor/import.
3. Design lifecycle management (create/edit, files, foldering, FAQs, package options).
4. Orders and purchases management:
   - status updates
   - export CSV/PDF
   - attach delivered files to specific order items
5. User management:
   - view/edit/block/unblock/reset actions
   - impersonate user and return
   - login history + purchases + analytics
6. Project management:
   - full CRUD on projects, milestones, requirements, costs, feedback, invoices
7. Notifications and messaging broadcast/support operations.

## 5. Feature Inventory with Data Flows

### A) Authentication and account lifecycle

Capabilities:

- Signup with credentials
- Login (credentials and Google)
- Forgot/reset password
- Email verification + confirmation token
- Session role hydration
- Login history tracking (IP)
- User status control (ACTIVE/BLOCKED)

Data flow:

- UI form -> /api/auth/\* -> Prisma User/VerificationToken/Session/Account
- NextAuth callbacks:
  - enrich JWT/session with role and impersonation context
  - create LoginHistory on sign-in events

### B) Design catalog and discovery

Capabilities:

- Design listing with search/filter/sort/pagination
- Category listing and category detail drill-down
- Featured filtering and featured landing snippets
- View tracking
- Tabs/count and unanswered FAQ helper endpoints

Data flow:

- Pages query /api/designs and /api/categories
- Server side listing also reads Prisma directly for some pages
- /api/designs/[id]/view increments engagement metrics

### C) Design detail and purchase configuration

Capabilities:

- Rich design detail page
- Image gallery + floor plan views
- FAQ display/expand
- Wishlist toggle
- Document-type selection (architectural/structural/BOQ variants)
- Package option add-ons
- Dynamic total price composition

Data flow:

- /designs/[id] fetches /api/designs/[id]
- Add to cart writes CartItem with selectedFileTypes + selectedExtras
- Favorite state toggles via /api/designs/[id]/favorite or /api/wishlist

### D) Cart and checkout

Capabilities:

- Cart item CRUD
- Quantity and option updates
- Cart sync
- Discount code application
- Multi-method checkout orchestration

Data flow:

- Cart UI -> /api/cart/items, /api/cart/clear, /api/cart/sync
- Discount -> /api/cart/update-discount and /api/checkout/apply-discount
- Final totals computed from selected options + discounts

### E) Payments and order creation

Capabilities:

- PayPal create/capture flow
- IntaSend STK push and secure URL checkout
- IntaSend webhook signature verification
- Payment attempt tracking
- Discount usage increment and anti-reuse checks
- Order + OrderItem creation after successful capture/webhook

Data flow:

- PayPal:
  - /api/paypal/create -> PayPal order
  - /api/paypal/capture -> verify amount -> create Order/OrderItems -> delete Cart
- IntaSend:
  - /api/intasend/stk-push or /api/intasend/checkout
  - webhook /api/intasend/webhook validates HMAC and creates paid order
  - /api/orders/status used for polling completion state

### F) Purchase fulfillment and digital delivery

Capabilities:

- User purchase history with filters/sorting/search
- Purchase details page with delivered file links
- Admin attaches delivered files to order items
- Download endpoints for order-level or purchase-level access

Data flow:

- Orders read from Prisma Order -> OrderItem -> Design/File relations
- Delivered files written via /api/admin/orders/[orderId]/items/[itemId]/files
- Delivery links surfaced in client dashboard purchase detail screens

### G) Client project management

Capabilities:

- Initialize project from purchased design
- List/detail/update/delete own projects
- Track progress and status
- View milestones, requirements, costs, feedback, invoices

Data flow:

- /api/projects/initialize creates project baseline
- /api/projects and /api/projects/[id] back dashboard project pages
- Related invoice view at /dashboard/invoice/[invoiceId] via invoices API

### H) Admin project operations

Capabilities:

- Full project CRUD across clients
- Milestone CRUD
- Requirement CRUD
- Cost entry CRUD
- Project feedback CRUD
- Invoice CRUD with typed statuses

Data flow:

- /api/admin/projects/\* with nested resources
- Writes/reads Project, ProjectMilestone, ProjectRequirement, ProjectCost, ProjectFeedback, Invoice, InvoiceItem

### I) Custom design requests

Capabilities:

- Public request intake with attachments
- Request status lifecycle (PENDING -> IN_REVIEW -> APPROVED/REJECTED -> COMPLETED)
- Admin review and status updates
- Client notification + email on status updates

Data flow:

- FormData upload -> /api/custom-design -> object storage upload + DB record
- Admin PUT /api/admin/custom-design-requests/[id]/status updates record and sends notifications/email

### J) Messaging and realtime collaboration

Capabilities:

- Conversation listing (client and admin variants)
- Message send/read flows
- Attachment support in messages
- Online presence list and typing states through Socket.IO

Data flow:

- Chat UI -> /api/conversations and /api/messages
- Seen events -> /api/messages/seen
- Socket server proxies some operations and emits presence/message events

### K) Notifications (in-app + push)

Capabilities:

- User inbox notifications
- Mark single/all read, delete single/all, unread counters
- Admin broadcast notifications
- Device token registration/removal
- Push delivery via Firebase Admin

Data flow:

- Browser token -> /api/notifications/save-token -> DeviceToken model
- Business events (order created, custom request, etc.) -> Notification model + optional push send
- Notification center reads /api/notifications

### L) Feedback, testimonials, and support surfaces

Capabilities:

- User feedback submission
- Admin feedback moderation and featuring
- Featured feedback display on public surfaces
- Dashboard help center + static help article pages

Data flow:

- /api/feedback creates Feedback
- /api/admin/feedback and /feature route manage moderation and featured states
- /api/featured-feedback serves public testimonial snippets

### M) Content and blog management

Capabilities:

- Blog list/detail pages
- Blog APIs (list/popular/detail)
- Admin content tabbed panel (blog/static/policy)
- Rich text editor and legacy editor routes
- Google Docs import to HTML via OAuth token

Data flow:

- Blog data in Post model
- Admin content metrics via /api/admin/content/blog-count and /api/admin/content/static-content
- Google import route reads docs API and writes imported images into public assets

### N) Marketing, referral, analytics, and costs

Capabilities:

- Referral code ownership and referee linking
- Referral trends analytics
- Client acquisition metrics
- Monthly sales and KPI endpoints
- DigitalOcean/resend/hosting monthly cost tracking
- Track endpoint for telemetry/event capture

Data flow:

- Referral settings UI -> /api/settings/referral
- Admin dashboards query /api/admin/analytics, /kpis, /monthly-sales, /marketing/referral-trends, /client-acquisition
- MonthlyCost model for operational cost reporting

### O) User administration and impersonation

Capabilities:

- User list/detail/edit
- Block/unblock/reset-password/refund/resend receipt actions
- Admin impersonation and unimpersonation
- Login history view
- Per-user analytics and purchases pages

Data flow:

- Admin actions through /api/users/\* and /api/admin/users
- Impersonation writes impersonatingUserId on admin user record
- Session callback swaps effective user when impersonating

### P) File management and versioning

Capabilities:

- Presigned upload URL generation
- Upload proxy and direct upload endpoints
- Document-specific file ingestion (architectural/structural/BOQ)
- File status state machine (UPLOADING/COMPLETED/FAILED)
- File versioning and latest pointer (version/isLatest/fileIdentifier)
- Cleanup/status APIs for file records

Data flow:

- UI upload -> upload endpoints -> object storage -> File records
- Version endpoint increments/links version lineage
- Delivery endpoints relate File to OrderItem through DeliveredFile

## 6. Data Model Coverage (Prisma)

### Identity and access

- User, Account, Session, VerificationToken, LoginHistory, DeviceToken

### Commerce

- Cart, CartItem, Order, OrderItem, DeliveredFile, Discount, DesignDiscount, PaymentAttempt

### Product/design domain

- Design, Category, Folder, DesignDocuments, File, PackageOption, Review, DesignInquiry, DesignView

### Project delivery domain

- Project, ProjectMilestone, ProjectRequirement, ProjectCost, ProjectFeedback, Invoice, InvoiceItem

### Communication and engagement

- Conversation, Message, Attachment, Notification, Feedback, Testimonial, NewsletterSubscription

### Content and marketing

- Post, Banner, MarqueeItem, ReferralVisit, OngoingProject, MonthlyCost

### Custom request domain

- CustomDesignRequest

## 7. End-to-End Data/UI Flow Blueprints

### Blueprint 1: Standard purchase

1. User browses /designs -> opens /designs/[id].
2. User selects file types/extras and adds item to cart.
3. User reviews /cart and proceeds to /checkout.
4. User picks PayPal or IntaSend method.
5. Payment API/webhook confirms payment.
6. Order + order items are persisted; cart is cleared when applicable.
7. Notification + email sent.
8. User lands on /purchase-confirmation and later accesses /dashboard/purchases.

### Blueprint 2: Admin file fulfillment

1. Admin opens order detail page and finds pending order item.
2. Admin uploads deliverable files by item file category.
3. System stores file and creates DeliveredFile linkage.
4. User sees files in purchase detail page and downloads via file URL/download endpoint.

### Blueprint 3: Custom design request lifecycle

1. Prospect submits /custom-design form with docs.
2. System uploads attachments and creates CustomDesignRequest.
3. Admin is notified and reviews request.
4. Admin updates status.
5. Client receives notification/email and can track own request page.

### Blueprint 4: Project initialization from purchased design

1. Client opens /dashboard/projects/new.
2. Purchased designs are fetched from /api/purchases.
3. Client selects one design and initializes project.
4. Project appears in /dashboard/projects and can be monitored in /dashboard/projects/[id].

### Blueprint 5: Messaging and read receipts

1. User enters /dashboard/messages and selects conversation.
2. Messages fetched from /api/messages?conversationId=...
3. Message send posts to /api/messages.
4. Seen event posts to /api/messages/seen.
5. Socket server emits online/presence/message updates to active clients.

## 8. Admin Feature Matrix (Operational)

- Design operations: create/edit/delete, foldering, FAQs, package options, docs/files
- Category operations: CRUD + featured management
- Orders: list/filter/status update, CSV/PDF export, item delivery files
- Purchases: overview and fulfillment surface
- Users: CRUD-like admin actions, blocks, resets, impersonation, history, analytics
- Projects: complete lifecycle admin CRUD across nested entities
- Content: blog/static/policy inventory, editor/import
- Marketing/analytics: KPI, trends, referrals, acquisition, monthly sales
- Notifications/messages: broadcast and inbox operations
- Discounts: code creation and lifecycle controls
- Costs: operational cost endpoints and historical views

## 9. Supporting Scripts and Maintenance Capabilities

- scripts/realtime/server.js: Socket.IO realtime messaging server
- scripts/export-users.ts: user export utility
- scripts/generate-sitemap.mjs: sitemap generation
- scripts/test-intasend.ts: IntaSend integration testing helper
- prisma seed and migration scripts for environment setup, test data, and schema evolution

## 10. Full API Surface by Functional Group

Note: This section groups all discovered routes by domain for feature tracing.

### Auth

- /api/auth/[...nextauth]
- /api/auth/signup
- /api/auth/forgot-password
- /api/auth/reset-password
- /api/auth/verify-email
- /api/auth/verify-email/confirm

### Public/content/catalog

- /api/designs and nested routes under /api/designs/\*
- /api/categories and /api/categories/[id]
- /api/blog, /api/blog/[slug], /api/blog/popular
- /api/posts
- /api/landing-page
- /api/ongoing-projects and /api/ongoing-projects/[slug]
- /api/contact
- /api/subscribe
- /api/exchange-rate
- /api/poll
- /api/featured-feedback
- /api/feedback

### Commerce and payment

- /api/cart/\*
- /api/checkout/apply-discount
- /api/orders, /api/orders/[id], /api/orders/status
- /api/purchases, /api/purchases/[purchaseId]
- /api/downloads/[orderId]
- /api/paypal/create, /api/paypal/capture
- /api/intasend/checkout, /api/intasend/stk-push, /api/intasend/webhook
- /api/payment/verify

### Dashboard/client

- /api/dashboard/stats
- /api/dashboard/recommendations
- /api/dashboard/my-requests
- /api/dashboard/purchases/[orderId]
- /api/dashboard/my-feedback and /api/dashboard/my-feedback/[id]
- /api/projects, /api/projects/[id], /api/projects/initialize
- /api/invoices/[invoiceId]
- /api/wishlist

### Notifications and messaging

- /api/notifications/\*
- /api/messages and /api/messages/seen
- /api/conversations and /api/conversations/all

### Settings/profile/referral

- /api/settings/profile
- /api/settings/password
- /api/settings/referral
- /api/settings/referrals
- /api/user/phone

### User administration

- /api/users
- /api/users/admins
- /api/users/clients
- /api/users/send-email
- /api/users/unimpersonate
- /api/users/[id]
- /api/users/[id]/edit
- /api/users/[id]/delete
- /api/users/[id]/block
- /api/users/[id]/unblock
- /api/users/[id]/reset-password
- /api/users/[id]/refund
- /api/users/[id]/resend-receipt
- /api/users/[id]/impersonate
- /api/users/[id]/analytics
- /api/users/[id]/purchases
- /api/users/[id]/login-history

### Admin domain

- /api/admin/analytics
- /api/admin/dashboard/kpis
- /api/admin/stats
- /api/admin/monthly-sales
- /api/admin/client-acquisition
- /api/admin/marketing/referral-trends
- /api/admin/users
- /api/admin/profile
- /api/admin/categories and /api/admin/categories/[id]
- /api/admin/designs and /api/admin/designs/[id]
- /api/admin/folders
- /api/admin/orders and nested export/status/item-files endpoints
- /api/admin/discounts
- /api/admin/projects and nested resources for milestones/requirements/costs/feedback/invoices/specf
- /api/admin/custom-design-requests and /api/admin/custom-design-requests/[id]/status
- /api/admin/notifications, /api/admin/notifications/send, /api/admin/notifications/unread-count, /api/admin/notifications/[id]
- /api/admin/ongoing-projects and /api/admin/ongoing-projects/[id]
- /api/admin/feedback, /api/admin/feedback/[id], /api/admin/feedback/[id]/feature
- /api/admin/content/blog-count
- /api/admin/content/static-content
- /api/admin/costs/calculate
- /api/admin/costs/historical
- /api/admin/historical-costs
- /api/admin/digitalocean-costs
- /api/admin/banners and /api/admin/banners/[id]
- /api/admin/marquee-items and /api/admin/marquee-items/[id]
- /api/admin/reset-progress

### Upload/files utility

- /api/upload
- /api/upload-file
- /api/upload/generate-presigned-url
- /api/upload-cloud-vercel-files
- /api/files/create
- /api/files/upload
- /api/files/update-status
- /api/files/cleanup
- /api/designs/upload
- /api/designs/upload-file
- /api/designs/upload-document
- /api/designs/upload-proxy
- /api/designs/generate-upload-url
- /api/designs/delete-file
- /api/designs/delete-uploaded-file
- /api/designs/[id]/files
- /api/designs/[id]/files/version

### Misc/utility

- /api/register
- /api/test-email
- /api/track
- /api/debug
- /api/receipts/resend
- /api/package-options/[optionId]

## 11. Integrations Inventory

- Prisma/PostgreSQL for relational persistence
- NextAuth for auth/session
- PayPal Checkout server/client SDK
- IntaSend for M-Pesa and hosted checkout
- Firebase + Firebase Admin for push notifications
- DigitalOcean Spaces/S3-compatible object storage
- Google APIs for Google Docs import and OAuth scopes
- Resend/react-email email delivery
- Socket.IO realtime messaging channel

## 12. Notes from Audit

- The platform is feature-rich and operationally broad across storefront, delivery, communication, and admin functions.
- Route-level and model-level coverage indicates mature multi-domain behavior (commerce + service-delivery + project management).
- Messaging realtime script exists, but production hardening/consistency should be validated separately in runtime QA.
