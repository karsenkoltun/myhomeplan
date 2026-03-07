"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { usePropertyStore } from "@/stores/property-store";
import { cn } from "@/lib/utils";
import { KeyRound, PawPrint, Car, Calendar, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const daysOfWeek = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "no-preference", label: "No Preference" },
];

export function StepPropertyAccess() {
  const { property, setProperty } = usePropertyStore();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <KeyRound className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Property Access</h2>
        <p className="mt-2 text-center text-muted-foreground">Help our crews access your property safely and efficiently.</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Access Details */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <KeyRound className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Access Instructions</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>How should our crew access the property?</Label>
                <textarea
                  value={property.accessInstructions}
                  onChange={(e) => setProperty({ accessInstructions: e.target.value })}
                  placeholder="e.g. Gate is on the left side, use the back entrance..."
                  rows={3}
                  className={cn(
                    "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground",
                    "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                    "dark:bg-input/30"
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <Label className="text-sm">Gate Code</Label>
                  <Switch checked={property.gateCodeExists} onCheckedChange={(v) => setProperty({ gateCodeExists: v })} />
                </div>
                <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                  <Label className="text-sm">Lockbox for Key</Label>
                  <Switch checked={property.lockboxExists} onCheckedChange={(v) => setProperty({ lockboxExists: v })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alarm System Details <span className="text-xs text-muted-foreground">(if any)</span></Label>
                <Input
                  value={property.alarmSystem}
                  onChange={(e) => setProperty({ alarmSystem: e.target.value })}
                  placeholder="e.g. ADT, code will be provided on service day"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pets */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Pets</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <Label className="text-sm">I have pets on the property</Label>
                <Switch checked={property.hasPets} onCheckedChange={(v) => setProperty({ hasPets: v })} />
              </div>
              {property.hasPets && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="space-y-2"
                >
                  <Label>Pet Details</Label>
                  <Input
                    value={property.petDetails}
                    onChange={(e) => setProperty({ petDetails: e.target.value })}
                    placeholder="e.g. 2 dogs (friendly), cat stays indoors"
                    className="h-11"
                  />
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Parking */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Parking</h3>
            </div>
            <div className="space-y-2">
              <Label>Where should our crew park?</Label>
              <Input
                value={property.parkingInstructions}
                onChange={(e) => setProperty({ parkingInstructions: e.target.value })}
                placeholder="e.g. Driveway is fine, or park on the street"
                className="h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Service Preferences</h3>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Preferred Service Day</Label>
                <Select value={property.preferredServiceDay || "no-preference"} onValueChange={(v) => setProperty({ preferredServiceDay: v })}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Chemical Sensitivities <span className="text-xs text-muted-foreground">(if any)</span></Label>
                <Input
                  value={property.chemicalSensitivities}
                  onChange={(e) => setProperty({ chemicalSensitivities: e.target.value })}
                  placeholder="e.g. No pesticides, fragrance-free only"
                  className="h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Anything Else?</h3>
            </div>
            <div className="space-y-2">
              <Label>Special Instructions <span className="text-xs text-muted-foreground">(optional)</span></Label>
              <textarea
                value={property.specialInstructions}
                onChange={(e) => setProperty({ specialInstructions: e.target.value })}
                placeholder="Anything else our crew should know..."
                rows={3}
                className={cn(
                  "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground",
                  "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  "dark:bg-input/30"
                )}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
