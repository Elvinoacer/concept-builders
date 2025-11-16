
## Auth APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/auth/forgot-password` | `POST` | Sends a password reset email to the user. |
| `/api/auth/reset-password` | `POST` | Resets the user's password. |
| `/api/auth/signup` | `POST` | Registers a new user. |
| `/api/auth/verify-email` | `POST` | Sends a verification email to the user. |
| `/api/auth/verify-email/confirm` | `GET` | Confirms the user's email address. |
| `/api/auth/[...nextauth]` | `GET`, `POST` | Handles all NextAuth.js authentication requests. |

## Blog APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/blog` | `GET` | Retrieves a paginated list of blog posts. |
| `/api/blog/[slug]` | `GET` | Retrieves a specific blog post by slug. |
| `/api/blog/popular` | `GET` | Retrieves a list of popular blog posts. |

## Cart APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/cart/clear` | `DELETE` | Clears all items from the user's cart. |
| `/api/cart/items` | `GET` | Retrieves all items from the user's cart. |
| `/api/cart/items` | `POST` | Adds an item to the user's cart. |
| `/api/cart/items/[itemId]` | `DELETE` | Removes an item from the user's cart. |
| `/api/cart/items/[itemId]` | `PUT` | Updates an item in the user's cart. |
| `/api/cart/sync` | `POST` | Syncs the user's local cart with the database. |
| `/api/cart/update-discount` | `POST` | Applies a discount to the user's cart. |

## Categories APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/categories` | `GET` | Retrieves a list of all categories. |
| `/api/categories` | `POST` | Creates a new category. |
| `/api/categories/[id]` | `GET` | Retrieves a specific category by ID. |
| `/api/categories/[id]` | `PUT` | Updates a specific category by ID. |
| `/api/categories/[id]` | `DELETE` | Deletes a specific category by ID. |

## Checkout APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/checkout/apply-discount` | `POST` | Applies a discount to the checkout. |

## Contact APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/contact` | `POST` | Sends a contact form submission to the admin. |

## Conversations APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/conversations` | `GET` | Retrieves all conversations for the authenticated user. |
| `/api/conversations/all` | `GET` | Retrieves all conversations for the admin user. |

## Custom Design APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/custom-design` | `POST` | Submits a new custom design request. |
| `/api/custom-design/[id]` | `PUT` | Updates a custom design request. |
| `/api/custom-design/[id]/file` | `DELETE` | Deletes a file from a custom design request. |

## Dashboard APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/dashboard/my-feedback` | `GET` | Retrieves all feedback submitted by the authenticated user. |
| `/api/dashboard/my-feedback/[id]` | `DELETE` | Deletes a feedback entry by ID. |
| `/api/dashboard/my-requests` | `GET` | Retrieves all custom design requests submitted by the authenticated user. |
| `/api/dashboard/recommendations` | `GET` | Retrieves a list of recommended designs for the authenticated user. |
| `/api/dashboard/stats` | `GET` | Retrieves statistics for the authenticated user's dashboard. |

## Debug APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/debug` | `GET` | A debug endpoint. |

## Designs APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/designs` | `GET` | Retrieves a paginated list of designs. |
| `/api/designs` | `POST` | Creates a new design. |
| `/api/designs/[id]` | `GET` | Retrieves a specific design by ID. |
| `/api/designs/[id]` | `PUT` | Updates a specific design by ID. |
| `/api/designs/[id]` | `DELETE` | Deletes a specific design by ID. |
| `/api/designs/[id]/faq` | `POST` | Adds a new FAQ to a design. |
| `/api/designs/[id]/faq/[faqIndex]` | `PUT` | Updates an FAQ for a design. |
| `/api/designs/[id]/favorite` | `POST` | Toggles a design as a favorite for the authenticated user. |
| `/api/designs/[id]/files` | `GET` | Retrieves all files for a specific design. |
| `/api/designs/[id]/files/version` | `POST` | Uploads a new version of a file for a design. |
| `/api/designs/[id]/package-options` | `POST` | Adds a new package option to a design. |
| `/api/designs/[id]/view` | `POST` | Tracks a view for a design. |
| `/api/designs/delete-file` | `POST` | Deletes a file from a design. |
| `/api/designs/delete-uploaded-file` | `POST` | Deletes an uploaded file. |
| `/api/designs/folders` | `GET` | Retrieves all folders for the authenticated user. |
| `/api/designs/folders` | `POST` | Creates a new folder. |
| `/api/designs/folders/[folderId]` | `GET` | Retrieves a specific folder by ID. |
| `/api/designs/folders/[folderId]` | `PUT` | Updates a specific folder by ID. |
| `/api/designs/tabs-count` | `GET` | Retrieves the count of designs for each tab. |
| `/api/designs/unanswered-faqs` | `GET` | Retrieves all designs with unanswered FAQs. |
| `/api/designs/upload` | `POST` | Gets a signed URL for uploading a file. |
| `/api/designs/upload-document` | `POST` | Gets a signed URL for uploading a document. |
| `/api/designs/upload-file` | `POST` | Gets a signed URL for uploading a file. |
| `/api/designs/upload-proxy` | `POST` | A proxy for uploading files. |

## Downloads APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/downloads/[orderId]` | `GET` | Retrieves the downloadable files for a specific order. |

## Exchange Rate APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/exchange-rate` | `GET` | Retrieves the current USD to KES exchange rate. |

## Featured Feedback APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/featured-feedback` | `GET` | Retrieves a list of featured feedback. |

## Feedback APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/feedback` | `GET` | Retrieves all feedback submitted by the authenticated user. |
| `/api/feedback` | `POST` | Submits new feedback. |

## Files APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/files/upload` | `POST` | Gets a signed URL for uploading a file. |

## Import GDoc APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/import-gdoc` | `POST` | Imports a Google Doc as HTML. |

## IntaSend APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/intasend/checkout` | `POST` | Creates an IntaSend checkout session. |
| `/api/intasend/stk-push` | `POST` | Initiates an M-Pesa STK push. |
| `/api/intasend/webhook` | `POST` | Handles IntaSend webhooks. |

## Invoices APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/invoices/[invoiceId]` | `GET` | Retrieves a specific invoice by ID. |

## Landing Page APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/landing-page` | `GET` | Retrieves data for the landing page. |

## Messages APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/messages` | `GET` | Retrieves all messages for a specific conversation. |
| `/api/messages` | `POST` | Sends a new message. |
| `/api/messages/seen` | `POST` | Marks a message as seen. |

## Notifications APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/notifications` | `GET` | Retrieves all notifications for the authenticated user. |
| `/api/notifications/clear-all` | `DELETE` | Clears all notifications for the authenticated user. |
| `/api/notifications/mark-all-read` | `PATCH` | Marks all notifications as read for the authenticated user. |
| `/api/notifications/unread-count` | `GET` | Retrieves the count of unread notifications for the authenticated user. |
| `/api/notifications/[id]` | `PATCH` | Marks a notification as read. |
| `/api/notifications/[id]` | `DELETE` | Deletes a notification by ID. |
| `/api/notifications/[id]/read` | `PUT` | Marks a notification as read. |

## Ongoing Projects APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/ongoing-projects` | `GET` | Retrieves all ongoing projects. |
| `/api/ongoing-projects/[slug]` | `GET` | Retrieves a specific ongoing project by slug. |

## Orders APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/orders` | `POST` | Creates a new order. |
| `/api/orders/[id]` | `GET` | Retrieves a specific order by ID. |
| `/api/orders/status` | `GET` | Retrieves the status of an order. |

## Package Options APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/package-options/[optionId]` | `PUT` | Updates a package option by ID. |
| `/api/package-options/[optionId]` | `DELETE` | Deletes a package option by ID. |

## Payment APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/payment` | `POST` | Processes a payment. |

## PayPal APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/paypal/capture` | `POST` | Captures a PayPal payment. |
| `/api/paypal/create` | `POST` | Creates a PayPal order. |

## Poll APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/poll` | `GET` | A long-polling endpoint for real-time updates. |

## Posts APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/posts` | `GET` | Retrieves all blog posts. |

## Projects APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/projects` | `GET` | Retrieves all projects for the authenticated user. |
| `/api/projects/[id]` | `GET` | Retrieves a specific project by ID. |
| `/api/projects/initialize` | `POST` | Initializes a new project from a design. |

## Purchases APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/purchases` | `GET` | Retrieves all purchases for the authenticated user. |
| `/api/purchases/[purchaseId]` | `GET` | Retrieves a specific purchase by ID. |

## Receipts APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/receipts/resend` | `POST` | Resends a receipt to the user. |

## Register APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/register` | `POST` | Registers a new user. |

## Settings APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/settings/password` | `PUT` | Updates the user's password. |
| `/api/settings/profile` | `GET` | Retrieves the user's profile information. |
| `/api/settings/profile` | `PUT` | Updates the user's profile information. |
| `/api/settings/referral` | `GET` | Retrieves the user's referral information. |
| `/api/settings/referral` | `PUT` | Applies a referral code to the user's account. |
| `/api/settings/referrals` | `GET` | Retrieves the user's referral information (mock data). |

## Subscribe APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/subscribe` | `POST` | Subscribes a user to the newsletter. |

## Track APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/track` | `POST` | Tracks a referral visit. |

## Upload Cloud Vercel Files APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/upload-cloud-vercel-files` | `POST` | Uploads a file to either Cloudinary or Vercel Blob Storage. |

## User APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/user/phone` | `POST` | Updates the user's phone number. |

## Wishlist APIs

| API Route | HTTP Method | Description |
|---|---|---|
| `/api/wishlist` | `GET` | Retrieves the user's wishlist. |
| `/api/wishlist` | `DELETE` | Removes an item from the user's wishlist. |