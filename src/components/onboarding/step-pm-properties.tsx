"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePropertyStore, type PMManagedProperty } from "@/stores/property-store";
import { Building, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const propertyTypes = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "strata", label: "Strata" },
  { value: "townhouse-complex", label: "Townhouse Complex" },
  { value: "mixed-use", label: "Mixed Use" },
];

const accessTypes = [
  { value: "key", label: "Physical Key" },
  { value: "fob", label: "Key Fob" },
  { value: "code", label: "Access Code" },
  { value: "lockbox", label: "Lockbox" },
  { value: "onsite-manager", label: "On-site Manager" },
];

const provinces = ["AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT"];

export function StepPMProperties() {
  const { pm, setPM } = usePropertyStore();

  const addProperty = () => {
    const newProp: PMManagedProperty = {
      id: crypto.randomUUID(),
      propertyName: "",
      address: "",
      city: "",
      province: "BC",
      postalCode: "",
      propertyType: "residential",
      unitCount: 1,
      totalSqft: 0,
      yearBuilt: 2000,
      accessInstructions: "",
      accessType: "key",
      selectedServices: [],
      notes: "",
    };
    setPM({ properties: [...pm.properties, newProp] });
  };

  const removeProperty = (id: string) => {
    setPM({ properties: pm.properties.filter((p) => p.id !== id) });
  };

  const updateProperty = (id: string, updates: Partial<PMManagedProperty>) => {
    setPM({
      properties: pm.properties.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
          <Building className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Your Properties</h2>
        <p className="mt-2 text-center text-muted-foreground">Add the properties you&apos;d like us to service.</p>
      </div>

      <div className="mt-8 space-y-6">
        <AnimatePresence>
          {pm.properties.map((prop, index) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">Property {index + 1}</h3>
                    <Button variant="ghost" size="sm" onClick={() => removeProperty(prop.id)} className="h-9 w-9 min-h-[44px] min-w-[44px] p-0 text-muted-foreground hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Property Name</Label>
                      <Input value={prop.propertyName} onChange={(e) => updateProperty(prop.id, { propertyName: e.target.value })} placeholder="e.g. Sunset Terrace" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Property Type</Label>
                      <Select value={prop.propertyType} onValueChange={(v) => updateProperty(prop.id, { propertyType: v })}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>{propertyTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Address <span className="text-red-500">*</span></Label>
                      <Input value={prop.address} onChange={(e) => updateProperty(prop.id, { address: e.target.value })} placeholder="123 Main Street" className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input value={prop.city} onChange={(e) => updateProperty(prop.id, { city: e.target.value })} placeholder="Kelowna" className="h-10" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Province</Label>
                        <Select value={prop.province} onValueChange={(v) => updateProperty(prop.id, { province: v })}>
                          <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                          <SelectContent>{provinces.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Postal Code</Label>
                        <Input value={prop.postalCode} onChange={(e) => updateProperty(prop.id, { postalCode: e.target.value.toUpperCase() })} maxLength={7} className="h-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Units</Label>
                      <Input type="number" value={prop.unitCount} onChange={(e) => updateProperty(prop.id, { unitCount: Math.max(1, Number(e.target.value)) })} min={1} className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Total Sq Ft</Label>
                      <Input type="number" value={prop.totalSqft || ""} onChange={(e) => updateProperty(prop.id, { totalSqft: Number(e.target.value) })} className="h-10" />
                    </div>
                    <div className="space-y-2">
                      <Label>Access Type</Label>
                      <Select value={prop.accessType} onValueChange={(v) => updateProperty(prop.id, { accessType: v })}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>{accessTypes.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Access Instructions</Label>
                      <Input value={prop.accessInstructions} onChange={(e) => updateProperty(prop.id, { accessInstructions: e.target.value })} placeholder="e.g. See on-site manager" className="h-10" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button variant="outline" onClick={addProperty} className="w-full gap-2 border-dashed">
          <Plus className="h-4 w-4" /> Add Property
        </Button>

        {pm.properties.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Add at least one property to continue.
          </p>
        )}
      </div>
    </div>
  );
}
