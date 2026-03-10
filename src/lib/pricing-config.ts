import { createClient } from "./supabase/client";

// ============================================================
// Pricing Config - DB-driven multipliers with hardcoded fallbacks
// Fetches all pricing config from Supabase once, caches in memory.
// Every numeric value in the pricing engine is editable in the DB.
// ============================================================

export interface PricingAdjustment {
  category: string;
  service_id: string;
  adjustment_key: string;
  adjustment_value: number;
  label: string;
}

export interface SizeMultiplierTier {
  label: string;
  min_sqft: number;
  max_sqft: number;
  multiplier: number;
  multiplier_type: "property_size" | "lot_size";
}

export interface FrequencyMultiplier {
  frequency: string;
  annual_events: number;
}

export interface PlanDiscount {
  interval: string;
  label: string;
  discount: number;
  description: string;
}

export interface PlatformConfigEntry {
  key: string;
  value: string | number;
}

export interface PricingConfig {
  adjustments: PricingAdjustment[];
  sizeMultipliers: SizeMultiplierTier[];
  frequencyMultipliers: FrequencyMultiplier[];
  planDiscounts: PlanDiscount[];
  platformConfig: Record<string, number | string>;
  loaded: boolean;
}

// In-memory cache
let _cache: PricingConfig | null = null;
let _loading: Promise<PricingConfig> | null = null;

// ---- DEFAULTS (used as fallback if DB fails) ----

const DEFAULT_PLATFORM_CONFIG: Record<string, number | string> = {
  contractor_margin: 0.25,
  comparison_markup: 1.25,
  size_multiplier_min: 0.7,
  size_multiplier_max: 2.5,
  size_base_indoor_sqft: 1500,
  size_base_outdoor_sqft: 5000,
  handyman_base_hours: 4,
  strata_plan_discount_monthly: 0,
  strata_plan_discount_quarterly: 0.05,
  strata_plan_discount_annual: 0.12,
  strata_discount_50_units: 0.1,
  strata_discount_100_units: 0.15,
};

const DEFAULT_FREQUENCY_MULTIPLIERS: Record<string, number> = {
  weekly: 30,
  biweekly: 15,
  monthly: 12,
  quarterly: 4,
  biannual: 2,
  annual: 1,
  seasonal: 20,
  "as-needed": 1,
};

const DEFAULT_PLAN_DISCOUNTS: Record<string, { label: string; discount: number; description: string }> = {
  monthly: { label: "Monthly", discount: 0, description: "Pay as you go" },
  quarterly: { label: "Quarterly", discount: 0.05, description: "Save 5%" },
  annual: { label: "Annual", discount: 0.15, description: "Save 15% - Best value" },
};

// Default adjustment values keyed as "category:service_id:key"
const DEFAULT_ADJUSTMENTS: Record<string, number> = {
  // Property detail - lawn mowing
  "property_detail:lawn-mowing:landscaping_extensive": 1.2,
  "property_detail:lawn-mowing:landscaping_minimal": 0.85,
  "property_detail:lawn-mowing:garden_beds_threshold": 3,
  "property_detail:lawn-mowing:garden_beds_per_bed": 0.03,
  "property_detail:lawn-mowing:has_irrigation": 1.05,
  // Property detail - lawn fertilization
  "property_detail:lawn-fertilization:landscaping_extensive": 1.2,
  "property_detail:lawn-fertilization:landscaping_minimal": 0.85,
  "property_detail:lawn-fertilization:garden_beds_threshold": 3,
  "property_detail:lawn-fertilization:garden_beds_per_bed": 0.03,
  // Property detail - spring/fall cleanup
  "property_detail:spring-fall-cleanup:per_mature_tree": 0.08,
  "property_detail:spring-fall-cleanup:per_garden_bed": 0.04,
  "property_detail:spring-fall-cleanup:deck_patio_max": 0.15,
  "property_detail:spring-fall-cleanup:deck_patio_divisor": 3000,
  "property_detail:spring-fall-cleanup:landscaping_extensive": 1.25,
  "property_detail:spring-fall-cleanup:landscaping_minimal": 0.75,
  // Property detail - snow removal
  "property_detail:snow-removal:driveway_long": 1.4,
  "property_detail:snow-removal:driveway_short": 0.75,
  "property_detail:snow-removal:driveway_gravel": 1.15,
  "property_detail:snow-removal:driveway_pavers": 1.1,
  "property_detail:snow-removal:has_garage": 1.05,
  // Property detail - gutter cleaning
  "property_detail:gutter-cleaning:per_mature_tree": 0.06,
  "property_detail:gutter-cleaning:roof_metal": 1.1,
  "property_detail:gutter-cleaning:roof_tile": 1.15,
  "property_detail:gutter-cleaning:floors_above_2": 1.3,
  // Property detail - pressure washing
  "property_detail:pressure-washing:stucco": 1.1,
  "property_detail:pressure-washing:wood_siding": 1.15,
  "property_detail:pressure-washing:brick": 1.1,
  "property_detail:pressure-washing:deck_patio_max": 0.3,
  "property_detail:pressure-washing:deck_patio_divisor": 1500,
  "property_detail:pressure-washing:deck_patio_threshold": 200,
  "property_detail:pressure-washing:driveway_concrete": 1.05,
  "property_detail:pressure-washing:driveway_pavers": 1.15,
  // Property detail - house cleaning
  "property_detail:house-cleaning:bathrooms_threshold": 2,
  "property_detail:house-cleaning:per_extra_bathroom": 0.08,
  "property_detail:house-cleaning:bedrooms_threshold": 3,
  "property_detail:house-cleaning:per_extra_bedroom": 0.05,
  "property_detail:house-cleaning:floors_above_2": 1.1,
  "property_detail:house-cleaning:has_pets": 1.1,
  // Property detail - window washing
  "property_detail:window-washing:window_count_base": 10,
  "property_detail:window-washing:window_count_min": 0.6,
  "property_detail:window-washing:window_count_max": 2.5,
  "property_detail:window-washing:per_extra_floor": 0.2,
  // Property detail - carpet cleaning
  "property_detail:carpet-cleaning:bedrooms_threshold": 3,
  "property_detail:carpet-cleaning:per_extra_bedroom": 0.1,
  "property_detail:carpet-cleaning:has_pets": 1.15,
  // Property detail - hvac tuneup
  "property_detail:hvac-tuneup:heat_pump": 1.1,
  "property_detail:hvac-tuneup:boiler": 1.15,
  "property_detail:hvac-tuneup:has_ac": 1.4,
  "property_detail:hvac-tuneup:large_home_threshold": 2500,
  "property_detail:hvac-tuneup:large_home": 1.1,
  // Property detail - plumbing inspection
  "property_detail:plumbing-inspection:bathrooms_threshold": 2,
  "property_detail:plumbing-inspection:per_extra_bathroom": 0.12,
  "property_detail:plumbing-inspection:home_age_30plus": 1.25,
  "property_detail:plumbing-inspection:home_age_15plus": 1.1,
  "property_detail:plumbing-inspection:foundation_crawlspace": 1.1,
  "property_detail:plumbing-inspection:foundation_basement": 1.15,
  // Property detail - electrical inspection
  "property_detail:electrical-inspection:home_age_30plus": 1.3,
  "property_detail:electrical-inspection:home_age_15plus": 1.1,
  "property_detail:electrical-inspection:floors_above_2": 1.15,
  // Property detail - pest control
  "property_detail:pest-control:foundation_crawlspace": 1.2,
  "property_detail:pest-control:mature_trees_threshold": 5,
  "property_detail:pest-control:mature_trees_above": 1.1,
  "property_detail:pest-control:garden_beds_threshold": 3,
  "property_detail:pest-control:garden_beds_above": 1.05,
  "property_detail:pest-control:has_pool": 1.1,
  // Property detail - painting
  "property_detail:painting:wood_siding": 1.2,
  "property_detail:painting:stucco": 1.1,
  "property_detail:painting:fence_wood_divisor": 500,
  "property_detail:painting:fence_wood_max": 0.3,
  "property_detail:painting:floors_above_2": 1.25,
  // Property detail - tree & shrub trimming
  "property_detail:tree-shrub-trimming:per_mature_tree": 0.1,
  "property_detail:tree-shrub-trimming:landscaping_extensive": 1.3,
  "property_detail:tree-shrub-trimming:landscaping_minimal": 0.7,
  // Property detail - garden maintenance
  "property_detail:garden-maintenance:per_garden_bed": 0.1,
  "property_detail:garden-maintenance:garden_bed_sqft_divisor": 500,
  "property_detail:garden-maintenance:garden_bed_sqft_max": 0.5,
  "property_detail:garden-maintenance:landscaping_extensive": 1.3,
  "property_detail:garden-maintenance:landscaping_minimal": 0.7,
  // Property detail - irrigation maintenance
  "property_detail:irrigation-maintenance:has_irrigation": 1.0,
  // Property detail - deck & fence staining
  "property_detail:deck-fence-staining:deck_patio_divisor": 200,
  "property_detail:deck-fence-staining:deck_patio_max": 1.0,
  "property_detail:deck-fence-staining:fence_wood_divisor": 200,
  "property_detail:deck-fence-staining:fence_wood_max": 0.6,
  // Property detail - driveway sealing
  "property_detail:driveway-sealing:driveway_long": 1.4,
  "property_detail:driveway-sealing:driveway_short": 0.7,
  "property_detail:driveway-sealing:driveway_gravel": 0, // not applicable for gravel
  "property_detail:driveway-sealing:driveway_pavers": 1.15,
  // Property detail - roof cleaning
  "property_detail:roof-cleaning:roof_metal": 0.85,
  "property_detail:roof-cleaning:roof_tile": 1.2,
  "property_detail:roof-cleaning:floors_above_2": 1.2,
  // Property detail - deep cleaning
  "property_detail:deep-cleaning:bathrooms_threshold": 2,
  "property_detail:deep-cleaning:per_extra_bathroom": 0.1,
  "property_detail:deep-cleaning:bedrooms_threshold": 3,
  "property_detail:deep-cleaning:per_extra_bedroom": 0.06,
  "property_detail:deep-cleaning:floors_above_2": 1.15,
  "property_detail:deep-cleaning:has_pets": 1.15,
  // Property detail - air duct cleaning
  "property_detail:air-duct-cleaning:large_home_threshold": 2500,
  "property_detail:air-duct-cleaning:large_home": 1.2,
  "property_detail:air-duct-cleaning:floors_above_2": 1.15,
  // Property detail - water heater service
  "property_detail:water-heater-service:tankless": 1.2,
  "property_detail:water-heater-service:age_10plus": 1.15,
  // Property detail - chimney sweep
  "property_detail:chimney-sweep:floors_above_2": 1.15,
  // Property detail - sump pump maintenance
  "property_detail:sump-pump-maintenance:foundation_basement": 1.0,
  "property_detail:sump-pump-maintenance:foundation_crawlspace": 1.1,
  // Property detail - hot tub & pool
  "property_detail:hot-tub-pool:has_pool": 1.0,
  // Property detail - exterior caulking
  "property_detail:exterior-caulking:window_count_base": 10,
  "property_detail:exterior-caulking:per_extra_window_group": 0.05,
  "property_detail:exterior-caulking:floors_above_2": 1.2,
  "property_detail:exterior-caulking:wood_siding": 1.15,
  "property_detail:exterior-caulking:stucco": 1.1,
  // Spec - lawn mowing
  "spec:lawn-mowing:terrain_slope": 1.15,
  "spec:lawn-mowing:terrain_steep": 1.3,
  "spec:lawn-mowing:obstacles_per_5": 0.05,
  // Spec - snow removal
  "spec:snow-removal:base_driveway_area": 360,
  "spec:snow-removal:min_area_multiplier": 0.8,
  "spec:snow-removal:salting": 1.15,
  "spec:snow-removal:slope_steep": 1.2,
  // Spec - house cleaning
  "spec:house-cleaning:deep_clean": 1.4,
  "spec:house-cleaning:has_pets": 1.1,
  "spec:house-cleaning:bathrooms_threshold": 2,
  "spec:house-cleaning:per_extra_bathroom": 0.08,
  // Spec - window washing
  "spec:window-washing:base_window_count": 15,
  "spec:window-washing:per_extra_story": 0.25,
  "spec:window-washing:exterior_only": 0.65,
  // Spec - gutter cleaning
  "spec:gutter-cleaning:base_linear_feet": 150,
  "spec:gutter-cleaning:heavy_debris": 1.25,
  // Spec - hvac tuneup
  "spec:hvac-tuneup:dual_system": 1.5,
  // Spec - pest control
  "spec:pest-control:active_infestation": 1.6,
  "spec:pest-control:comprehensive_pests": 1.3,
  // Spec - handyman
  "spec:handyman:base_hours": 4,
  // Spec - painting
  "spec:painting:scope_rooms": 1.5,
  "spec:painting:scope_exterior_trim": 1.8,
  "spec:painting:scope_full_exterior": 3.0,
  "spec:painting:prep_needed": 1.2,
  // Spec - carpet cleaning
  "spec:carpet-cleaning:base_sqft": 800,
  "spec:carpet-cleaning:stain_moderate": 1.15,
  "spec:carpet-cleaning:stain_heavy": 1.3,
  // Spec - spring/fall cleanup
  "spec:spring-fall-cleanup:per_tree": 0.06,
  "spec:spring-fall-cleanup:per_garden_bed": 0.04,
};

// ---- FETCH & CACHE ----

export async function loadPricingConfig(): Promise<PricingConfig> {
  // Return cache if fresh
  if (_cache?.loaded) return _cache;

  // Deduplicate concurrent calls
  if (_loading) return _loading;

  _loading = _fetchAll();
  const result = await _loading;
  _loading = null;
  return result;
}

async function _fetchAll(): Promise<PricingConfig> {
  const supabase = createClient();

  try {
    const [adjRes, sizeRes, freqRes, discRes, platRes] = await Promise.all([
      supabase.from("pricing_adjustments").select("*"),
      supabase.from("pricing_multipliers").select("*").order("sort_order"),
      supabase.from("frequency_multiplier_config").select("*"),
      supabase.from("plan_discount_config").select("*"),
      supabase.from("platform_config").select("*"),
    ]);

    const config: PricingConfig = {
      adjustments: (adjRes.data ?? []) as PricingAdjustment[],
      sizeMultipliers: (sizeRes.data ?? []).map((r: Record<string, unknown>) => ({
        label: r.label as string,
        min_sqft: r.min_sqft as number,
        max_sqft: r.max_sqft as number,
        multiplier: Number(r.multiplier),
        multiplier_type: r.multiplier_type as "property_size" | "lot_size",
      })),
      frequencyMultipliers: (freqRes.data ?? []).map((r: Record<string, unknown>) => ({
        frequency: r.frequency as string,
        annual_events: r.annual_events as number,
      })),
      planDiscounts: (discRes.data ?? []).map((r: Record<string, unknown>) => ({
        interval: r.interval as string,
        label: r.label as string,
        discount: Number(r.discount),
        description: (r.description ?? "") as string,
      })),
      platformConfig: {},
      loaded: true,
    };

    // Parse platform_config into a flat record
    for (const row of (platRes.data ?? []) as { key: string; value: unknown }[]) {
      if (typeof row.value === "number") {
        config.platformConfig[row.key] = row.value;
      } else if (typeof row.value === "string") {
        const parsed = parseFloat(row.value);
        config.platformConfig[row.key] = Number.isFinite(parsed) ? parsed : row.value;
      } else {
        try {
          const parsed = JSON.parse(String(row.value));
          config.platformConfig[row.key] = typeof parsed === "number" ? parsed : String(row.value);
        } catch {
          config.platformConfig[row.key] = row.value as string;
        }
      }
    }

    _cache = config;
    return config;
  } catch {
    // DB failed - return defaults
    console.warn("[pricing-config] Failed to fetch from DB, using hardcoded defaults");
    return _buildDefaults();
  }
}

function _buildDefaults(): PricingConfig {
  return {
    adjustments: Object.entries(DEFAULT_ADJUSTMENTS).map(([key, value]) => {
      const [category, service_id, adjustment_key] = key.split(":");
      return { category, service_id, adjustment_key, adjustment_value: value, label: "" };
    }),
    sizeMultipliers: [
      { label: "Under 1,000 sq ft", min_sqft: 0, max_sqft: 999, multiplier: 0.8, multiplier_type: "property_size" },
      { label: "1,000 - 2,000 sq ft", min_sqft: 1000, max_sqft: 1999, multiplier: 1.0, multiplier_type: "property_size" },
      { label: "2,000 - 3,000 sq ft", min_sqft: 2000, max_sqft: 2999, multiplier: 1.2, multiplier_type: "property_size" },
      { label: "3,000 - 4,000 sq ft", min_sqft: 3000, max_sqft: 3999, multiplier: 1.4, multiplier_type: "property_size" },
      { label: "4,000+ sq ft", min_sqft: 4000, max_sqft: 999999, multiplier: 1.6, multiplier_type: "property_size" },
      { label: "Under 3,000 sq ft", min_sqft: 0, max_sqft: 2999, multiplier: 0.8, multiplier_type: "lot_size" },
      { label: "3,000 - 6,000 sq ft", min_sqft: 3000, max_sqft: 5999, multiplier: 1.0, multiplier_type: "lot_size" },
      { label: "6,000 - 10,000 sq ft", min_sqft: 6000, max_sqft: 9999, multiplier: 1.3, multiplier_type: "lot_size" },
      { label: "10,000 - 20,000 sq ft", min_sqft: 10000, max_sqft: 19999, multiplier: 1.6, multiplier_type: "lot_size" },
      { label: "20,000+ sq ft", min_sqft: 20000, max_sqft: 999999, multiplier: 2.0, multiplier_type: "lot_size" },
    ],
    frequencyMultipliers: Object.entries(DEFAULT_FREQUENCY_MULTIPLIERS).map(([frequency, annual_events]) => ({
      frequency,
      annual_events,
    })),
    planDiscounts: Object.entries(DEFAULT_PLAN_DISCOUNTS).map(([interval, d]) => ({
      interval,
      ...d,
    })),
    platformConfig: { ...DEFAULT_PLATFORM_CONFIG },
    loaded: true,
  };
}

// ---- HELPER ACCESSORS ----

/** Get a specific adjustment value with fallback */
export function getAdj(config: PricingConfig, category: string, serviceId: string, key: string): number {
  const row = config.adjustments.find(
    (a) => a.category === category && a.service_id === serviceId && a.adjustment_key === key
  );
  if (row) return Number(row.adjustment_value);
  return DEFAULT_ADJUSTMENTS[`${category}:${serviceId}:${key}`] ?? 1;
}

/** Get property detail adjustment */
export function pd(config: PricingConfig, serviceId: string, key: string): number {
  return getAdj(config, "property_detail", serviceId, key);
}

/** Get spec adjustment */
export function sp(config: PricingConfig, serviceId: string, key: string): number {
  return getAdj(config, "spec", serviceId, key);
}

/** Get platform config value */
export function pc(config: PricingConfig, key: string): number {
  const val = config.platformConfig[key];
  if (val !== undefined) return Number(val);
  const def = DEFAULT_PLATFORM_CONFIG[key];
  return typeof def === "number" ? def : parseFloat(String(def)) || 0;
}

/** Get frequency multiplier */
export function getFrequencyEvents(config: PricingConfig, frequency: string): number {
  const row = config.frequencyMultipliers.find((f) => f.frequency === frequency);
  return row?.annual_events ?? DEFAULT_FREQUENCY_MULTIPLIERS[frequency] ?? 1;
}

/** Get plan discount */
export function getPlanDiscount(config: PricingConfig, interval: string): number {
  const row = config.planDiscounts.find((d) => d.interval === interval);
  return row?.discount ?? DEFAULT_PLAN_DISCOUNTS[interval]?.discount ?? 0;
}

/** Get size multiplier tier for a given sqft */
export function getSizeMultiplier(
  config: PricingConfig,
  sqft: number,
  type: "property_size" | "lot_size"
): number {
  const tiers = config.sizeMultipliers.filter((t) => t.multiplier_type === type);
  const tier = tiers.find((t) => sqft >= t.min_sqft && sqft <= t.max_sqft);
  return tier?.multiplier ?? 1.0;
}

/** Force refresh cached config */
export function invalidatePricingConfig(): void {
  _cache = null;
  _loading = null;
}
