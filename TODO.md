# MyHomePlan - Master TODO List

## BUGS FIXED THIS AUDIT
- [x] Fix 3 broken links in services page pointing to `/plan-builder` instead of `/account/plan-builder`
- [x] Fix ESLint error: setState called synchronously in checkout/success useEffect
- [x] Em dash check: CLEAN - none found in codebase
- [x] TypeScript: 0 errors
- [x] ESLint: 0 errors (75 unused-import warnings remaining)

---

## 1. CRITICAL - Marketing Contradictions & False Claims
- [x] Plan tier naming standardized to Essentials/Complete/Premium across all pages
- [x] Savings claims fixed: "up to 15% with annual plans" everywhere
- [x] Plan build time standardized to "5 minutes"
- [x] Rating system implemented - claim now backed by code
- [x] On-time guarantee softened to realistic claims
- [x] Liability coverage softened to accurate description
- [x] "50+ contractors" replaced with "32 services"
- [x] Contractor payout standardized to "75%" everywhere
- [x] Annual pricing recalculated with correct 15% discount

---

## 2. CONTRACTOR ONBOARDING - Missing Critical Features

### Calendar Integration
- [x] Google Calendar OAuth integration scaffolding (`src/lib/google-calendar.ts`)
- [x] API route: `GET /api/calendar/connect` - OAuth flow redirect
- [x] API route: `GET /api/calendar/callback` - OAuth callback handler
- [x] API route: `GET /api/calendar/availability` - returns open slots, merges static + calendar data
- [x] Calendar connect UI component (`src/components/contractor/calendar-connect.tsx`)
- [ ] Add Outlook/iCal calendar sync option
- [ ] Add vacation/blocked dates feature for contractors
- [ ] Show contractor's booked jobs on their calendar view with external events overlaid
- [ ] Set up GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET env vars to activate

### Service Zone / Coverage Area
- [ ] Add service area radius setting per contractor (e.g., "I'll travel up to 30km from [home address]")
- [ ] Add postal code / zone mapping for service matching
- [ ] Show contractors only jobs within their coverage area
- [ ] Factor travel distance into pricing/scheduling

### Contractor Verification System
- [x] Admin dashboard with contractor vetting (approve/suspend/reinstate)
- [ ] Add document upload for: business license, insurance certificate, WCB letter
- [ ] Add automated document expiry tracking and renewal reminders
- [ ] Build background check integration (or manual verification workflow)
- [ ] Track vetting_status transitions with audit log
- [ ] Email notifications: "Your application is approved / needs more info / rejected"
- [ ] Probation period tracking (first X jobs are monitored)

### Contractor Profile & Portfolio
- [ ] Add photo upload for contractor profile picture
- [ ] Add portfolio image gallery (before/after photos)
- [ ] Public contractor profile page for homeowners to view before booking
- [ ] Add certifications/badges display (Red Seal, licensed, insured, etc.)

---

## 3. BOOKING SYSTEM

### Smart Contractor Matching
- [x] Matching engine with weighted scoring (rating, completion rate, capacity, experience, cancellations)
- [x] Preferred contractor bonus in matching
- [x] Auto-matching on booking creation
- [ ] If no contractor available for requested time, suggest alternative times
- [ ] Priority matching for Premium plan subscribers

### Job Acceptance Flow
- [x] Accept API: `POST /api/bookings/[id]/accept`
- [x] Decline API: `POST /api/bookings/[id]/decline` with auto-reassignment
- [x] Notification chain: assign -> notify homeowner on accept/decline
- [ ] Set acceptance timeout (e.g., 2 hours to accept before auto-reassign)
- [ ] Track acceptance rates per contractor (factor into future matching)

### Booking Modifications
- [x] Reschedule API: `PATCH /api/bookings/[id]/reschedule` with 24h notice policy
- [x] Status update API: `PATCH /api/bookings/[id]/status` with state machine validation
- [x] Cancellation with 24h notice policy enforcement
- [x] Notifications for both parties on any changes
- [ ] Cancellation fee logic based on how close to appointment

### Recurring Bookings
- [x] Recurring scheduler utility (`src/lib/recurring-scheduler.ts`)
- [x] Scheduler API: `POST /api/scheduler/generate` - auto-creates due bookings
- [x] Seasonal awareness (lawn: Apr-Oct, snow: Nov-Mar, etc.)
- [ ] Auto-assign same contractor for continuity when possible
- [ ] Allow one-off skip/reschedule without affecting the recurring series
- [ ] Dashboard view of upcoming recurring schedule

### Job Completion Flow
- [x] Status update to "completed" with timestamp
- [x] Review prompt component after job completion
- [x] Rating/review system (1-5 stars + categories)
- [ ] Contractor marks job complete with optional photos (before/after)
- [ ] Dispute flow if homeowner is unhappy (quality issue, incomplete work)
- [ ] Auto-close jobs after 48h if homeowner doesn't respond

---

## 4. PAYMENT & BILLING

### Stripe Connect for Contractors
- [x] Stripe Connect utility (`src/lib/stripe-connect.ts`)
- [x] Connect onboarding API (`POST /api/stripe/connect`)
- [x] Connect callback API (`GET /api/stripe/connect/callback`)
- [x] Payout API (`POST /api/stripe/payouts`)
- [x] Transfer history API (`GET /api/stripe/payouts`)
- [x] Stripe Connect button component (`src/components/contractor/stripe-connect-button.tsx`)
- [ ] Automatic weekly/biweekly payout schedule (cron)
- [ ] Retry logic for failed payouts
- [ ] Hold period: payouts released X days after job completion (dispute window)

### Contractor Earnings Dashboard
- [ ] Detailed earnings breakdown: by service, by month, by client
- [ ] Downloadable earnings reports (CSV/PDF)
- [ ] Tax summary (annual total, per-service breakdown)
- [ ] Projected earnings based on upcoming bookings

### Homeowner Billing
- [ ] Invoice generation for each billing period
- [ ] Payment history with downloadable receipts
- [ ] Failed payment handling and retry
- [ ] Plan upgrade/downgrade mid-cycle proration

---

## 5. COMMUNICATION

### In-App Messaging
- [x] Messages API: `GET/POST /api/messages` with access control
- [x] Booking chat component (`src/components/messaging/booking-chat.tsx`)
- [x] Message list/conversations component (`src/components/messaging/message-list.tsx`)
- [x] Auto-read marking when messages are viewed
- [ ] Photo sharing in chat (contractor sends progress photos)

### Notification System
- [x] Notification types and labels (`src/lib/notification-types.ts`)
- [x] Notification store (`src/stores/notification-store.ts`)
- [x] Notification bell with popover (`src/components/notifications/notification-bell.tsx`)
- [x] Notification preferences page (`src/components/notifications/notification-preferences.tsx`)
- [x] In-app notifications for all booking lifecycle events
- [ ] Email notifications (integrate with email provider)
- [ ] SMS notifications (via Twilio)
- [ ] Push notifications (service worker)

### Review & Rating System
- [x] Reviews API: `GET/POST /api/reviews`
- [x] Star rating component (`src/components/reviews/star-rating.tsx`)
- [x] Review form with category ratings (`src/components/reviews/review-form.tsx`)
- [x] Review list with summary stats (`src/components/reviews/review-list.tsx`)
- [x] Post-job review prompt (`src/components/reviews/review-prompt.tsx`)
- [x] Auto-update contractor average rating on new review
- [ ] Contractor can respond to reviews
- [ ] Flag/report inappropriate reviews

---

## 6. ADMIN DASHBOARD
- [x] Admin layout with email-based auth guard (`src/app/(app)/admin/layout.tsx`)
- [x] Overview dashboard with 6 metric cards (`src/app/(app)/admin/page.tsx`)
- [x] Contractor management with approve/suspend actions (`src/app/(app)/admin/contractors/page.tsx`)
- [x] Bookings management with filtering/sorting (`src/app/(app)/admin/bookings/page.tsx`)
- [x] Revenue analytics with MRR, growth, service breakdown (`src/app/(app)/admin/revenue/page.tsx`)
- [ ] Dispute resolution interface
- [ ] Document review interface for contractor vetting
- [ ] Service popularity by region analytics
- [ ] Seasonal demand forecasting

---

## 7. PRICING ENGINE - Improvements
- [ ] Platform sets ceiling/floor rates - contractor rates must be within range
- [ ] Show contractors how their rates compare to network average
- [ ] Peak season multipliers
- [ ] Off-peak discounts
- [ ] Multi-property discounts for property managers / strata
- [ ] Referral discounts
- [ ] Loyalty discounts (1+ years subscribed)

---

## 8. PROPERTY MANAGEMENT / STRATA - Gaps
- [ ] Property manager dashboard with overview of all managed properties
- [ ] Bulk booking across multiple properties
- [ ] Consolidated billing for all properties
- [ ] Common area vs. individual unit service management
- [ ] Strata council approval workflow
- [ ] Building-wide maintenance calendar

---

## 9. MOBILE & PWA
- [x] PWA manifest with app icons and theme color
- [ ] Service worker for offline capability
- [ ] Mobile-optimized booking flow
- [ ] Contractor mobile experience (accept jobs, navigate, mark complete)
- [ ] Push notification support

---

## 10. LEGAL & COMPLIANCE
- [ ] Terms of Service - review for accuracy
- [ ] Privacy Policy - verify data collection matches actual
- [ ] Independent contractor agreement
- [ ] Cancellation policy - clearly stated and enforced in code (24h policy is implemented)
- [ ] PIPEDA/CASL compliance

---

## 11. SEO & MARKETING PAGES
- [x] JSON-LD schema markup for local business
- [x] Sitemap.xml generation (dynamic with blog posts)
- [x] robots.txt with proper disallow rules
- [x] Open Graph / social share metadata
- [ ] Blog system - needs content strategy
- [ ] Service area pages - dynamic pages for each city
- [ ] Google Business Profile integration

---

## 12. CODE QUALITY

### Architecture
- [x] Shared ICON_MAP utility (refactored all 13 files to use `src/lib/icon-map.ts`)
- [x] Error boundaries for app, marketing, and global
- [x] Loading skeleton component + dashboard loading state
- [x] Skeleton UI component (`src/components/ui/skeleton.tsx`)
- [x] Popover component (`src/components/ui/popover.tsx`)
- [x] ScrollArea component (`src/components/ui/scroll-area.tsx`)
- [ ] Remove unused imports across ~20 files
- [ ] Replace `<img>` with `<Image>` in gallery4.tsx
- [ ] Create shared types file for common DB row interfaces

### Testing
- [ ] Unit tests for pricing engine
- [ ] Unit tests for contractor matching algorithm
- [ ] Integration tests for booking flow
- [ ] E2E tests for critical paths

---

## Completed Phases Summary

### Phase 1 - Marketing Fixes: COMPLETE
### Phase 2 - Core Business Logic: COMPLETE
- Stripe Connect, contractor matching, job accept/decline, recurring scheduler, rating/review system
### Phase 3 - Calendar & Communication: COMPLETE
- Google Calendar scaffold, notification system, in-app messaging, booking modifications
### Phase 4 - Admin & Scale: COMPLETE
- Admin dashboard with overview, contractors, bookings, revenue
### Phase 5 - Polish & Growth: PARTIALLY COMPLETE
- PWA manifest, error boundaries, loading skeletons, SEO basics done
- Remaining: tests, email/SMS notifications, advanced analytics, blog content
