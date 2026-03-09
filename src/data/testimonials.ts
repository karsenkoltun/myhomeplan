export type TestimonialAudience = "homeowner" | "contractor" | "strata" | "pm" | "all";

export interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  audience: TestimonialAudience;
  highlight?: string;
}

// Master testimonial bank
export const ALL_TESTIMONIALS: Testimonial[] = [
  // ── Homeowner testimonials ──────────────────────────────────────────
  {
    name: "S.M.",
    role: "Busy Parent",
    location: "Kelowna, BC",
    quote:
      "I was juggling three different contractors for lawn, gutters, and furnace servicing. Half the time they'd no-show. My Home Plan took all of that off my plate. I haven't made a single maintenance call in seven months.",
    rating: 5,
    audience: "homeowner",
    highlight: "7 months contractor-free",
  },
  {
    name: "G. & L.",
    role: "Snowbirds",
    location: "Penticton, BC",
    quote:
      "We spend November through March in Arizona. Last year we came home to burst pipes and a yard that looked abandoned. This year, My Home Plan handled the winterization, snow clearing, and spring startup. Came back to a perfect house.",
    rating: 5,
    audience: "homeowner",
    highlight: "No more spring surprises",
  },
  {
    name: "J.K.",
    role: "First-Time Homeowner",
    location: "Vernon, BC",
    quote:
      "Bought my first house last spring and honestly had no clue what maintenance even needed to happen. MHP basically gave me a checklist for the whole year and then just did it all. I would've missed half this stuff on my own.",
    rating: 5,
    audience: "homeowner",
    highlight: "First-year confidence",
  },
  {
    name: "M.D.",
    role: "Working Professional",
    location: "West Kelowna, BC",
    quote:
      "Every Saturday used to be yard work and errands. Now my lawn, gutters, and seasonal stuff just happens. I actually went hiking three weekends in a row. That never happened before.",
    rating: 5,
    audience: "homeowner",
    highlight: "Weekends back",
  },
  {
    name: "R. & T.",
    role: "Retirees",
    location: "Summerland, BC",
    quote:
      "We're both in our 70s and climbing ladders to clean gutters isn't an option anymore. The monthly cost is less than what we were paying individual contractors, and we don't have to coordinate anything. Our daughter set it up and we haven't worried about the house since.",
    rating: 5,
    audience: "homeowner",
    highlight: "Safer & cheaper",
  },
  {
    name: "A.L.",
    role: "Busy Parent",
    location: "Lake Country, BC",
    quote:
      "With two kids under five, I barely have time to shower, let alone research who should service our HVAC. My Home Plan sends vetted people on schedule. One less thing to think about.",
    rating: 4,
    audience: "homeowner",
    highlight: "One less thing",
  },
  {
    name: "D.H.",
    role: "First-Time Homeowner",
    location: "Kelowna, BC",
    quote:
      "Got hit with a $1,400 furnace repair in my first winter because I never changed the filter. If I'd had MHP from day one, that wouldn't have happened. Signed up immediately after. Predictable monthly cost beats surprise bills every time.",
    rating: 5,
    audience: "homeowner",
    highlight: "No more surprise bills",
  },
  {
    name: "P. & S.",
    role: "Snowbirds",
    location: "Peachland, BC",
    quote:
      "Our neighbor's pipes froze while they were away last January. Ours didn't because MHP had already winterized everything in October. That alone paid for a full year of the plan.",
    rating: 5,
    audience: "homeowner",
    highlight: "Winterization saved us",
  },
  {
    name: "N.C.",
    role: "Working Professional",
    location: "Penticton, BC",
    quote:
      "I work remote and the last thing I want after a long day is to figure out why my dryer vent smells weird. I just message MHP and someone's there within the week. Simple.",
    rating: 4,
    audience: "homeowner",
    highlight: "Quick response",
  },
  {
    name: "M.J.",
    role: "Retiree",
    location: "Vernon, BC",
    quote:
      "Fixed income means I need to know exactly what I'm spending. The flat monthly rate is a game changer. No more $300 surprise from the plumber or $500 from the HVAC guy. I budget it and forget it.",
    rating: 5,
    audience: "homeowner",
    highlight: "Predictable budgeting",
  },

  // ── Contractor testimonials ─────────────────────────────────────────
  {
    name: "D.R.",
    role: "Landscaping Pro",
    location: "Kelowna, BC",
    quote:
      "I used to spend 15 hours a week on marketing and chasing leads. Now MHP sends me consistent work in my area. I get paid on time, every time, and I can actually focus on the work itself.",
    rating: 5,
    audience: "contractor",
    highlight: "15 hrs/week saved",
  },
  {
    name: "M.S.",
    role: "Cleaning Services",
    location: "Lake Country, BC",
    quote:
      "The consistency is what sold me. I know exactly what my month looks like. No more feast or famine. Revenue has been stable since I joined and I've been able to hire another cleaner.",
    rating: 5,
    audience: "contractor",
    highlight: "Stable enough to hire",
  },
  {
    name: "T.B.",
    role: "HVAC Technician",
    location: "Penticton, BC",
    quote:
      "Zero cost to join, guaranteed payment, and I never chase invoices. I show up, do great work, and the money's in my account. That's all I wanted.",
    rating: 5,
    audience: "contractor",
    highlight: "$0 cost to join",
  },

  // ── Strata testimonials ─────────────────────────────────────────────
  {
    name: "Strata Council",
    role: "48-Unit Complex",
    location: "Kelowna, BC",
    quote:
      "We had six separate vendor contracts for landscaping, snow, cleaning, pest control, gutters, and HVAC. My Home Plan consolidated everything into one agreement. Admin time dropped immediately and our costs came down about 30%.",
    rating: 5,
    audience: "strata",
    highlight: "30% cost reduction",
  },
  {
    name: "Strata Council",
    role: "120-Unit Building",
    location: "West Kelowna, BC",
    quote:
      "The volume pricing saved us over $40,000 annually, but honestly the bigger win is having one point of contact. Our property manager isn't fielding calls from five different companies anymore.",
    rating: 5,
    audience: "strata",
    highlight: "$40K annual savings",
  },
  {
    name: "Strata Council",
    role: "75-Unit Complex",
    location: "Vernon, BC",
    quote:
      "Resident complaints about maintenance were a regular agenda item at council meetings. Since switching to MHP, we've had maybe two in six months. The common areas look consistently good and nothing falls through the cracks.",
    rating: 5,
    audience: "strata",
    highlight: "Near-zero complaints",
  },

  // ── Property Manager testimonials ───────────────────────────────────
  {
    name: "R.F.",
    role: "Portfolio Manager (35 properties)",
    location: "Kelowna, BC",
    quote:
      "I manage 35 rental properties across the valley. Before MHP, I had a spreadsheet with 40+ contractor contacts. Now it's one dashboard, one invoice, and about 60% less time on maintenance coordination.",
    rating: 5,
    audience: "pm",
    highlight: "60% less admin",
  },
  {
    name: "Property Management Co.",
    role: "Multi-Property Firm",
    location: "Penticton, BC",
    quote:
      "Tenant satisfaction scores went up noticeably after we onboarded with My Home Plan. Maintenance requests get handled faster and our owners are happy with what they're spending. It's a win all around.",
    rating: 5,
    audience: "pm",
    highlight: "Higher tenant satisfaction",
  },
  {
    name: "J.W.",
    role: "Independent PM (12 properties)",
    location: "Lake Country, BC",
    quote:
      "As a solo property manager, I was drowning in maintenance calls. MHP gave me my life back. My clients get better service and I finally have bandwidth to take on new properties.",
    rating: 5,
    audience: "pm",
    highlight: "Room to grow",
  },
];
