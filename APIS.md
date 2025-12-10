# API Routes Documentation

This document provides a comprehensive list of all API routes in the Concept Builders web application.

**Total Routes:** 134

---

## Table of Contents

- [Admin Routes](#admin-routes)
- [Authentication Routes](#authentication-routes)
- [Blog Routes](#blog-routes)
- [Cart Routes](#cart-routes)
- [Categories Routes](#categories-routes)
- [Checkout Routes](#checkout-routes)
- [Contact Routes](#contact-routes)
- [Conversations Routes](#conversations-routes)
- [Custom Design Routes](#custom-design-routes)
- [Dashboard Routes](#dashboard-routes)
- [Designs Routes](#designs-routes)
- [Downloads Routes](#downloads-routes)
- [Exchange Rate Routes](#exchange-rate-routes)
- [Feedback Routes](#feedback-routes)
- [Files Routes](#files-routes)
- [Import Routes](#import-routes)
- [IntaSend Payment Routes](#intasend-payment-routes)
- [Invoices Routes](#invoices-routes)
- [Landing Page Routes](#landing-page-routes)
- [Messages Routes](#messages-routes)
- [Notifications Routes](#notifications-routes)
- [Ongoing Projects Routes](#ongoing-projects-routes)
- [Orders Routes](#orders-routes)
- [Package Options Routes](#package-options-routes)
- [PayPal Routes](#paypal-routes)
- [Poll Routes](#poll-routes)
- [Posts Routes](#posts-routes)
- [Projects Routes](#projects-routes)
- [Purchases Routes](#purchases-routes)
- [Receipts Routes](#receipts-routes)
- [Register Routes](#register-routes)
- [Settings Routes](#settings-routes)
- [Subscribe Routes](#subscribe-routes)
- [Test Routes](#test-routes)
- [Track Routes](#track-routes)
- [Upload Routes](#upload-routes)
- [User Routes](#user-routes)
- [Users Routes](#users-routes)
- [Wishlist Routes](#wishlist-routes)

---

## Admin Routes

### Analytics & Stats

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/analytics` | GET | Get admin analytics data |
| `/api/admin/dashboard/kpis` | GET | Get key performance indicators |
| `/api/admin/stats` | GET | Get admin statistics |
| `/api/admin/client-acquisition` | GET | Get client acquisition metrics |
| `/api/admin/monthly-sales` | GET | Get monthly sales data |
| `/api/admin/marketing/referral-trends` | GET | Get referral trends |

### Banners

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/banners` | GET, POST | List/create banners |
| `/api/admin/banners/[id]` | GET, PUT, DELETE | Get/update/delete banner |

### Categories

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/categories` | GET, POST | List/create categories |
| `/api/admin/categories/[id]` | GET, PUT, DELETE | Get/update/delete category |

### Content Management

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/content/blog-count` | GET | Get blog post count |
| `/api/admin/content/static-content` | GET, PUT | Get/update static content |

### Costs

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/costs/calculate` | POST | Calculate costs |
| `/api/admin/costs/historical` | GET | Get historical costs |
| `/api/admin/historical-costs` | GET, POST, PUT | Manage historical costs |
| `/api/admin/digitalocean-costs` | GET, POST | Manage DigitalOcean costs |

### Custom Design Requests

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/custom-design-requests` | GET | List custom design requests |
| `/api/admin/custom-design-requests/[id]/status` | PUT | Update request status |

### Designs

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/designs` | GET, POST | List/create designs (admin) |
| `/api/admin/designs/[id]` | PUT, DELETE | Update/delete design featured status |

### Discounts

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/discounts` | GET, POST, PUT, DELETE | Manage discounts |

### Feedback

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/feedback` | GET | List all feedback |
| `/api/admin/feedback/[id]` | DELETE | Delete feedback |
| `/api/admin/feedback/[id]/feature` | PUT | Feature/unfeature feedback |

### Folders

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/folders` | GET, POST | List/create design folders |

### Marquee Items

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/marquee-items` | GET, POST | List/create marquee items |
| `/api/admin/marquee-items/[id]` | PUT, DELETE | Update/delete marquee item |

### Notifications

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/notifications` | GET, POST | List/create admin notifications |
| `/api/admin/notifications/[id]` | DELETE | Delete notification |
| `/api/admin/notifications/send` | POST | Send notification to users |
| `/api/admin/notifications/unread-count` | GET | Get unread count |

### Ongoing Projects

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/ongoing-projects` | GET, POST | List/create ongoing projects |
| `/api/admin/ongoing-projects/[id]` | GET, PUT, DELETE | Get/update/delete ongoing project |

### Orders

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/orders` | GET | List all orders |
| `/api/admin/orders/[orderId]` | GET, PUT | Get/update order |
| `/api/admin/orders/[orderId]/items/[itemId]/files` | POST | Add files to order item |
| `/api/admin/orders/status-counts` | GET | Get order status counts |
| `/api/admin/orders/export/csv` | GET | Export orders as CSV |
| `/api/admin/orders/export/pdf` | POST | Export order as PDF |

### Profile

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/profile` | GET, PUT | Get/update admin profile |

### Projects

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/projects` | GET, POST | List/create projects |
| `/api/admin/projects/[projectId]` | GET, PUT, DELETE | Get/update/delete project |
| `/api/admin/projects/[projectId]/costs` | GET, POST | List/create project costs |
| `/api/admin/projects/[projectId]/costs/[costId]` | PUT, DELETE | Update/delete project cost |
| `/api/admin/projects/[projectId]/feedback` | GET, POST | List/create project feedback |
| `/api/admin/projects/[projectId]/feedback/[feedbackId]` | PUT, DELETE | Update/delete project feedback |
| `/api/admin/projects/[projectId]/invoices` | GET, POST | List/create project invoices |
| `/api/admin/projects/[projectId]/invoices/[invoiceId]` | GET, PUT, DELETE | Get/update/delete invoice |
| `/api/admin/projects/[projectId]/milestones` | GET, POST | List/create project milestones |
| `/api/admin/projects/[projectId]/milestones/[milestoneId]` | PUT, DELETE | Update/delete milestone |
| `/api/admin/projects/[projectId]/requirements` | GET, POST | List/create project requirements |
| `/api/admin/projects/[projectId]/requirements/[requirementId]` | PUT, DELETE | Update/delete requirement |
| `/api/admin/projects/specf/[id]` | GET | Get project specification |

### System

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/reset-progress` | POST | Reset system progress |

### Users

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/admin/users` | GET | List all users (admin view) |

---

## Authentication Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/auth/[...nextauth]` | GET, POST | NextAuth authentication handler |
| `/api/auth/signup` | POST | User registration |
| `/api/auth/forgot-password` | POST | Request password reset |
| `/api/auth/reset-password` | POST | Reset password |
| `/api/auth/verify-email` | POST | Request email verification |
| `/api/auth/verify-email/confirm` | GET | Confirm email verification |

---

## Blog Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/blog` | GET, POST | List/create blog posts |
| `/api/blog/[slug]` | GET, PUT, DELETE | Get/update/delete blog post |
| `/api/blog/popular` | GET | Get popular blog posts |

---

## Cart Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/cart/items` | GET, POST | List/add cart items |
| `/api/cart/items/[itemId]` | PUT, DELETE | Update/remove cart item |
| `/api/cart/clear` | DELETE | Clear cart |
| `/api/cart/sync` | POST | Sync cart |
| `/api/cart/update-discount` | POST | Apply/remove discount from cart |

---

## Categories Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/categories` | GET | List categories |
| `/api/categories/[id]` | GET | Get category by ID |

---

## Checkout Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/checkout/apply-discount` | POST | Apply discount code at checkout |

---

## Contact Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/contact` | POST | Submit contact form |

---

## Conversations Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/conversations` | GET, POST | List/create conversations |
| `/api/conversations/all` | GET | Get all conversations |

---

## Custom Design Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/custom-design` | POST | Submit custom design request |
| `/api/custom-design/[id]` | GET, PUT | Get/update custom design request |
| `/api/custom-design/[id]/file` | POST | Upload file for custom design |

---

## Dashboard Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/dashboard/stats` | GET | Get dashboard statistics |
| `/api/dashboard/my-feedback` | GET, POST | List/create user feedback |
| `/api/dashboard/my-feedback/[id]` | DELETE | Delete user feedback |
| `/api/dashboard/my-requests` | GET | Get user's custom design requests |
| `/api/dashboard/purchases/[orderId]` | GET | Get purchase details |
| `/api/dashboard/recommendations` | GET | Get personalized recommendations |

---

## Designs Routes

### Main Design Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/designs` | GET, POST | List/create designs |
| `/api/designs/[id]` | GET, PUT, DELETE | Get/update/delete design |
| `/api/designs/[id]/view` | POST | Track design view |
| `/api/designs/[id]/favorite` | POST | Toggle favorite design |
| `/api/designs/inquiry` | POST | Submit design inquiry |
| `/api/designs/tabs-count` | GET | Get design tabs count |
| `/api/designs/unanswered-faqs` | GET | Get unanswered FAQs |

### Design Files

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/designs/[id]/files` | POST | Upload design files |
| `/api/designs/[id]/files/version` | POST | Create file version |
| `/api/designs/delete-file` | DELETE | Delete design file |
| `/api/designs/delete-uploaded-file` | POST | Delete uploaded file |
| `/api/designs/generate-upload-url` | POST | Generate presigned upload URL |
| `/api/designs/upload` | POST | Upload design file |
| `/api/designs/upload-document` | POST | Upload design document |
| `/api/designs/upload-file` | POST | Upload file to design |
| `/api/designs/upload-proxy` | POST | Proxy file upload |

### Design FAQs

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/designs/[id]/faq` | GET, POST | List/create design FAQs |
| `/api/designs/[id]/faq/[faqIndex]` | PUT, DELETE | Update/delete FAQ |

### Design Folders

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/designs/folders` | GET, POST | List/create design folders |
| `/api/designs/folders/[folderId]` | GET, PUT, DELETE | Get/update/delete folder |

### Package Options

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/designs/[id]/package-options` | POST | Add package option to design |

---

## Downloads Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/downloads/[orderId]` | POST | Generate download links for order |

---

## Exchange Rate Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/exchange-rate` | GET | Get current exchange rate |

---

## Feedback Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/feedback` | POST | Submit feedback |
| `/api/featured-feedback` | GET | Get featured feedback |

---

## Files Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/files/create` | POST | Create file record |
| `/api/files/upload` | POST | Upload file |
| `/api/files/cleanup` | POST | Cleanup unused files |
| `/api/files/update-status` | PUT | Update file status |

---

## Import Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/import-gdoc` | POST | Import Google Doc content |

---

## IntaSend Payment Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/intasend/checkout` | POST | Initialize IntaSend checkout |
| `/api/intasend/stk-push` | POST | M-Pesa STK Push |
| `/api/intasend/webhook` | POST | IntaSend payment webhook |

---

## Invoices Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/invoices/[invoiceId]` | GET | Get invoice by ID |

---

## Landing Page Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/landing-page` | GET, PUT | Get/update landing page content |

---

## Messages Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/messages` | GET, POST | List/send messages |
| `/api/messages/seen` | POST | Mark messages as seen |

---

## Notifications Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/notifications` | GET | List user notifications |
| `/api/notifications/[id]` | DELETE | Delete notification |
| `/api/notifications/[id]/read` | PUT | Mark notification as read |
| `/api/notifications/mark-all-read` | POST | Mark all notifications as read |
| `/api/notifications/clear-all` | DELETE | Clear all notifications |
| `/api/notifications/unread-count` | GET | Get unread notification count |
| `/api/notifications/save-token` | POST | Save device token for push notifications |

---

## Ongoing Projects Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/ongoing-projects` | GET | List ongoing projects |
| `/api/ongoing-projects/[slug]` | GET | Get ongoing project by slug |

---

## Orders Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/orders` | GET, POST | List/create orders |
| `/api/orders/[id]` | GET | Get order by ID |
| `/api/orders/status` | PUT | Update order status |

---

## Package Options Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/package-options/[optionId]` | PUT, DELETE | Update/delete package option |

---

## PayPal Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/paypal/create` | POST | Create PayPal order |
| `/api/paypal/capture` | POST | Capture PayPal payment |

---

## Poll Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/poll` | GET, POST | Get/submit poll response |

---

## Posts Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/posts` | GET, POST | List/create posts |

---

## Projects Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/projects` | GET, POST | List/create user projects |
| `/api/projects/[id]` | GET, PUT, DELETE | Get/update/delete project |
| `/api/projects/initialize` | POST | Initialize new project |

---

## Purchases Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/purchases` | GET | List user purchases |
| `/api/purchases/[purchaseId]` | GET | Get purchase details |

---

## Receipts Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/receipts/resend` | POST | Resend receipt email |

---

## Register Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/register` | POST | Register new user |

---

## Settings Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/settings/profile` | GET, PUT | Get/update user profile |
| `/api/settings/password` | PUT | Change password |
| `/api/settings/referral` | GET | Get referral information |
| `/api/settings/referrals` | GET | Get referral statistics |

---

## Subscribe Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/subscribe` | POST | Subscribe to newsletter |

---

## Test Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/test-email` | GET | Test email sending |

---

## Track Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/track` | POST | Track user events |

---

## Upload Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/upload` | POST | Upload file |
| `/api/upload/generate-presigned-url` | POST | Generate presigned URL for upload |
| `/api/upload-file` | POST | Upload file (alternative endpoint) |
| `/api/upload-cloud-vercel-files` | POST | Upload to Vercel storage |

---

## User Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/user/phone` | PUT | Update user phone number |

---

## Users Routes

### User Management

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/users` | GET | List users |
| `/api/users/[id]` | GET, PUT, DELETE | Get/update/delete user |
| `/api/users/[id]/analytics` | GET | Get user analytics |
| `/api/users/[id]/block` | POST | Block user |
| `/api/users/[id]/unblock` | POST | Unblock user |
| `/api/users/[id]/delete` | DELETE | Delete user |
| `/api/users/[id]/edit` | PUT | Edit user |

### User Actions

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/users/[id]/impersonate` | POST | Impersonate user |
| `/api/users/unimpersonate` | POST | Stop impersonating |
| `/api/users/[id]/login-history` | GET | Get user login history |
| `/api/users/[id]/purchases` | GET | Get user purchases |
| `/api/users/[id]/refund` | POST | Process refund for user |
| `/api/users/[id]/resend-receipt` | POST | Resend receipt to user |
| `/api/users/[id]/reset-password` | POST | Reset user password |

### User Categories

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/users/admins` | GET | List admin users |
| `/api/users/clients` | GET | List client users |

### User Communication

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/users/send-email` | POST | Send email to users |

---

## Wishlist Routes

| Route | Methods | Description |
|-------|---------|-------------|
| `/api/wishlist` | GET | Get user wishlist |

---

## Notes

- All routes prefixed with `/api/admin/` require admin authentication
- All routes prefixed with `/api/dashboard/` require user authentication
- Dynamic segments are denoted with `[parameter]` syntax
- Most routes support standard CRUD operations (GET, POST, PUT, DELETE)
- Payment routes integrate with IntaSend (M-Pesa) and PayPal

---

**Last Updated:** December 10, 2025
