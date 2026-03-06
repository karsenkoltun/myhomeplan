export type SpecFieldType = "number" | "select" | "boolean" | "range";

export interface SpecField {
  id: string;
  label: string;
  type: SpecFieldType;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: string | number | boolean;
  options?: { label: string; value: string }[];
  pricingImpact?: string;
}

export interface ServiceSpec {
  serviceId: string;
  fields: SpecField[];
}

export const SERVICE_SPECS: ServiceSpec[] = [
  {
    serviceId: "lawn-mowing",
    fields: [
      { id: "sqft", label: "Lawn Area", type: "number", unit: "sq ft", min: 500, max: 30000, step: 100, defaultValue: 3000, pricingImpact: "Base area for pricing" },
      { id: "terrain", label: "Terrain", type: "select", defaultValue: "flat", options: [{ label: "Flat", value: "flat" }, { label: "Some slopes", value: "slope" }, { label: "Steep/hilly", value: "steep" }], pricingImpact: "+15-30% for slopes" },
      { id: "obstacles", label: "Obstacles (trees, beds, etc.)", type: "range", min: 0, max: 20, step: 1, defaultValue: 3, pricingImpact: "+5% per 5 obstacles" },
      { id: "edging", label: "Include edging", type: "boolean", defaultValue: true },
    ],
  },
  {
    serviceId: "snow-removal",
    fields: [
      { id: "drivewayLength", label: "Driveway Length", type: "number", unit: "ft", min: 10, max: 200, step: 5, defaultValue: 30, pricingImpact: "Primary pricing factor" },
      { id: "drivewayWidth", label: "Driveway Width", type: "number", unit: "ft", min: 8, max: 40, step: 2, defaultValue: 12 },
      { id: "walkwayLength", label: "Walkway Length", type: "number", unit: "ft", min: 0, max: 200, step: 5, defaultValue: 30, pricingImpact: "+$2/linear ft" },
      { id: "stairCount", label: "Outdoor Stairs", type: "range", min: 0, max: 20, step: 1, defaultValue: 0, pricingImpact: "+$3/stair" },
      { id: "slope", label: "Driveway Slope", type: "select", defaultValue: "flat", options: [{ label: "Flat", value: "flat" }, { label: "Slight incline", value: "slight" }, { label: "Steep", value: "steep" }], pricingImpact: "Steep +20%" },
      { id: "salting", label: "Include salting/de-icing", type: "boolean", defaultValue: true, pricingImpact: "+15% per visit" },
    ],
  },
  {
    serviceId: "house-cleaning",
    fields: [
      { id: "homeSqft", label: "Home Size", type: "number", unit: "sq ft", min: 500, max: 6000, step: 100, defaultValue: 1500 },
      { id: "bedrooms", label: "Bedrooms", type: "range", min: 1, max: 8, step: 1, defaultValue: 3, pricingImpact: "+$10/bedroom above 3" },
      { id: "bathrooms", label: "Bathrooms", type: "range", min: 1, max: 6, step: 1, defaultValue: 2, pricingImpact: "+$15/bathroom above 2" },
      { id: "floors", label: "Floors/Levels", type: "range", min: 1, max: 4, step: 1, defaultValue: 2, pricingImpact: "+10% per floor above 2" },
      { id: "hasPets", label: "Pets in home", type: "boolean", defaultValue: false, pricingImpact: "+10% for pet hair cleanup" },
      { id: "cleanType", label: "Cleaning Type", type: "select", defaultValue: "standard", options: [{ label: "Standard clean", value: "standard" }, { label: "Deep clean", value: "deep" }, { label: "Move-in/move-out", value: "move" }], pricingImpact: "Deep +40%, Move +60%" },
      { id: "fridgeOven", label: "Include fridge & oven interior", type: "boolean", defaultValue: false, pricingImpact: "+$25/visit" },
      { id: "laundry", label: "Include laundry", type: "boolean", defaultValue: false, pricingImpact: "+$15/visit" },
    ],
  },
  {
    serviceId: "window-washing",
    fields: [
      { id: "windowCount", label: "Number of Windows", type: "number", min: 4, max: 60, step: 1, defaultValue: 15, pricingImpact: "$8-12/window" },
      { id: "stories", label: "Home Stories", type: "range", min: 1, max: 4, step: 1, defaultValue: 2, pricingImpact: "+25% per story above 1" },
      { id: "scope", label: "Scope", type: "select", defaultValue: "both", options: [{ label: "Interior + Exterior", value: "both" }, { label: "Exterior only", value: "exterior" }], pricingImpact: "Exterior only -35%" },
      { id: "screenCleaning", label: "Include screen cleaning", type: "boolean", defaultValue: false, pricingImpact: "+$3/screen" },
      { id: "trackCleaning", label: "Include track & sill cleaning", type: "boolean", defaultValue: false, pricingImpact: "+$2/window" },
    ],
  },
  {
    serviceId: "gutter-cleaning",
    fields: [
      { id: "linearFeet", label: "Gutter Length", type: "number", unit: "ft", min: 50, max: 500, step: 10, defaultValue: 150, pricingImpact: "$1/linear ft" },
      { id: "stories", label: "Home Stories", type: "range", min: 1, max: 3, step: 1, defaultValue: 2, pricingImpact: "+30% per story above 1" },
      { id: "debrisLevel", label: "Tree Coverage", type: "select", defaultValue: "moderate", options: [{ label: "Low - few trees", value: "low" }, { label: "Moderate", value: "moderate" }, { label: "Heavy - many trees", value: "heavy" }], pricingImpact: "Heavy +25%" },
      { id: "downspoutFlushing", label: "Include downspout flushing", type: "boolean", defaultValue: true, pricingImpact: "Included in standard service" },
      { id: "gutterGuards", label: "Gutter guard inspection", type: "boolean", defaultValue: false, pricingImpact: "+$50 for guard inspection" },
    ],
  },
  {
    serviceId: "pressure-washing",
    fields: [
      { id: "surfaces", label: "Surfaces to Clean", type: "select", defaultValue: "driveway", options: [{ label: "Driveway only", value: "driveway" }, { label: "Driveway + Deck", value: "driveway-deck" }, { label: "Driveway + Siding", value: "driveway-siding" }, { label: "Full exterior", value: "full" }], pricingImpact: "Per surface pricing" },
      { id: "totalSqft", label: "Approximate Total Area", type: "number", unit: "sq ft", min: 100, max: 5000, step: 50, defaultValue: 600, pricingImpact: "$0.30-0.50/sq ft" },
      { id: "mildewTreatment", label: "Mildew/mold treatment", type: "boolean", defaultValue: false, pricingImpact: "+15% for treatment chemicals" },
    ],
  },
  {
    serviceId: "hvac-tuneup",
    fields: [
      { id: "systemType", label: "System Type", type: "select", defaultValue: "furnace", options: [{ label: "Furnace", value: "furnace" }, { label: "Heat Pump", value: "heat-pump" }, { label: "Furnace + AC", value: "furnace-ac" }, { label: "Heat Pump + AC", value: "heatpump-ac" }], pricingImpact: "Dual systems +50%" },
      { id: "unitCount", label: "Number of Units", type: "range", min: 1, max: 4, step: 1, defaultValue: 1, pricingImpact: "Per unit pricing" },
      { id: "systemAge", label: "System Age", type: "select", defaultValue: "5-10", options: [{ label: "Under 5 years", value: "0-5" }, { label: "5-10 years", value: "5-10" }, { label: "10-15 years", value: "10-15" }, { label: "15+ years", value: "15+" }] },
      { id: "ductCleaning", label: "Include duct cleaning", type: "boolean", defaultValue: false, pricingImpact: "+$150 per cleaning" },
      { id: "filterReplacement", label: "Include filter replacement", type: "boolean", defaultValue: true, pricingImpact: "Included in base price" },
    ],
  },
  {
    serviceId: "pest-control",
    fields: [
      { id: "propertySize", label: "Property Size", type: "select", defaultValue: "medium", options: [{ label: "Small (under 2000 sqft)", value: "small" }, { label: "Medium (2000-3500 sqft)", value: "medium" }, { label: "Large (3500+ sqft)", value: "large" }] },
      { id: "treatmentType", label: "Treatment Type", type: "select", defaultValue: "preventive", options: [{ label: "Preventive (quarterly)", value: "preventive" }, { label: "Active infestation", value: "active" }], pricingImpact: "Active +60%" },
      { id: "targetPests", label: "Target Pests", type: "select", defaultValue: "general", options: [{ label: "General (ants, spiders)", value: "general" }, { label: "Wasps/hornets", value: "wasps" }, { label: "Rodents", value: "rodents" }, { label: "Comprehensive", value: "comprehensive" }] },
    ],
  },
  {
    serviceId: "plumbing-inspection",
    fields: [
      { id: "bathrooms", label: "Bathrooms", type: "range", min: 1, max: 6, step: 1, defaultValue: 2, pricingImpact: "+$25/bathroom above 2" },
      { id: "homeAge", label: "Home Age", type: "select", defaultValue: "10-30", options: [{ label: "Under 10 years", value: "0-10" }, { label: "10-30 years", value: "10-30" }, { label: "30+ years", value: "30+" }], pricingImpact: "Older homes need more thorough inspection" },
      { id: "waterHeater", label: "Water Heater Type", type: "select", defaultValue: "tank", options: [{ label: "Tank", value: "tank" }, { label: "Tankless", value: "tankless" }] },
      { id: "waterHeaterFlush", label: "Include water heater flush", type: "boolean", defaultValue: false, pricingImpact: "+$75 per flush" },
      { id: "fixtureCount", label: "Number of Fixtures", type: "range", min: 5, max: 25, step: 1, defaultValue: 10, pricingImpact: "+$5/fixture above 10" },
    ],
  },
  {
    serviceId: "electrical-inspection",
    fields: [
      { id: "homeSqft", label: "Home Size", type: "number", unit: "sq ft", min: 500, max: 6000, step: 100, defaultValue: 1500 },
      { id: "homeAge", label: "Home Age", type: "select", defaultValue: "10-30", options: [{ label: "Under 10 years", value: "0-10" }, { label: "10-30 years", value: "10-30" }, { label: "30+ years", value: "30+" }] },
      { id: "panelCapacity", label: "Panel Capacity", type: "select", defaultValue: "100", options: [{ label: "100 amp", value: "100" }, { label: "200 amp", value: "200" }, { label: "Not sure", value: "unknown" }] },
    ],
  },
  {
    serviceId: "handyman",
    fields: [
      { id: "hours", label: "Hours per Year", type: "range", min: 2, max: 20, step: 1, defaultValue: 4, pricingImpact: "$85/hour" },
      { id: "taskTypes", label: "Common Tasks", type: "select", defaultValue: "general", options: [{ label: "General repairs", value: "general" }, { label: "Fixture installation", value: "fixtures" }, { label: "Caulking/weatherproofing", value: "caulking" }, { label: "Mixed", value: "mixed" }] },
    ],
  },
  {
    serviceId: "painting",
    fields: [
      { id: "scope", label: "Scope", type: "select", defaultValue: "interior-touchup", options: [{ label: "Interior touch-ups", value: "interior-touchup" }, { label: "1-2 rooms", value: "rooms" }, { label: "Exterior trim", value: "exterior-trim" }, { label: "Full exterior", value: "full-exterior" }], pricingImpact: "Varies by scope" },
      { id: "roomCount", label: "Rooms (if applicable)", type: "range", min: 1, max: 8, step: 1, defaultValue: 2 },
      { id: "prepNeeded", label: "Prep work needed", type: "boolean", defaultValue: false, pricingImpact: "+20% for prep" },
    ],
  },
  {
    serviceId: "carpet-cleaning",
    fields: [
      { id: "carpetSqft", label: "Carpeted Area", type: "number", unit: "sq ft", min: 100, max: 5000, step: 50, defaultValue: 800, pricingImpact: "$0.25/sq ft" },
      { id: "rooms", label: "Carpeted Rooms", type: "range", min: 1, max: 10, step: 1, defaultValue: 3 },
      { id: "stainLevel", label: "Stain Level", type: "select", defaultValue: "light", options: [{ label: "Light/maintenance", value: "light" }, { label: "Moderate stains", value: "moderate" }, { label: "Heavy/pet stains", value: "heavy" }], pricingImpact: "Heavy +30%" },
    ],
  },
  {
    serviceId: "lawn-fertilization",
    fields: [
      { id: "lawnSqft", label: "Lawn Area", type: "number", unit: "sq ft", min: 500, max: 30000, step: 100, defaultValue: 3000 },
      { id: "weedControl", label: "Include weed control", type: "boolean", defaultValue: true, pricingImpact: "+$25/treatment" },
    ],
  },
  {
    serviceId: "spring-fall-cleanup",
    fields: [
      { id: "lotSqft", label: "Lot Size", type: "number", unit: "sq ft", min: 1000, max: 30000, step: 500, defaultValue: 5000 },
      { id: "treeCount", label: "Mature Trees", type: "range", min: 0, max: 20, step: 1, defaultValue: 3, pricingImpact: "+$15/tree for leaf removal" },
      { id: "gardenBeds", label: "Garden Beds", type: "range", min: 0, max: 10, step: 1, defaultValue: 2, pricingImpact: "+$10/bed for cleanup" },
      { id: "hedgeTrimming", label: "Include hedge trimming", type: "boolean", defaultValue: false, pricingImpact: "+$40 per cleanup" },
      { id: "debrisHauling", label: "Debris hauling needed", type: "boolean", defaultValue: true, pricingImpact: "Included in base price" },
    ],
  },
];

export function getServiceSpec(serviceId: string): ServiceSpec | undefined {
  return SERVICE_SPECS.find((s) => s.serviceId === serviceId);
}
