export interface StrataService {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePerUnit: number; // base price per unit per month
  basePerSqft: number; // base price per common area sqft per month (if applicable)
  frequency: string;
}

export const STRATA_SERVICES: StrataService[] = [
  {
    id: "strata-common-cleaning",
    name: "Common Area Cleaning",
    description: "Lobbies, hallways, stairwells, and amenity spaces",
    icon: "Sparkles",
    basePerUnit: 8,
    basePerSqft: 0.02,
    frequency: "Weekly",
  },
  {
    id: "strata-grounds",
    name: "Grounds Maintenance",
    description: "Lawn care, landscaping, garden bed maintenance",
    icon: "Scissors",
    basePerUnit: 6,
    basePerSqft: 0.01,
    frequency: "Bi-weekly (seasonal)",
  },
  {
    id: "strata-snow",
    name: "Snow & Ice Removal",
    description: "Parking lots, walkways, entrances, salting",
    icon: "Snowflake",
    basePerUnit: 5,
    basePerSqft: 0.005,
    frequency: "As needed (Nov-Mar)",
  },
  {
    id: "strata-exterior-wash",
    name: "Building Exterior Wash",
    description: "Pressure washing building exterior, walkways, parkade",
    icon: "Waves",
    basePerUnit: 3,
    basePerSqft: 0,
    frequency: "Annual",
  },
  {
    id: "strata-gutters",
    name: "Gutter Cleaning",
    description: "All building gutters and downspouts",
    icon: "Droplets",
    basePerUnit: 2,
    basePerSqft: 0,
    frequency: "2x per year",
  },
  {
    id: "strata-parkade",
    name: "Parkade Maintenance",
    description: "Sweeping, line painting, drain cleaning",
    icon: "Car",
    basePerUnit: 2,
    basePerSqft: 0.008,
    frequency: "Quarterly",
  },
  {
    id: "strata-windows",
    name: "Common Area Windows",
    description: "Lobby, hallway, and amenity space windows",
    icon: "Sun",
    basePerUnit: 2,
    basePerSqft: 0.005,
    frequency: "Quarterly",
  },
  {
    id: "strata-pest",
    name: "Pest Control",
    description: "Building-wide preventive pest management",
    icon: "Bug",
    basePerUnit: 3,
    basePerSqft: 0,
    frequency: "Quarterly",
  },
  {
    id: "strata-hvac",
    name: "Common Area HVAC",
    description: "Heating/cooling systems in common spaces",
    icon: "Thermometer",
    basePerUnit: 2,
    basePerSqft: 0.01,
    frequency: "2x per year",
  },
  {
    id: "strata-elevator-lobby",
    name: "Elevator Lobby Care",
    description: "Daily elevator lobby cleaning and maintenance",
    icon: "ArrowUpDown",
    basePerUnit: 1.5,
    basePerSqft: 0,
    frequency: "Daily/Weekly",
  },
];

export function calculateStrataServicePrice(
  service: StrataService,
  units: number,
  commonAreaSqft: number
): number {
  return service.basePerUnit * units + service.basePerSqft * commonAreaSqft;
}

export const STRATA_PLAN_DISCOUNTS = {
  monthly: { label: "Monthly", discount: 0 },
  quarterly: { label: "Quarterly", discount: 0.05 },
  annual: { label: "Annual", discount: 0.12 },
};
