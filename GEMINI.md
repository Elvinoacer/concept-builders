# **Concept Builders – Product Requirements Document (PRD)**

## **1\. Introduction**

Concept Builders is an architectural design platform that allows users to discover and purchase house plans, while offering a robust admin dashboard for managing designs, clients, and analytics. This PRD outlines the features, flows, and technical requirements of the platform.

---

## **2\. Objectives**

- **Provide a comprehensive platform** for discovering and purchasing architectural designs.

- **Deliver superior UX** with fast performance and intuitive navigation.

- **Offer full analytics and tracking** to understand customer behavior and business health.

- **Ensure scalability and security** for future growth.

---

## **3\. User Roles & Permissions**

### **3.1 Guest Users (Non-Logged-In)**

- Browse designs, categories, and blog posts.

- View product details and prices.

- Compare different design plans.

- Add designs to cart but must sign up/login to complete checkout.

- Read about pages, policies, FAQs, and contact support.

### **3.2 Authenticated Members (Clients)**

- Manage account profile and password.

- Purchase designs securely via supported payment methods.

- View and download purchased plans.

- Request modifications or new custom designs.

- Receive receipts (with ability to resend via email).

- View personalized analytics (purchases, downloads, referrals).

### **3.3 Admin Users**

- Full dashboard access: analytics, revenue, cost tracking.

- Create/update/delete designs, categories, blogs.

- Manage user accounts, payments, refunds.

- Organize design assets into folder structures.

- Upload files to DigitalOcean Spaces.

- View real-time visitor, product, and referral analytics.

- Track operational costs (storage, email, hosting).
- Track real-time visitor from different social media eg Youtube, linkedIn, Whatsapp, etc

---

## **4\. User Flows**

### **4.1 Guest Flow**

1. Visitor lands on homepage.

2. Browses designs → filters by type, size, budget.

3. Clicks a design → views details.

4. Adds to cart → prompted to sign up or log in.(modal form)-support for oauth

### **4.2 Authenticated Member Flow**

1. Login/Signup (email/password, social login optional).

2. Add design to cart and checkout.

3. Receives order confirmation \+ receipt.

4. Downloads plan from dashboard.

### **4.3 Admin Flow**

1. Logs in to admin panel.

2. Views dashboard analytics (visitors, top designs, revenue).

3. Uploads new designs, organizes in folders.

4. Monitors cost dashboard (DigitalOcean, Resend, hosting).

5. Responds to support tickets.

6. Approves or refunds orders as needed.

---

## **5\. Core Features & Requirements**

### **5.1 Design Catalog**

- Grid/list display with filtering (price, size, bedrooms).

- Detail page: images, 3D renders, floor plan preview.

- Related designs section.

### **5.2 Checkout & Payments**

- Integration with paypal\&Intasend

- Generate invoice & receipt.
- The admin should as well see those emails sent(success and failed ) and take actions based on it like for a failed he would resend, and also details why it failed to sent to client

- Automatic receipt resend option.

### **5.3 Analytics & Tracking**

- Visitor tracking: page views, session duration, bounce rate.

- Product performance: views, conversions, abandoned carts.

- Referral tracking: Facebook, WhatsApp, LinkedIn, Google.

- Revenue dashboard: daily/weekly/monthly totals.

- Cost tracking: DigitalOcean storage, Resend emails, hosting.

### **5.4 File Management**

- Folder-based storage system.

- Secure uploads to DigitalOcean Spaces.

- Version control (replace outdated files).

### **5.5 Admin Dashboard**

- KPIs: total sales, trending products, traffic sources.

- Orders management (view, refund, resend receipts).

- User management (block/unblock, reset passwords).

- CMS for blog posts, static pages, policies.

### **5.6 Communication**

- Contact support form with email notifications.

- Automated email updates (status changes, reminders).

### **5.7 Legal & Policy Pages**

- Terms & Conditions, Privacy Policy, Refund Policy.

- About page with company info.

- Contact page with phone, email, live chat.

---

## **6\. Non-Functional Requirements**

- **Performance:** Page loads under 2 seconds.

- **Scalability:** Handle 10k concurrent users.

- **Security:** SSL, role-based access control, PCI-compliant payments.

- **Availability:** 99.9% uptime.

- **Accessibility:** WCAG 2.1 compliance.

---

## **7\. Analytics Variables**

- Visitors (unique, returning)

- Time on site

- Bounce rate

- Conversions per product

- Revenue by referral source

- Storage usage (GB/month)

- Email sends (Resend cost)

- Monthly infrastructure costs

---

## **8\. Acceptance Criteria**

- Guest can browse and view any design.

- Only logged-in users can checkout or download.

- Admin can upload files, create categories, and see analytics.

- Receipts can be resent successfully.

- Analytics dashboard shows real-time and historical data.

- Cost tracking dashboard updates automatically.

---

## **9\. Future Enhancements**

- AI-powered design recommendations.

- CRM integration for client relationship management.

---

## **10\. Deliverables**

- Fully functional Next.js front-end with responsive UI.

- Prisma ORM, Postresql, [Next.js](http://Next.js) APIs

- Admin panel for management and analytics.

- Integration with DigitalOcean, Resend, paypal/Intasend.

- Comprehensive documentation and testing.

# **Concept Builders – Site Map with App Pages**

## **Public Pages (Guest Accessible)**

- **Home**

  - Hero Section (Search, Featured Designs)

  - Categories Grid (Bungalows, Duplexes, Apartments, etc.)

  - Featured Projects/Blogs

- **Designs Listing**

  - Category Filter (Price, Bedrooms, Style)

  - Sorting (Newest, Popular, Price Ascending/Descending)

- **Design Detail Page**

  - Image Gallery & Floor Plan Preview

  - Add to Cart Button

  - Related Designs Section

- **Custom Design Request Page** (Form Submission)

- **Blog & Learning Hub**

  - Blog List View

  - Blog Detail View

- **About Us**

- **Contact Page** (Form \+ Map \+ Support Info)

- **Policies Section**

  - Terms & Conditions

  - Privacy Policy

  - Refund Policy

- **Cart** (View Items) → **Checkout** (Login Required)

---

## **Authenticated Member Pages (App Dashboard)**

- **Dashboard Home** (Summary Cards: Purchases, Referrals)

- **My Purchases**

  - List of Purchased Designs

  - Download Buttons & Resend Receipts

- **Messages/Support**

  - Chat Interface with Attachments

- **Profile & Settings**

  - Personal Info

  - Password Management

  - Referral Link/Code

- **Notifications Center**

  - Promotions & Offers

---

## **Admin Panel Pages**

- **Admin Dashboard**

  - KPIs (Sales, Visitors, Costs, Conversions)

  - Charts & Graphs

- **Design Management**

  - Add/Edit/Delete Designs

  - Organize Designs into Folders

- **File Manager**

  - Folder Tree \+ File Uploads (DigitalOcean Spaces)

  - Version Control

- **Orders & Refunds Management**

- **User Management**

  - Clients & Team Members

- **Content Management (CMS)**

  - Blog Posts, Static Pages, Policies

- **Analytics & Reports**

  - Traffic, Product Views, Referral Sources, Conversion Rates

- **Service Cost Tracking**

  - DigitalOcean Usage, Email Costs, Hosting Bills

---

## **Utility & System Pages**

- **Login / Signup**

- **Password Reset / Email Verification**

- **Error Pages (404 / 500\)**

- **Loading / Maintenance Pages**

---

# **🛒 Concept Builders – Purchase Flow**

## **1\. Browse & Discover**

- **Step 1: User visits Home Page → browses featured plans or categories.**

- **Step 2: Clicks a plan to open Design Detail Page.**

  - **Shows images, 3D render, floor plan preview.**

  - **Displays pricing options (PDF plan, editable CAD files).**

  - **Allows user to compare with other designs (via “Compare” feature).**

---

## **2\. Price Comparison (Optional)**

- **User clicks Compare Button → adds design to comparison list.**

- **Opens a Comparison View (side-by-side table) with:**

  - **Price**

  - **Number of bedrooms/bathrooms**

  - **Plot size required**

- **User clicks Add to Cart or Buy Now on preferred plan.**

---

## **3\. Add to Cart / Instant Checkout**

- **Option 1 – Add to Cart: Plan is added to cart → user can continue browsing and add more.**

- **Option 2 – Buy Now: Takes user directly to checkout process.**

---

## **4\. Cart Page**

- **Displays:**

  - **Item name, price, quantity.**

  - **“Remove” or “Edit Selection” options.**

  - **Discount/coupon field.**

- **CTA buttons: Continue Shopping or Proceed to Checkout.**

---

## **5\. Checkout Page**

- **If Guest: Prompt for login/signup (or continue as guest with email collection).**

- **Billing Details Form: Name, email, phone number, country (auto-filled for logged-in users).**

- **Delivery Option: Instant download after payment confirmation (no shipping).**

- **Order Summary: Item list \+ tax (if any) \+ total cost.**

- **Payment Methods:**

  - **Credit/Debit Card (Stripe)**

  - **Mobile Money (M-Pesa)**

  - **PayPal**

- **Place Order Button: Triggers secure payment.**

---

## **6\. Payment Processing**

- **Redirect to secure payment gateway (Stripe checkout page or M-Pesa STK push).**

- **On success → redirect back to Order Confirmation Page.**

---

## **7\. Order Confirmation Page**

- **Displays:**

  - **Order number**

  - **Download link (for digital plans)**

  - **Receipt link**

- **Sends:**

  - **Email receipt (with resend link in case email is lost)**

  - **Thank-you message with download instructions**

---

## **8\. Post-Purchase Dashboard**

- **My Purchases Page: Stores all past purchases with:**

  - **Download buttons**

  - **Resend receipt option**

- **Analytics Tracking:**

  - **Record purchase event**

  - **Store referral source (e.g., Facebook ad)**

  - **Update revenue analytics dashboard for admin**

---

## **9\. Optional Next Step**

- **Offer Customizations (button “Request Changes”).**

---

### **🧠 Improvements Over Typical Maramani Flow**

**✅ Side-by-side comparison tool to boost user decision confidence.**  
**✅ Instant checkout option to reduce friction.**  
**✅ Analytics-driven flow for admin to measure conversion rates at each step.**  
**✅ Resendable receipts & download history for user convenience.**
