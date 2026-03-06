# My Home Plan - Business Plan
## The All-in-One Home Services Subscription Platform

---

## Executive Summary

My Home Plan is a two-sided marketplace that lets homeowners subscribe to a monthly plan covering all their home maintenance needs - lawn care, snow removal, HVAC servicing, cleaning, pest control, plumbing, electrical, painting, and handyman services - while giving contractors a reliable pipeline of guaranteed, year-round work.

**The problem:** Homeowners deal with 8-12 different service providers annually, face unpredictable pricing, unreliable scheduling, and the stress of finding trustworthy contractors. On the flip side, contractors deal with seasonal revenue swings, inconsistent lead flow, and expensive customer acquisition.

**The solution:** One monthly payment. All your home services. Guaranteed scheduling. Vetted contractors. No surprises.

**Launch market:** Okanagan Valley, BC (Kelowna, Vernon, Penticton)
**Domain:** myhomeplan.ca
**Revenue model:** Monthly/quarterly/annual subscriptions + contractor listing fees + service margin

---

## Market Opportunity

### The Numbers
- Canadian home services market: **$50 billion CAD** annually
- BC residential maintenance spending: **~$5.8 billion CAD**
- Okanagan Valley (est. 200,000 households): **~$580M** in annual home service spending
- Online on-demand home services in Canada projected to reach **US$738M by 2030** (14.8% CAGR)
- No dominant bundled subscription player exists in Canada

### The Gap
The Canadian market has zero companies doing what we're doing. Existing players are:
- **Single-service only** (Yardly does lawn + snow, that's it)
- **Marketplace/referral models** (Homeservice Club of Canada - just connects you, doesn't manage)
- **Franchise models** (The Grounds Guys - you deal with individual operators)
- **American companies** that don't serve Canada (Super, Frontdoor/American Home Shield)

**My Home Plan fills this gap completely.**

---

## How It Works

### For Homeowners

1. **Visit myhomeplan.ca** - enter your property address
2. **Property Profile** - answer questions about your home (size, lot size, # bathrooms, heating type, etc.)
3. **Select Services** - choose from our service menu. A live receipt builds on-screen showing your monthly cost
4. **Choose Your Plan** - Monthly, Quarterly (5% off), or Annual (15% off)
5. **Subscribe** - one payment, done. We handle everything.
6. **Schedule Services** - through your dashboard, book when you want each service throughout the year
7. **We Dispatch** - our contractor network handles it. You get notified, rate the service, done.

### For Contractors

1. **Apply at myhomeplan.ca/contractors** - submit your business info, licenses, insurance
2. **Get Vetted** - we verify licensing, insurance, reviews, and do a background check
3. **Get Listed** - appear on our platform in your service area
4. **Receive Jobs** - get notified when a homeowner in your area books a service you provide
5. **Accept & Complete** - show up, do great work, get paid on time (guaranteed)
6. **Build Your Profile** - ratings and reviews help you get more jobs

### For My Home Plan (Revenue Model)

1. **Subscription Revenue** - homeowners pay us monthly
2. **Contractor Margin** - we pay contractors 70-80% of the service value, keeping 20-30% as our margin
3. **Contractor Listing Fee** - optional premium listing ($49/month) for priority placement
4. **Annual Prepay Bonus** - we collect the full year upfront on annual plans, improving cash flow
5. **Add-on Services** - homeowners can add one-off services outside their plan at a slight premium

---

## Service Menu & Pricing Model

### Core Service Categories

| Category | Services Included | Frequency | Est. Contractor Cost | Our Price (per service) |
|---|---|---|---|---|
| **Lawn & Garden** | Mowing, edging, trimming, fertilization, aeration, spring/fall cleanup | Weekly/Bi-weekly (Apr-Oct) | $35-65/visit | $45-85/visit |
| **Snow Removal** | Driveway, walkways, salting/sanding | As-needed (Nov-Mar) | $35-75/visit | $50-95/visit |
| **HVAC** | Furnace tune-up, AC tune-up, filter replacement | 2x/year | $80-150/visit | $110-190/visit |
| **Plumbing** | Inspection, water heater flush, winterization | 1-2x/year | $100-200/visit | $130-250/visit |
| **Cleaning** | Interior deep clean, window washing | Monthly/Quarterly | $120-250/visit | $155-320/visit |
| **Gutter Cleaning** | Full gutter clean + flush | 2x/year | $100-200 | $130-250 |
| **Pest Control** | Quarterly treatment, ant/wasp/rodent | Quarterly | $80-150/visit | $105-190/visit |
| **Handyman** | Minor repairs, fixture install, caulking | As-needed (bank of hours) | $50-80/hr | $65-100/hr |
| **Pressure Washing** | Driveway, deck, siding | 1-2x/year | $150-350 | $195-450 |
| **Electrical** | Safety inspection, outlet/switch replacement | Annual | $100-200 | $130-250 |
| **Painting** | Touch-up, accent walls, exterior trim | As-needed | $200-500 | $260-650 |

### Plan Tiers

#### Essentials Plan - Starting at ~$89/month
- Lawn care (bi-weekly, seasonal)
- Snow removal (as-needed, seasonal)
- 1 gutter cleaning per year
- 1 spring cleanup + 1 fall cleanup
- Priority scheduling guarantee

#### Home Care Plan - Starting at ~$159/month
Everything in Essentials, plus:
- HVAC tune-up (2x/year)
- Interior cleaning (quarterly)
- Window washing (2x/year)
- Pest control (quarterly)
- 2 hours of handyman service per year

#### Premium Plan - Starting at ~$249/month
Everything in Home Care, plus:
- Plumbing inspection (annual)
- Electrical safety check (annual)
- Pressure washing (annual)
- 6 hours of handyman service per year
- Painting touch-ups (annual)
- Priority response guarantee (48-hour booking window)
- Dedicated account manager

#### Custom Plan - Build Your Own
- Select individual services a la carte
- Live pricing calculator on-screen
- Mix and match any frequency
- Same contractor network and guarantees

### Payment Options
- **Monthly** - base price
- **Quarterly** - 5% discount (paid every 3 months)
- **Annual** - 15% discount (paid upfront, best deal)

---

## The Monthly Cost Calculator (How It Works)

This is the core UX element of the website. Here's the calculation logic:

### Inputs
1. **Property Size** (sq ft of home) - affects cleaning costs
2. **Lot Size** (sq ft of lot) - affects lawn care, snow removal costs
3. **Number of Bathrooms** - affects cleaning scope
4. **Heating Type** (gas/electric/heat pump) - affects HVAC pricing
5. **Driveway Type & Size** - affects snow removal, pressure washing
6. **Location** (postal code) - regional pricing adjustments

### Calculation Engine
```
Monthly Cost = SUM(selected_services) where each service =
  base_cost
  x property_size_multiplier
  x frequency_per_year
  / 12 (to monthly)
  x regional_adjustment
  x plan_discount (if quarterly/annual)
```

### Property Size Multipliers
| Property Size | Multiplier |
|---|---|
| < 1,000 sq ft | 0.8x |
| 1,000 - 2,000 sq ft | 1.0x (base) |
| 2,000 - 3,000 sq ft | 1.2x |
| 3,000 - 4,000 sq ft | 1.4x |
| 4,000+ sq ft | 1.6x |

### Lot Size Multipliers (Outdoor Services Only)
| Lot Size | Multiplier |
|---|---|
| < 3,000 sq ft | 0.8x |
| 3,000 - 6,000 sq ft | 1.0x (base) |
| 6,000 - 10,000 sq ft | 1.3x |
| 10,000 - 20,000 sq ft | 1.6x |
| 20,000+ sq ft | Custom quote |

### Live Receipt UX
As the user selects services:
- Each service appears on a floating receipt panel (right side on desktop, bottom sheet on mobile)
- Shows service name, frequency, and monthly cost
- Running total updates in real-time
- Shows comparison: "Without My Home Plan: ~$X/month" vs "With My Home Plan: $Y/month"
- Savings badge: "You save $Z/year"
- Payment toggle: Monthly | Quarterly (-5%) | Annual (-15%)

---

## Contractor Network Strategy

### The Problem With Competitors
Frontdoor/American Home Shield pays contractors below-market rates. Contractors hate working with them. This creates terrible service quality, which causes customer churn. We will NOT make this mistake.

### Our Approach: Fair Pay = Great Service = Happy Customers = Growth

1. **Contractors keep 70-80% of service value** (industry standard for quality networks)
2. **Guaranteed payment within 7 days** of service completion (competitors take 30-90 days)
3. **No lead fees** - contractors don't pay per lead. They get guaranteed booked work.
4. **Volume guarantee** - we commit to a minimum number of jobs per month based on the contractor's capacity
5. **Seasonal stability** - year-round plans mean contractors get work even in slow seasons
6. **Profile & reviews** - top-rated contractors get priority placement and more jobs

### Contractor Onboarding Requirements
- Valid business license
- Proof of liability insurance ($2M minimum)
- WorkSafe BC coverage (where applicable)
- 3+ years of experience (or demonstrated competence)
- Background check
- 2 professional references
- Agreement to our service standards and response times

### Service Guarantees
- **Scheduling guarantee**: Service completed within the scheduled window or next available slot free
- **Quality guarantee**: If the homeowner isn't satisfied, we send another contractor at no cost
- **Response guarantee**: Emergency requests responded to within 4 hours (Premium plan)
- **Timing guarantee**: All seasonal services completed on schedule (e.g., fall cleanup before first snow)

---

## Technology Platform

### Website (myhomeplan.ca)
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: shadcn/ui + 21st.dev components + Tailwind CSS
- **Hosting**: Vercel
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (or Clerk)
- **Payments**: Stripe (subscriptions, invoicing)
- **Notifications**: Twilio (SMS), SendGrid (email), push notifications
- **Maps**: Google Maps API (service areas, contractor routing)

### Key Pages
1. **Landing Page** - hero, value prop, trust signals, CTA
2. **How It Works** - step-by-step for homeowners and contractors
3. **Plan Builder** - interactive calculator with live receipt
4. **Service Area** - map showing covered areas + contractor listings
5. **Contractor Directory** - browse vetted contractors by service type
6. **Contractor Signup** - application flow for contractors
7. **Homeowner Dashboard** - manage plan, schedule services, view history
8. **Contractor Dashboard** - view jobs, manage schedule, track earnings
9. **About / Trust** - team, mission, guarantees, licensing
10. **Blog / Resources** - home maintenance tips, SEO content
11. **FAQ** - common questions for both sides
12. **Pricing** - plan comparison table

### Notification System
When a homeowner books a service:
1. System identifies available contractors in the area for that service type
2. Sends notification (SMS + email + in-app) to top-rated available contractors
3. First contractor to accept gets the job (with a 30-minute window)
4. If no acceptance, system escalates to next tier of contractors
5. Homeowner gets confirmation with contractor name, photo, rating, and ETA
6. Day-before reminder to homeowner
7. On completion, homeowner rates the service (1-5 stars + optional review)
8. Contractor gets paid within 7 days

---

## Financial Projections

### Year 1 - Okanagan Launch (Conservative)

**Assumptions:**
- Average monthly subscription: $149/month
- Customer acquisition: 20 customers/month (growing to 40/month by month 12)
- Monthly churn: 5%
- Contractor margin: 25% average (we keep 25% of service value)
- Contractor costs: 75% of subscription revenue
- Operating costs: 2 employees + tech + marketing

| Metric | Month 1 | Month 6 | Month 12 |
|---|---|---|---|
| Active Subscribers | 20 | 105 | 240 |
| MRR | $2,980 | $15,645 | $35,760 |
| Gross Revenue (Annual) | - | - | ~$250,000 |
| Contractor Payouts (75%) | - | - | ~$187,500 |
| Gross Profit (25%) | - | - | ~$62,500 |
| Operating Costs | - | - | ~$120,000 |
| Net (Year 1) | - | - | **-$57,500** |

**Year 1 is an investment year.** We're building the network, proving the model, perfecting operations.

### Year 2 - Growth + Expansion

| Metric | Target |
|---|---|
| Active Subscribers | 800 |
| Average MRR | $119,200 |
| Annual Revenue | $1,430,400 |
| Gross Profit (30% margin) | $429,120 |
| Operating Costs | $250,000 |
| **Net Profit** | **$179,120** |

### Year 3-5 - Scale to BC + Alberta

| Metric | Year 3 | Year 4 | Year 5 |
|---|---|---|---|
| Markets | 3 cities | 8 cities | 15+ cities |
| Active Subscribers | 2,500 | 8,000 | 20,000 |
| Annual Revenue | $4.5M | $14.3M | $35.8M |
| Gross Margin | 32% | 35% | 38% |
| Net Margin | 12% | 18% | 22% |
| **Net Profit** | **$540K** | **$2.57M** | **$7.88M** |

### Path to $100M
- **Year 7-8**: National expansion across Canada (50,000+ subscribers)
- **Year 8-10**: $100M ARR at ~40,000+ subscribers averaging $200/month OR 80,000+ at $100/month
- **Key lever**: Average revenue per user (ARPU). Premium plans and upsells push ARPU higher.

---

## Customer Acquisition Strategy

### Phase 1: Okanagan Launch (Months 1-6)
1. **Real Estate Partnerships** - partner with local realtors to offer My Home Plan at closing (Super's proven model - cheapest CAC in the industry)
2. **Contractor Referrals** - contractors recommend us to their existing clients (they benefit from the guaranteed work)
3. **Local Facebook/Instagram Ads** - targeted to Okanagan homeowners
4. **Community Events** - home shows, farmers markets, community boards
5. **Door-to-door** - targeted neighborhoods with "first month free" offers
6. **Referral Program** - existing subscribers get $50 credit for each referral

### Phase 2: Growth (Months 6-18)
7. **Google Ads** - "home services Kelowna", "lawn care Okanagan", etc.
8. **Content Marketing** - blog posts, seasonal maintenance guides, YouTube
9. **Strategic Partnerships** - property management companies, strata councils, HOAs
10. **Insurance Partnerships** - bundle with home insurance for discount

### Target CAC: $150-250 per customer
### Target LTV: $2,500+ (average 18-month retention at $149/month)
### LTV:CAC Ratio: 10:1+ (excellent)

---

## Competitive Moat

1. **Network Effects** - more homeowners = more contractors want to join = better service = more homeowners
2. **Data Advantage** - we know every home's maintenance history, enabling predictive service recommendations
3. **Switching Costs** - once you're on a plan and have your service history, it's painful to leave
4. **Brand Trust** - the "subscription" model builds trust through consistency
5. **Geographic Density** - first-mover in each market creates contractor lock-in (contractors prefer one reliable platform)
6. **Seasonal Coverage** - bundling summer + winter services means year-round revenue where competitors are seasonal

---

## Risk Mitigation

| Risk | Mitigation |
|---|---|
| **Contractor quality** | Rigorous vetting, ongoing ratings, quick removal of low performers |
| **Underpricing services** | Dynamic pricing engine, property-specific quotes, quarterly pricing reviews |
| **Seasonal demand spikes** | Contractor capacity planning, seasonal surge pricing, advance scheduling incentives |
| **Customer churn** | 62% of customers stay with the right retention offer (industry data). Proactive check-ins, annual plan incentives |
| **Worker classification** | All contractors are independent businesses with their own licenses/insurance. We provide leads, not instructions on how to do the work |
| **Competitor entry** | First-mover advantage in Canadian market. Build density before competitors notice |
| **Weather variability** | Flexible scheduling windows, force majeure clauses, alternative service credits |

---

## Legal & Compliance

- **Business Registration**: BC Corporation
- **Insurance**: Commercial general liability ($5M), E&O insurance
- **Privacy**: PIPEDA compliant (Canadian privacy law)
- **Payment Processing**: PCI-DSS compliant through Stripe
- **Contractor Agreements**: Independent contractor agreements reviewed by business lawyer
- **Terms of Service**: Clear scope of coverage, exclusions, dispute resolution
- **Consumer Protection**: BC Consumer Protection Act compliance

---

## Team (Initial)

1. **Karsen Koltun** - Founder & CEO (operations, strategy, sales)
2. **Operations Manager** (hire month 3) - contractor relationships, service quality, scheduling
3. **Marketing / Growth** (hire month 6) - digital marketing, partnerships, content

Tech is handled by the platform (automated scheduling, billing, notifications). No dev team needed initially - Claude Code builds and maintains the platform.

---

## 90-Day Launch Plan

### Days 1-30: Foundation
- [ ] Finalize business plan and financial model
- [ ] Register BC corporation
- [ ] Set up business bank account
- [ ] Get business insurance
- [ ] Build website (Next.js on Vercel)
- [ ] Set up Stripe for subscriptions
- [ ] Create contractor application flow
- [ ] Design and build the plan builder/calculator
- [ ] Create all marketing materials and brand assets

### Days 31-60: Network Building
- [ ] Recruit 10-15 contractors across all service categories
- [ ] Vet and onboard contractors
- [ ] Test the platform end-to-end (place test orders, run through full flow)
- [ ] Build realtor partnership deck
- [ ] Start local marketing (social media, community)
- [ ] Soft launch with friends/family (beta testers)

### Days 61-90: Launch
- [ ] Public launch with press release
- [ ] Run launch promotion (first month free or 25% off first 3 months)
- [ ] Activate realtor partnerships
- [ ] Start paid advertising
- [ ] Target: 20 paying subscribers by day 90
- [ ] Target: 15 active contractors by day 90

---

## Why This Will Work

1. **Proven model**: Frontdoor does $2B/year with this concept in the US. Nobody's done it in Canada.
2. **Perfect timing**: Subscription economy is mainstream. Consumers expect it.
3. **Solves a real pain**: Every homeowner hates managing multiple contractors. Every contractor hates inconsistent revenue.
4. **Capital efficient**: No inventory, no equipment, no fleet. Just a platform connecting supply and demand.
5. **Compounding growth**: 78% renewal rate (industry benchmark) means the business compounds.
6. **Data flywheel**: Every service completed makes our platform smarter about pricing, scheduling, and matching.
7. **Massive market**: $50B CAD in Canada alone. Even 0.1% market share = $50M revenue.

---

*My Home Plan - One Plan. Every Service. Zero Stress.*
