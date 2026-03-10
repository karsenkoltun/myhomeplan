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
    description: "Lawn care, landscaping, snow removal, and exterior maintenance",
  },
  indoor: {
    label: "Indoor",
    description: "Cleaning, air quality, window washing, and interior care",
  },
  maintenance: {
    label: "Systems & Maintenance",
    description: "HVAC, plumbing, electrical, appliances, and home systems",
  },
  specialty: {
    label: "Specialty",
    description: "Pest control, handyman, painting, pool care, and more",
  },
};

export const SERVICES: Service[] = [
  // ========== OUTDOOR ==========
  {
    id: "lawn-mowing",
    name: "Lawn Mowing & Edging",
    description: "Professional mowing, edging, and trimming every visit",
    category: "outdoor",
    icon: "Scissors",
    basePrice: 50,
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
    basePrice: 70,
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
    basePrice: 195,
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
    basePrice: 60,
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
    basePrice: 160,
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
    basePrice: 285,
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
  {
    id: "tree-shrub-trimming",
    name: "Tree & Shrub Trimming",
    description: "Professional pruning of trees, hedges, and ornamental shrubs",
    category: "outdoor",
    icon: "TreePine",
    basePrice: 185,
    frequency: "biannual",
    frequencyLabel: "2x per year",
    seasonal: "summer",
    popular: true,
    includes: [
      "Trimming of all accessible trees under 25 feet",
      "Hedge and shrub shaping",
      "Dead branch and sucker removal",
      "Canopy thinning for light penetration",
      "All debris hauled away",
    ],
    whatToExpect: "Arborist-trained crew prunes all trees and shrubs to proper shape, removes deadwood, and cleans up completely. 2-4 hours for most properties.",
    whyItMatters: "Regular pruning keeps trees healthy, prevents storm damage from weak branches, and keeps shrubs looking manicured.",
  },
  {
    id: "garden-maintenance",
    name: "Garden Bed Maintenance",
    description: "Weeding, mulching, pruning, and seasonal planting",
    category: "outdoor",
    icon: "Flower2",
    basePrice: 95,
    frequency: "monthly",
    frequencyLabel: "Monthly (Apr-Oct)",
    seasonal: "summer",
    includes: [
      "Complete weeding of all garden beds",
      "Edging and bed border maintenance",
      "Deadheading and light pruning",
      "Mulch top-up as needed",
      "Seasonal plant health check",
    ],
    whatToExpect: "Gardener spends 1-3 hours maintaining all beds, pulling weeds, shaping borders, and checking plant health. Your beds stay tidy all season.",
    whyItMatters: "Regular garden maintenance prevents weed takeover, promotes healthy growth, and saves you hours of back-breaking work.",
  },
  {
    id: "irrigation-maintenance",
    name: "Irrigation System Service",
    description: "Spring startup, mid-season check, and winterization",
    category: "outdoor",
    icon: "CloudRain",
    basePrice: 95,
    frequency: "biannual",
    frequencyLabel: "Spring startup + winterization",
    seasonal: "year-round",
    includes: [
      "Spring system activation and zone testing",
      "Head adjustment and replacement as needed",
      "Leak detection and repair",
      "Controller programming optimization",
      "Fall blowout and winterization",
    ],
    whatToExpect: "Licensed technician activates your system in spring, tests every zone, fixes issues, then winterizes with a compressed air blowout in fall.",
    whyItMatters: "Proper winterization prevents frozen pipe bursts (a $500-2,000 repair), and spring tuning ensures even coverage that saves water.",
  },
  {
    id: "deck-fence-staining",
    name: "Deck & Fence Staining",
    description: "Power wash, prep, and professional stain application",
    category: "outdoor",
    icon: "PaintBucket",
    basePrice: 375,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "summer",
    includes: [
      "Power washing and surface prep",
      "Sanding of rough spots",
      "Premium exterior stain or sealant",
      "Even application with sprayer and back-brush",
      "Furniture and plant protection",
    ],
    whatToExpect: "Crew power washes surfaces, allows drying, preps and sands, then applies premium stain. Most decks completed in 1-2 days.",
    whyItMatters: "Unstained wood decks and fences rot within 3-5 years. Annual staining extends wood life to 15-20 years and keeps it looking great.",
  },
  {
    id: "driveway-sealing",
    name: "Driveway Sealing",
    description: "Asphalt or concrete driveway sealing and crack repair",
    category: "outdoor",
    icon: "Layers",
    basePrice: 285,
    frequency: "biannual",
    frequencyLabel: "Every 2 years",
    seasonal: "summer",
    includes: [
      "Surface cleaning and prep",
      "Crack filling and patching",
      "Professional-grade sealant application",
      "Edge-to-edge coverage",
      "24-hour cure time guidance",
    ],
    whatToExpect: "Crew cleans the driveway, fills cracks, and applies commercial sealant. Your driveway looks fresh and is protected from water and UV damage.",
    whyItMatters: "Sealing every 2-3 years prevents expensive crack damage and resurfacing. A $285 seal prevents a $3,000+ replacement.",
  },
  {
    id: "roof-cleaning",
    name: "Roof Cleaning & Moss Treatment",
    description: "Soft wash cleaning and moss prevention treatment",
    category: "outdoor",
    icon: "Umbrella",
    basePrice: 325,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "summer",
    includes: [
      "Low-pressure soft wash of entire roof",
      "Moss, algae, and lichen removal",
      "Preventive zinc or copper treatment",
      "Flashing and vent visual inspection",
      "Before/after photos provided",
    ],
    whatToExpect: "Trained crew soft-washes your roof with appropriate chemicals, removes all growth, and applies preventive treatment. 3-5 hours for most homes.",
    whyItMatters: "Moss and algae hold moisture against shingles, causing premature failure. Cleaning extends roof life by 5-10 years.",
  },

  // ========== INDOOR ==========
  {
    id: "house-cleaning",
    name: "House Cleaning",
    description: "Professional cleaning of your entire home",
    category: "indoor",
    icon: "Sparkles",
    basePrice: 185,
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
    id: "deep-cleaning",
    name: "Deep Clean & Sanitization",
    description: "Intensive top-to-bottom cleaning including behind appliances",
    category: "indoor",
    icon: "SprayCan",
    basePrice: 375,
    frequency: "biannual",
    frequencyLabel: "2x per year",
    seasonal: "year-round",
    includes: [
      "Everything in standard cleaning, plus:",
      "Inside oven, fridge, and dishwasher",
      "Behind and under all appliances",
      "Light fixture and ceiling fan cleaning",
      "Baseboard and door frame deep scrub",
      "Cabinet fronts and hardware cleaning",
    ],
    whatToExpect: "Team of 2-3 cleaners spends 4-6 hours doing an intensive clean of every surface. Think spring cleaning on steroids.",
    whyItMatters: "Twice-yearly deep cleans tackle the grime that regular cleaning misses - inside appliances, behind furniture, and high-touch surfaces.",
  },
  {
    id: "window-washing",
    name: "Window Washing",
    description: "Interior and exterior window cleaning",
    category: "indoor",
    icon: "Sun",
    basePrice: 185,
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
    basePrice: 235,
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
  {
    id: "dryer-vent-cleaning",
    name: "Dryer Vent Cleaning",
    description: "Full dryer vent line cleaning and lint removal",
    category: "indoor",
    icon: "Wind",
    basePrice: 135,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "year-round",
    includes: [
      "Full vent line cleaning from dryer to exterior",
      "Lint trap deep cleaning",
      "Airflow measurement before and after",
      "Exterior vent cap inspection",
      "Fire hazard assessment",
    ],
    whatToExpect: "Technician disconnects the dryer, runs a rotary brush through the entire vent line, and vacuums all debris. Takes 30-60 minutes.",
    whyItMatters: "Clogged dryer vents cause 15,000+ house fires per year. Annual cleaning also cuts drying time and energy costs by 25%.",
  },
  {
    id: "air-duct-cleaning",
    name: "Air Duct Cleaning",
    description: "Full HVAC ductwork cleaning and sanitization",
    category: "indoor",
    icon: "Fan",
    basePrice: 395,
    frequency: "biannual",
    frequencyLabel: "Every 2 years",
    seasonal: "year-round",
    includes: [
      "Complete supply and return duct cleaning",
      "Register and grille cleaning",
      "Main trunk line cleaning",
      "Antimicrobial treatment",
      "Before/after photos of ductwork",
    ],
    whatToExpect: "NADCA-certified crew uses truck-mounted vacuum and agitation tools to clean your entire duct system. 3-5 hours for most homes.",
    whyItMatters: "Duct cleaning removes dust, pet dander, mold spores, and allergens from your air supply - improving air quality and HVAC efficiency.",
  },

  // ========== SYSTEMS & MAINTENANCE ==========
  {
    id: "hvac-tuneup",
    name: "HVAC Tune-Up",
    description: "Furnace and AC inspection, cleaning, and filter replacement",
    category: "maintenance",
    icon: "Thermometer",
    basePrice: 155,
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
    description: "Full system check, leak detection, and water heater flush",
    category: "maintenance",
    icon: "Wrench",
    basePrice: 185,
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
    description: "Panel inspection, outlet testing, smoke/CO detector check",
    category: "maintenance",
    icon: "Zap",
    basePrice: 175,
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
  {
    id: "garage-door-tuneup",
    name: "Garage Door Tune-Up",
    description: "Lubrication, balance test, safety sensor check, and adjustment",
    category: "maintenance",
    icon: "DoorOpen",
    basePrice: 155,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "year-round",
    includes: [
      "Full hardware lubrication",
      "Spring tension and balance test",
      "Safety sensor alignment check",
      "Weatherstrip inspection",
      "Opener motor and chain inspection",
      "Track alignment adjustment",
    ],
    whatToExpect: "Technician lubricates all moving parts, tests spring balance, verifies safety sensors, and adjusts as needed. 30-45 minutes per door.",
    whyItMatters: "A properly maintained garage door lasts 20+ years. Neglected springs and cables can snap, causing injury or trapping vehicles.",
  },
  {
    id: "water-heater-service",
    name: "Water Heater Service",
    description: "Tank flush, anode rod check, and efficiency inspection",
    category: "maintenance",
    icon: "Flame",
    basePrice: 145,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "year-round",
    includes: [
      "Full tank flush and sediment removal",
      "Anode rod inspection (replacement if needed)",
      "T&P valve safety test",
      "Thermostat calibration",
      "Leak and corrosion inspection",
      "Efficiency assessment",
    ],
    whatToExpect: "Licensed plumber drains and flushes the tank, inspects the anode rod, tests safety valves, and checks for any issues. 45-60 minutes.",
    whyItMatters: "Annual flushing removes sediment that reduces efficiency and shortens tank life. A $145 service prevents a $1,500 replacement.",
  },
  {
    id: "chimney-sweep",
    name: "Chimney Sweep & Inspection",
    description: "Creosote removal, flue inspection, and cap check",
    category: "maintenance",
    icon: "Heater",
    basePrice: 225,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "year-round",
    includes: [
      "Full creosote and soot removal",
      "Flue liner inspection",
      "Chimney cap and crown check",
      "Damper operation test",
      "Smoke chamber inspection",
      "Written condition report",
    ],
    whatToExpect: "Certified chimney sweep cleans the entire flue, inspects all components with camera as needed, and provides a detailed report. 60-90 minutes.",
    whyItMatters: "Creosote buildup is the leading cause of chimney fires. Annual sweeping is required by most home insurance policies.",
  },
  {
    id: "appliance-maintenance",
    name: "Appliance Maintenance",
    description: "Annual tune-up for washer, dryer, dishwasher, and fridge",
    category: "maintenance",
    icon: "Refrigerator",
    basePrice: 195,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "year-round",
    includes: [
      "Refrigerator coil cleaning and temp check",
      "Dishwasher spray arm and filter cleaning",
      "Washing machine hose and seal inspection",
      "Dryer lint path cleaning",
      "Level and vibration check on all units",
      "Written condition report",
    ],
    whatToExpect: "Technician services all major appliances in a single visit, cleaning components, checking hoses, and identifying wear. 90 minutes to 2 hours.",
    whyItMatters: "Regular maintenance extends appliance life 3-5 years, prevents water damage from failed hoses, and keeps everything running efficiently.",
  },
  {
    id: "sump-pump-maintenance",
    name: "Sump Pump Maintenance",
    description: "Testing, cleaning, and backup battery check",
    category: "maintenance",
    icon: "Gauge",
    basePrice: 115,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "year-round",
    includes: [
      "Pump operation test with water",
      "Pit cleaning and debris removal",
      "Float switch test and adjustment",
      "Check valve inspection",
      "Backup battery test (if applicable)",
      "Discharge line inspection",
    ],
    whatToExpect: "Technician tests the pump by filling the pit, cleans all components, tests the float switch and check valve, and verifies the discharge line is clear.",
    whyItMatters: "A failed sump pump during heavy rain means a flooded basement. Annual testing ensures it works when you need it most.",
  },

  // ========== SPECIALTY ==========
  {
    id: "pest-control",
    name: "Pest Control",
    description: "Quarterly treatment for ants, wasps, rodents, and more",
    category: "specialty",
    icon: "Bug",
    basePrice: 125,
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
    description: "Minor repairs, fixture installation, caulking, and more",
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
    description: "Interior touch-ups, accent walls, exterior trim painting",
    category: "specialty",
    icon: "Paintbrush",
    basePrice: 375,
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
  {
    id: "hot-tub-pool",
    name: "Hot Tub & Pool Maintenance",
    description: "Chemical balancing, filter cleaning, and seasonal open/close",
    category: "specialty",
    icon: "LifeBuoy",
    basePrice: 165,
    frequency: "monthly",
    frequencyLabel: "Monthly (seasonal)",
    seasonal: "summer",
    includes: [
      "Water chemistry testing and balancing",
      "Filter cleaning or replacement",
      "Skimmer and pump basket cleaning",
      "Surface brushing and vacuuming",
      "Equipment inspection",
      "Seasonal opening and closing",
    ],
    whatToExpect: "Technician tests and balances water chemistry, cleans filters and baskets, brushes surfaces, and inspects all equipment. 45-60 minutes per visit.",
    whyItMatters: "Proper chemical balance prevents algae, protects equipment, and keeps water safe. Neglected pools cost thousands to restore.",
  },
  {
    id: "exterior-caulking",
    name: "Exterior Caulking & Weatherproofing",
    description: "Window, door, and siding caulking plus weatherstrip replacement",
    category: "specialty",
    icon: "Shield",
    basePrice: 195,
    frequency: "annual",
    frequencyLabel: "1x per year",
    seasonal: "year-round",
    includes: [
      "Full exterior caulk inspection",
      "Removal of old/cracked caulking",
      "Application of premium exterior caulk",
      "Window and door frame sealing",
      "Weatherstrip replacement as needed",
      "Siding gap and trim sealing",
    ],
    whatToExpect: "Technician inspects all exterior joints, removes failed caulk, and applies fresh sealant around windows, doors, trim, and siding gaps. 2-4 hours.",
    whyItMatters: "Failed caulking lets water into walls, causing rot and mold. Also reduces heating/cooling costs by 10-15% by sealing air leaks.",
  },
  {
    id: "junk-removal",
    name: "Junk Removal & Hauling",
    description: "Garage cleanout, yard waste removal, and donation runs",
    category: "specialty",
    icon: "Trash2",
    basePrice: 175,
    frequency: "biannual",
    frequencyLabel: "2x per year",
    seasonal: "year-round",
    includes: [
      "Up to 1/4 truck load per visit",
      "Heavy item lifting and carrying",
      "Responsible disposal and recycling",
      "Donation drop-off for reusable items",
      "Yard waste and debris removal",
      "Post-removal sweep and cleanup",
    ],
    whatToExpect: "Crew arrives with a truck, loads everything you want gone, and hauls it away. Items in good condition are donated. Everything else is responsibly disposed of.",
    whyItMatters: "Regular decluttering prevents garage and storage overwhelm. Professional hauling handles heavy, awkward items you can't move yourself.",
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
  "tree-shrub-trimming": [
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "garden-maintenance": [
    { value: "biweekly", label: "Bi-weekly", multiplier: 14 },
    { value: "monthly", label: "Monthly", multiplier: 7 },
    { value: "quarterly", label: "Quarterly", multiplier: 3 },
  ],
  "irrigation-maintenance": [
    { value: "biannual", label: "Startup + winterization", multiplier: 2 },
    { value: "quarterly", label: "Quarterly checks", multiplier: 4 },
    { value: "annual", label: "Winterization only", multiplier: 1 },
  ],
  "deck-fence-staining": [
    { value: "annual", label: "Once a year", multiplier: 1 },
    { value: "biannual", label: "Every 2 years", multiplier: 0.5 },
  ],
  "driveway-sealing": [
    { value: "annual", label: "Every year", multiplier: 1 },
    { value: "biannual", label: "Every 2 years", multiplier: 0.5 },
  ],
  "roof-cleaning": [
    { value: "annual", label: "Once a year", multiplier: 1 },
    { value: "biannual", label: "Every 2 years", multiplier: 0.5 },
  ],
  "house-cleaning": [
    { value: "weekly", label: "Weekly", multiplier: 52 },
    { value: "biweekly", label: "Bi-weekly", multiplier: 26 },
    { value: "monthly", label: "Monthly", multiplier: 12 },
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
  ],
  "deep-cleaning": [
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
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
  "dryer-vent-cleaning": [
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "air-duct-cleaning": [
    { value: "annual", label: "Every year", multiplier: 1 },
    { value: "biannual", label: "Every 2 years", multiplier: 0.5 },
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
  "garage-door-tuneup": [
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "water-heater-service": [
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "chimney-sweep": [
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "appliance-maintenance": [
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
  ],
  "sump-pump-maintenance": [
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
  "hot-tub-pool": [
    { value: "biweekly", label: "Bi-weekly", multiplier: 14 },
    { value: "monthly", label: "Monthly", multiplier: 7 },
    { value: "quarterly", label: "Quarterly", multiplier: 3 },
  ],
  "exterior-caulking": [
    { value: "annual", label: "Once a year", multiplier: 1 },
    { value: "biannual", label: "Every 2 years", multiplier: 0.5 },
  ],
  "junk-removal": [
    { value: "quarterly", label: "Quarterly", multiplier: 4 },
    { value: "biannual", label: "Twice a year", multiplier: 2 },
    { value: "annual", label: "Once a year", multiplier: 1 },
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
    name: "Essentials",
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
    name: "Complete",
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
      "tree-shrub-trimming",
      "hvac-tuneup",
      "house-cleaning",
      "window-washing",
      "pest-control",
      "handyman",
      "plumbing-inspection",
      "electrical-inspection",
      "pressure-washing",
      "painting",
      "dryer-vent-cleaning",
      "appliance-maintenance",
    ],
    features: [
      "Everything in Fundamentals, plus:",
      "Lawn fertilization program",
      "Tree & shrub trimming",
      "Annual plumbing inspection",
      "Annual electrical safety check",
      "Annual pressure washing",
      "6 hours of handyman work",
      "Painting touch-ups",
      "Dryer vent cleaning",
      "Appliance maintenance",
      "48-hour priority booking",
      "Dedicated account manager",
    ],
    bestFor: "Homeowners who want the ultimate care package",
  },
];
