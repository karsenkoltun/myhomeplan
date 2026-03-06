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
  },
];

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
  startingPrice: number;
  services: string[]; // service IDs
  features: string[];
  highlighted?: boolean;
}

export const PLAN_TIERS: PlanTier[] = [
  {
    id: "essentials",
    name: "Essentials",
    tagline: "The basics, handled",
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
      "1 gutter cleaning per year",
      "Priority scheduling",
    ],
  },
  {
    id: "home-care",
    name: "Home Care",
    tagline: "Complete peace of mind",
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
      "Everything in Essentials",
      "HVAC tune-ups (spring + fall)",
      "Quarterly house cleaning",
      "2x window washing",
      "Quarterly pest control",
      "2 hours of handyman work",
    ],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Your home, perfected",
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
      "Everything in Home Care",
      "Lawn fertilization program",
      "Annual plumbing inspection",
      "Annual electrical check",
      "Annual pressure washing",
      "6 hours of handyman work",
      "Painting touch-ups",
      "48-hour priority booking",
      "Dedicated account manager",
    ],
  },
];
