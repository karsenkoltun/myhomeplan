export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  icon: string;
  basePrice: number; // base price per service event
  frequency: ServiceFrequency;
  frequencyLabel: string;
  seasonal?: "summer" | "winter" | "year-round";
  popular?: boolean;
  includes: string[];
  whatToExpect: string;
  whyItMatters: string;
}

export type ServiceCategory =
  | "outdoor"
  | "indoor"
  | "maintenance"
  | "specialty";

export type ServiceFrequency =
  | "weekly"
  | "biweekly"
  | "monthly"
  | "quarterly"
  | "biannual"
  | "annual"
  | "seasonal"
  | "as-needed";

export const SERVICE_CATEGORIES: Record<
  ServiceCategory,
  { label: string; description: string }
> = {
  outdoor: {
    label: "Outdoor",
    description: "Lawn care, snow removal, and exterior maintenance",
  },
  indoor: {
    label: "Indoor",
    description: "Cleaning, window washing, and interior care",
  },
  maintenance: {
    label: "Systems & Maintenance",
    description: "HVAC, plumbing, electrical, and home systems",
  },
  specialty: {
    label: "Specialty",
    description: "Pest control, handyman, painting, and more",
  },
};

export const SERVICES: Service[] = [
  // Outdoor
  {
    id: "lawn-mowing",
    name: "Lawn Mowing & Edging",
    description: "Professional mowing, edging, and trimming every visit",
    category: "outdoor",
    icon: "Scissors",
    basePrice: 55,
    frequency: "biweekly",
    frequencyLabel: "Bi-weekly (Apr-Oct)",
    seasonal: "summer",
    popular: true,
    includes: [
      "Professional mowing with commercial equipment",
      "Precise edging along walkways, beds & driveways",
      "Grass clipping cleanup & removal",
      "Trimming around obstacles & tight spots",
      "Optimal cut height for healthiest growth",
    ],
    whatToExpect: "Our crew arrives with commercial-grade equipment, mows your entire lawn at the optimal height, edges all borders, trims around obstacles, and cleans up completely. 30-60 minutes depending on lawn size.",
    whyItMatters: "Regular professional mowing prevents thatch buildup, promotes root health, and keeps your property looking sharp.",
  },
  {
    id: "lawn-fertilization",
    name: "Lawn Fertilization & Weed Control",
    description: "Seasonal fertilization and weed treatment program",
    category: "outdoor",
    icon: "Sprout",
    basePrice: 75,
    frequency: "quarterly",
    frequencyLabel: "4x per season",
    seasonal: "summer",
    includes: [
      "Seasonal fertilizer application",
      "Pre-emergent weed treatment",
      "Post-emergent spot treatment",
      "Soil health assessment",
      "Customized treatment plan for your grass type",
    ],
    whatToExpect: "Licensed technician tests soil conditions, applies appropriate seasonal fertilizer blend, and treats existing weeds. Treatment plan adjusts throughout the year.",
    whyItMatters: "Proper fertilization and weed control transforms thin, patchy lawns into thick, green carpets that resist pests and disease.",
  },
  {
    id: "spring-fall-cleanup",
    name: "Spring & Fall Cleanup",
    description: "Leaf removal, bed cleanup, garden prep",
    category: "outdoor",
    icon: "Leaf",
    basePrice: 180,
    frequency: "biannual",
    frequencyLabel: "2x per year",
    seasonal: "summer",
    popular: true,
    includes: [
      "Complete leaf removal from lawn, beds & hard surfaces",
      "Garden bed cleanup and edge defining",
      "Debris removal and hauling",
      "Gutter flushing (ground-level)",
      "Lawn dethatching and aeration prep",
      "Pruning of dead/damaged branches",
    ],
    whatToExpect: "Full crew spends 2-4 hours doing a comprehensive seasonal cleanup. Everything is hauled away - you don't lift a finger.",
    whyItMatters: "Seasonal cleanups prevent lawn disease, prepare your yard for the next season, and dramatically boost curb appeal.",
  },
  {
    id: "snow-removal",
    name: "Snow Removal & Salting",
    description: "Driveway and walkway clearing with ice management",
    category: "outdoor",
    icon: "Snowflake",
    basePrice: 65,
    frequency: "seasonal",
    frequencyLabel: "As-needed (Nov-Mar)",
    seasonal: "winter",
    popular: true,
    includes: [
      "Driveway clearing within 4 hours of snowfall",
      "All walkways and pathways cleared",
      "De-icing salt/sand application",
      "Mailbox and entrance path access",
      "Available 24/7, November through March",
    ],
    whatToExpect: "Priority response after every significant snowfall. Driveway plowed, walkways shoveled, surfaces de-iced. You wake up to clear paths.",
    whyItMatters: "Professional snow removal eliminates slip-and-fall liability, saves your back, and ensures you can always get in and out.",
  },
  {
    id: "gutter-cleaning",
    name: "Gutter Cleaning",
    description: "Full gutter clean, flush, and downspout check",
    category: "outdoor",
    icon: "Droplets",
    basePrice: 165,
    frequency: "biannual",
    frequencyLabel: "2x per year",
    seasonal: "year-round",
    includes: [
      "Complete debris removal from all gutters",
      "Downspout flushing and clearing",
      "Gutter bracket inspection",
      "Minor re-securing of loose sections",
      "Ground-level cleanup of debris",
    ],
    whatToExpect: "Technician works around the entire roofline, removes all debris from gutters, flushes downspouts to verify flow, and cleans up below.",
    whyItMatters: "Clogged gutters cause foundation damage, basement flooding, ice dams, and fascia rot - all far more expensive than cleaning.",
  },
  {
    id: "pressure-washing",
    name: "Pressure Washing",
    description: "Driveway, deck, siding, and patio cleaning",
    category: "outdoor",
    icon: "Waves",
    basePrice: 275,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "summer",
    includes: [
      "Professional-grade pressure washing",
      "Surface-appropriate PSI settings",
      "Eco-friendly cleaning solutions",
      "Driveway, walkways, siding, or deck",
      "Mildew and stain treatment",
    ],
    whatToExpect: "We assess each surface and use the right pressure and cleaning solution. Most homes take 3-5 hours for a full exterior wash.",
    whyItMatters: "Pressure washing removes years of grime, mold, and stains - instantly refreshing your home's appearance and preventing surface degradation.",
  },

  // Indoor
  {
    id: "house-cleaning",
    name: "House Cleaning",
    description: "Professional deep clean of your entire home",
    category: "indoor",
    icon: "Sparkles",
    basePrice: 195,
    frequency: "monthly",
    frequencyLabel: "Monthly",
    seasonal: "year-round",
    popular: true,
    includes: [
      "All rooms dusted and vacuumed",
      "Kitchen deep clean (counters, appliances, sink)",
      "Bathroom sanitization (toilet, shower, mirrors)",
      "Floor mopping on all hard surfaces",
      "Baseboard and light fixture dusting",
      "Bed making and general tidying",
    ],
    whatToExpect: "Professional cleaner arrives with all supplies. Standard clean takes 2-4 hours depending on home size. Deep cleans include inside appliances and detailed scrubbing.",
    whyItMatters: "Regular professional cleaning maintains a healthy home environment, reduces allergens, and gives you back hours of your week.",
  },
  {
    id: "window-washing",
    name: "Window Washing",
    description: "Interior and exterior window cleaning",
    category: "indoor",
    icon: "Sun",
    basePrice: 175,
    frequency: "biannual",
    frequencyLabel: "2x per year",
    seasonal: "year-round",
    includes: [
      "Exterior window cleaning (all accessible windows)",
      "Interior window cleaning",
      "Screen cleaning and reinstallation",
      "Window track and sill wiping",
      "Hard water stain treatment",
    ],
    whatToExpect: "Professional window team handles interior and exterior surfaces. Most homes completed in 2-4 hours. We use professional squeegee technique for streak-free results.",
    whyItMatters: "Clean windows transform the feel of your home - more natural light, better views, and a polished look from the street.",
  },
  {
    id: "carpet-cleaning",
    name: "Carpet & Upholstery Cleaning",
    description: "Professional steam cleaning for carpets and furniture",
    category: "indoor",
    icon: "Armchair",
    basePrice: 225,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "year-round",
    includes: [
      "Hot water extraction deep cleaning",
      "Pre-treatment of high-traffic areas",
      "Spot and stain treatment",
      "Deodorizing treatment",
      "Quick-dry process (4-6 hours)",
    ],
    whatToExpect: "Technician pre-treats stains, deep cleans all carpeted areas with truck-mounted hot water extraction, and applies deodorizer. Most homes dry within 4-6 hours.",
    whyItMatters: "Professional carpet cleaning removes allergens, dust mites, and bacteria that vacuuming can't reach - extending carpet life by years.",
  },

  // Maintenance
  {
    id: "hvac-tuneup",
    name: "HVAC Tune-Up",
    description:
      "Furnace and AC inspection, cleaning, and filter replacement",
    category: "maintenance",
    icon: "Thermometer",
    basePrice: 145,
    frequency: "biannual",
    frequencyLabel: "2x per year (spring + fall)",
    seasonal: "year-round",
    popular: true,
    includes: [
      "Complete system inspection",
      "Filter replacement",
      "Coil cleaning",
      "Refrigerant level check",
      "Thermostat calibration",
      "Safety inspection and CO test",
    ],
    whatToExpect: "Licensed HVAC tech spends 60-90 minutes inspecting, cleaning, and tuning your heating/cooling system. Provides written report of any concerns.",
    whyItMatters: "Regular HVAC maintenance extends system life 5-10 years, reduces energy bills 15-25%, and catches problems before they become emergencies.",
  },
  {
    id: "plumbing-inspection",
    name: "Plumbing Inspection",
    description: "Full system check, water heater flush, winterization",
    category: "maintenance",
    icon: "Wrench",
    basePrice: 175,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "year-round",
    includes: [
      "Full visible pipe inspection",
      "Water heater check and flush",
      "Toilet and faucet leak check",
      "Water pressure test",
      "Drain flow assessment",
      "Shut-off valve verification",
    ],
    whatToExpect: "Licensed plumber inspects all visible plumbing, tests water pressure, checks for leaks, flushes water heater, and provides a written condition report.",
    whyItMatters: "Catching a small leak or failing water heater early saves thousands in water damage, mold remediation, and emergency repairs.",
  },
  {
    id: "electrical-inspection",
    name: "Electrical Safety Check",
    description:
      "Panel inspection, outlet testing, smoke/CO detector check",
    category: "maintenance",
    icon: "Zap",
    basePrice: 165,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "year-round",
    includes: [
      "Panel inspection and breaker test",
      "Outlet and switch testing",
      "GFCI/AFCI verification",
      "Smoke and CO detector check",
      "Visible wiring inspection",
      "Grounding verification",
    ],
    whatToExpect: "Licensed electrician spends 60-90 minutes testing your home's electrical system. Checks panels, outlets, switches, and safety devices. Written report provided.",
    whyItMatters: "Electrical issues are the #1 cause of house fires. Annual inspections catch faulty wiring, overloaded circuits, and outdated components.",
  },

  // Specialty
  {
    id: "pest-control",
    name: "Pest Control",
    description:
      "Quarterly treatment for ants, wasps, rodents, and more",
    category: "specialty",
    icon: "Bug",
    basePrice: 135,
    frequency: "quarterly",
    frequencyLabel: "Quarterly",
    seasonal: "year-round",
    popular: true,
    includes: [
      "Interior and exterior perimeter treatment",
      "Entry point identification and sealing recommendations",
      "Targeted treatment for identified pests",
      "Monitoring station placement",
      "Follow-up visit if needed within 30 days",
    ],
    whatToExpect: "Licensed technician inspects your property for pest activity, applies targeted treatments inside and out, identifies entry points, and sets monitoring stations.",
    whyItMatters: "Preventive pest control costs a fraction of dealing with an infestation. Protects your home's structure and your family's health.",
  },
  {
    id: "handyman",
    name: "Handyman Services",
    description:
      "Minor repairs, fixture installation, caulking, and more",
    category: "specialty",
    icon: "Hammer",
    basePrice: 85,
    frequency: "as-needed",
    frequencyLabel: "Bank of hours per year",
    seasonal: "year-round",
    includes: [
      "Skilled handyman for small repairs and projects",
      "Furniture assembly",
      "Picture hanging and TV mounting",
      "Minor drywall patches",
      "Caulking and weatherstripping",
      "Fixture replacements",
    ],
    whatToExpect: "Experienced handyman arrives with tools for your task list. Hourly service lets you knock out multiple small jobs in one visit.",
    whyItMatters: "Those small jobs add up. A handyman bank means you actually get them done instead of letting them pile up for months.",
  },
  {
    id: "painting",
    name: "Painting & Touch-Ups",
    description:
      "Interior touch-ups, accent walls, exterior trim painting",
    category: "specialty",
    icon: "Paintbrush",
    basePrice: 350,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "year-round",
    includes: [
      "Interior or exterior painting",
      "Surface prep (sanding, patching, priming)",
      "Two coats of premium paint",
      "Trim and detail work",
      "Furniture and floor protection",
      "Full cleanup",
    ],
    whatToExpect: "Professional painters prep surfaces, protect your belongings, apply primer and two coats, and clean up completely. Timeline varies by scope.",
    whyItMatters: "Fresh paint is the single highest-ROI home improvement. It protects surfaces and transforms the look and feel of your space.",
  },
];

// Available frequency options per service
export interface FrequencyOption {
  value: ServiceFrequency;
  label: string;
  multiplier: number; // annual events
}

export const SERVICE_FREQUENCY_OPTIONS: Record<string, FrequencyOption[]> = {
  "lawn-mowing": [
    { value: "weekly", label: "Weekly", multiplier: 30 },
    { value: "biweekly", label: "Bi-weekly", multiplier: 15 },
    { value: "monthly", label: "Monthly", multiplier: 7 },
  ],
  "lawn-fertilization": [
    { value: "monthly", label: "Monthly (growing season)", multiplier: 6 },
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
    { value: "biannual", label: "Twice a year", multiplier: 2 },
  ],
  "spring-fall-cleanup": [
    { value: "biannual", label: "Spring + Fall", multiplier: 2 },
    { value: "annual", label: "Spring only", multiplier: 1 },
  ],
  "snow-removal": [
    { value: "seasonal", label: "Every snow day", multiplier: 20 },
    { value: "biweekly", label: "Heavy snow only", multiplier: 10 },
    { value: "as-needed", label: "On-call", multiplier: 5 },
  ],
  "gutter-cleaning": [
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "pressure-washing": [
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "house-cleaning": [
    { value: "weekly", label: "Weekly", multiplier: 52 },
    { value: "biweekly", label: "Bi-weekly", multiplier: 26 },
    { value: "monthly", label: "Monthly", multiplier: 12 },
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
  ],
  "window-washing": [
    { value: "monthly", label: "Monthly", multiplier: 12 },
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "carpet-cleaning": [
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "hvac-tuneup": [
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "plumbing-inspection": [
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "electrical-inspection": [
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "pest-control": [
    { value: "monthly", label: "Monthly", multiplier: 12 },
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
    { value: "biannual", label: "Twice a year", multiplier: 2 },
  ],
  "handyman": [
    { value: "monthly", label: "Monthly hours bank", multiplier: 12 },
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
    { value: "as-needed", label: "On-call", multiplier: 1 },
  ],
  "painting": [
    { value: "annual", label: "Once a year", multiplier: 1 },
    { value: "biannual", label: "Every 6 months", multiplier: 2 },
  ],
};

// How many times per year each frequency type occurs
export const FREQUENCY_MULTIPLIERS: Record<ServiceFrequency, number> = {
  weekly: 30, // ~30 weeks of summer service
  biweekly: 15,
  monthly: 12,
  quarterly: 4,
  biannual: 2,
  annual: 1,
  seasonal: 20, // ~20 snow events average in Okanagan
  "as-needed": 1, // priced as hourly bank
};

export const PROPERTY_SIZE_MULTIPLIERS = [
  { label: "Under 1,000 sq ft", min: 0, max: 999, multiplier: 0.8 },
  { label: "1,000 - 2,000 sq ft", min: 1000, max: 1999, multiplier: 1.0 },
  { label: "2,000 - 3,000 sq ft", min: 2000, max: 2999, multiplier: 1.2 },
  { label: "3,000 - 4,000 sq ft", min: 3000, max: 3999, multiplier: 1.4 },
  { label: "4,000+ sq ft", min: 4000, max: Infinity, multiplier: 1.6 },
];

export const LOT_SIZE_MULTIPLIERS = [
  { label: "Under 3,000 sq ft", min: 0, max: 2999, multiplier: 0.8 },
  { label: "3,000 - 6,000 sq ft", min: 3000, max: 5999, multiplier: 1.0 },
  { label: "6,000 - 10,000 sq ft", min: 6000, max: 9999, multiplier: 1.3 },
  {
    label: "10,000 - 20,000 sq ft",
    min: 10000,
    max: 19999,
    multiplier: 1.6,
  },
  { label: "20,000+ sq ft", min: 20000, max: Infinity, multiplier: 2.0 },
];

export function getPropertyMultiplier(sqft: number): number {
  const tier = PROPERTY_SIZE_MULTIPLIERS.find(
    (t) => sqft >= t.min && sqft <= t.max
  );
  return tier?.multiplier ?? 1.0;
}

export function getLotMultiplier(sqft: number): number {
  const tier = LOT_SIZE_MULTIPLIERS.find(
    (t) => sqft >= t.min && sqft <= t.max
  );
  return tier?.multiplier ?? 1.0;
}

export function calculateMonthlyPrice(
  service: Service,
  propertySqft: number,
  lotSqft: number
): number {
  const isOutdoor = service.category === "outdoor";
  const sizeMultiplier = isOutdoor
    ? getLotMultiplier(lotSqft)
    : getPropertyMultiplier(propertySqft);
  const annualFrequency = FREQUENCY_MULTIPLIERS[service.frequency];

  // For handyman, it's hourly bank - different calculation
  if (service.id === "handyman") {
    return (service.basePrice * sizeMultiplier * 4) / 12; // 4 hours per year
  }

  const annualCost = service.basePrice * sizeMultiplier * annualFrequency;
  return annualCost / 12;
}

export const PLAN_DISCOUNTS = {
  monthly: { label: "Monthly", discount: 0, description: "Pay as you go" },
  quarterly: {
    label: "Quarterly",
    discount: 0.05,
    description: "Save 5%",
  },
  annual: {
    label: "Annual",
    discount: 0.15,
    description: "Save 15% - Best value",
  },
};

export type PlanInterval = keyof typeof PLAN_DISCOUNTS;

export interface PlanTier {
  id: string;
  name: string;
  tagline: string;
  description: string;
  startingPrice: number;
  services: string[]; // service IDs
  features: string[];
  highlighted?: boolean;
  bestFor: string;
}

export const PLAN_TIERS: PlanTier[] = [
  {
    id: "minimum",
    name: "Minimum",
    tagline: "Keep Your Home Maintained",
    description:
      "Essential outdoor maintenance at an affordable price. The basics your home needs to stay in great shape year-round.",
    startingPrice: 89,
    services: [
      "lawn-mowing",
      "snow-removal",
      "spring-fall-cleanup",
      "gutter-cleaning",
    ],
    features: [
      "Bi-weekly lawn care (Apr-Oct)",
      "Snow removal (Nov-Mar)",
      "Spring + fall cleanup",
      "Gutter cleaning (2x per year)",
    ],
    bestFor: "Homeowners who want the basics covered",
  },
  {
    id: "fundamentals",
    name: "Fundamentals",
    tagline: "Everything Your Home Needs",
    description:
      "Comprehensive indoor and outdoor care that covers all the essentials. The most popular choice for a reason.",
    startingPrice: 159,
    services: [
      "lawn-mowing",
      "snow-removal",
      "spring-fall-cleanup",
      "gutter-cleaning",
      "hvac-tuneup",
      "house-cleaning",
      "window-washing",
      "pest-control",
      "handyman",
    ],
    features: [
      "Everything in Minimum, plus:",
      "HVAC tune-ups (spring + fall)",
      "Monthly house cleaning",
      "Window washing (2x per year)",
      "Quarterly pest control",
      "2 hours of handyman work",
    ],
    highlighted: true,
    bestFor: "Homeowners who want comprehensive care",
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Complete Peace of Mind",
    description:
      "All-inclusive white-glove service with priority scheduling. Every service we offer, handled for you.",
    startingPrice: 249,
    services: [
      "lawn-mowing",
      "lawn-fertilization",
      "snow-removal",
      "spring-fall-cleanup",
      "gutter-cleaning",
      "hvac-tuneup",
      "house-cleaning",
      "window-washing",
      "pest-control",
      "handyman",
      "plumbing-inspection",
      "electrical-inspection",
      "pressure-washing",
      "painting",
    ],
    features: [
      "Everything in Fundamentals, plus:",
      "Lawn fertilization program",
      "Annual plumbing inspection",
      "Annual electrical safety check",
      "Annual pressure washing",
      "6 hours of handyman work",
      "Painting touch-ups",
      "48-hour priority booking",
      "Dedicated account manager",
    ],
    bestFor: "Homeowners who want the ultimate care package",
  },
];
