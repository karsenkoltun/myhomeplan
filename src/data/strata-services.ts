export interface StrataService {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePerUnit: number; // base price per unit per month
  basePerSqft: number; // base price per common area sqft per month (if applicable)
  frequency: string;
  includes: string[];
  whatToExpect: string;
  whyItMatters: string;
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
    includes: [
      "Lobby floor mopping and vacuuming",
      "Hallway and stairwell cleaning",
      "Amenity room sanitization",
      "Garbage and recycling area cleanup",
      "Door handle and high-touch surface sanitization",
      "Elevator cab cleaning",
    ],
    whatToExpect: "Cleaning crew arrives weekly on a set schedule to clean all common areas from top to bottom. Includes floor care, dusting, garbage area cleanup, and surface sanitization.",
    whyItMatters: "Clean common areas directly impact resident satisfaction, property value, and reduce the spread of illness throughout the building.",
  },
  {
    id: "strata-grounds",
    name: "Grounds Maintenance",
    description: "Lawn care, landscaping, garden bed maintenance",
    icon: "Scissors",
    basePerUnit: 6,
    basePerSqft: 0.01,
    frequency: "Bi-weekly (seasonal)",
    includes: [
      "Lawn mowing and edging throughout the property",
      "Garden bed weeding and maintenance",
      "Shrub and hedge trimming",
      "Seasonal flower planting and mulching",
      "Irrigation system monitoring",
      "Debris and litter pickup",
    ],
    whatToExpect: "Landscape crew handles all outdoor green spaces bi-weekly during the growing season. Includes mowing, edging, bed maintenance, and general grounds cleanup.",
    whyItMatters: "Well-maintained grounds are the first impression for residents and visitors. Professional landscaping protects property values and creates pride of ownership.",
  },
  {
    id: "strata-snow",
    name: "Snow & Ice Removal",
    description: "Parking lots, walkways, entrances, salting",
    icon: "Snowflake",
    basePerUnit: 5,
    basePerSqft: 0.005,
    frequency: "As needed (Nov-Mar)",
    includes: [
      "Parking lot plowing and clearing",
      "All walkways and entrance paths cleared",
      "De-icing salt and sand application",
      "Emergency response within 4 hours of snowfall",
      "Fire lane and accessibility compliance",
      "Available 24/7 throughout winter season",
    ],
    whatToExpect: "Priority response after every significant snowfall. Parking lots plowed, walkways cleared, all surfaces de-iced. Strata council receives service reports after each event.",
    whyItMatters: "Professional snow removal protects the strata from slip-and-fall liability, ensures accessibility compliance, and keeps residents safe all winter.",
  },
  {
    id: "strata-exterior-wash",
    name: "Building Exterior Wash",
    description: "Pressure washing building exterior, walkways, parkade",
    icon: "Waves",
    basePerUnit: 3,
    basePerSqft: 0,
    frequency: "Annual",
    includes: [
      "Building exterior soft wash or pressure wash",
      "Walkway and patio pressure washing",
      "Parkade floor and wall cleaning",
      "Entrance canopy and overhang cleaning",
      "Mildew and algae treatment",
      "Waste containment and proper drainage",
    ],
    whatToExpect: "Professional crew spends 1-3 days (depending on building size) washing all exterior surfaces with appropriate pressure and cleaning solutions. Residents notified in advance.",
    whyItMatters: "Annual exterior washing prevents permanent staining, algae damage, and concrete deterioration - protecting the building envelope and maintaining curb appeal.",
  },
  {
    id: "strata-gutters",
    name: "Gutter Cleaning",
    description: "All building gutters and downspouts",
    icon: "Droplets",
    basePerUnit: 2,
    basePerSqft: 0,
    frequency: "2x per year",
    includes: [
      "Complete debris removal from all building gutters",
      "Downspout flushing and flow verification",
      "Gutter bracket and fastener inspection",
      "Roof drainage assessment",
      "Ground-level cleanup",
      "Written condition report for strata council",
    ],
    whatToExpect: "Technicians work along the entire roofline, clear all gutters, flush every downspout, and provide the strata with a written report noting any damage or concerns.",
    whyItMatters: "Clogged gutters on multi-unit buildings cause water infiltration, foundation damage, and ice dams - repairs that can cost the strata tens of thousands.",
  },
  {
    id: "strata-parkade",
    name: "Parkade Maintenance",
    description: "Sweeping, line painting, drain cleaning",
    icon: "Car",
    basePerUnit: 2,
    basePerSqft: 0.008,
    frequency: "Quarterly",
    includes: [
      "Full parkade sweeping and debris removal",
      "Drain grate cleaning and flow check",
      "Oil stain spot treatment",
      "Line painting touch-ups as needed",
      "Light fixture and signage cleaning",
      "Condition assessment of concrete surfaces",
    ],
    whatToExpect: "Quarterly deep clean of all parkade levels including sweeping, drain cleaning, stain treatment, and line painting touch-ups. Annual condition report provided.",
    whyItMatters: "Regular parkade maintenance prevents drain blockages, reduces slip hazards from oil buildup, and extends the life of expensive concrete and membrane systems.",
  },
  {
    id: "strata-windows",
    name: "Common Area Windows",
    description: "Lobby, hallway, and amenity space windows",
    icon: "Sun",
    basePerUnit: 2,
    basePerSqft: 0.005,
    frequency: "Quarterly",
    includes: [
      "All common area window cleaning (interior and exterior)",
      "Entrance glass doors and sidelights",
      "Amenity room and hallway windows",
      "Window frame and track wiping",
      "Hard water stain treatment",
      "Screen cleaning where applicable",
    ],
    whatToExpect: "Professional window crew cleans all common area glass surfaces inside and out on a quarterly schedule. Streak-free squeegee technique on all surfaces.",
    whyItMatters: "Clean common area windows brighten shared spaces, create a welcoming first impression, and reflect well-managed building maintenance.",
  },
  {
    id: "strata-pest",
    name: "Pest Control",
    description: "Building-wide preventive pest management",
    icon: "Bug",
    basePerUnit: 3,
    basePerSqft: 0,
    frequency: "Quarterly",
    includes: [
      "Perimeter treatment around the entire building",
      "Common area inspection and treatment",
      "Garbage and recycling room treatment",
      "Monitoring station placement and checks",
      "Entry point identification report",
      "Emergency unit treatment available within 48 hours",
    ],
    whatToExpect: "Licensed technician treats the building perimeter and all common areas quarterly. Monitors are checked, stations refreshed, and a report is filed with the strata council.",
    whyItMatters: "Building-wide pest prevention stops infestations before they spread between units - far cheaper and less disruptive than treating individual suites reactively.",
  },
  {
    id: "strata-hvac",
    name: "Common Area HVAC",
    description: "Heating/cooling systems in common spaces",
    icon: "Thermometer",
    basePerUnit: 2,
    basePerSqft: 0.01,
    frequency: "2x per year",
    includes: [
      "Common area furnace and AC inspection",
      "Filter replacement on all common area units",
      "Coil cleaning and refrigerant check",
      "Thermostat calibration",
      "Ventilation system assessment",
      "Written maintenance report for council",
    ],
    whatToExpect: "Licensed HVAC technician services all common area heating and cooling equipment twice per year. Full inspection, cleaning, filter swap, and written report provided.",
    whyItMatters: "Common area HVAC failures affect every resident. Preventive maintenance extends equipment life, reduces energy costs, and avoids emergency repair callouts.",
  },
  {
    id: "strata-elevator-lobby",
    name: "Elevator Lobby Care",
    description: "Daily elevator lobby cleaning and maintenance",
    icon: "ArrowUpDown",
    basePerUnit: 1.5,
    basePerSqft: 0,
    frequency: "Daily/Weekly",
    includes: [
      "Daily floor sweeping and spot mopping",
      "Elevator button and panel sanitization",
      "Lobby mirror and glass cleaning",
      "Weekly deep floor cleaning and buffing",
      "Wall and baseboard wiping",
      "Light fixture and ceiling vent dusting",
    ],
    whatToExpect: "Daily light cleaning keeps elevator lobbies presentable between weekly deep cleans. High-touch surfaces like buttons and handles sanitized daily.",
    whyItMatters: "Elevator lobbies are the most-used space in any building. Daily care prevents wear buildup, keeps residents happy, and reduces long-term flooring replacement costs.",
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
