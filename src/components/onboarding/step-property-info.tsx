"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { usePropertyStore, type HomeType, type HeatingType } from "@/stores/property-store";
import { Home, Ruler, CalendarDays } from "lucide-react";

const homeTypes: { value: HomeType; label: string }[] = [
  { value: "detached", label: "Detached House" },
  { value: "townhouse", label: "Townhouse" },
  { value: "duplex", label: "Duplex" },
  { value: "condo", label: "Condo" },
  { value: "other", label: "Other" },
];

export function StepPropertyBasics() {
  const { property, setProperty } = usePropertyStore();

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Tell us about your home</h2>
      <p className="mt-2 text-center text-muted-foreground">This helps us give you accurate, personalized pricing.</p>

      <div className="mt-8 space-y-6">
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="space-y-2">
              <Label>Home Size (sq ft)</Label>
              <Input type="number" value={property.homeSqft} onChange={(e) => setProperty({ homeSqft: Number(e.target.value) })} min={200} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Lot Size (sq ft)</Label>
              <Input type="number" value={property.lotSqft} onChange={(e) => setProperty({ lotSqft: Number(e.target.value) })} min={500} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Year Built</Label>
              <Input type="number" value={property.yearBuilt} onChange={(e) => setProperty({ yearBuilt: Number(e.target.value) })} min={1900} max={2026} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label>Home Type</Label>
              <Select value={property.homeType} onValueChange={(v: HomeType) => setProperty({ homeType: v })}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {homeTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Address (optional)</Label>
              <Input value={property.address} onChange={(e) => setProperty({ address: e.target.value })} placeholder="123 Main St, Kelowna, BC" className="h-11" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const heatingTypes: { value: HeatingType; label: string }[] = [
  { value: "furnace", label: "Furnace (gas/electric)" },
  { value: "heat-pump", label: "Heat Pump" },
  { value: "baseboard", label: "Baseboard Heaters" },
  { value: "boiler", label: "Boiler" },
  { value: "other", label: "Other" },
];

export function StepPropertyDetails() {
  const { property, setProperty } = usePropertyStore();

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Property details</h2>
      <p className="mt-2 text-center text-muted-foreground">More details help us tailor your services perfectly.</p>

      <div className="mt-8 space-y-6">
        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-3 sm:p-6">
            <NumberStepper label="Bedrooms" value={property.bedrooms} onChange={(v) => setProperty({ bedrooms: v })} min={1} max={10} />
            <NumberStepper label="Bathrooms" value={property.bathrooms} onChange={(v) => setProperty({ bathrooms: v })} min={1} max={8} />
            <NumberStepper label="Floors" value={property.floors} onChange={(v) => setProperty({ floors: v })} min={1} max={4} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="space-y-2">
              <Label>Heating Type</Label>
              <Select value={property.heatingType} onValueChange={(v: HeatingType) => setProperty({ heatingType: v })}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {heatingTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
              <Label className="text-sm">Air Conditioning</Label>
              <Switch checked={property.hasAC} onCheckedChange={(v) => setProperty({ hasAC: v })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 sm:p-6">
            {[
              { key: "hasGarage" as const, label: "Garage" },
              { key: "hasDriveway" as const, label: "Driveway" },
              { key: "hasDeck" as const, label: "Deck/Patio" },
              { key: "hasFence" as const, label: "Fence" },
              { key: "hasPets" as const, label: "Pets" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <Label className="text-sm">{item.label}</Label>
                <Switch checked={property[item.key]} onCheckedChange={(v) => setProperty({ [item.key]: v })} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NumberStepper({ label, value, onChange, min = 0, max = 99 }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <motion.button
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
          whileTap={{ scale: 0.9 }}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-10 w-10 items-center justify-center rounded-lg border text-lg font-bold hover:bg-muted"
        >
          +
        </motion.button>
      </div>
    </div>
  );
}
