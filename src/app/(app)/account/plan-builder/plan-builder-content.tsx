"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FadeIn } from "@/components/ui/motion";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Scissors,
  Snowflake,
  Thermometer,
  Sparkles,
  Bug,
  Hammer,
  Wrench,
  Zap,
  Sprout,
  Leaf,
  Droplets,
  Waves,
  Sun,
  Paintbrush,
  ArrowRight,
  Receipt,
  TrendingDown,
  AlertTriangle,
  type LucideIcon,
  Armchair,
  ShoppingCart,
  X,
  ChevronUp,
  Check,
  Home,
  ChevronDown,
  Loader2,
  Building2,
} from "lucide-react";
import {
  SERVICES,
  SERVICE_CATEGORIES,
  PLAN_DISCOUNTS,
  type PlanInterval,
  type ServiceCategory,
} from "@/data/services";
import { calculateServicePrice, calculateIndividualComparison } from "@/lib/pricing";
import { useAuth } from "@/components/auth/auth-provider";
import { getAllProperties } from "@/lib/supabase/queries";
import type { PropertyProfile } from "@/stores/property-store";
import { cn } from "@/lib/utils";
import Link from "next/link";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Map a DB homeowner_properties row (snake_case) to the PropertyProfile interface (camelCase) */
function mapDbToPropertyProfile(row: any): PropertyProfile {
  return {
    address: row.address ?? "",
    homeSqft: row.home_sqft ?? 1500,
    lotSqft: row.lot_sqft ?? 5000,
    yearBuilt: row.year_built ?? 2000,
    homeType: row.home_type ?? "detached",
    bedrooms: row.bedrooms ?? 3,
    bathrooms: row.bathrooms ?? 2,
    floors: row.floors ?? 2,
    heatingType: row.heating_type ?? "furnace",
    hasAC: row.has_ac ?? false,
    hasGarage: row.has_garage ?? true,
    hasDriveway: row.has_driveway ?? true,
    hasDeck: row.has_deck ?? false,
    hasFence: row.has_fence ?? false,
    hasPets: row.has_pets ?? false,
    roofType: row.roof_type ?? "asphalt",
    exteriorMaterial: row.exterior_material ?? "vinyl",
    foundation: row.foundation ?? "slab",
    windowCount: row.window_count ?? 10,
    landscapingComplexity: row.landscaping_complexity ?? "moderate",
    matureTrees: row.mature_trees ?? 0,
    gardenBeds: row.garden_beds ?? 0,
    gardenBedSqft: row.garden_bed_sqft ?? 0,
    deckPatioSqft: row.deck_patio_sqft ?? 0,
    hasPool: row.has_pool ?? false,
    hasIrrigation: row.has_irrigation ?? false,
    drivewayMaterial: row.driveway_material ?? "concrete",
    drivewayLength: row.driveway_length ?? "medium",
    fenceType: row.fence_type ?? "none",
    fenceLinearFeet: row.fence_linear_feet ?? 0,
    hvacBrand: row.hvac_brand ?? "",
    hvacAge: row.hvac_age ?? 0,
    waterHeaterType: row.water_heater_type ?? "tank",
    waterHeaterAge: row.water_heater_age ?? 0,
    furnaceFilterSize: row.furnace_filter_size ?? "",
    accessInstructions: row.access_instructions ?? "",
    gateCodeExists: row.gate_code_exists ?? false,
    lockboxExists: row.lockbox_exists ?? false,
    alarmSystem: row.alarm_system ?? "",
    petDetails: row.pet_details ?? "",
    parkingInstructions: row.parking_instructions ?? "",
    preferredServiceDay: row.preferred_service_day ?? "",
    chemicalSensitivities: row.chemical_sensitivities ?? "",
    specialInstructions: row.special_instructions ?? "",
    homeInsuranceProvider: row.home_insurance_provider ?? "",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface DbProperty {
  id: string;
  address?: string | null;
  city?: string | null;
  home_type?: string | null;
  home_sqft?: number | null;
  lot_sqft?: number | null;
  [key: string]: unknown;
}

export default function PlanBuilderContent() {
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<DbProperty[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [propertyDropdownOpen, setPropertyDropdownOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [planInterval, setPlanInterval] = useState<PlanInterval>("monthly");
  const [mobileReceiptOpen, setMobileReceiptOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const propertyDropdownRef = useRef<HTMLDivElement>(null);

  // Close property dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(e.target as Node)) {
        setPropertyDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Load user's properties from DB
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setPropertiesLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await getAllProperties(user.id);
        if (!cancelled) {
          setProperties(data as DbProperty[]);
          if (data.length > 0 && !selectedPropertyId) {
            setSelectedPropertyId(data[0].id);
          }
        }
      } catch {
        // silently fail
      } finally {
        if (!cancelled) setPropertiesLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user, authLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // Derive property profile and sqft from selected property
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const propertyProfile = selectedProperty ? mapDbToPropertyProfile(selectedProperty) : null;
  const propertySqft = propertyProfile?.homeSqft ?? 1500;
  const lotSqft = propertyProfile?.lotSqft ?? 5000;

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    // Clear the "no services" error when a service is selected
    if (validationError) setValidationError(null);
  };

  const receipt = useMemo(() => {
    const items = SERVICES.filter((s) => selectedServices.has(s.id)).map((service) => ({
      service,
      monthlyPrice: calculateServicePrice(service, propertySqft, lotSqft, undefined, propertyProfile ?? undefined),
    }));
    const subtotal = items.reduce((sum, item) => sum + item.monthlyPrice, 0);
    const discount = PLAN_DISCOUNTS[planInterval].discount;
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;
    const withoutPlan = items.reduce((sum, item) => sum + calculateIndividualComparison(item.monthlyPrice), 0);
    const annualSavings = (withoutPlan - total) * 12;
    return { items, subtotal, discount, discountAmount, total, withoutPlan, annualSavings };
  }, [selectedServices, propertySqft, lotSqft, planInterval, propertyProfile]);

  const categories = Object.keys(SERVICE_CATEGORIES) as ServiceCategory[];

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Plan Builder
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Select your property, choose your services, and see your price in real-time.
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Left Column - Property Selector & Services */}
        <div className="space-y-6 sm:space-y-8 lg:col-span-2">
          {/* Property Selector */}
          <FadeIn>
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Select Property</CardTitle>
              </CardHeader>
              <CardContent>
                {authLoading || propertiesLoading ? (
                  <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading properties...
                  </div>
                ) : properties.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center">
                    <Building2 className="mx-auto h-8 w-8 text-muted-foreground/40" />
                    <p className="mt-2 text-sm font-medium">No properties yet</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Add a property first to get accurate pricing based on your home details
                    </p>
                    <Button size="sm" className="mt-3" asChild>
                      <Link href="/account/property">Add Property</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="relative" ref={propertyDropdownRef}>
                    <button
                      onClick={() => setPropertyDropdownOpen(!propertyDropdownOpen)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-left transition-colors hover:bg-muted"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Home className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {selectedProperty?.address || selectedProperty?.city || "Select property"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {propertySqft.toLocaleString()} sq ft home · {lotSqft.toLocaleString()} sq ft lot
                            {selectedProperty?.home_type && (
                              <span className="capitalize"> · {selectedProperty.home_type}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={cn(
                        "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                        propertyDropdownOpen && "rotate-180"
                      )} />
                    </button>

                    <AnimatePresence>
                      {propertyDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-border bg-popover p-1.5 shadow-xl"
                        >
                          {properties.map((p) => {
                            const isActive = p.id === (selectedPropertyId || properties[0]?.id);
                            return (
                              <button
                                key={p.id}
                                onClick={() => {
                                  setSelectedPropertyId(p.id);
                                  setPropertyDropdownOpen(false);
                                }}
                                className={cn(
                                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                                  isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-popover-foreground hover:bg-accent/50"
                                )}
                              >
                                <Home className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="flex-1 text-left min-w-0">
                                  <p className="truncate font-medium">{p.address || p.city || "Property"}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(p.home_sqft ?? 0).toLocaleString()} sq ft
                                    {p.home_type && <span className="capitalize"> · {p.home_type}</span>}
                                  </p>
                                </div>
                                {isActive && <Check className="h-4 w-4 shrink-0 text-primary" />}
                              </button>
                            );
                          })}
                          <Separator className="my-1.5" />
                          <Link
                            href="/account/property"
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                            onClick={() => setPropertyDropdownOpen(false)}
                          >
                            <Building2 className="h-4 w-4" />
                            <span>Add new property</span>
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Services Selection */}
          {categories.map((category, catIdx) => {
            const categoryServices = SERVICES.filter((s) => s.category === category);
            const info = SERVICE_CATEGORIES[category];
            const selectedInCategory = categoryServices.filter((s) => selectedServices.has(s.id)).length;

            return (
              <FadeIn key={category} delay={catIdx * 0.1}>
                <Card>
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base sm:text-lg">{info.label}</CardTitle>
                        <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">{info.description}</p>
                      </div>
                      {selectedInCategory > 0 && (
                        <Badge className="bg-primary/10 text-primary">
                          {selectedInCategory} selected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
                      {categoryServices.map((service) => {
                        const Icon = ICON_MAP[service.icon] || CheckCircle2;
                        const isSelected = selectedServices.has(service.id);
                        const monthlyPrice = calculateServicePrice(service, propertySqft, lotSqft, undefined, propertyProfile ?? undefined);

                        return (
                          <motion.div
                            key={service.id}
                            layout
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleService(service.id)}
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors sm:p-4 ${
                              isSelected
                                ? "border-primary bg-primary/[0.04] shadow-sm"
                                : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                            }`}
                          >
                            <motion.div
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground/30"
                              }`}
                              animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                              transition={{ duration: 0.2 }}
                            >
                              {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                            </motion.div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-1.5 sm:gap-2">
                                <Icon className="h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
                                <span className="text-xs font-semibold sm:text-sm truncate">{service.name}</span>
                                {service.popular && (
                                  <Badge variant="secondary" className="bg-amber-100 px-1.5 py-0 text-xs text-amber-700">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                              <p className="hidden text-xs text-muted-foreground sm:line-clamp-1">{service.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground sm:text-xs">{service.frequencyLabel}</span>
                                <span className="text-xs font-semibold text-primary sm:text-sm">${(Number.isFinite(monthlyPrice) ? monthlyPrice : 0).toFixed(0)}/mo</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>

        {/* Right Column - Desktop Live Receipt */}
        <div className="hidden lg:col-span-1 lg:block">
          <div className="sticky top-20">
            <ReceiptPanel
              receipt={receipt}
              planInterval={planInterval}
              setPlanInterval={setPlanInterval}
              selectedCount={selectedServices.size}
              validationError={validationError}
              onGetStarted={() => {
                if (!selectedPropertyId) {
                  setValidationError("Please select a property to build your plan");
                  return;
                }
                if (selectedServices.size === 0) {
                  setValidationError("Please select at least one service to build your plan");
                  return;
                }
                setValidationError(null);
                // proceed with get started action
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile Floating Receipt Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <AnimatePresence>
          {mobileReceiptOpen && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="rounded-t-2xl border-t bg-background shadow-2xl"
            >
              <div className="flex items-center justify-between border-b p-4">
                <h3 className="font-bold">Your Plan Summary</h3>
                <Button variant="ghost" size="icon" className="h-11 w-11 min-h-[44px] min-w-[44px]" onClick={() => setMobileReceiptOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4">
                <ReceiptPanel
                  receipt={receipt}
                  planInterval={planInterval}
                  setPlanInterval={setPlanInterval}
                  selectedCount={selectedServices.size}
                  validationError={validationError}
                  onGetStarted={() => {
                    if (!selectedPropertyId) {
                      setValidationError("Please select a property to build your plan");
                      return;
                    }
                    if (selectedServices.size === 0) {
                      setValidationError("Please select at least one service to build your plan");
                      return;
                    }
                    setValidationError(null);
                  }}
                  isMobile
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!mobileReceiptOpen && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="border-t bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setMobileReceiptOpen(true)}
                className="flex flex-1 items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-muted-foreground">
                    {selectedServices.size} service{selectedServices.size !== 1 ? "s" : ""}
                  </p>
                  <p className="text-lg font-bold">
                    <motion.span
                      key={receipt.total}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      ${(receipt.total || 0).toFixed(0)}
                    </motion.span>
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  </p>
                </div>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </button>
              <Button
                size="lg"
                className="shrink-0"
                onClick={() => {
                  if (!selectedPropertyId) {
                    setValidationError("Please select a property to build your plan");
                    setMobileReceiptOpen(true);
                    return;
                  }
                  if (selectedServices.size === 0) {
                    setValidationError("Please select at least one service to build your plan");
                    setMobileReceiptOpen(true);
                    return;
                  }
                  setValidationError(null);
                }}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom padding for mobile bar */}
      <div className="h-24 lg:hidden" />
    </div>
  );
}

function ReceiptPanel({
  receipt,
  planInterval,
  setPlanInterval,
  selectedCount,
  validationError,
  onGetStarted,
  isMobile = false,
}: {
  receipt: {
    items: { service: { id: string; name: string; icon: string }; monthlyPrice: number }[];
    subtotal: number;
    discount: number;
    discountAmount: number;
    total: number;
    withoutPlan: number;
    annualSavings: number;
  };
  planInterval: PlanInterval;
  setPlanInterval: (v: PlanInterval) => void;
  selectedCount: number;
  validationError: string | null;
  onGetStarted: () => void;
  isMobile?: boolean;
}) {
  const content = (
    <>
      {!isMobile && (
        <div className="bg-gradient-to-r from-primary to-blue-700 p-5 text-primary-foreground">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            <h3 className="font-bold">Your Plan Summary</h3>
          </div>
          <p className="mt-1 text-sm opacity-80">
            {selectedCount} service{selectedCount !== 1 ? "s" : ""} selected
          </p>
        </div>
      )}

      <div className={isMobile ? "" : "p-5"}>
        {/* Payment interval */}
        <div className="mb-4">
          <Label className="text-sm text-muted-foreground sm:text-xs">Payment Frequency</Label>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {(Object.entries(PLAN_DISCOUNTS) as [PlanInterval, typeof PLAN_DISCOUNTS[PlanInterval]][]).map(
              ([key, val]) => (
                <button
                  key={key}
                  onClick={() => setPlanInterval(key)}
                  className={`rounded-lg border px-2 py-2.5 text-center text-xs font-medium transition-all min-h-[44px] sm:text-sm ${
                    planInterval === key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {val.label}
                  {val.discount > 0 && (
                    <span className="block text-xs text-primary">{val.description}</span>
                  )}
                </button>
              )
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Line items */}
        {receipt.items.length === 0 ? (
          <div className="py-8 text-center">
            <ShoppingCart className="mx-auto h-8 w-8 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">Select services to build your plan</p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {receipt.items.map(({ service, monthlyPrice }) => {
                const Icon = ICON_MAP[service.icon] || CheckCircle2;
                return (
                  <motion.div
                    key={service.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between overflow-hidden"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm">{service.name}</span>
                    </div>
                    <motion.span
                      key={monthlyPrice}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium"
                    >
                      ${(Number.isFinite(monthlyPrice) ? monthlyPrice : 0).toFixed(0)}
                    </motion.span>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <Separator className="my-3" />

            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <motion.span key={receipt.subtotal} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                ${(receipt.subtotal || 0).toFixed(0)}/mo
              </motion.span>
            </div>

            {receipt.discount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-between text-sm text-primary"
              >
                <span>{PLAN_DISCOUNTS[planInterval].label} discount</span>
                <span>-${(receipt.discountAmount || 0).toFixed(0)}/mo</span>
              </motion.div>
            )}

            <Separator className="my-3" />

            <div className="flex items-center justify-between">
              <span className="text-base font-bold sm:text-lg">Monthly Total</span>
              <motion.span
                key={receipt.total}
                initial={{ scale: 1.1, color: "hsl(var(--primary))" }}
                animate={{ scale: 1 }}
                className="text-xl font-bold text-primary sm:text-2xl"
              >
                ${(receipt.total || 0).toFixed(0)}
                <span className="text-xs font-normal text-muted-foreground sm:text-sm">/mo</span>
              </motion.span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-3 rounded-lg bg-primary/[0.06] p-3"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <TrendingDown className="h-4 w-4" />
                <span>You save ~${(receipt.annualSavings || 0).toFixed(0)}/year</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Compared to hiring contractors individually
              </p>
            </motion.div>
          </div>
        )}

        {!isMobile && (
          <>
            <AnimatePresence>
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4"
                >
                  <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
                    <AlertDescription>{validationError}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
            <Button className="mt-4 w-full" size="lg" onClick={onGetStarted}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              No commitment - cancel anytime on monthly plans
            </p>
          </>
        )}
        {isMobile && validationError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4"
          >
            <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </div>
    </>
  );

  if (isMobile) return <div>{content}</div>;

  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg">
      {content}
    </Card>
  );
}
