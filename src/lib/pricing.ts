import {
  SERVICES,
  FREQUENCY_MULTIPLIERS,
  SERVICE_FREQUENCY_OPTIONS,
  PLAN_DISCOUNTS,
  type PlanInterval,
  type Service,
  type ServiceFrequency,
} from "@/data/services";
import { type PropertyProfile, type ServiceSpecs } from "@/stores/property-store";

// Property-aware pricing that uses ALL home details
export function calculateServicePrice(
  service: Service,
  homeSqft: number,
  lotSqft: number,
  specs?: Record<string, string | number | boolean>,
  property?: PropertyProfile,
  customFrequency?: ServiceFrequency
): number {
  const isOutdoor = service.category === "outdoor";
  let baseCost = service.basePrice;

  // Size-based multiplier
  const refSize = isOutdoor ? lotSqft : homeSqft;
  const refBase = isOutdoor ? 5000 : 1500;
  const sizeMultiplier = Math.max(0.7, Math.min(2.5, refSize / refBase));

  // Property-detail multipliers (applied when property data is available)
  let propertyMultiplier = 1;

  if (property) {
    switch (service.id) {
      case "lawn-mowing":
      case "lawn-fertilization": {
        // Landscaping complexity
        if (property.landscapingComplexity === "extensive") propertyMultiplier *= 1.2;
        else if (property.landscapingComplexity === "minimal") propertyMultiplier *= 0.85;
        // Garden beds add to mowing complexity (mowing around them)
        if (property.gardenBeds > 3) propertyMultiplier *= 1 + (property.gardenBeds - 3) * 0.03;
        // Irrigation means healthier/thicker grass - grows faster
        if (property.hasIrrigation && service.id === "lawn-mowing") propertyMultiplier *= 1.05;
        break;
      }
      case "spring-fall-cleanup": {
        // Mature trees are a HUGE factor
        propertyMultiplier *= 1 + property.matureTrees * 0.08;
        // Garden beds need cleanup
        if (property.gardenBeds > 0) propertyMultiplier *= 1 + property.gardenBeds * 0.04;
        // Deck/patio needs clearing
        if (property.deckPatioSqft > 0) propertyMultiplier *= 1 + Math.min(0.15, property.deckPatioSqft / 3000);
        // Landscaping complexity
        if (property.landscapingComplexity === "extensive") propertyMultiplier *= 1.25;
        else if (property.landscapingComplexity === "minimal") propertyMultiplier *= 0.75;
        break;
      }
      case "snow-removal": {
        // Driveway length
        const drivewayMultiplier = property.drivewayLength === "long" ? 1.4 : property.drivewayLength === "short" ? 0.75 : 1;
        propertyMultiplier *= drivewayMultiplier;
        // Driveway material affects ease
        if (property.drivewayMaterial === "gravel") propertyMultiplier *= 1.15;
        if (property.drivewayMaterial === "pavers") propertyMultiplier *= 1.1;
        // Walkways and stairs from garage
        if (property.hasGarage) propertyMultiplier *= 1.05;
        break;
      }
      case "gutter-cleaning": {
        // Mature trees = more debris
        propertyMultiplier *= 1 + property.matureTrees * 0.06;
        // Roof type affects gutter access
        if (property.roofType === "metal") propertyMultiplier *= 1.1;
        if (property.roofType === "tile") propertyMultiplier *= 1.15;
        // Floors/stories affect ladder work
        if (property.floors > 2) propertyMultiplier *= 1.3;
        break;
      }
      case "pressure-washing": {
        // Exterior material affects approach
        if (property.exteriorMaterial === "stucco") propertyMultiplier *= 1.1;
        if (property.exteriorMaterial === "wood") propertyMultiplier *= 1.15;
        if (property.exteriorMaterial === "brick") propertyMultiplier *= 1.1;
        // Deck/patio area
        if (property.deckPatioSqft > 200) propertyMultiplier *= 1 + Math.min(0.3, (property.deckPatioSqft - 200) / 1500);
        // Driveway material
        if (property.drivewayMaterial === "concrete") propertyMultiplier *= 1.05;
        if (property.drivewayMaterial === "pavers") propertyMultiplier *= 1.15;
        break;
      }
      case "house-cleaning": {
        // Bathrooms above 2 add cost
        if (property.bathrooms > 2) propertyMultiplier *= 1 + (property.bathrooms - 2) * 0.08;
        // Bedrooms above 3 add cost
        if (property.bedrooms > 3) propertyMultiplier *= 1 + (property.bedrooms - 3) * 0.05;
        // Multiple floors
        if (property.floors > 2) propertyMultiplier *= 1.1;
        // Pets
        if (property.hasPets) propertyMultiplier *= 1.1;
        break;
      }
      case "window-washing": {
        // Window count
        const windowMult = property.windowCount / 10;
        propertyMultiplier *= Math.max(0.6, Math.min(2.5, windowMult));
        // Stories
        if (property.floors > 1) propertyMultiplier *= 1 + (property.floors - 1) * 0.2;
        break;
      }
      case "carpet-cleaning": {
        // More bedrooms = more carpet
        if (property.bedrooms > 3) propertyMultiplier *= 1 + (property.bedrooms - 3) * 0.1;
        // Pets
        if (property.hasPets) propertyMultiplier *= 1.15;
        break;
      }
      case "hvac-tuneup": {
        // Heating type
        if (property.heatingType === "heat-pump") propertyMultiplier *= 1.1;
        if (property.heatingType === "boiler") propertyMultiplier *= 1.15;
        // Has AC means dual system
        if (property.hasAC) propertyMultiplier *= 1.4;
        // Larger homes = bigger systems
        if (homeSqft > 2500) propertyMultiplier *= 1.1;
        break;
      }
      case "plumbing-inspection": {
        // Bathrooms
        if (property.bathrooms > 2) propertyMultiplier *= 1 + (property.bathrooms - 2) * 0.12;
        // Year built - older homes need more inspection
        const homeAge = new Date().getFullYear() - property.yearBuilt;
        if (homeAge > 30) propertyMultiplier *= 1.25;
        else if (homeAge > 15) propertyMultiplier *= 1.1;
        // Foundation type
        if (property.foundation === "crawlspace") propertyMultiplier *= 1.1;
        if (property.foundation === "basement") propertyMultiplier *= 1.15;
        break;
      }
      case "electrical-inspection": {
        // Year built
        const elecAge = new Date().getFullYear() - property.yearBuilt;
        if (elecAge > 30) propertyMultiplier *= 1.3;
        else if (elecAge > 15) propertyMultiplier *= 1.1;
        // Floors
        if (property.floors > 2) propertyMultiplier *= 1.15;
        break;
      }
      case "pest-control": {
        // Foundation type
        if (property.foundation === "crawlspace") propertyMultiplier *= 1.2;
        // Mature trees attract pests
        if (property.matureTrees > 5) propertyMultiplier *= 1.1;
        // Garden beds attract pests
        if (property.gardenBeds > 3) propertyMultiplier *= 1.05;
        // Pool areas attract mosquitoes etc.
        if (property.hasPool) propertyMultiplier *= 1.1;
        break;
      }
      case "painting": {
        // Exterior material
        if (property.exteriorMaterial === "wood") propertyMultiplier *= 1.2;
        if (property.exteriorMaterial === "stucco") propertyMultiplier *= 1.1;
        // Fence painting
        if (property.fenceType === "wood" && property.fenceLinearFeet > 0) {
          propertyMultiplier *= 1 + Math.min(0.3, property.fenceLinearFeet / 500);
        }
        // Stories
        if (property.floors > 2) propertyMultiplier *= 1.25;
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
        if (terrain === "slope") specMultiplier *= 1.15;
        if (terrain === "steep") specMultiplier *= 1.3;
        const obstacles = (specs.obstacles as number) || 0;
        specMultiplier *= 1 + Math.floor(obstacles / 5) * 0.05;
        break;
      }
      case "snow-removal": {
        const area = ((specs.drivewayLength as number) || 30) * ((specs.drivewayWidth as number) || 12);
        specMultiplier *= Math.max(0.8, area / 360);
        if (specs.salting) specMultiplier *= 1.15;
        if (specs.slope === "steep") specMultiplier *= 1.2;
        break;
      }
      case "house-cleaning": {
        if (specs.cleanType === "deep") specMultiplier *= 1.4;
        if (specs.hasPets) specMultiplier *= 1.1;
        const baths = (specs.bathrooms as number) || 2;
        if (baths > 2) specMultiplier *= 1 + (baths - 2) * 0.08;
        break;
      }
      case "window-washing": {
        const windows = (specs.windowCount as number) || 15;
        specMultiplier *= windows / 15;
        const stories = (specs.stories as number) || 2;
        if (stories > 1) specMultiplier *= 1 + (stories - 1) * 0.25;
        if (specs.scope === "exterior") specMultiplier *= 0.65;
        break;
      }
      case "gutter-cleaning": {
        const linearFt = (specs.linearFeet as number) || 150;
        specMultiplier *= linearFt / 150;
        if (specs.debrisLevel === "heavy") specMultiplier *= 1.25;
        break;
      }
      case "hvac-tuneup": {
        const sysType = specs.systemType as string;
        if (sysType === "furnace-ac" || sysType === "heatpump-ac") specMultiplier *= 1.5;
        const units = (specs.unitCount as number) || 1;
        specMultiplier *= units;
        break;
      }
      case "pest-control": {
        if (specs.treatmentType === "active") specMultiplier *= 1.6;
        if (specs.targetPests === "comprehensive") specMultiplier *= 1.3;
        break;
      }
      case "handyman": {
        const hours = (specs.hours as number) || 4;
        baseCost = service.basePrice * hours / 4;
        break;
      }
      case "painting": {
        if (specs.scope === "rooms") specMultiplier *= 1.5;
        if (specs.scope === "exterior-trim") specMultiplier *= 1.8;
        if (specs.scope === "full-exterior") specMultiplier *= 3;
        if (specs.prepNeeded) specMultiplier *= 1.2;
        break;
      }
      case "carpet-cleaning": {
        const carpetSqft = (specs.carpetSqft as number) || 800;
        specMultiplier *= carpetSqft / 800;
        if (specs.stainLevel === "moderate") specMultiplier *= 1.15;
        if (specs.stainLevel === "heavy") specMultiplier *= 1.3;
        break;
      }
      case "spring-fall-cleanup": {
        const treeCount = (specs.treeCount as number) || 0;
        specMultiplier *= 1 + treeCount * 0.06;
        const beds = (specs.gardenBeds as number) || 0;
        specMultiplier *= 1 + beds * 0.04;
        break;
      }
    }
  }

  // Determine frequency (custom override or default)
  const effectiveFrequency = customFrequency || service.frequency;
  const frequencyOptions = SERVICE_FREQUENCY_OPTIONS[service.id];
  const customOption = frequencyOptions?.find((o) => o.value === effectiveFrequency);
  const annualFrequency = customOption?.multiplier ?? FREQUENCY_MULTIPLIERS[effectiveFrequency];

  // Handyman uses hourly bank calculation
  if (service.id === "handyman") {
    return (baseCost * specMultiplier * propertyMultiplier) / 12;
  }

  const annualCost = baseCost * sizeMultiplier * propertyMultiplier * specMultiplier * annualFrequency;
  return annualCost / 12;
}

export function calculatePlanTotal(
  selectedServiceIds: string[],
  homeSqft: number,
  lotSqft: number,
  interval: PlanInterval,
  serviceSpecs: ServiceSpecs = {},
  property?: PropertyProfile,
  serviceFrequencies: Record<string, ServiceFrequency> = {}
) {
  const items = SERVICES.filter((s) => selectedServiceIds.includes(s.id)).map(
    (service) => ({
      service,
      monthlyPrice: calculateServicePrice(
        service,
        homeSqft,
        lotSqft,
        serviceSpecs[service.id],
        property,
        serviceFrequencies[service.id]
      ),
    })
  );

  const subtotal = items.reduce((sum, item) => sum + item.monthlyPrice, 0);
  const discount = PLAN_DISCOUNTS[interval].discount;
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;
  const withoutPlan = subtotal * 1.25;
  const annualSavings = (withoutPlan - total) * 12;

  return { items, subtotal, discount, discountAmount, total, withoutPlan, annualSavings };
}
