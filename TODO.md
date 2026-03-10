# MyHomePlan - Master TODO List

## BUGS FIXED THIS AUDIT
- [x] Fix 3 broken links in services page pointing to `/plan-builder` instead of `/account/plan-builder`
- [x] Fix ESLint error: setState called synchronously in checkout/success useEffect
- [x] Em dash check: CLEAN - none found in codebase
- [x] TypeScript: 0 errors
- [x] ESLint: 0 errors (75 unused-import warnings remaining)

---

## 1. CRITICAL - Marketing Contradictions & False Claims

### Plan Tier Naming Mismatch
- [ ] Pricing page uses "Essential / Complete / Premium" but services.ts defines "Minimum / Fundamentals / Premium" - standardize across all pages
- **Files:** `src/app/(marketing)/pricing/pricing-content.tsx` vs `src/data/services.ts`

### Savings Claims Don't Match Code
- [ ] Home page claims "Save 20-40% with bulk rates" but max discount is 15% annual - update marketing copy to match actual discounts (5% quarterly, 15% annual)
- [ ] Pricing page says "Annual plans save up to 20%" but code says 15% - fix to match
- **Files:** `src/app/(marketing)/home-page.tsx:42`, `src/app/(marketing)/pricing/pricing-content.tsx:203`, `src/data/services.ts:960`

### Plan Build Time Inconsistency
- [ ] Home page says "under 2 minutes", How It Works says "5 minutes", Pricing says "under 5 minutes" - pick one consistent estimate
- **Files:** `home-page.tsx:445`, `how-it-works-content.tsx:28,116`, `pricing-content.tsx:320`

### Unimplemented Promises
- [ ] "Every contractor is rated by real homeowners" - no rating system exists. Either implement or remove claim
- [ ] "Miss a window and your next service is free" on-time guarantee - no credit/free service system in code. Either implement or remove
- [ ] "Full liability coverage on every visit" - no damage claim system exists. Remove or add disclaimer
- [ ] "50+ local contractors connected" - unverified stat, remove or add live count from DB
- **Files:** `how-it-works-content.tsx:34,57,87`, `home-page.tsx:65`

### Contractor Payout Inconsistency
- [ ] FAQ says contractors keep "70-80%" but pricing-config.ts has fixed 25% margin (= 75% payout). Standardize to "75%" or update config
- **Files:** `faq-data.ts:25`, `pricing-config.ts:58`

### Annual Pricing Math Wrong
- [ ] Pricing page shows annual prices that don't reflect the 15% discount (e.g., $890/yr for $89/mo should be ~$907 with 15% off, not $890)
- **File:** `pricing-content.tsx`

---

## 2. CONTRACTOR ONBOARDING - Missing Critical Features

### Calendar Integration (HIGH PRIORITY)
- [ ] Add Google Calendar OAuth integration for contractors
- [ ] Add Outlook/iCal calendar sync option
- [ ] Build real-time availability engine that checks contractor's external calendar before showing time slots to homeowners
- [ ] Add conflict detection - if contractor has a personal event, block that time slot
- [ ] Add vacation/blocked dates feature for contractors
- [ ] Replace hardcoded time blocks (6AM-12PM, 12PM-6PM, 6PM-9PM) with custom hour ranges
- [ ] Show contractor's booked jobs on their calendar view with external events overlaid
- [ ] API route: `POST /api/calendar/connect` - OAuth flow for Google/Outlook
- [ ] API route: `GET /api/calendar/availability?contractorId=X&date=Y` - returns open slots
- [ ] Store calendar tokens in `contractor_profiles` table (encrypted)

### Service Zone / Coverage Area
- [ ] Add service area radius setting per contractor (e.g., "I'll travel up to 30km from [home address]")
- [ ] Add postal code / zone mapping for service matching
- [ ] Show contractors only jobs within their coverage area
- [ ] Factor travel distance into pricing/scheduling

### Contractor Verification System
- [ ] Build admin dashboard for contractor vetting workflow
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

## 3. BOOKING SYSTEM - Missing Critical Features

### Smart Contractor Matching
- [ ] When homeowner books, match to best contractor based on: availability, proximity, service expertise, rating, workload balance
- [ ] If no contractor available for requested time, suggest alternative times
- [ ] Allow homeowner to request a specific contractor they've used before
- [ ] Handle multiple contractors for the same service (load balancing)
- [ ] Priority matching for Premium plan subscribers

### Job Acceptance Flow
- [ ] Contractor should be able to accept OR decline an assigned job (currently auto-assigned)
- [ ] If declined, auto-reassign to next best contractor
- [ ] Set acceptance timeout (e.g., 2 hours to accept before auto-reassign)
- [ ] Notification chain: assign -> remind -> reassign
- [ ] Track acceptance rates per contractor (factor into future matching)

### Booking Modifications
- [ ] Homeowner can reschedule (with 24h+ notice)
- [ ] Homeowner can cancel (with cancellation policy enforcement)
- [ ] Contractor can request reschedule (with reason)
- [ ] Both parties get notifications for any changes
- [ ] Cancellation fee logic based on how close to appointment

### Recurring Bookings
- [ ] Auto-schedule recurring services based on plan frequency (e.g., bi-weekly lawn mowing)
- [ ] Auto-assign same contractor for continuity when possible
- [ ] Allow one-off skip/reschedule without affecting the recurring series
- [ ] Dashboard view of upcoming recurring schedule

### Job Completion Flow
- [ ] Contractor marks job complete with optional photos (before/after)
- [ ] Homeowner receives notification to confirm completion
- [ ] Homeowner can rate the service (1-5 stars + optional comment)
- [ ] Dispute flow if homeowner is unhappy (quality issue, incomplete work)
- [ ] Auto-close jobs after 48h if homeowner doesn't respond

---

## 4. PAYMENT & BILLING - Missing Critical Features

### Stripe Connect for Contractors
- [ ] Set up Stripe Connect (Express or Custom accounts) for contractor payouts
- [ ] Onboarding step: "Connect your bank account" via Stripe Connect OAuth
- [ ] Build payout calculation engine: job price * (1 - platform_margin) = contractor payout
- [ ] Automatic weekly/biweekly payout schedule
- [ ] Payout dashboard for contractors: pending, processing, completed, failed
- [ ] Retry logic for failed payouts
- [ ] Hold period: payouts released X days after job completion (dispute window)

### Contractor Earnings Dashboard
- [ ] Detailed earnings breakdown: by service, by month, by client
- [ ] Downloadable earnings reports (CSV/PDF)
- [ ] Tax summary (annual total, per-service breakdown)
- [ ] Projected earnings based on upcoming bookings
- [ ] Year-over-year comparison

### Homeowner Billing
- [ ] Invoice generation for each billing period
- [ ] Payment history with downloadable receipts
- [ ] Failed payment handling and retry
- [ ] Plan upgrade/downgrade mid-cycle proration
- [ ] Service credit system (for on-time guarantee, referrals, etc.)

---

## 5. COMMUNICATION - Missing Features

### In-App Messaging
- [ ] Direct messaging between homeowner and assigned contractor for a job
- [ ] Automated messages: "Your contractor is on the way", "Job started", "Job complete"
- [ ] Photo sharing in chat (contractor sends progress photos)
- [ ] Message history per booking

### Notification System
- [ ] Email notifications for: booking confirmed, reminder (24h before), job started, job complete, payment processed
- [ ] SMS notifications (optional, via Twilio)
- [ ] Push notifications (if PWA)
- [ ] Notification preferences page (toggle email/SMS/push per event type)
- [ ] Contractor notification: new job assigned, job cancelled, payment sent

### Review & Rating System
- [ ] Post-job rating prompt for homeowners (1-5 stars)
- [ ] Written review with optional categories (punctuality, quality, communication, value)
- [ ] Contractor can respond to reviews
- [ ] Rating affects contractor matching priority
- [ ] Display average rating on contractor profile
- [ ] Flag/report inappropriate reviews

---

## 6. ADMIN DASHBOARD - Not Built

### Operations
- [ ] Admin view of all active bookings across all contractors
- [ ] Contractor management: approve, suspend, remove contractors
- [ ] Service request queue: unassigned jobs needing manual intervention
- [ ] Revenue dashboard: MRR, churn, LTV, active subscriptions
- [ ] Dispute resolution interface

### Contractor Vetting Queue
- [ ] List of pending contractor applications
- [ ] Document review interface (view uploaded licenses, insurance, etc.)
- [ ] Approve/reject with reason
- [ ] Background check status tracking

### Analytics
- [ ] Service popularity by region
- [ ] Contractor utilization rates
- [ ] Customer satisfaction scores
- [ ] Seasonal demand forecasting
- [ ] Churn analysis

---

## 7. PRICING ENGINE - Improvements

### Dynamic Rate Negotiation
- [ ] Allow contractors to set their own rates per service (already collected in onboarding)
- [ ] Platform sets ceiling/floor rates - contractor rates must be within range
- [ ] If contractor rate < platform rate, platform keeps higher margin
- [ ] If contractor rate > platform rate, flag for review or adjust customer pricing
- [ ] Show contractors how their rates compare to network average

### Seasonal Pricing
- [ ] Peak season multipliers (e.g., snow removal demand spikes in winter)
- [ ] Off-peak discounts to fill contractor calendars during slow periods
- [ ] Holiday/weekend surcharges (optional)

### Volume Pricing
- [ ] Multi-property discounts for property managers / strata
- [ ] Referral discounts (homeowner refers a friend)
- [ ] Loyalty discounts (been a subscriber for 1+ years)

---

## 8. PROPERTY MANAGEMENT / STRATA - Gaps

### Multi-Property Management
- [ ] Property manager dashboard with overview of all managed properties
- [ ] Bulk booking across multiple properties
- [ ] Consolidated billing for all properties
- [ ] Per-property service status and history
- [ ] Assign different contractors to different properties

### Strata-Specific Features
- [ ] Common area vs. individual unit service management
- [ ] Strata council approval workflow for services
- [ ] Shared cost allocation between units
- [ ] Building-wide maintenance calendar
- [ ] Vendor/contractor rotation for fairness

---

## 9. MOBILE & PWA

- [ ] Ensure all pages are fully responsive (audit mobile breakpoints)
- [ ] Add PWA manifest and service worker for offline capability
- [ ] Mobile-optimized booking flow
- [ ] Contractor mobile app experience (accept jobs, navigate to location, mark complete)
- [ ] Push notification support

---

## 10. LEGAL & COMPLIANCE

- [ ] Terms of Service - review for accuracy against actual platform behavior
- [ ] Privacy Policy - ensure data collection described matches actual collection
- [ ] Independent contractor agreement - legally reviewed document
- [ ] Liability/indemnification - clarify who's liable if contractor damages property
- [ ] Insurance requirements documentation
- [ ] Cancellation policy - clearly stated and enforced in code
- [ ] Data retention policy - how long is user data kept?
- [ ] PIPEDA/CASL compliance (Canadian privacy & anti-spam laws)

---

## 11. SEO & MARKETING PAGES

- [ ] Blog system - currently has routes but needs content strategy
- [ ] Service area pages - dynamic pages for each city/region served
- [ ] Schema markup (JSON-LD) for local business, services, reviews
- [ ] Sitemap.xml generation
- [ ] Open Graph / social share images per page
- [ ] Google Business Profile integration

---

## 12. CODE QUALITY

### Lint Cleanup (75 warnings)
- [ ] Remove unused imports across ~20 files (non-blocking but messy)
- [ ] Replace `<img>` with `<Image>` in gallery4.tsx

### Architecture
- [ ] Extract ICON_MAP into a shared utility (currently duplicated in 13 files)
- [ ] Create shared types file for common DB row interfaces (DbProperty, etc.)
- [ ] Add error boundaries for each major section
- [ ] Add loading skeletons for all async data fetches
- [ ] Implement proper error handling with user-friendly messages

### Testing
- [ ] Unit tests for pricing engine (calculateServicePrice, all multipliers)
- [ ] Unit tests for contractor matching algorithm
- [ ] Integration tests for booking flow
- [ ] E2E tests for critical paths: signup, onboarding, booking, payment

---

## Priority Order

### Phase 1 - Fix What's Broken (This Week)
1. Fix marketing contradictions (copy changes)
2. Fix plan tier naming consistency
3. Fix annual pricing math

### Phase 2 - Core Business Logic (Next 2 Weeks)
4. Stripe Connect for contractor payouts
5. Smart contractor matching with availability check
6. Job acceptance/decline flow
7. Recurring booking auto-scheduling
8. Rating/review system

### Phase 3 - Calendar & Communication (Week 3-4)
9. Google Calendar integration for contractors
10. In-app notification system (email + in-app)
11. In-app messaging per booking
12. Booking modifications (reschedule, cancel)

### Phase 4 - Admin & Scale (Month 2)
13. Admin dashboard
14. Contractor vetting queue
15. Analytics dashboard
16. Multi-property management improvements

### Phase 5 - Polish & Growth (Month 3)
17. Mobile/PWA optimization
18. SEO improvements
19. Blog content system
20. Referral program
