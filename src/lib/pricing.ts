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
  let baseCost = service.basePrice;

  // Size-based multiplier
  const refSize = isOutdoor ? lotSqft : homeSqft;
  const refBase = isOutdoor ? pc(cfg, "size_base_outdoor_sqft") : pc(cfg, "size_base_indoor_sqft");
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
        if (property.gardenBeds > bedThreshold)
          propertyMultiplier *= 1 + (property.gardenBeds - bedThreshold) * pd(cfg, service.id, "garden_beds_per_bed");

        if (property.hasIrrigation && service.id === "lawn-mowing")
          propertyMultiplier *= pd(cfg, "lawn-mowing", "has_irrigation");
        break;
      }
      case "spring-fall-cleanup": {
        propertyMultiplier *= 1 + property.matureTrees * pd(cfg, service.id, "per_mature_tree");
        if (property.gardenBeds > 0)
          propertyMultiplier *= 1 + property.gardenBeds * pd(cfg, service.id, "per_garden_bed");
        if (property.deckPatioSqft > 0)
          propertyMultiplier *= 1 + Math.min(
            pd(cfg, service.id, "deck_patio_max"),
            property.deckPatioSqft / pd(cfg, service.id, "deck_patio_divisor")
          );
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
        propertyMultiplier *= 1 + property.matureTrees * pd(cfg, service.id, "per_mature_tree");
        if (property.roofType === "metal")
          propertyMultiplier *= pd(cfg, service.id, "roof_metal");
        if (property.roofType === "tile")
          propertyMultiplier *= pd(cfg, service.id, "roof_tile");
        if (property.floors > 2)
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
        if (property.deckPatioSqft > deckThreshold)
          propertyMultiplier *= 1 + Math.min(
            pd(cfg, service.id, "deck_patio_max"),
            (property.deckPatioSqft - deckThreshold) / pd(cfg, service.id, "deck_patio_divisor")
          );
        if (property.drivewayMaterial === "concrete")
          propertyMultiplier *= pd(cfg, service.id, "driveway_concrete");
        if (property.drivewayMaterial === "pavers")
          propertyMultiplier *= pd(cfg, service.id, "driveway_pavers");
        break;
      }
      case "house-cleaning": {
        const bathThreshold = pd(cfg, service.id, "bathrooms_threshold");
        if (property.bathrooms > bathThreshold)
          propertyMultiplier *= 1 + (property.bathrooms - bathThreshold) * pd(cfg, service.id, "per_extra_bathroom");
        const bedThreshold = pd(cfg, service.id, "bedrooms_threshold");
        if (property.bedrooms > bedThreshold)
          propertyMultiplier *= 1 + (property.bedrooms - bedThreshold) * pd(cfg, service.id, "per_extra_bedroom");
        if (property.floors > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
        if (property.hasPets)
          propertyMultiplier *= pd(cfg, service.id, "has_pets");
        break;
      }
      case "window-washing": {
        const windowBase = pd(cfg, service.id, "window_count_base");
        const windowMult = property.windowCount / windowBase;
        propertyMultiplier *= Math.max(
          pd(cfg, service.id, "window_count_min"),
          Math.min(pd(cfg, service.id, "window_count_max"), windowMult)
        );
        if (property.floors > 1)
          propertyMultiplier *= 1 + (property.floors - 1) * pd(cfg, service.id, "per_extra_floor");
        break;
      }
      case "carpet-cleaning": {
        const bedThreshold = pd(cfg, service.id, "bedrooms_threshold");
        if (property.bedrooms > bedThreshold)
          propertyMultiplier *= 1 + (property.bedrooms - bedThreshold) * pd(cfg, service.id, "per_extra_bedroom");
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
        if (homeSqft > pd(cfg, service.id, "large_home_threshold"))
          propertyMultiplier *= pd(cfg, service.id, "large_home");
        break;
      }
      case "plumbing-inspection": {
        const bathThreshold = pd(cfg, service.id, "bathrooms_threshold");
        if (property.bathrooms > bathThreshold)
          propertyMultiplier *= 1 + (property.bathrooms - bathThreshold) * pd(cfg, service.id, "per_extra_bathroom");
        const homeAge = new Date().getFullYear() - property.yearBuilt;
        if (homeAge > 30) propertyMultiplier *= pd(cfg, service.id, "home_age_30plus");
        else if (homeAge > 15) propertyMultiplier *= pd(cfg, service.id, "home_age_15plus");
        if (property.foundation === "crawlspace")
          propertyMultiplier *= pd(cfg, service.id, "foundation_crawlspace");
        if (property.foundation === "basement")
          propertyMultiplier *= pd(cfg, service.id, "foundation_basement");
        break;
      }
      case "electrical-inspection": {
        const elecAge = new Date().getFullYear() - property.yearBuilt;
        if (elecAge > 30) propertyMultiplier *= pd(cfg, service.id, "home_age_30plus");
        else if (elecAge > 15) propertyMultiplier *= pd(cfg, service.id, "home_age_15plus");
        if (property.floors > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
        break;
      }
      case "pest-control": {
        if (property.foundation === "crawlspace")
          propertyMultiplier *= pd(cfg, service.id, "foundation_crawlspace");
        if (property.matureTrees > pd(cfg, service.id, "mature_trees_threshold"))
          propertyMultiplier *= pd(cfg, service.id, "mature_trees_above");
        if (property.gardenBeds > pd(cfg, service.id, "garden_beds_threshold"))
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
        if (property.fenceType === "wood" && property.fenceLinearFeet > 0) {
          propertyMultiplier *= 1 + Math.min(
            pd(cfg, service.id, "fence_wood_max"),
            property.fenceLinearFeet / pd(cfg, service.id, "fence_wood_divisor")
          );
        }
        if (property.floors > 2)
          propertyMultiplier *= pd(cfg, service.id, "floors_above_2");
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
        const obstacles = (specs.obstacles as number) || 0;
        specMultiplier *= 1 + Math.floor(obstacles / 5) * sp(cfg, service.id, "obstacles_per_5");
        break;
      }
      case "snow-removal": {
        const area = ((specs.drivewayLength as number) || 30) * ((specs.drivewayWidth as number) || 12);
        specMultiplier *= Math.max(sp(cfg, service.id, "min_area_multiplier"), area / sp(cfg, service.id, "base_driveway_area"));
        if (specs.salting) specMultiplier *= sp(cfg, service.id, "salting");
        if (specs.slope === "steep") specMultiplier *= sp(cfg, service.id, "slope_steep");
        break;
      }
      case "house-cleaning": {
        if (specs.cleanType === "deep") specMultiplier *= sp(cfg, service.id, "deep_clean");
        if (specs.hasPets) specMultiplier *= sp(cfg, service.id, "has_pets");
        const baths = (specs.bathrooms as number) || 2;
        const bathThreshold = sp(cfg, service.id, "bathrooms_threshold");
        if (baths > bathThreshold)
          specMultiplier *= 1 + (baths - bathThreshold) * sp(cfg, service.id, "per_extra_bathroom");
        break;
      }
      case "window-washing": {
        const windows = (specs.windowCount as number) || 15;
        specMultiplier *= windows / sp(cfg, service.id, "base_window_count");
        const stories = (specs.stories as number) || 2;
        if (stories > 1) specMultiplier *= 1 + (stories - 1) * sp(cfg, service.id, "per_extra_story");
        if (specs.scope === "exterior") specMultiplier *= sp(cfg, service.id, "exterior_only");
        break;
      }
      case "gutter-cleaning": {
        const linearFt = (specs.linearFeet as number) || 150;
        specMultiplier *= linearFt / sp(cfg, service.id, "base_linear_feet");
        if (specs.debrisLevel === "heavy") specMultiplier *= sp(cfg, service.id, "heavy_debris");
        break;
      }
      case "hvac-tuneup": {
        const sysType = specs.systemType as string;
        if (sysType === "furnace-ac" || sysType === "heatpump-ac")
          specMultiplier *= sp(cfg, service.id, "dual_system");
        const units = (specs.unitCount as number) || 1;
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
        const hours = (specs.hours as number) || pc(cfg, "handyman_base_hours");
        baseCost = service.basePrice * hours / sp(cfg, service.id, "base_hours");
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
        const carpetSqft = (specs.carpetSqft as number) || 800;
        specMultiplier *= carpetSqft / sp(cfg, service.id, "base_sqft");
        if (specs.stainLevel === "moderate") specMultiplier *= sp(cfg, service.id, "stain_moderate");
        if (specs.stainLevel === "heavy") specMultiplier *= sp(cfg, service.id, "stain_heavy");
        break;
      }
      case "spring-fall-cleanup": {
        const treeCount = (specs.treeCount as number) || 0;
        specMultiplier *= 1 + treeCount * sp(cfg, service.id, "per_tree");
        const beds = (specs.gardenBeds as number) || 0;
        specMultiplier *= 1 + beds * sp(cfg, service.id, "per_garden_bed");
        break;
      }
    }
  }

  // Determine frequency (custom override or default)
  const effectiveFrequency = customFrequency || service.frequency;
  const frequencyOptions = SERVICE_FREQUENCY_OPTIONS[service.id];
  const customOption = frequencyOptions?.find((o) => o.value === effectiveFrequency);
  const annualFrequency = customOption?.multiplier ?? getFrequencyEvents(cfg, effectiveFrequency);

  // Handyman uses hourly bank calculation
  if (service.id === "handyman") {
    return (baseCost * specMultiplier * propertyMultiplier) / 12;
  }

  const annualCost = baseCost * sizeMultiplier * propertyMultiplier * specMultiplier * annualFrequency;
  return annualCost / 12;
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
