"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Building, Building2, Hotel, TowerControl, Blocks, Waves, Dumbbell, PartyPopper, Flower2, Baby, CircleParking, ArrowUpDown, Sun, Check } from "lucide-react";
import { FileInput } from "@/components/ui/file-input";
import { usePropertyStore, type StrataBuildingType, type StrataAmenity } from "@/stores/property-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { RequiredLabel, FieldError, type StepValidationRef } from "./shared";

// --- Validation ---

const strataPropertySchema = z.object({
  unitCount: z.number().min(2, "Must have at least 2 units"),
  buildingType: z.enum(["townhouse", "low-rise", "mid-rise", "high-rise", "mixed"]),
  buildingCount: z.number().min(1, "Must have at least 1 building"),
  yearBuilt: z.number().min(1900, "Must be 1900 or later").max(2026, "Cannot be in the future"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

// --- Data ---

const buildingTypes: { value: StrataBuildingType; label: string; description: string; icon: typeof Building }[] = [
  { value: "townhouse", label: "Townhouse", description: "Complex", icon: Building },
  { value: "low-rise", label: "Low-Rise", description: "1-4 floors", icon: Building2 },
  { value: "mid-rise", label: "Mid-Rise", description: "5-8 floors", icon: Hotel },
  { value: "high-rise", label: "High-Rise", description: "9+ floors", icon: TowerControl },
  { value: "mixed", label: "Mixed", description: "Multiple types", icon: Blocks },
];

const amenityOptions: { value: StrataAmenity; label: string; icon: typeof Waves }[] = [
  { value: "pool", label: "Pool", icon: Waves },
  { value: "gym", label: "Gym", icon: Dumbbell },
  { value: "party-room", label: "Party Room", icon: PartyPopper },
  { value: "garden", label: "Garden", icon: Flower2 },
  { value: "playground", label: "Playground", icon: Baby },
  { value: "parking-garage", label: "Parking Garage", icon: CircleParking },
  { value: "elevator", label: "Elevator", icon: ArrowUpDown },
  { value: "rooftop", label: "Rooftop Deck", icon: Sun },
];

const provinces = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
];

const parkingTypes = [
  { value: "underground", label: "Underground" },
  { value: "surface", label: "Surface" },
  { value: "both", label: "Both" },
  { value: "none", label: "None" },
];

const fireSystemTypes = [
  { value: "sprinkler", label: "Sprinkler" },
  { value: "alarm", label: "Alarm Only" },
  { value: "both", label: "Sprinkler + Alarm" },
  { value: "none", label: "None" },
];

// --- Component ---

export const StepStrataProperty = forwardRef<StepValidationRef>(function StepStrataProperty(_props, ref) {
  const { strata, setStrata } = usePropertyStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shaking, setShaking] = useState(false);

  const validate = useCallback(() => {
    const result = strataPropertySchema.safeParse({
      unitCount: strata.unitCount,
      buildingType: strata.buildingType,
      buildingCount: strata.buildingCount,
      yearBuilt: strata.yearBuilt,
      address: strata.address,
      city: strata.city,
      province: strata.province,
      postalCode: strata.postalCode,
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
  }, [strata]);

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

  const toggleAmenity = (amenity: StrataAmenity) => {
    const current = strata.amenities;
    if (current.includes(amenity)) {
      setStrata({ amenities: current.filter((a) => a !== amenity) });
    } else {
      setStrata({ amenities: [...current, amenity] });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Building Details</h2>
      <p className="mt-2 text-center text-muted-foreground">Tell us about your building so we can provide accurate service pricing.</p>

      <div className={cn("mt-8 space-y-6", shaking && "animate-shake")}>
        {/* Building Details */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Building Details</h3>

            {/* Building Type - Visual Cards */}
            <div className="mb-5">
              <RequiredLabel>Building Type</RequiredLabel>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {buildingTypes.map((bt) => {
                  const isSelected = strata.buildingType === bt.value;
                  return (
                    <motion.button
                      key={bt.value}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        setStrata({ buildingType: bt.value });
                        clearError("buildingType");
                      }}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all",
                        isSelected
                          ? "border-primary bg-primary/[0.06] shadow-sm"
                          : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                      )}
                    >
                      <bt.icon className={cn("h-6 w-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-xs font-semibold">{bt.label}</span>
                      <span className="text-[10px] text-muted-foreground">{bt.description}</span>
                    </motion.button>
                  );
                })}
              </div>
              <FieldError message={errors.buildingType} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <RequiredLabel>Number of Units</RequiredLabel>
                  <div className="flex items-center gap-1">
                    <Input
                      inputMode="numeric"
                      value={strata.unitCount}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!isNaN(v)) {
                          setStrata({ unitCount: Math.max(0, v) });
                          clearError("unitCount");
                        }
                      }}
                      className={cn("w-20 text-right h-9 transition-colors duration-200", errors.unitCount && "ring-2 ring-red-500 border-red-500")}
                    />
                  </div>
                </div>
                <Slider
                  value={[Math.min(Math.max(strata.unitCount, 4), 500)]}
                  onValueChange={([v]) => {
                    setStrata({ unitCount: v });
                    clearError("unitCount");
                  }}
                  min={4}
                  max={500}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>4 units</span>
                  <span>500 units</span>
                </div>
                <FieldError message={errors.unitCount} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <RequiredLabel>Number of Buildings</RequiredLabel>
                  <div className="flex items-center gap-1">
                    <Input
                      inputMode="numeric"
                      value={strata.buildingCount}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!isNaN(v)) {
                          setStrata({ buildingCount: Math.max(0, v) });
                          clearError("buildingCount");
                        }
                      }}
                      className={cn("w-20 text-right h-9 transition-colors duration-200", errors.buildingCount && "ring-2 ring-red-500 border-red-500")}
                    />
                  </div>
                </div>
                <Slider
                  value={[Math.min(Math.max(strata.buildingCount, 1), 50)]}
                  onValueChange={([v]) => {
                    setStrata({ buildingCount: v });
                    clearError("buildingCount");
                  }}
                  min={1}
                  max={50}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 building</span>
                  <span>50 buildings</span>
                </div>
                <FieldError message={errors.buildingCount} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Common Area</Label>
                  <div className="flex items-center gap-1">
                    <Input
                      inputMode="numeric"
                      value={strata.commonAreaSqft}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (!isNaN(v)) setStrata({ commonAreaSqft: Math.max(0, v) });
                      }}
                      className="w-24 text-right h-9"
                    />
                    <span className="text-sm text-muted-foreground">sq ft</span>
                  </div>
                </div>
                <Slider
                  value={[Math.min(Math.max(strata.commonAreaSqft, 0), 50000)]}
                  onValueChange={([v]) => setStrata({ commonAreaSqft: v })}
                  min={0}
                  max={50000}
                  step={500}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0 sq ft</span>
                  <span>50,000 sq ft</span>
                </div>
              </div>
              <div className="space-y-2">
                <RequiredLabel>Year Built</RequiredLabel>
                <Input
                  type="number"
                  value={strata.yearBuilt}
                  onChange={(e) => {
                    setStrata({ yearBuilt: Number(e.target.value) });
                    clearError("yearBuilt");
                  }}
                  min={1900}
                  max={2026}
                  className={cn("h-11 transition-colors duration-200", errors.yearBuilt && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.yearBuilt} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Location</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <RequiredLabel>Street Address</RequiredLabel>
                <Input
                  value={strata.address}
                  onChange={(e) => {
                    setStrata({ address: e.target.value });
                    clearError("address");
                  }}
                  placeholder="123 Main Street"
                  className={cn("h-11 transition-colors duration-200", errors.address && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.address} />
              </div>
              <div className="space-y-2">
                <RequiredLabel>City</RequiredLabel>
                <Input
                  value={strata.city}
                  onChange={(e) => {
                    setStrata({ city: e.target.value });
                    clearError("city");
                  }}
                  placeholder="Kelowna"
                  className={cn("h-11 transition-colors duration-200", errors.city && "ring-2 ring-red-500 border-red-500")}
                />
                <FieldError message={errors.city} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <RequiredLabel>Province</RequiredLabel>
                  <Select
                    value={strata.province}
                    onValueChange={(v) => {
                      setStrata({ province: v });
                      clearError("province");
                    }}
                  >
                    <SelectTrigger className={cn("h-11 transition-colors duration-200", errors.province && "ring-2 ring-red-500 border-red-500")}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {provinces.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.province} />
                </div>
                <div className="space-y-2">
                  <RequiredLabel>Postal Code</RequiredLabel>
                  <Input
                    value={strata.postalCode}
                    onChange={(e) => {
                      setStrata({ postalCode: e.target.value.toUpperCase() });
                      clearError("postalCode");
                    }}
                    placeholder="V1Y 1A1"
                    maxLength={7}
                    className={cn("h-11 transition-colors duration-200", errors.postalCode && "ring-2 ring-red-500 border-red-500")}
                  />
                  <FieldError message={errors.postalCode} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Elevator, Parking, Roof, Fire System */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Building Systems</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Elevator Count</Label>
                <Input
                  type="number"
                  value={strata.elevatorCount}
                  onChange={(e) => setStrata({ elevatorCount: Math.max(0, Number(e.target.value)) })}
                  min={0}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Elevator Service Provider</Label>
                <Input
                  value={strata.elevatorServiceProvider}
                  onChange={(e) => setStrata({ elevatorServiceProvider: e.target.value })}
                  placeholder="e.g. ThyssenKrupp, Otis"
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label>Parking Type</Label>
                <Select
                  value={strata.parkingType}
                  onValueChange={(v) => setStrata({ parkingType: v })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {parkingTypes.map((pt) => (
                      <SelectItem key={pt.value} value={pt.value}>{pt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Total Stalls</Label>
                  <Input
                    type="number"
                    value={strata.parkingStallCount}
                    onChange={(e) => setStrata({ parkingStallCount: Math.max(0, Number(e.target.value)) })}
                    min={0}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Visitor Stalls</Label>
                  <Input
                    type="number"
                    value={strata.visitorParkingCount}
                    onChange={(e) => setStrata({ visitorParkingCount: Math.max(0, Number(e.target.value)) })}
                    min={0}
                    className="h-11"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Roof Age (years)</Label>
                  <Input
                    type="number"
                    value={strata.roofAge}
                    onChange={(e) => setStrata({ roofAge: Math.max(0, Number(e.target.value)) })}
                    min={0}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Roof Warranty Expiry</Label>
                  <Input
                    type="date"
                    value={strata.roofWarrantyExpiry}
                    onChange={(e) => setStrata({ roofWarrantyExpiry: e.target.value })}
                    className="h-11"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Fire System Type</Label>
                <Select
                  value={strata.fireSystemType}
                  onValueChange={(v) => setStrata({ fireSystemType: v })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fireSystemTypes.map((ft) => (
                      <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Last Fire Inspection</Label>
                <Input
                  type="date"
                  value={strata.lastFireInspection}
                  onChange={(e) => setStrata({ lastFireInspection: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Amenities</h3>
            <p className="mb-3 text-xs text-muted-foreground">Select all amenities in your building - this helps us recommend the right services.</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {amenityOptions.map((amenity) => {
                const isSelected = strata.amenities.includes(amenity.value);
                return (
                  <motion.button
                    key={amenity.value}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggleAmenity(amenity.value)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 rounded-xl border p-3 transition-all",
                      isSelected
                        ? "border-primary bg-primary/[0.06] shadow-sm"
                        : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary"
                      >
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </motion.div>
                    )}
                    <amenity.icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-xs font-medium">{amenity.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Building Plans */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Building Plans</h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Uploading your strata or building floor plan helps contractors provide more accurate quotes (optional).
            </p>
            <FileInput
              label="Strata Plan / Building Floor Plan"
              description="PDF or image of your registered strata plan or building layout"
              accept="image/*,.pdf"
              maxSize={10}
              onFileChange={(file) => {
                if (file) {
                  (window as unknown as Record<string, unknown>).__mhp_strataPlan = file;
                } else {
                  delete (window as unknown as Record<string, unknown>).__mhp_strataPlan;
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
