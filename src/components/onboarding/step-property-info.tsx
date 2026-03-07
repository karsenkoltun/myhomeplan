"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { motion, AnimatePresence } from "framer-motion";
import {
  usePropertyStore,
  type HomeType,
  type HeatingType,
  type RoofType,
  type ExteriorMaterial,
  type FoundationType,
  type LandscapingComplexity,
  type DrivewayMaterial,
  type DrivewayLength,
  type FenceType,
  type WaterHeaterType,
} from "@/stores/property-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Home,
  ChevronDown,
  Warehouse,
  TreePine,
  Car,
} from "lucide-react";
import { easings } from "@/lib/animations";

// --- Validation schemas ---

const propertyBasicsSchema = z.object({
  homeSqft: z.number().min(200, "Must be at least 200 sq ft"),
  lotSqft: z.number().min(100, "Must be at least 100 sq ft"),
  yearBuilt: z.number().min(1800, "Must be 1800 or later").max(2026, "Cannot be in the future"),
  homeType: z.enum(["detached", "townhouse", "duplex", "condo", "other"], {
    message: "Please select a home type",
  }),
});

const propertyDetailsSchema = z.object({
  bedrooms: z.number().min(1, "Must have at least 1 bedroom"),
  bathrooms: z.number().min(1, "Must have at least 1 bathroom"),
  floors: z.number().min(1, "Must have at least 1 floor"),
  heatingType: z.enum(["furnace", "heat-pump", "baseboard", "boiler", "other"], {
    message: "Please select a heating type",
  }),
});

// Re-export from shared for backward compatibility
export type { StepValidationRef } from "./shared";
import { RequiredLabel, FieldError, type StepValidationRef } from "./shared";

// --- Option data ---

const homeTypes: { value: HomeType; label: string }[] = [
  { value: "detached", label: "Detached House" },
  { value: "townhouse", label: "Townhouse" },
  { value: "duplex", label: "Duplex" },
  { value: "condo", label: "Condo" },
  { value: "other", label: "Other" },
];

const heatingTypes: { value: HeatingType; label: string }[] = [
  { value: "furnace", label: "Furnace (gas/electric)" },
  { value: "heat-pump", label: "Heat Pump" },
  { value: "baseboard", label: "Baseboard Heaters" },
  { value: "boiler", label: "Boiler" },
  { value: "other", label: "Other" },
];

const roofTypes: { value: RoofType; label: string }[] = [
  { value: "asphalt", label: "Asphalt Shingles" },
  { value: "metal", label: "Metal" },
  { value: "tile", label: "Tile" },
  { value: "flat", label: "Flat / Membrane" },
];

const exteriorMaterials: { value: ExteriorMaterial; label: string }[] = [
  { value: "vinyl", label: "Vinyl Siding" },
  { value: "stucco", label: "Stucco" },
  { value: "brick", label: "Brick" },
  { value: "wood", label: "Wood" },
  { value: "fiber-cement", label: "Fiber Cement" },
];

const foundationTypes: { value: FoundationType; label: string }[] = [
  { value: "slab", label: "Slab on Grade" },
  { value: "crawlspace", label: "Crawl Space" },
  { value: "basement", label: "Basement" },
];

const drivewayMaterials: { value: DrivewayMaterial; label: string }[] = [
  { value: "concrete", label: "Concrete" },
  { value: "asphalt", label: "Asphalt" },
  { value: "gravel", label: "Gravel" },
  { value: "pavers", label: "Pavers" },
];

const fenceTypes: { value: FenceType; label: string }[] = [
  { value: "none", label: "No Fence" },
  { value: "wood", label: "Wood" },
  { value: "vinyl", label: "Vinyl" },
  { value: "chain-link", label: "Chain Link" },
  { value: "metal", label: "Metal / Wrought Iron" },
];

const landscapingOptions: { value: LandscapingComplexity; label: string; description: string }[] = [
  { value: "minimal", label: "Minimal", description: "Mostly lawn, few plantings" },
  { value: "moderate", label: "Moderate", description: "Some beds, shrubs, a few trees" },
  { value: "extensive", label: "Extensive", description: "Large gardens, many trees, detailed design" },
];

const drivewayLengthOptions: { value: DrivewayLength; label: string; description: string }[] = [
  { value: "short", label: "Short", description: "Under 20 ft" },
  { value: "medium", label: "Medium", description: "20 - 40 ft" },
  { value: "long", label: "Long", description: "40 ft+" },
];

// --- Stagger animation helpers ---

const sectionVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: easings.smooth } },
};

// ================================================================
// StepPropertyBasics
// ================================================================

export const StepPropertyBasics = forwardRef<StepValidationRef>(function StepPropertyBasics(_props, ref) {
  const { property, setProperty } = usePropertyStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const validate = useCallback(() => {
    const result = propertyBasicsSchema.safeParse({
      homeSqft: property.homeSqft,
      lotSqft: property.lotSqft,
      yearBuilt: property.yearBuilt,
      homeType: property.homeType,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const mapped: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(fieldErrors)) {
        if (msgs && msgs.length > 0) mapped[key] = msgs[0];
      }
      setErrors(mapped);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      toast.error("Please fill in all required fields");
      return false;
    }

    setErrors({});
    return true;
  }, [property]);

  useImperativeHandle(ref, () => ({ validate }), [validate]);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Tell us about your home</h2>
      <p className="mt-2 text-center text-muted-foreground">This helps us give you accurate, personalized pricing.</p>

      <div className={cn("mt-8 space-y-6", shaking && "animate-shake")}>
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="space-y-2">
              <RequiredLabel>Home Size (sq ft)</RequiredLabel>
              <Input
                type="number"
                value={property.homeSqft}
                onChange={(e) => {
                  setProperty({ homeSqft: Number(e.target.value) });
                  clearError("homeSqft");
                }}
                min={200}
                className={cn("h-11 transition-colors duration-200", errors.homeSqft && "ring-2 ring-red-500 border-red-500")}
              />
              <FieldError message={errors.homeSqft} />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Lot Size (sq ft)</RequiredLabel>
              <Input
                type="number"
                value={property.lotSqft}
                onChange={(e) => {
                  setProperty({ lotSqft: Number(e.target.value) });
                  clearError("lotSqft");
                }}
                min={100}
                className={cn("h-11 transition-colors duration-200", errors.lotSqft && "ring-2 ring-red-500 border-red-500")}
              />
              <FieldError message={errors.lotSqft} />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Year Built</RequiredLabel>
              <Input
                type="number"
                value={property.yearBuilt}
                onChange={(e) => {
                  setProperty({ yearBuilt: Number(e.target.value) });
                  clearError("yearBuilt");
                }}
                min={1800}
                max={2026}
                className={cn("h-11 transition-colors duration-200", errors.yearBuilt && "ring-2 ring-red-500 border-red-500")}
              />
              <FieldError message={errors.yearBuilt} />
            </div>
            <div className="space-y-2">
              <RequiredLabel>Home Type</RequiredLabel>
              <Select
                value={property.homeType}
                onValueChange={(v: HomeType) => {
                  setProperty({ homeType: v });
                  clearError("homeType");
                }}
              >
                <SelectTrigger className={cn("h-11 transition-colors duration-200", errors.homeType && "ring-2 ring-red-500 border-red-500")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {homeTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <FieldError message={errors.homeType} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

// ================================================================
// StepPropertyDetails
// ================================================================

export const StepPropertyDetails = forwardRef<StepValidationRef>(function StepPropertyDetails(_props, ref) {
  const { property, setProperty } = usePropertyStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    interior: true,
    exterior: true,
    outdoor: true,
    driveway: true,
  });

  const toggleSection = (key: string) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const validate = useCallback(() => {
    const result = propertyDetailsSchema.safeParse({
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      floors: property.floors,
      heatingType: property.heatingType,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const mapped: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(fieldErrors)) {
        if (msgs && msgs.length > 0) mapped[key] = msgs[0];
      }
      setErrors(mapped);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      toast.error("Please fill in all required fields");
      // Make sure the interior section is open so the user can see the errors
      setOpenSections((prev) => ({ ...prev, interior: true }));
      return false;
    }

    setErrors({});
    return true;
  }, [property]);

  useImperativeHandle(ref, () => ({ validate }), [validate]);

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Property details</h2>
      <p className="mt-2 text-center text-muted-foreground">
        More details help us tailor your services perfectly.
      </p>

      <motion.div
        className={cn("mt-8 space-y-5", shaking && "animate-shake")}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ===== Interior & Systems ===== */}
        <motion.div variants={itemVariants}>
          <CollapsibleSection
            icon={<Home className="h-4 w-4" />}
            title="Interior & Systems"
            sectionKey="interior"
            open={openSections.interior}
            onToggle={toggleSection}
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <NumberStepper
                label="Bedrooms"
                value={property.bedrooms}
                onChange={(v) => setProperty({ bedrooms: v })}
                min={1}
                max={10}
                error={errors.bedrooms}
                required
              />
              <NumberStepper
                label="Bathrooms"
                value={property.bathrooms}
                onChange={(v) => setProperty({ bathrooms: v })}
                min={1}
                max={8}
                error={errors.bathrooms}
                required
              />
              <NumberStepper
                label="Floors"
                value={property.floors}
                onChange={(v) => setProperty({ floors: v })}
                min={1}
                max={4}
                error={errors.floors}
                required
              />
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <RequiredLabel>Heating Type</RequiredLabel>
                <Select value={property.heatingType} onValueChange={(v: HeatingType) => setProperty({ heatingType: v })}>
                  <SelectTrigger className={cn("h-11 transition-colors duration-200", errors.heatingType && "ring-2 ring-red-500 border-red-500")}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {heatingTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <FieldError message={errors.heatingType} />
              </div>
              <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <Label className="text-sm">Air Conditioning</Label>
                <Switch checked={property.hasAC} onCheckedChange={(v) => setProperty({ hasAC: v })} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <Label className="text-sm">Garage</Label>
                <Switch checked={property.hasGarage} onCheckedChange={(v) => setProperty({ hasGarage: v })} />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <Label className="text-sm">Pets</Label>
                <Switch checked={property.hasPets} onCheckedChange={(v) => setProperty({ hasPets: v })} />
              </div>
            </div>

            {/* HVAC & Water Heater details */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>HVAC Brand</Label>
                <Input
                  value={property.hvacBrand}
                  onChange={(e) => setProperty({ hvacBrand: e.target.value })}
                  placeholder="e.g. Lennox, Carrier"
                  className="h-11"
                />
              </div>
              <NumberStepper
                label="HVAC Age (years)"
                value={property.hvacAge}
                onChange={(v) => setProperty({ hvacAge: v })}
                min={0}
                max={40}
              />
              <div className="space-y-2">
                <Label>Water Heater Type</Label>
                <Select value={property.waterHeaterType} onValueChange={(v: WaterHeaterType) => setProperty({ waterHeaterType: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tank">Tank</SelectItem>
                    <SelectItem value="tankless">Tankless</SelectItem>
                    <SelectItem value="heat-pump">Heat Pump</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <NumberStepper
                label="Water Heater Age (years)"
                value={property.waterHeaterAge}
                onChange={(v) => setProperty({ waterHeaterAge: v })}
                min={0}
                max={30}
              />
              <div className="space-y-2 sm:col-span-2">
                <Label>Furnace Filter Size</Label>
                <Input
                  value={property.furnaceFilterSize}
                  onChange={(e) => setProperty({ furnaceFilterSize: e.target.value })}
                  placeholder='e.g. 16x25x1, 20x20x4'
                  className="h-11"
                />
              </div>
            </div>
          </CollapsibleSection>
        </motion.div>

        {/* ===== Exterior & Structure ===== */}
        <motion.div variants={itemVariants}>
          <CollapsibleSection
            icon={<Warehouse className="h-4 w-4" />}
            title="Exterior & Structure"
            sectionKey="exterior"
            open={openSections.exterior}
            onToggle={toggleSection}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Roof Type</Label>
                <Select value={property.roofType} onValueChange={(v: RoofType) => setProperty({ roofType: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {roofTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exterior Material</Label>
                <Select value={property.exteriorMaterial} onValueChange={(v: ExteriorMaterial) => setProperty({ exteriorMaterial: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {exteriorMaterials.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Foundation</Label>
                <Select value={property.foundation} onValueChange={(v: FoundationType) => setProperty({ foundation: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {foundationTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <NumberStepper
                label="Windows"
                value={property.windowCount}
                onChange={(v) => setProperty({ windowCount: v })}
                min={1}
                max={60}
              />
            </div>
          </CollapsibleSection>
        </motion.div>

        {/* ===== Outdoor Spaces ===== */}
        <motion.div variants={itemVariants}>
          <CollapsibleSection
            icon={<TreePine className="h-4 w-4" />}
            title="Outdoor Spaces"
            sectionKey="outdoor"
            open={openSections.outdoor}
            onToggle={toggleSection}
          >
            {/* Landscaping complexity - visual cards */}
            <div className="space-y-2">
              <Label>Landscaping Complexity</Label>
              <div className="grid grid-cols-3 gap-3">
                {landscapingOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setProperty({ landscapingComplexity: opt.value })}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-colors",
                      property.landscapingComplexity === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <span className="block text-sm font-semibold">{opt.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground leading-tight">{opt.description}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Mature trees slider */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <Label>Mature Trees</Label>
                <span className="text-sm font-semibold tabular-nums">
                  {property.matureTrees}{property.matureTrees >= 20 ? "+" : ""}
                </span>
              </div>
              <Slider
                value={[property.matureTrees]}
                onValueChange={([v]) => setProperty({ matureTrees: v })}
                min={0}
                max={20}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>5</span>
                <span>10</span>
                <span>15</span>
                <span>20+</span>
              </div>
            </div>

            {/* Garden beds */}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <NumberStepper
                label="Garden Beds"
                value={property.gardenBeds}
                onChange={(v) => setProperty({ gardenBeds: v })}
                min={0}
                max={10}
              />
              <AnimatePresence>
                {property.gardenBeds > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: easings.smooth }}
                    className="space-y-2 overflow-hidden"
                  >
                    <Label>Garden Bed Total (sq ft)</Label>
                    <Input
                      type="number"
                      value={property.gardenBedSqft || ""}
                      onChange={(e) => setProperty({ gardenBedSqft: Number(e.target.value) })}
                      min={0}
                      className="h-11"
                      placeholder="e.g. 200"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Deck/patio sqft */}
            <div className="mt-5 space-y-2">
              <Label>Deck / Patio Size (sq ft)</Label>
              <Input
                type="number"
                value={property.deckPatioSqft || ""}
                onChange={(e) => setProperty({ deckPatioSqft: Number(e.target.value) })}
                min={0}
                className="h-11"
                placeholder="0 if none"
              />
            </div>

            {/* Toggles */}
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <Label className="text-sm">Pool / Hot Tub</Label>
                <Switch checked={property.hasPool} onCheckedChange={(v) => setProperty({ hasPool: v })} />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <Label className="text-sm">Irrigation System</Label>
                <Switch checked={property.hasIrrigation} onCheckedChange={(v) => setProperty({ hasIrrigation: v })} />
              </div>
            </div>
          </CollapsibleSection>
        </motion.div>

        {/* ===== Driveway & Fencing ===== */}
        <motion.div variants={itemVariants}>
          <CollapsibleSection
            icon={<Car className="h-4 w-4" />}
            title="Driveway & Fencing"
            sectionKey="driveway"
            open={openSections.driveway}
            onToggle={toggleSection}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Driveway Material</Label>
                <Select value={property.drivewayMaterial} onValueChange={(v: DrivewayMaterial) => setProperty({ drivewayMaterial: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {drivewayMaterials.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fence Type</Label>
                <Select value={property.fenceType} onValueChange={(v: FenceType) => setProperty({ fenceType: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {fenceTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Driveway length - visual cards */}
            <div className="mt-5 space-y-2">
              <Label>Driveway Length</Label>
              <div className="grid grid-cols-3 gap-3">
                {drivewayLengthOptions.map((opt) => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setProperty({ drivewayLength: opt.value })}
                    className={cn(
                      "rounded-xl border-2 p-3 text-left transition-colors",
                      property.drivewayLength === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <span className="block text-sm font-semibold">{opt.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{opt.description}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Fence linear feet - conditional */}
            <AnimatePresence>
              {property.fenceType !== "none" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: easings.smooth }}
                  className="mt-5 space-y-2 overflow-hidden"
                >
                  <Label>Fence Length (linear ft)</Label>
                  <Input
                    type="number"
                    value={property.fenceLinearFeet || ""}
                    onChange={(e) => setProperty({ fenceLinearFeet: Number(e.target.value) })}
                    min={0}
                    className="h-11"
                    placeholder="e.g. 150"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CollapsibleSection>
        </motion.div>
      </motion.div>
    </div>
  );
});

// ================================================================
// Shared sub-components
// ================================================================

function CollapsibleSection({
  icon,
  title,
  sectionKey,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  sectionKey: string;
  open: boolean;
  onToggle: (key: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Collapsible open={open} onOpenChange={() => onToggle(sectionKey)}>
      <Card>
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center justify-between px-5 py-4 sm:px-6"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                {icon}
              </span>
              <span className="text-sm font-semibold">{title}</span>
            </div>
            <motion.div
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="px-5 pb-5 pt-0 sm:px-6 sm:pb-6">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

function NumberStepper({
  label,
  value,
  onChange,
  min = 0,
  max = 99,
  error,
  required,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  error?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      {required ? <RequiredLabel>{label}</RequiredLabel> : <Label>{label}</Label>}
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg p-1 transition-colors duration-200",
          error && "ring-2 ring-red-500"
        )}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-bold hover:bg-muted"
        >
          -
        </motion.button>
        <motion.span key={value} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className="w-10 text-center text-lg font-bold">
          {value}
        </motion.span>
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-bold hover:bg-muted"
        >
          +
        </motion.button>
      </div>
      <FieldError message={error} />
    </div>
  );
}
