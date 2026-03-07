"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { usePropertyStore, type StrataCurrentProvider } from "@/stores/property-store";
import { ClipboardList, Plus, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const providerCategories = [
  "Landscaping",
  "Snow Removal",
  "Cleaning",
  "HVAC / Mechanical",
  "Plumbing",
  "Electrical",
  "Elevator Service",
  "Fire & Safety",
  "Pest Control",
  "Painting",
  "Roof Maintenance",
  "Other",
];

export function StepStrataCurrentProviders() {
  const { strata, setStrata } = usePropertyStore();

  const addProvider = () => {
    setStrata({
      currentProviders: [
        ...strata.currentProviders,
        { category: "", companyName: "", contractEndDate: "", satisfaction: 3, notes: "" },
      ],
    });
  };

  const removeProvider = (index: number) => {
    setStrata({
      currentProviders: strata.currentProviders.filter((_, i) => i !== index),
    });
  };

  const updateProvider = (index: number, updates: Partial<StrataCurrentProvider>) => {
    const updated = [...strata.currentProviders];
    updated[index] = { ...updated[index], ...updates };
    setStrata({ currentProviders: updated });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <ClipboardList className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Current Service Providers</h2>
        <p className="mt-2 text-center text-muted-foreground">Tell us about your existing providers so we can plan a smooth transition.</p>
      </div>

      <div className="mt-8 space-y-6">
        <AnimatePresence>
          {strata.currentProviders.map((provider, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card>
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold">Provider {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProvider(index)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Service Category</Label>
                      <Select value={provider.category} onValueChange={(v) => updateProvider(index, { category: v })}>
                        <SelectTrigger className="h-11"><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {providerCategories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={provider.companyName}
                        onChange={(e) => updateProvider(index, { companyName: e.target.value })}
                        placeholder="e.g. ABC Landscaping"
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contract End Date</Label>
                      <Input
                        type="date"
                        value={provider.contractEndDate}
                        onChange={(e) => updateProvider(index, { contractEndDate: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Satisfaction (1-5)</Label>
                      <div className="flex items-center gap-1 pt-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => updateProvider(index, { satisfaction: rating })}
                            className="p-0.5"
                          >
                            <Star
                              className={cn(
                                "h-6 w-6 transition-colors",
                                rating <= provider.satisfaction
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Notes <span className="text-xs text-muted-foreground">(optional)</span></Label>
                      <Input
                        value={provider.notes}
                        onChange={(e) => updateProvider(index, { notes: e.target.value })}
                        placeholder="e.g. Good work but expensive, contract auto-renews"
                        className="h-11"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button
          variant="outline"
          onClick={addProvider}
          className="w-full gap-2 border-dashed"
        >
          <Plus className="h-4 w-4" /> Add Current Provider
        </Button>

        {strata.currentProviders.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No current providers? No problem - just click Next to continue.
          </p>
        )}
      </div>
    </div>
  );
}
