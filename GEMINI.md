Concept Builders – Product Requirements Document (PRD)

1. Introduction
   Concept Builders is an end-to-end architectural design and construction platform that allows users to discover, purchase, and actualize house plans while offering a robust admin dashboard for managing designs, clients, costs, and analytics. This PRD outlines the features, flows, and technical requirements of the platform.

2. Objectives
   Provide an all-in-one solution for home building – from design discovery to construction handover.

Deliver superior UX with fast performance and intuitive navigation.

Offer full analytics and tracking to understand customer behavior and business health.

Ensure scalability and security for future growth.

3. User Roles & Permissions
   3.1 Guest Users (Non-Logged-In)
   Browse designs, categories, and blog posts.

View product details, prices, and estimated construction costs.

Compare different design plans

Add designs to cart but must sign up/login to complete checkout.

Read about pages, policies, FAQs, and contact support.

3.2 Authenticated Members (Clients)
Manage account profile and password.

Purchase designs securely via supported payment methods.

View and download purchased plans.

Access project dashboard for ongoing construction.

Request modifications or new custom designs.

Receive receipts (with ability to resend via email).

View personalized analytics (purchases, downloads, referrals).

3.3 Admin Users
Full dashboard access: analytics, revenue, cost tracking.

Create/update/delete designs, categories, blogs.

Approve custom projects and assign project managers.

Manage user accounts, payments, refunds.

Organize design assets into folder structures.

Upload files to DigitalOcean Spaces.

View real-time visitor, product, and referral analytics.

Track operational costs (storage, email, hosting).
Track real-time visitor from different social media eg Youtube, linkedIn, Whatsapp, etc

4. User Flows
   4.1 Guest Flow
   Visitor lands on homepage.

Browses designs → filters by type, size, budget.

Clicks a design → views details, estimated costs.

Adds to cart → prompted to sign up or log in.(modal form)-support for oauth

4.2 Authenticated Member Flow
Login/Signup (email/password, social login optional).

Add design to cart and checkout.

Receives order confirmation + receipt.

Downloads plan from dashboard.

Tracks project progress (if actualization service selected).

Communicates with the project manager via dashboard messaging.

4.3 Admin Flow
Logs in to admin panel.

Views dashboard analytics (visitors, top designs, revenue).

Uploads new designs, organizes in folders.

Monitors cost dashboard (DigitalOcean, Resend, hosting).

Responds to support tickets.

Approves or refunds orders as needed.

5. Core Features & Requirements
   5.1 Design Catalog
   Grid/list display with filtering (price, size, bedrooms).

Detail page: images, 3D renders, floor plan preview.

Related designs section.

5.2 Checkout & Payments
Integration with paypal&Intasend

Generate invoice & receipt.
The admin should as well see those emails sent(success and failed ) and take actions based on it like for a failed he would resend, and also details why it failed to sent to client

Automatic receipt resend option.

5.3 Analytics & Tracking
Visitor tracking: page views, session duration, bounce rate.

Product performance: views, conversions, abandoned carts.

Referral tracking: Facebook, WhatsApp, LinkedIn, Google.

Revenue dashboard: daily/weekly/monthly totals.

Cost tracking: DigitalOcean storage, Resend emails, hosting.

5.4 File Management
Folder-based storage system.

Secure uploads to DigitalOcean Spaces.

Version control (replace outdated files).

5.5 Admin Dashboard
KPIs: total sales, trending products, traffic sources.

Orders management (view, refund, resend receipts).

User management (block/unblock, reset passwords).

CMS for blog posts, static pages, policies.

5.6 Communication
Contact support form with email notifications.

Project messaging system (client ↔ project manager).

Automated email updates (status changes, reminders).

5.7 Legal & Policy Pages
Terms & Conditions, Privacy Policy, Refund Policy.

About page with company info.

Contact page with phone, email, live chat.

6. Non-Functional Requirements
   Performance: Page loads under 2 seconds.

Scalability: Handle 10k concurrent users.

Security: SSL, role-based access control, PCI-compliant payments.

Availability: 99.9% uptime.

Accessibility: WCAG 2.1 compliance.

7. Analytics Variables
   Visitors (unique, returning)

Time on site

Bounce rate

Conversions per product

Revenue by referral source

Storage usage (GB/month)

Email sends (Resend cost)

Monthly infrastructure costs

8. Acceptance Criteria
   Guest can browse and view any design.

Only logged-in users can checkout or download.

Admin can upload files, create categories, and see analytics.

Receipts can be resent successfully.

Analytics dashboard shows real-time and historical data.

Cost tracking dashboard updates automatically.

9. Future Enhancements
   AI-powered design recommendations.

Automated construction cost estimation per region.

Marketplace for vetted contractors.

CRM integration for client relationship management.

10. Deliverables
    Fully functional Next.js front-end with responsive UI.

Prisma ORM, Postresql, Next.js APIs

Admin panel for management and analytics.

Integration with DigitalOcean, Resend, paypal/Intasend.

Comprehensive documentation and testing.

Concept Builders – Site Map with App Pages
Public Pages (Guest Accessible)
Home

Hero Section (Search, Featured Designs)

Categories Grid (Bungalows, Duplexes, Apartments, etc.)

Featured Projects/Blogs

Designs Listing

Category Filter (Price, Bedrooms, Style)

Sorting (Newest, Popular, Price Ascending/Descending)

Design Detail Page

Image Gallery & Floor Plan Preview

Cost Estimate Breakdown

Add to Cart Button

Related Designs Section

Custom Design Request Page (Form Submission)

Blog & Learning Hub

Blog List View

Blog Detail View

About Us

Contact Page (Form + Map + Support Info)

Policies Section

Terms & Conditions

Privacy Policy

Refund Policy

Cart (View Items) → Checkout (Login Required)

Authenticated Member Pages (App Dashboard)
Dashboard Home (Summary Cards: Purchases, Projects, Referrals)

My Purchases

List of Purchased Designs

Download Buttons & Resend Receipts

My Projects

Project Tracking (Progress Bar, Updates, Images)

Milestones & Payment Tracking

Messages/Support

Chat Interface with Attachments

Profile & Settings

Personal Info

Password Management

Referral Link/Code

Notifications Center

Project Updates

Promotions & Offers

Admin Panel Pages
Admin Dashboard

KPIs (Sales, Visitors, Costs, Conversions)

Charts & Graphs

Design Management

Add/Edit/Delete Designs

Organize Designs into Folders

File Manager

Folder Tree + File Uploads (DigitalOcean Spaces)

Version Control

Orders & Refunds Management

User Management

Clients & Team Members

Content Management (CMS)

Blog Posts, Static Pages, Policies

Analytics & Reports

Traffic, Product Views, Referral Sources, Conversion Rates

Service Cost Tracking

DigitalOcean Usage, Email Costs, Hosting Bills

Utility & System Pages
Login / Signup

Password Reset / Email Verification

Error Pages (404 / 500)

Loading / Maintenance Pages

PROMPT:
│ > so we have concept_builders_designs folder that contains all the designs we might need for now, the best thing is to plan on implementation, we are │
│ not going to build everything but focus on small and increment on that, so all the static data should be stored in one place in /lib folder, we │
│ have our logo in this @public/images/concept-builders-logo-free-bg.png, so just use the theme of the logo, but the design looks better in terms of │
│ layout,

so the way we do it is also to focus on modular structure like components, I would really wish most code to be kept server side and only needed should be on client side, since most hooks and framer-motion library(which we must use) must be client side code, also all the page static data to be on /lib folder
