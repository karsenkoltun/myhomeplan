import {
  SERVICES,
  FREQUENCY_MULTIPLIERS,
  PLAN_DISCOUNTS,
  type PlanInterval,
  type Service,
} from "@/data/services";
import { type ServiceSpecs } from "@/stores/property-store";

// Enhanced pricing that takes into account detailed specs
export function calculateServicePrice(
  service: Service,
  homeSqft: number,
  lotSqft: number,
  specs?: Record<string, string | number | boolean>
): number {
  const isOutdoor = service.category === "outdoor";
  let baseCost = service.basePrice;

  // Size-based multiplier
  const refSize = isOutdoor ? lotSqft : homeSqft;
  const refBase = isOutdoor ? 5000 : 1500;
  const sizeMultiplier = Math.max(0.7, Math.min(2.5, refSize / refBase));

  // Spec-based adjustments
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
    }
  }

  // Handyman uses hourly bank calculation
  if (service.id === "handyman") {
    return (baseCost * specMultiplier) / 12;
  }

  const annualFrequency = FREQUENCY_MULTIPLIERS[service.frequency];
  const annualCost = baseCost * sizeMultiplier * specMultiplier * annualFrequency;
  return annualCost / 12;
}

export function calculatePlanTotal(
  selectedServiceIds: string[],
  homeSqft: number,
  lotSqft: number,
  interval: PlanInterval,
  serviceSpecs: ServiceSpecs = {}
) {
  const items = SERVICES.filter((s) => selectedServiceIds.includes(s.id)).map(
    (service) => ({
      service,
      monthlyPrice: calculateServicePrice(
        service,
        homeSqft,
        lotSqft,
        serviceSpecs[service.id]
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
