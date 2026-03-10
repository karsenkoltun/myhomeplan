export interface CityData {
  slug: string;
  name: string;
  region: string;
  population: string;
  description: string;
  coordinates: { lat: number; lng: number };
  highlights: string[];
  commonHomeTypes: string[];
  seasonalNotes: string;
  nearbyAreas: string[];
}

export const CITIES: CityData[] = [
  {
    slug: "kelowna",
    name: "Kelowna",
    region: "Central Okanagan",
    population: "150,000+",
    description:
      "As the largest city in the Okanagan Valley, Kelowna homeowners face unique maintenance challenges from hot summers, cold winters, and wildfire seasons. From lakefront properties to suburban homes in Glenmore, Rutland, and Mission, we provide comprehensive home maintenance coverage.",
    coordinates: { lat: 49.888, lng: -119.496 },
    highlights: [
      "Largest service coverage area in the Okanagan",
      "Same-day service available for most requests",
      "Specialized lakefront property maintenance",
      "Wildfire season property protection services",
    ],
    commonHomeTypes: [
      "Single-family detached",
      "Townhomes",
      "Condos",
      "Lakefront properties",
    ],
    seasonalNotes:
      "Kelowna's hot, dry summers mean irrigation maintenance and wildfire prep are essential. Winters bring moderate snowfall requiring regular removal.",
    nearbyAreas: ["West Kelowna", "Lake Country", "Peachland"],
  },
  {
    slug: "west-kelowna",
    name: "West Kelowna",
    region: "Central Okanagan",
    population: "36,000+",
    description:
      "West Kelowna's hillside neighborhoods, orchards, and growing subdivisions need reliable year-round maintenance. From Westbank to Lakeview Heights, our contractors know the unique terrain and maintenance needs of West Kelowna homes.",
    coordinates: { lat: 49.8625, lng: -119.5833 },
    highlights: [
      "Hillside property specialists",
      "Orchard-area maintenance expertise",
      "Growing community with new construction services",
      "Wildfire interface zone protection",
    ],
    commonHomeTypes: [
      "Single-family detached",
      "Townhomes",
      "Acreages",
      "New construction",
    ],
    seasonalNotes:
      "West Kelowna's hillside properties face extra wind exposure and wildfire risk. Steep driveways need priority snow removal.",
    nearbyAreas: ["Kelowna", "Peachland", "Summerland"],
  },
  {
    slug: "vernon",
    name: "Vernon",
    region: "North Okanagan",
    population: "44,000+",
    description:
      "Vernon experiences the Okanagan's coldest winters and most snowfall, making year-round maintenance essential. From downtown character homes to newer subdivisions in Predator Ridge and Okanagan Landing, we keep Vernon homes protected.",
    coordinates: { lat: 50.267, lng: -119.272 },
    highlights: [
      "Heavy snowfall area - priority snow removal",
      "Experienced with older heritage homes",
      "Coverage from Coldstream to Okanagan Landing",
      "Agricultural property maintenance available",
    ],
    commonHomeTypes: [
      "Single-family detached",
      "Heritage homes",
      "Townhomes",
      "Rural properties",
    ],
    seasonalNotes:
      "Vernon gets the most snow in the Okanagan. Snow removal, ice dam prevention, and furnace maintenance are critical winter services.",
    nearbyAreas: ["Lake Country", "Coldstream", "Armstrong"],
  },
  {
    slug: "penticton",
    name: "Penticton",
    region: "South Okanagan",
    population: "37,000+",
    description:
      "Nestled between Okanagan and Skaha Lakes, Penticton's warm climate and active outdoor lifestyle mean homeowners need reliable maintenance to enjoy their free time. Our local contractors serve from Naramata to Skaha Estates.",
    coordinates: { lat: 49.4991, lng: -119.5937 },
    highlights: [
      "Beach community property specialists",
      "Mild winters mean more outdoor maintenance focus",
      "Wine country property expertise",
      "Retirement community focused services",
    ],
    commonHomeTypes: [
      "Single-family detached",
      "Condos",
      "Retirement homes",
      "Vineyard properties",
    ],
    seasonalNotes:
      "Penticton's mild winters mean less snow removal but more year-round landscaping. Summer tourism season means scheduling around vacation plans.",
    nearbyAreas: ["Summerland", "Naramata", "Kaleden"],
  },
  {
    slug: "lake-country",
    name: "Lake Country",
    region: "Central Okanagan",
    population: "15,000+",
    description:
      "Lake Country's mix of established neighborhoods, orchards, and lakefront properties in Oyama, Carr's Landing, and Winfield need maintenance that understands rural and suburban needs alike.",
    coordinates: { lat: 50.074, lng: -119.414 },
    highlights: [
      "Lakefront and rural property expertise",
      "Orchard community maintenance",
      "Serving Oyama, Winfield, and Carr's Landing",
      "Well water and septic system knowledge",
    ],
    commonHomeTypes: [
      "Single-family detached",
      "Lakefront homes",
      "Acreages",
      "Orchard properties",
    ],
    seasonalNotes:
      "Lake Country gets a mix of Kelowna and Vernon weather. Properties with large lots need comprehensive outdoor maintenance.",
    nearbyAreas: ["Kelowna", "Vernon", "Oyama"],
  },
  {
    slug: "summerland",
    name: "Summerland",
    region: "South Okanagan",
    population: "12,000+",
    description:
      "Summerland's charming downtown, orchard properties, and growing residential areas need maintenance that respects the community's character. Our contractors serve from Trout Creek to Prairie Valley.",
    coordinates: { lat: 49.6006, lng: -119.6778 },
    highlights: [
      "Small-town service with big-city quality",
      "Orchard and vineyard property maintenance",
      "Heritage home specialists",
      "Community-focused contractors",
    ],
    commonHomeTypes: [
      "Single-family detached",
      "Heritage homes",
      "Orchard properties",
      "Townhomes",
    ],
    seasonalNotes:
      "Summerland's microclimate is ideal for gardening but means more landscaping maintenance. Moderate winters with occasional heavy snow.",
    nearbyAreas: ["Penticton", "Peachland", "West Kelowna"],
  },
  {
    slug: "peachland",
    name: "Peachland",
    region: "Central Okanagan",
    population: "5,600+",
    description:
      "Peachland's steep hillside neighborhoods and lakefront properties present unique maintenance challenges. Our contractors are experienced with the terrain, from Beach Avenue to Trepanier Bench.",
    coordinates: { lat: 49.77, lng: -119.735 },
    highlights: [
      "Steep terrain specialists",
      "Lakefront property maintenance",
      "Intimate community with dedicated contractors",
      "Wildfire interface zone expertise",
    ],
    commonHomeTypes: [
      "Single-family detached",
      "Lakefront homes",
      "Hillside properties",
    ],
    seasonalNotes:
      "Peachland's steep slopes make snow removal challenging and wildfire prep essential. Lake-effect weather creates unique maintenance needs.",
    nearbyAreas: ["West Kelowna", "Summerland", "Kelowna"],
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find((city) => city.slug === slug);
}

export function getCityFAQs(
  city: CityData
): Array<{ question: string; answer: string }> {
  return CITY_FAQS[city.slug] || [];
}

// City-specific FAQs optimized for local SEO
const CITY_FAQS: Record<
  string,
  Array<{ question: string; answer: string }>
> = {
  kelowna: [
    {
      question:
        "What home maintenance services does My Home Plan offer in Kelowna?",
      answer:
        "My Home Plan offers 32 professional home maintenance services in Kelowna, including lawn mowing, snow removal, HVAC tune-ups, house cleaning, gutter cleaning, pressure washing, pest control, plumbing inspections, electrical safety checks, and more. All services are bundled into one affordable monthly plan starting at $89/month.",
    },
    {
      question: "How does wildfire season affect home maintenance in Kelowna?",
      answer:
        "Kelowna's wildfire season (typically June through September) requires proactive property preparation. My Home Plan includes wildfire-ready services like vegetation management around your home's perimeter, gutter cleaning to remove dry debris, roof cleaning to prevent ember ignition, and ensuring your irrigation system is functioning properly to keep your property's green space well-watered.",
    },
    {
      question:
        "Do you service lakefront properties in Kelowna and the Mission area?",
      answer:
        "Yes, we service all Kelowna neighborhoods including lakefront properties in the Mission, Lakeshore Road area, and Abbott Street. Our contractors are experienced with the unique maintenance needs of waterfront homes, including dock-area cleanup, erosion-aware landscaping, and handling the additional moisture exposure these properties face.",
    },
    {
      question:
        "What does snow removal look like in Kelowna with My Home Plan?",
      answer:
        "Kelowna averages 15-25 significant snowfall events per winter. Our snow removal service includes driveway plowing within 4 hours of snowfall, walkway clearing, de-icing salt application, and mailbox/entrance access. Service runs November through March and is included in all plans. We prioritize early morning clearing so you can get to work on time.",
    },
    {
      question:
        "Can I customize my home maintenance plan for my Kelowna property?",
      answer:
        "Absolutely. While we offer three standard plans (Essentials from $89/mo, Complete from $159/mo, and Premium from $249/mo), you can use our Plan Builder to select exactly the services your Kelowna home needs. Property size, lot size, and the specific services you choose all factor into your personalized monthly price.",
    },
  ],
  "west-kelowna": [
    {
      question:
        "Does My Home Plan serve all neighborhoods in West Kelowna?",
      answer:
        "Yes, we provide full service coverage across West Kelowna, including Westbank, Lakeview Heights, Shannon Lake, Smith Creek, Rose Valley, Glenrosa, and all surrounding areas. Our contractors live and work in West Kelowna, so they understand the unique terrain and maintenance challenges of each neighborhood.",
    },
    {
      question:
        "How do you handle steep driveways for snow removal in West Kelowna?",
      answer:
        "West Kelowna's hillside neighborhoods are known for steep driveways that become hazardous in winter. Our snow removal crews use specialized equipment for steep grades, apply heavy-duty de-icing treatment, and prioritize steep driveways for early morning clearing. We also offer sand/gravel application for extra traction on icy slopes.",
    },
    {
      question:
        "What wildfire preparation services are available for West Kelowna homes?",
      answer:
        "West Kelowna sits in a wildfire interface zone, making fire preparation critical. Our services include creating defensible space around your home, removing dead vegetation and pine needles from your property, cleaning gutters of flammable debris, trimming tree branches away from structures, and ensuring your irrigation system is running efficiently during fire season.",
    },
    {
      question:
        "Do you work with new construction homes in West Kelowna?",
      answer:
        "Yes, we service many new construction homes in West Kelowna's growing developments like Shannon Lake and Smith Creek. New homes often need initial landscaping maintenance setup, builder-warranty-aware HVAC servicing, and establishing a proper maintenance schedule from day one to protect your investment.",
    },
    {
      question:
        "How much does home maintenance cost in West Kelowna?",
      answer:
        "Our plans start at $89/month for the Essentials plan (lawn care, snow removal, seasonal cleanup, and gutter cleaning). The Complete plan at $159/month adds HVAC, cleaning, window washing, pest control, and handyman hours. Premium at $249/month covers virtually everything. Final pricing depends on your property and lot size. Use our Plan Builder for an instant quote.",
    },
  ],
  vernon: [
    {
      question:
        "How does My Home Plan handle Vernon's heavy snowfall?",
      answer:
        "Vernon receives the most snowfall in the Okanagan, averaging 100+ cm per winter. Our Vernon snow removal service includes priority response after every significant snowfall, driveway plowing, walkway clearing, de-icing, and mailbox access. We have dedicated Vernon-based crews ready to deploy 24/7 from November through March. Ice dam prevention and roof snow removal are also available.",
    },
    {
      question:
        "Do you service heritage homes in downtown Vernon?",
      answer:
        "Yes, our contractors have extensive experience with Vernon's character and heritage homes. We understand that older homes need extra care with their original features, unique heating systems, and aging infrastructure. Our plumbing, electrical, and HVAC inspections are especially important for heritage properties that may have outdated systems.",
    },
    {
      question:
        "What areas around Vernon does My Home Plan cover?",
      answer:
        "We serve all of Vernon proper plus Coldstream, Okanagan Landing, Bella Vista, Predator Ridge, and the surrounding area. Whether you live in a lakeside home at Okanagan Landing or a rural property in Coldstream, our contractors cover the full North Okanagan service area.",
    },
    {
      question:
        "Is furnace maintenance especially important in Vernon?",
      answer:
        "Absolutely. Vernon's colder winters mean your furnace works harder and longer than in other Okanagan cities. Our biannual HVAC tune-ups include thorough furnace inspection, filter replacement, heat exchanger check, CO testing, and thermostat calibration. Regular maintenance prevents mid-winter breakdowns and can reduce your heating bills by 15-25%.",
    },
    {
      question:
        "Can My Home Plan help with agricultural property maintenance in Vernon?",
      answer:
        "Yes, we support rural and agricultural properties in the Vernon area. Our services can be adapted for larger lots, including extensive lawn and garden maintenance, irrigation system management, tree and shrub care for orchard boundaries, and general property upkeep. Contact us to discuss your property's specific needs.",
    },
  ],
  penticton: [
    {
      question:
        "What home maintenance services are most popular in Penticton?",
      answer:
        "Penticton homeowners tend to prioritize landscaping and outdoor maintenance due to the mild climate. Year-round lawn care, garden bed maintenance, tree trimming, and irrigation services are extremely popular. Indoor services like house cleaning and HVAC tune-ups are also in high demand, especially for retirement-age homeowners who want hassle-free home care.",
    },
    {
      question:
        "Does My Home Plan serve Naramata and the Penticton bench?",
      answer:
        "Yes, we cover all of Penticton and the surrounding area, including Naramata, Skaha Estates, Wiltse, the Penticton Bench, Sage Mesa, and Kaleden. Our contractors are based locally and familiar with every neighborhood in the South Okanagan.",
    },
    {
      question:
        "How does Penticton's mild climate affect maintenance needs?",
      answer:
        "Penticton's mild winters mean less snow removal compared to Kelowna or Vernon, but more year-round outdoor maintenance is needed. Gardens grow longer into the fall, lawns may need attention into November, and the hot summers put extra demand on irrigation systems and HVAC cooling. Our plans are flexible to match Penticton's unique seasonal patterns.",
    },
    {
      question:
        "Do you offer services for vacation or rental properties in Penticton?",
      answer:
        "Yes, we serve many vacation and short-term rental properties in Penticton. We can coordinate maintenance around booking schedules, handle turnover cleaning, and ensure your rental property stays in top condition year-round. Property managers and Airbnb hosts find our bundled plans especially valuable for consistent property care.",
    },
    {
      question:
        "What does a home maintenance plan cost for a typical Penticton home?",
      answer:
        "For a typical 2,000-2,500 sq ft home in Penticton, plans start at $89/month for essentials (lawn, snow, seasonal cleanup, gutters). The Complete plan runs about $159/month and covers most indoor and outdoor needs. Use our Plan Builder for an instant personalized quote based on your property's size and the services you want.",
    },
  ],
  "lake-country": [
    {
      question:
        "Does My Home Plan serve all communities within Lake Country?",
      answer:
        "Yes, we provide full service coverage across all Lake Country communities, including Winfield, Oyama, Carr's Landing, Okanagan Centre, and all areas in between. Our contractors are familiar with both the suburban and rural properties that make up Lake Country.",
    },
    {
      question:
        "Do you have experience with large rural properties in Lake Country?",
      answer:
        "Absolutely. Lake Country has many acreage and rural properties that need specialized maintenance. Our crews handle large lots with ride-on mowers, manage extensive irrigation systems, maintain orchard borders, and service well water and septic systems. Property and lot size multipliers in our pricing ensure you pay fairly for your property's actual needs.",
    },
    {
      question:
        "What seasonal maintenance challenges are unique to Lake Country?",
      answer:
        "Lake Country sits between Kelowna and Vernon's climate zones, getting moderate snowfall and warm summers. Lakefront properties face extra moisture, wind exposure, and dock-area maintenance needs. Large lots require more extensive lawn care, and the orchard-heavy area means dealing with fruit tree debris, pest control, and irrigation management throughout the growing season.",
    },
    {
      question:
        "Can you maintain lakefront properties on Kalamalka or Wood Lake?",
      answer:
        "Yes, we service lakefront properties on Kalamalka Lake, Wood Lake, and Okanagan Lake within Lake Country. Our contractors handle the specific needs of waterfront homes, including shoreline-area landscaping, additional moisture protection, dock-adjacent maintenance, and the enhanced gutter cleaning that lakeside properties often require.",
    },
    {
      question:
        "How do I get started with My Home Plan in Lake Country?",
      answer:
        "Getting started takes about 5 minutes. Use our Plan Builder to select your services, enter your property details, and get an instant monthly price. You can also choose from our Essentials ($89/mo), Complete ($159/mo), or Premium ($249/mo) plans. Once you sign up, we handle everything - scheduling, contractor coordination, and quality checks.",
    },
  ],
  summerland: [
    {
      question:
        "What makes Summerland's home maintenance needs different?",
      answer:
        "Summerland's microclimate is one of the warmest in the Okanagan, which means longer growing seasons, more landscaping maintenance, and unique gardening opportunities. Many Summerland properties include orchard trees, vineyards, or large gardens that need specialized care. The town's heritage homes also require maintenance approaches that respect their character.",
    },
    {
      question:
        "Do you service orchard and vineyard properties in Summerland?",
      answer:
        "Yes, we serve many orchard and vineyard properties in Summerland. While we focus on residential home maintenance (not commercial orchard management), we handle the residential aspects including property landscaping around orchards, irrigation system maintenance, driveway and walkway upkeep, and all standard home services.",
    },
    {
      question:
        "What areas of Summerland does My Home Plan cover?",
      answer:
        "We cover all of Summerland, including Trout Creek, Prairie Valley, Lower Town, Upper Summerland, Garnet Valley, and the surrounding residential areas. Our contractors are local to the South Okanagan and provide reliable, consistent service across the entire district.",
    },
    {
      question:
        "How does winter maintenance work in Summerland?",
      answer:
        "Summerland gets moderate snowfall compared to Vernon or Kelowna - typically 5-15 significant snow events per winter. Our snow removal service covers your driveway, walkways, and entrances after each snowfall, with de-icing included. For properties on Summerland's hillier streets, we prioritize early clearing for safety.",
    },
    {
      question:
        "Are My Home Plan's contractors local to Summerland?",
      answer:
        "Yes, we prioritize matching you with contractors who live and work in the Summerland/South Okanagan area. This means faster response times, familiarity with local conditions, and contractors who care about the community they serve. All our contractors are vetted, insured, and background-checked.",
    },
  ],
  peachland: [
    {
      question:
        "How does My Home Plan handle Peachland's steep terrain?",
      answer:
        "Peachland's steep hillside properties require contractors who understand the terrain. Our crews use specialized equipment for steep-grade snow removal, hillside landscaping, and erosion-conscious property maintenance. We assign contractors who are experienced with Peachland's unique topography, from Beach Avenue to Trepanier Bench.",
    },
    {
      question:
        "What wildfire preparation does My Home Plan offer in Peachland?",
      answer:
        "Peachland is in a high-risk wildfire interface zone. Our wildfire preparation services include creating and maintaining defensible space, clearing dry vegetation and pine needles, cleaning gutters of flammable debris, trimming branches within 2 meters of structures, and ensuring your sprinkler and irrigation systems are operational during fire season.",
    },
    {
      question:
        "Do you service lakefront properties along Okanagan Lake in Peachland?",
      answer:
        "Absolutely. We serve lakefront homes all along Peachland's Okanagan Lake shoreline. These properties often need enhanced gutter maintenance due to lake moisture, specialized landscaping that handles the lakeshore microclimate, and extra attention to exterior surfaces that face increased weathering from lake winds.",
    },
    {
      question:
        "Is it more expensive to get home maintenance in a smaller community like Peachland?",
      answer:
        "No. Our pricing is based on your property size and the services you select, not your location within our service area. Peachland homeowners pay the same rates as Kelowna or Penticton homeowners for the same property size. Plans start at $89/month for essentials, regardless of which Okanagan city you live in.",
    },
    {
      question:
        "What services do Peachland homeowners use most?",
      answer:
        "The most popular services among Peachland homeowners are snow removal (the steep terrain makes it essential), gutter cleaning, wildfire-prep vegetation management, tree and shrub trimming, and HVAC maintenance. Many Peachland homeowners also add house cleaning and handyman hours to their plans for full coverage.",
    },
  ],
};
