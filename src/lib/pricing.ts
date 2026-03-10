import {
  SERVICES,
  SERVICE_FREQUENCY_OPTIONS,
  type PlanInterval,
  type Service,
  type ServiceFrequency,
} from "@/data/services";
import { type PropertyProfile, type ServiceSpecs } from "@/stores/property-store";
import {
  type PricingConfig,
  pd,
  sp,
  pc,
  getFrequencyEvents,
  getPlanDiscount,
  loadPricingConfig,
} from "./pricing-config";

// ============================================================
// Property-aware pricing engine
// ALL numeric multipliers come from the PricingConfig (DB-driven).
// If the DB is unavailable, hardcoded defaults are used.
// ============================================================

/** Safely convert any value to a finite number, defaulting to fallback */
function n(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

/** Safe division - returns fallback if divisor is 0 or NaN */
function safeDiv(numerator: number, denominator: number, fallback = 1): number {
  const num = n(numerator);
  const den = n(denominator);
  if (den === 0) return fallback;
  const result = num / den;
  return Number.isFinite(result) ? result : fallback;
}

export function calculateServicePrice(
  service: Service,
  homeSqft: number,
  lotSqft: number,
  specs?: Record<string, string | number | boolean>,
  property?: PropertyProfile,
  customFrequency?: ServiceFrequency,
  config?: PricingConfig
): number {
  // Use a sync fallback config if none provided
  // (callers should pre-load via loadPricingConfig() and pass it in)
  const cfg = config ?? _syncDefaults();

  const isOutdoor = service.category === "outdoor";
  let baseCost = n(service.basePrice, 1);

  // Size-based multiplier
  const refSize = n(isOutdoor ? lotSqft : homeSqft, isOutdoor ? 5000 : 1500);
  const refBase = pc(cfg, isOutdoor ? "size_base_outdoor_sqft" : "size_base_indoor_sqft") || 1;
  const sizeMultiplier = Math.max(
    pc(cfg, "size_multiplier_min"),
    Math.min(pc(cfg, "size_multiplier_max"), refSize / refBase)
  );

  // Property-detail multipliers (applied when property data is available)
  let propertyMultiplier = 1;

  if (property) {
    switch (service.id) {
      case "lawn-mowing":
      case "lawn-fertilization": {
        if (property.landscapingComplexity === "extensive")
          propertyMultiplier *= pd(cfg, service.id, "landscaping_extensive");
        else if (property.landscapingComplexity === "minimal")
          propertyMultiplier *= pd(cfg, service.id, "landscaping_minimal");

        const bedThreshold = pd(cfg, service.id, "garden_beds_threshold");
        const gardenBeds = n(property.gardenBeds);
        if (gardenBeds > bedThreshold)
          propertyMultiplier *= 1 + (gardenBeds - bedThreshold) * pd(cfg, service.id, "garden_beds_per_bed");

        if (property.hasIrrigation && service.id === "lawn-mowing")
          propertyMultiplier *= pd(cfg, "lawn-mowing", "has_irrigation");
        break;
      }
      case "spring-fall-cleanup": {
        propertyMultiplier *= 1 + n(property.matureTrees) * pd(cfg, service.id, "per_mature_tree");
        if (n(property.gardenBeds) > 0)
          propertyMultiplier *= 1 + n(property.gardenBeds) * pd(cfg, service.id, "per_garden_bed");
        if (n(property.deckPatioSqft) > 0) {
          const divisor = pd(cfg, service.id, "deck_patio_divisor") || 1;
          propertyMultiplier *= 1 + Math.min(
            pd(cfg, service.id, "deck_patio_max"),
            n(property.deckPatioSqft) / divisor
          );
        }
        if (property.landscapingComplexity === "extensive")
          propertyMultiplier *= pd(cfg, service.id, "landscaping_extensive");
        else if (property.landscapingComplexity === "minimal")
          propertyMultiplier *= pd(cfg, service.id, "landscaping_minimal");
        break;
      }
      case "snow-removal": {
        const drivewayMult = property.drivewayLength === "long"
          ? pd(cfg, service.id, "driveway_long")
          : property.drivewayLength === "short"
            ? pd(cfg, service.id, "driveway_short")
            : 1;
        propertyMultiplier *= drivewayMult;
        if (property.drivewayMaterial === "gravel")
          propertyMultiplier *= pd(cfg, service.id, "driveway_gravel");
        if (property.drivewayMaterial === "pavers")
          propertyMultiplier *= pd(cfg, service.id, "driveway_pavers");
        if (property.hasGarage)
          propertyMultiplier *= pd(cfg, service.id, "has_garage");
        break;
      }
      case "gutter-cleaning": {
        propertyMultiplier *= 1 + n(property.matureTrees) * pd(cfg, service.id, "per_mature_tree");
        if (property.roofType === "metal")
          propertyMultiplier *= pd(cfg, service.id, "roof_metal");
        if (property.roofType === "tile")
          propertyMultiplier *= pd(cfg, service.id, "roof_tile");
        if (n(property.floors) > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
        break;
      }
      case "pressure-washing": {
        if (property.exteriorMaterial === "stucco")
          propertyMultiplier *= pd(cfg, service.id, "stucco");
        if (property.exteriorMaterial === "wood")
          propertyMultiplier *= pd(cfg, service.id, "wood_siding");
        if (property.exteriorMaterial === "brick")
          propertyMultiplier *= pd(cfg, service.id, "brick");
        const deckThreshold = pd(cfg, service.id, "deck_patio_threshold");
        if (n(property.deckPatioSqft) > deckThreshold) {
          const divisor = pd(cfg, service.id, "deck_patio_divisor") || 1;
          propertyMultiplier *= 1 + Math.min(
            pd(cfg, service.id, "deck_patio_max"),
            (n(property.deckPatioSqft) - deckThreshold) / divisor
          );
        }
        if (property.drivewayMaterial === "concrete")
          propertyMultiplier *= pd(cfg, service.id, "driveway_concrete");
        if (property.drivewayMaterial === "pavers")
          propertyMultiplier *= pd(cfg, service.id, "driveway_pavers");
        break;
      }
      case "house-cleaning": {
        const bathThreshold = pd(cfg, service.id, "bathrooms_threshold");
        if (n(property.bathrooms) > bathThreshold)
          propertyMultiplier *= 1 + (n(property.bathrooms) - bathThreshold) * pd(cfg, service.id, "per_extra_bathroom");
        const bedThreshold = pd(cfg, service.id, "bedrooms_threshold");
        if (n(property.bedrooms) > bedThreshold)
          propertyMultiplier *= 1 + (n(property.bedrooms) - bedThreshold) * pd(cfg, service.id, "per_extra_bedroom");
        if (n(property.floors) > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
        if (property.hasPets)
          propertyMultiplier *= pd(cfg, service.id, "has_pets");
        break;
      }
      case "window-washing": {
        const windowBase = pd(cfg, service.id, "window_count_base") || 10;
        const windowMult = safeDiv(n(property.windowCount, 10), windowBase);
        propertyMultiplier *= Math.max(
          pd(cfg, service.id, "window_count_min"),
          Math.min(pd(cfg, service.id, "window_count_max"), windowMult)
        );
        if (n(property.floors) > 1)
          propertyMultiplier *= 1 + (n(property.floors) - 1) * pd(cfg, service.id, "per_extra_floor");
        break;
      }
      case "carpet-cleaning": {
        const bedThreshold = pd(cfg, service.id, "bedrooms_threshold");
        if (n(property.bedrooms) > bedThreshold)
          propertyMultiplier *= 1 + (n(property.bedrooms) - bedThreshold) * pd(cfg, service.id, "per_extra_bedroom");
        if (property.hasPets)
          propertyMultiplier *= pd(cfg, service.id, "has_pets");
        break;
      }
      case "hvac-tuneup": {
        if (property.heatingType === "heat-pump")
          propertyMultiplier *= pd(cfg, service.id, "heat_pump");
        if (property.heatingType === "boiler")
          propertyMultiplier *= pd(cfg, service.id, "boiler");
        if (property.hasAC)
          propertyMultiplier *= pd(cfg, service.id, "has_ac");
        if (n(homeSqft) > pd(cfg, service.id, "large_home_threshold"))
          propertyMultiplier *= pd(cfg, service.id, "large_home");
        break;
      }
      case "plumbing-inspection": {
        const bathThreshold = pd(cfg, service.id, "bathrooms_threshold");
        if (n(property.bathrooms) > bathThreshold)
          propertyMultiplier *= 1 + (n(property.bathrooms) - bathThreshold) * pd(cfg, service.id, "per_extra_bathroom");
        const homeAge = new Date().getFullYear() - n(property.yearBuilt, 2000);
        if (homeAge > 30) propertyMultiplier *= pd(cfg, service.id, "home_age_30plus");
        else if (homeAge > 15) propertyMultiplier *= pd(cfg, service.id, "home_age_15plus");
        if (property.foundation === "crawlspace")
          propertyMultiplier *= pd(cfg, service.id, "foundation_crawlspace");
        if (property.foundation === "basement")
          propertyMultiplier *= pd(cfg, service.id, "foundation_basement");
        break;
      }
      case "electrical-inspection": {
        const elecAge = new Date().getFullYear() - n(property.yearBuilt, 2000);
        if (elecAge > 30) propertyMultiplier *= pd(cfg, service.id, "home_age_30plus");
        else if (elecAge > 15) propertyMultiplier *= pd(cfg, service.id, "home_age_15plus");
        if (n(property.floors) > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
        break;
      }
      case "pest-control": {
        if (property.foundation === "crawlspace")
          propertyMultiplier *= pd(cfg, service.id, "foundation_crawlspace");
        if (n(property.matureTrees) > pd(cfg, service.id, "mature_trees_threshold"))
          propertyMultiplier *= pd(cfg, service.id, "mature_trees_above");
        if (n(property.gardenBeds) > pd(cfg, service.id, "garden_beds_threshold"))
          propertyMultiplier *= pd(cfg, service.id, "garden_beds_above");
        if (property.hasPool)
          propertyMultiplier *= pd(cfg, service.id, "has_pool");
        break;
      }
      case "painting": {
        if (property.exteriorMaterial === "wood")
          propertyMultiplier *= pd(cfg, service.id, "wood_siding");
        if (property.exteriorMaterial === "stucco")
          propertyMultiplier *= pd(cfg, service.id, "stucco");
        if (property.fenceType === "wood" && n(property.fenceLinearFeet) > 0) {
          const divisor = pd(cfg, service.id, "fence_wood_divisor") || 1;
          propertyMultiplier *= 1 + Math.min(
            pd(cfg, service.id, "fence_wood_max"),
            n(property.fenceLinearFeet) / divisor
          );
        }
        if (n(property.floors) > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
        break;
      }
      case "tree-shrub-trimming": {
        propertyMultiplier *= 1 + n(property.matureTrees) * pd(cfg, service.id, "per_mature_tree");
        if (property.landscapingComplexity === "extensive")
          propertyMultiplier *= pd(cfg, service.id, "landscaping_extensive");
        else if (property.landscapingComplexity === "minimal")
          propertyMultiplier *= pd(cfg, service.id, "landscaping_minimal");
        break;
      }
      case "garden-maintenance": {
        if (n(property.gardenBeds) > 0)
          propertyMultiplier *= 1 + n(property.gardenBeds) * pd(cfg, service.id, "per_garden_bed");
        if (n(property.gardenBedSqft) > 0) {
          const divisor = pd(cfg, service.id, "garden_bed_sqft_divisor") || 1;
          propertyMultiplier *= 1 + Math.min(
            pd(cfg, service.id, "garden_bed_sqft_max"),
            n(property.gardenBedSqft) / divisor
          );
        }
        if (property.landscapingComplexity === "extensive")
          propertyMultiplier *= pd(cfg, service.id, "landscaping_extensive");
        else if (property.landscapingComplexity === "minimal")
          propertyMultiplier *= pd(cfg, service.id, "landscaping_minimal");
        break;
      }
      case "deck-fence-staining": {
        if (n(property.deckPatioSqft) > 0) {
          const divisor = pd(cfg, service.id, "deck_patio_divisor") || 1;
          propertyMultiplier *= 1 + Math.min(
            pd(cfg, service.id, "deck_patio_max"),
            n(property.deckPatioSqft) / divisor
          );
        }
        if (property.fenceType === "wood" && n(property.fenceLinearFeet) > 0) {
          const divisor = pd(cfg, service.id, "fence_wood_divisor") || 1;
          propertyMultiplier *= 1 + Math.min(
            pd(cfg, service.id, "fence_wood_max"),
            n(property.fenceLinearFeet) / divisor
          );
        }
        break;
      }
      case "driveway-sealing": {
        const drivewayMult = property.drivewayLength === "long"
          ? pd(cfg, service.id, "driveway_long")
          : property.drivewayLength === "short"
            ? pd(cfg, service.id, "driveway_short")
            : 1;
        propertyMultiplier *= drivewayMult;
        if (property.drivewayMaterial === "gravel")
          propertyMultiplier *= pd(cfg, service.id, "driveway_gravel");
        if (property.drivewayMaterial === "pavers")
          propertyMultiplier *= pd(cfg, service.id, "driveway_pavers");
        break;
      }
      case "roof-cleaning": {
        if (property.roofType === "metal")
          propertyMultiplier *= pd(cfg, service.id, "roof_metal");
        if (property.roofType === "tile")
          propertyMultiplier *= pd(cfg, service.id, "roof_tile");
        if (n(property.floors) > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
        break;
      }
      case "deep-cleaning": {
        const bathThreshold = pd(cfg, service.id, "bathrooms_threshold");
        if (n(property.bathrooms) > bathThreshold)
          propertyMultiplier *= 1 + (n(property.bathrooms) - bathThreshold) * pd(cfg, service.id, "per_extra_bathroom");
        const bedThreshold = pd(cfg, service.id, "bedrooms_threshold");
        if (n(property.bedrooms) > bedThreshold)
          propertyMultiplier *= 1 + (n(property.bedrooms) - bedThreshold) * pd(cfg, service.id, "per_extra_bedroom");
        if (n(property.floors) > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
        if (property.hasPets)
          propertyMultiplier *= pd(cfg, service.id, "has_pets");
        break;
      }
      case "air-duct-cleaning": {
        if (n(homeSqft) > pd(cfg, service.id, "large_home_threshold"))
          propertyMultiplier *= pd(cfg, service.id, "large_home");
        if (n(property.floors) > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
        break;
      }
      case "water-heater-service": {
        if (property.waterHeaterType === "tankless")
          propertyMultiplier *= pd(cfg, service.id, "tankless");
        if (n(property.waterHeaterAge) > 10)
          propertyMultiplier *= pd(cfg, service.id, "age_10plus");
        break;
      }
      case "chimney-sweep": {
        if (n(property.floors) > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
        break;
      }
      case "sump-pump-maintenance": {
        if (property.foundation === "basement")
          propertyMultiplier *= pd(cfg, service.id, "foundation_basement");
        if (property.foundation === "crawlspace")
          propertyMultiplier *= pd(cfg, service.id, "foundation_crawlspace");
        break;
      }
      case "exterior-caulking": {
        const windowBase = pd(cfg, service.id, "window_count_base") || 10;
        const extraWindows = Math.max(0, n(property.windowCount, 10) - windowBase);
        if (extraWindows > 0)
          propertyMultiplier *= 1 + Math.floor(extraWindows / 5) * pd(cfg, service.id, "per_extra_window_group");
        if (n(property.floors) > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
        if (property.exteriorMaterial === "wood")
          propertyMultiplier *= pd(cfg, service.id, "wood_siding");
        if (property.exteriorMaterial === "stucco")
          propertyMultiplier *= pd(cfg, service.id, "stucco");
        break;
      }
    }
  }

  // Spec-based adjustments (from the customize step)
  let specMultiplier = 1;

  if (specs) {
    switch (service.id) {
      case "lawn-mowing": {
        const terrain = specs.terrain as string;
        if (terrain === "slope") specMultiplier *= sp(cfg, service.id, "terrain_slope");
        if (terrain === "steep") specMultiplier *= sp(cfg, service.id, "terrain_steep");
        const obstacles = n(specs.obstacles as number);
        specMultiplier *= 1 + Math.floor(obstacles / 5) * sp(cfg, service.id, "obstacles_per_5");
        break;
      }
      case "snow-removal": {
        const area = n(specs.drivewayLength as number, 30) * n(specs.drivewayWidth as number, 12);
        const baseArea = sp(cfg, service.id, "base_driveway_area") || 360;
        specMultiplier *= Math.max(sp(cfg, service.id, "min_area_multiplier"), area / baseArea);
        if (specs.salting) specMultiplier *= sp(cfg, service.id, "salting");
        if (specs.slope === "steep") specMultiplier *= sp(cfg, service.id, "slope_steep");
        break;
      }
      case "house-cleaning": {
        if (specs.cleanType === "deep") specMultiplier *= sp(cfg, service.id, "deep_clean");
        if (specs.hasPets) specMultiplier *= sp(cfg, service.id, "has_pets");
        const baths = n(specs.bathrooms as number, 2);
        const bathThreshold = sp(cfg, service.id, "bathrooms_threshold");
        if (baths > bathThreshold)
          specMultiplier *= 1 + (baths - bathThreshold) * sp(cfg, service.id, "per_extra_bathroom");
        break;
      }
      case "window-washing": {
        const windows = n(specs.windowCount as number, 15);
        const baseCount = sp(cfg, service.id, "base_window_count") || 15;
        specMultiplier *= windows / baseCount;
        const stories = n(specs.stories as number, 2);
        if (stories > 1) specMultiplier *= 1 + (stories - 1) * sp(cfg, service.id, "per_extra_story");
        if (specs.scope === "exterior") specMultiplier *= sp(cfg, service.id, "exterior_only");
        break;
      }
      case "gutter-cleaning": {
        const linearFt = n(specs.linearFeet as number, 150);
        const baseFt = sp(cfg, service.id, "base_linear_feet") || 150;
        specMultiplier *= linearFt / baseFt;
        if (specs.debrisLevel === "heavy") specMultiplier *= sp(cfg, service.id, "heavy_debris");
        break;
      }
      case "hvac-tuneup": {
        const sysType = specs.systemType as string;
        if (sysType === "furnace-ac" || sysType === "heatpump-ac")
          specMultiplier *= sp(cfg, service.id, "dual_system");
        const units = n(specs.unitCount as number, 1);
        specMultiplier *= units;
        break;
      }
      case "pest-control": {
        if (specs.treatmentType === "active")
          specMultiplier *= sp(cfg, service.id, "active_infestation");
        if (specs.targetPests === "comprehensive")
          specMultiplier *= sp(cfg, service.id, "comprehensive_pests");
        break;
      }
      case "handyman": {
        const hours = n(specs.hours as number, pc(cfg, "handyman_base_hours"));
        const baseHours = sp(cfg, service.id, "base_hours") || 4;
        baseCost = service.basePrice * hours / baseHours;
        break;
      }
      case "painting": {
        if (specs.scope === "rooms") specMultiplier *= sp(cfg, service.id, "scope_rooms");
        if (specs.scope === "exterior-trim") specMultiplier *= sp(cfg, service.id, "scope_exterior_trim");
        if (specs.scope === "full-exterior") specMultiplier *= sp(cfg, service.id, "scope_full_exterior");
        if (specs.prepNeeded) specMultiplier *= sp(cfg, service.id, "prep_needed");
        break;
      }
      case "carpet-cleaning": {
        const carpetSqft = n(specs.carpetSqft as number, 800);
        const baseSqft = sp(cfg, service.id, "base_sqft") || 800;
        specMultiplier *= carpetSqft / baseSqft;
        if (specs.stainLevel === "moderate") specMultiplier *= sp(cfg, service.id, "stain_moderate");
        if (specs.stainLevel === "heavy") specMultiplier *= sp(cfg, service.id, "stain_heavy");
        break;
      }
      case "spring-fall-cleanup": {
        const treeCount = n(specs.treeCount as number);
        specMultiplier *= 1 + treeCount * sp(cfg, service.id, "per_tree");
        const beds = n(specs.gardenBeds as number);
        specMultiplier *= 1 + beds * sp(cfg, service.id, "per_garden_bed");
        break;
      }
    }
  }

  // Determine frequency (custom override or default)
  const effectiveFrequency = customFrequency || service.frequency;
  const frequencyOptions = SERVICE_FREQUENCY_OPTIONS[service.id];
  const customOption = frequencyOptions?.find((o) => o.value === effectiveFrequency);
  const annualFrequency = n(customOption?.multiplier ?? getFrequencyEvents(cfg, effectiveFrequency), 1);

  // Handyman uses hourly bank calculation
  if (service.id === "handyman") {
    const result = (baseCost * specMultiplier * propertyMultiplier) / 12;
    return Number.isFinite(result) ? result : 0;
  }

  const annualCost = baseCost * sizeMultiplier * propertyMultiplier * specMultiplier * annualFrequency;
  const monthly = annualCost / 12;
  return Number.isFinite(monthly) ? monthly : 0;
}

export async function calculatePlanTotal(
  selectedServiceIds: string[],
  homeSqft: number,
  lotSqft: number,
  interval: PlanInterval,
  serviceSpecs: ServiceSpecs = {},
  property?: PropertyProfile,
  serviceFrequencies: Record<string, ServiceFrequency> = {}
) {
  const cfg = await loadPricingConfig();

  const items = SERVICES.filter((s) => selectedServiceIds.includes(s.id)).map(
    (service) => ({
      service,
      monthlyPrice: calculateServicePrice(
        service,
        homeSqft,
        lotSqft,
        serviceSpecs[service.id],
        property,
        serviceFrequencies[service.id],
        cfg
      ),
    })
  );

  const subtotal = items.reduce((sum, item) => sum + item.monthlyPrice, 0);
  const discount = getPlanDiscount(cfg, interval);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;
  const withoutPlan = subtotal * pc(cfg, "comparison_markup");
  const annualSavings = (withoutPlan - total) * 12;

  return { items, subtotal, discount, discountAmount, total, withoutPlan, annualSavings };
}

// ============================================================
// Contractor & comparison helpers
// ============================================================

/** Calculate what the contractor gets paid for a service at plan price */
export function calculateContractorPayout(planPrice: number, config?: PricingConfig): number {
  const cfg = config ?? _syncDefaults();
  return planPrice * (1 - pc(cfg, "contractor_margin"));
}

/** Calculate the individual (non-plan) comparison price */
export function calculateIndividualComparison(planPrice: number, config?: PricingConfig): number {
  const cfg = config ?? _syncDefaults();
  return planPrice * pc(cfg, "comparison_markup");
}

/** Get volume discount percentage for strata/PM based on unit count */
export function calculateVolumeDiscount(unitCount: number, config?: PricingConfig): { percent: number; label: string } | null {
  const cfg = config ?? _syncDefaults();
  const discount100 = pc(cfg, "strata_discount_100_units");
  const discount50 = pc(cfg, "strata_discount_50_units");
  if (unitCount >= 200) return { percent: discount100 * 100, label: `200+ Units: ${(discount100 * 100).toFixed(0)}% Off` };
  if (unitCount >= 100) return { percent: discount100 * 100, label: `100+ Units: ${(discount100 * 100).toFixed(0)}% Off` };
  if (unitCount >= 50) return { percent: discount50 * 100, label: `50+ Units: ${(discount50 * 100).toFixed(0)}% Off` };
  return null;
}

/** Apply volume discount to a price based on unit count */
export function applyVolumeDiscount(price: number, unitCount: number, config?: PricingConfig): number {
  const discount = calculateVolumeDiscount(unitCount, config);
  if (!discount) return price;
  return price * (1 - discount.percent / 100);
}

// Sync version for backward compatibility - uses defaults if config not loaded
function _syncDefaults(): PricingConfig {
  return {
    adjustments: [],
    sizeMultipliers: [],
    frequencyMultipliers: [],
    planDiscounts: [],
    platformConfig: {},
    loaded: false,
  };
}

// Re-export for convenience
export { loadPricingConfig } from "./pricing-config";
