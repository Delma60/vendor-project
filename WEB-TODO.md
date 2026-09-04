# FoodConnect — Website Build Plan (Next.js)

> Covers the three web surfaces: **Seller Dashboard**, **Admin Dashboard**, and **B2B Portal**. All three live in the Next.js side of the monorepo (`/apps/web-seller`, `/apps/web-admin`, `/apps/web-b2b`) and share the `shared-types`, `shared-utils`, and `ui` packages defined in the main project TODO.

**Decision carried over from main plan:** if you choose to merge the seller experience into the mobile app instead of building a web dashboard, skip Section 2 and only build Admin + B2B on web. Flag which way you're going before Phase 1 below starts.

---

## 0. Shared Web Foundations (build once, used by all 3 apps)

- [ ] Shared Next.js app shell: layout, sidebar nav, topbar, auth guard wrapper
- [ ] Shared auth pages (login, OTP/email verification, forgot password) — styled per-app but same logic
- [ ] Role-based route protection (seller can't hit admin routes, etc.)
- [ ] Shared data tables component (sortable, filterable, paginated) — used in orders, menu, invoices, user lists everywhere
- [ ] Shared charts component (for analytics — orders over time, revenue, loyalty redemptions)
- [ ] Shared toast/notification system
- [ ] Dark/light theme tokens synced with mobile app's design tokens
- [ ] API layer: typed fetch hooks wrapping Firebase calls (or REST/Cloud Functions), reused across all 3 apps

---

## 1. Seller Dashboard (`web-seller`)

### 1.1 Onboarding
- [ ] Multi-step signup: business info, category, location/address, operating hours
- [ ] ID/document upload for verification (Firebase Storage)
- [ ] Bank account details form for payouts
- [ ] Pending-approval state screen (until admin approves)

### 1.2 Menu Management
- [ ] Add/edit/delete menu items (name, price, photo, category, description)
- [ ] Bulk photo upload + image cropping tool
- [ ] Toggle item availability instantly ("sold out today")
- [ ] Daily "cooking today: yes/no" master toggle
- [ ] Set/edit operating hours per day of week

### 1.3 Order Management
- [ ] Live incoming orders feed (real-time, sound/visual alert on new order)
- [ ] Accept/reject order flow with reason codes for rejection
- [ ] Order status update controls (preparing → ready for pickup/out for delivery)
- [ ] Order history with filters (date range, status, customer)
- [ ] Print/export order receipts

### 1.4 Earnings & Payouts
- [ ] Earnings dashboard (daily/weekly/monthly breakdown)
- [ ] Commission/fee transparency (show platform cut per order clearly)
- [ ] Payout history + next payout date
- [ ] Request early payout (if supported)

### 1.5 Reviews & Reputation
- [ ] View customer reviews/ratings
- [ ] Respond to reviews
- [ ] Reputation/badge display (fastest prep, top-rated, etc. — pulled from gamification engine)

### 1.6 Seller-side Gamification (ties to main loyalty engine)
- [ ] Milestone progress display ("500 orders — unlock fee discount")
- [ ] Visibility boost status indicator (why they're ranking higher/lower in search)
- [ ] Leaderboard opt-in (top sellers this month)

### 1.7 B2B Order Handling (seller side of bulk orders)
- [ ] Separate queue/tab for B2B bulk orders (different prep timelines, larger quantities)
- [ ] Recurring/standing order view (so seller can plan ahead for daily office orders)

---

## 2. Admin Dashboard (`web-admin`)

### 2.1 Seller Management
- [ ] Seller approval queue (review documents, approve/reject with notes)
- [ ] Seller directory (search, filter by status/category/location)
- [ ] Suspend/reinstate seller accounts
- [ ] Manual edit of seller profile/menu (support cases)

### 2.2 User Management
- [ ] Customer directory (search, view order history, loyalty status)
- [ ] B2B account directory (search, view company details, payment terms, standing orders)
- [ ] Ban/suspend user accounts
- [ ] Manual loyalty adjustment tool (add/remove points, grant coupon manually — support cases)

### 2.3 Order Oversight
- [ ] Global order feed (all orders across platform, filterable by status/seller/buyer type)
- [ ] Dispute resolution workflow (flag, investigate, resolve with refund/credit/no-action)
- [ ] Refund processing (via Flutterwave API)
- [ ] Order anomaly flags (e.g., repeated cancellations from same seller)

### 2.4 Financials
- [ ] Platform revenue dashboard (commission earned, by seller/category/time period)
- [ ] Seller payout management (approve batch payouts, view payout logs)
- [ ] B2B invoicing oversight (outstanding invoices, overdue accounts, net-30 tracking)
- [ ] Coupon/promo cost tracking (how much loyalty rewards are costing the platform)

### 2.5 Promotions & Gamification Control
- [ ] Create/edit platform-wide coupons and flash promotions
- [ ] Configure loyalty tier thresholds (Bronze/Silver/Gold cutoffs)
- [ ] Configure progress bar fill logic (order count vs. spend vs. hybrid) without needing a code deploy
- [ ] Toggle scarcity/limited-time drop campaigns
- [ ] Referral program settings (reward amounts, expiry)

### 2.6 Content Moderation
- [ ] Review flagged reviews/photos
- [ ] Remove inappropriate content
- [ ] Seller/customer report queue

### 2.7 Analytics & Reporting
- [ ] GMV over time, active users (DAU/WAU/MAU), retention cohort charts
- [ ] Loyalty redemption rate, streak participation rate
- [ ] Top-performing sellers/categories
- [ ] B2B vs B2C revenue split
- [ ] Exportable reports (CSV)

### 2.8 Admin Roles & Permissions
- [ ] Sub-admin roles (support staff vs. finance vs. super-admin) with scoped permissions
- [ ] Activity/audit log of admin actions (who approved what, who issued refunds)

---

## 3. B2B Portal (`web-b2b`)

### 3.1 Company Onboarding
- [ ] Company signup (business name, industry, size, billing contact)
- [ ] Payment terms selection (prepay vs. net-30 — subject to admin approval for net-30)
- [ ] Add delivery locations (office addresses, multiple sites supported)
- [ ] Invite team members/approvers to the account

### 3.2 Bulk Ordering
- [ ] Menu browsing filtered for bulk-capable sellers
- [ ] Bulk order builder (quantity per item, mixed items, notes per item e.g. "no spice")
- [ ] Scheduled delivery date/time picker
- [ ] Multiple drop-off points in a single order (e.g., different floors/departments)
- [ ] Save order as template for reuse

### 3.3 Recurring Orders
- [ ] Set up standing daily/weekly orders
- [ ] Pause/modify/cancel a standing order
- [ ] Notification before a recurring order auto-places (grace period to edit)

### 3.4 Approval Workflow
- [ ] Multi-approver setup (staff member requests, admin/finance approves before order is placed)
- [ ] Approval status visibility (pending, approved, rejected)
- [ ] Spending limits per requester (optional)

### 3.5 Invoicing & Payments
- [ ] View outstanding invoices, due dates
- [ ] Download invoice PDFs
- [ ] Payment history
- [ ] Pay via Flutterwave (for prepay accounts) or mark as settled (for net-30 offline payment tracking)

### 3.6 Bulk Pricing & Rewards
- [ ] Display volume-based discount tiers at checkout
- [ ] B2B loyalty status (discount tier unlocks, free delivery week, bonus staff meals — per main gamification plan)
- [ ] Usage reports (spend per department, most-ordered items — useful for office admins justifying budget)

### 3.7 Order Tracking
- [ ] Real-time status for bulk orders (placed → confirmed → preparing → delivered)
- [ ] Delivery confirmation per drop-off point (for multi-location orders)

---

## 4. Cross-Cutting Web Requirements

- [ ] SEO basics on B2B portal marketing/landing pages (metadata, sitemap, OG tags) — admin/seller dashboards don't need this (behind auth)
- [ ] Responsive design for all 3 (sellers/admins often work from tablets, not just desktop)
- [ ] Role-based Firestore/Firebase security rules audited across all 3 apps
- [ ] Consistent design tokens shared with mobile app (per main TODO)
- [ ] Loading/empty/error states standardized across all data tables
- [ ] Audit logging on all destructive/financial admin actions

---

## 5. Open Decisions Specific to Web

1. Does the seller get a full web dashboard, or is seller management mobile-only? (affects whether Section 1 is built at all)
2. Does B2B net-30 require manual admin approval per account, or automatic based on company size/verification?
3. Should admin sub-roles (support vs. finance vs. super-admin) be built at launch, or single admin role for MVP?
4. Is B2B portal public-facing (marketing pages + SEO) or invite-only (no public signup)?