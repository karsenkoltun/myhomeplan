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
  // Homeowner testimonials
  {
    name: "Sarah M.",
    role: "Busy Parent",
    location: "Kelowna, BC",
    quote:
      "Between the kids, work, and just life - I had zero time to deal with home maintenance. My Home Plan handles everything. I haven't called a contractor in 8 months.",
    rating: 5,
    audience: "homeowner",
    highlight: "8 months contractor-free",
  },
  {
    name: "Greg & Linda T.",
    role: "Snowbirds",
    location: "Penticton, BC",
    quote:
      "We spend winters in Arizona. Before My Home Plan, we'd come back to a disaster every spring. Now everything happens automatically. Total peace of mind.",
    rating: 5,
    audience: "homeowner",
    highlight: "Total peace of mind",
  },
  {
    name: "Jordan K.",
    role: "First-Time Homeowner",
    location: "Vernon, BC",
    quote:
      "I had no idea how much maintenance a house needed. My Home Plan was a lifesaver. They told me what I needed, scheduled it all, and I save over $200/month.",
    rating: 5,
    audience: "homeowner",
    highlight: "Saves $200/month",
  },
  {
    name: "Michelle D.",
    role: "Working Professional",
    location: "West Kelowna, BC",
    quote:
      "I used to spend every Saturday dealing with yard work and house stuff. Now I actually have my weekends back. Worth every penny.",
    rating: 5,
    audience: "homeowner",
    highlight: "Weekends back",
  },
  // Contractor testimonials
  {
    name: "Dave R.",
    role: "Landscaping Pro",
    location: "Kelowna, BC",
    quote:
      "I used to spend 15 hours a week marketing and chasing leads. Now MHP sends me steady work, I get paid on time every time, and I can focus on what I'm good at.",
    rating: 5,
    audience: "contractor",
    highlight: "15 hrs/week saved",
  },
  {
    name: "Maria S.",
    role: "Cleaning Services",
    location: "Lake Country, BC",
    quote:
      "The consistency is what sold me. I know exactly what my month looks like. No more feast-or-famine. My income has been stable since I joined.",
    rating: 5,
    audience: "contractor",
    highlight: "Stable income",
  },
  {
    name: "Tyler B.",
    role: "HVAC Technician",
    location: "Penticton, BC",
    quote:
      "Zero cost to join, guaranteed payment, and I don't have to deal with billing or scheduling. I just show up, do great work, and get paid. Simple.",
    rating: 5,
    audience: "contractor",
    highlight: "$0 cost to join",
  },
  // Strata testimonials
  {
    name: "Pinnacle Strata Council",
    role: "48-Unit Complex",
    location: "Kelowna, BC",
    quote:
      "Managing 6 different vendors was a nightmare. My Home Plan consolidated everything into one contract. Our costs dropped 30% and quality went up.",
    rating: 5,
    audience: "strata",
    highlight: "30% cost reduction",
  },
  {
    name: "Lakeview Towers",
    role: "120-Unit Building",
    location: "West Kelowna, BC",
    quote:
      "The volume pricing alone saved us over $40,000 annually. But the real win is having one point of contact for everything. Our property manager loves it.",
    rating: 5,
    audience: "strata",
    highlight: "$40K annual savings",
  },
  {
    name: "Summit Ridge Strata",
    role: "75-Unit Complex",
    location: "Vernon, BC",
    quote:
      "Quality consistency across all our common areas improved dramatically. Residents notice the difference and complaints about maintenance have dropped to near zero.",
    rating: 5,
    audience: "strata",
    highlight: "Near-zero complaints",
  },
  // PM testimonials
  {
    name: "Rachel F.",
    role: "Portfolio Manager (35 properties)",
    location: "Kelowna, BC",
    quote:
      "I manage 35 rental properties. Before MHP, I had a spreadsheet of 40+ contractors. Now I have one dashboard, one invoice, and 60% less admin time.",
    rating: 5,
    audience: "pm",
    highlight: "60% less admin",
  },
  {
    name: "Pacific Properties Group",
    role: "Property Management Co.",
    location: "Penticton, BC",
    quote:
      "Tenant satisfaction scores went up 25% since we switched to My Home Plan. Maintenance requests get handled faster and our owners are thrilled with the cost savings.",
    rating: 5,
    audience: "pm",
    highlight: "25% higher satisfaction",
  },
  {
    name: "James W.",
    role: "Independent PM (12 properties)",
    location: "Lake Country, BC",
    quote:
      "As a solo property manager, I was drowning in maintenance coordination. MHP gave me my life back. My clients get better service and I have time to grow my business.",
    rating: 5,
    audience: "pm",
    highlight: "Time to grow",
  },
];
