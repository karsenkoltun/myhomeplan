"use client";

import { useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Check,
  CornerDownRight,
  DoorOpen,
  CircleParking,
  Trees,
  Landmark,
  Home,
  Sofa,
  ArrowUpDown,
  AlertTriangle,
  DollarSign,
  Star,
  CalendarClock,
  MessageSquareWarning,
  Siren,
  GripVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { usePropertyStore, type StrataCoveredArea, type StrataPainPoint } from "@/stores/property-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { StepValidationRef } from "./step-property-info";

// --- Data ---

const coveredAreaOptions: { value: StrataCoveredArea; label: string; icon: typeof DoorOpen }[] = [
  { value: "hallways", label: "Hallways & Corridors", icon: CornerDownRight },
  { value: "lobbies", label: "Lobbies & Entrances", icon: DoorOpen },
  { value: "parking", label: "Parking Areas", icon: CircleParking },
  { value: "grounds", label: "Grounds & Landscaping", icon: Trees },
  { value: "exterior", label: "Building Exterior", icon: Landmark },
  { value: "roof", label: "Roof", icon: Home },
  { value: "amenity-rooms", label: "Amenity Rooms", icon: Sofa },
  { value: "elevators-stairwells", label: "Elevators & Stairwells", icon: ArrowUpDown },
];

const budgetRanges = [
  { value: "0", label: "Not sure yet" },
  { value: "25000", label: "Under $25,000" },
  { value: "50000", label: "$25,000 - $50,000" },
  { value: "100000", label: "$50,000 - $100,000" },
  { value: "200000", label: "$100,000 - $200,000" },
  { value: "300000", label: "$200,000+" },
];

const painPointOptions: { value: StrataPainPoint; label: string; description: string; icon: typeof AlertTriangle }[] = [
  { value: "reliability", label: "Contractor Reliability", description: "Hard to find contractors who show up consistently", icon: AlertTriangle },
  { value: "cost", label: "Cost Overruns", description: "Maintenance costs exceeding budget regularly", icon: DollarSign },
  { value: "quality", label: "Quality Inconsistency", description: "Service quality varies from visit to visit", icon: Star },
  { value: "scheduling", label: "Scheduling Issues", description: "Difficulty coordinating multiple service providers", icon: CalendarClock },
  { value: "communication", label: "Poor Communication", description: "Contractors don't communicate well with management", icon: MessageSquareWarning },
  { value: "emergency", label: "Emergency Response", description: "Slow response times for urgent issues", icon: Siren },
];

const priorityAreaLabels: Record<string, string> = {
  "hallways": "Hallways",
  "lobbies": "Lobbies",
  "parking": "Parking",
  "grounds": "Grounds",
  "exterior": "Exterior",
  "roof": "Roof",
  "amenity-rooms": "Amenity Rooms",
  "elevators-stairwells": "Elevators",
};

// --- Component ---

export const StepStrataCoverage = forwardRef<StepValidationRef>(function StepStrataCoverage(_props, ref) {
  const { strata, setStrata } = usePropertyStore();
  const [shaking, setShaking] = useState(false);

  const validate = useCallback(() => {
    if (strata.coveredAreas.length === 0) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      toast.error("Please select at least one area your strata covers");
      return false;
    }
    return true;
  }, [strata.coveredAreas]);

  useImperativeHandle(ref, () => ({ validate }), [validate]);

  const toggleCoveredArea = (area: StrataCoveredArea) => {
    const current = strata.coveredAreas;
    let updated: StrataCoveredArea[];
    if (current.includes(area)) {
      updated = current.filter((a) => a !== area);
    } else {
      updated = [...current, area];
    }
    setStrata({ coveredAreas: updated });

    // Also update priority areas to stay in sync
    const currentPriorities = strata.priorityAreas.filter((p) => updated.includes(p as StrataCoveredArea));
    if (!updated.includes(area as StrataCoveredArea) && strata.priorityAreas.includes(area)) {
      setStrata({ priorityAreas: currentPriorities });
    }
  };

  const togglePainPoint = (pp: StrataPainPoint) => {
    const current = strata.currentPainPoints;
    if (current.includes(pp)) {
      setStrata({ currentPainPoints: current.filter((p) => p !== pp) });
    } else {
      setStrata({ currentPainPoints: [...current, pp] });
    }
  };

  const movePriorityUp = (index: number) => {
    if (index <= 0) return;
    const arr = [...strata.priorityAreas];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    setStrata({ priorityAreas: arr });
  };

  const movePriorityDown = (index: number) => {
    if (index >= strata.priorityAreas.length - 1) return;
    const arr = [...strata.priorityAreas];
    [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
    setStrata({ priorityAreas: arr });
  };

  const togglePriorityArea = (area: string) => {
    const current = strata.priorityAreas;
    if (current.includes(area)) {
      setStrata({ priorityAreas: current.filter((p) => p !== area) });
    } else {
      setStrata({ priorityAreas: [...current, area] });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Coverage & Priorities</h2>
      <p className="mt-2 text-center text-muted-foreground">Help us understand what your strata needs so we can match the right services.</p>

      <div className={cn("mt-8 space-y-6", shaking && "animate-shake")}>
        {/* Covered Areas */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-1 text-sm font-semibold text-muted-foreground uppercase tracking-wider">What does your strata cover?</h3>
            <p className="mb-4 text-xs text-muted-foreground">Select all areas that your strata corporation is responsible for maintaining.</p>
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {coveredAreaOptions.map((area) => {
                const isSelected = strata.coveredAreas.includes(area.value);
                return (
                  <motion.button
                    key={area.value}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggleCoveredArea(area.value)}
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
                    <area.icon className={cn("h-5 w-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-xs font-medium text-center leading-tight">{area.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Budget & Priorities */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Budget & Priorities</h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Annual Maintenance Budget</Label>
                <Select
                  value={String(strata.annualMaintenanceBudget)}
                  onValueChange={(v) => setStrata({ annualMaintenanceBudget: Number(v) })}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetRanges.map((b) => (
                      <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Areas */}
              {strata.coveredAreas.length > 0 && (
                <div className="space-y-2">
                  <Label>Priority Areas</Label>
                  <p className="text-xs text-muted-foreground">Select and rank your maintenance priorities. Click to add, use arrows to reorder.</p>

                  {/* Available areas to add */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {strata.coveredAreas
                      .filter((a) => !strata.priorityAreas.includes(a))
                      .map((area) => (
                        <motion.button
                          key={area}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => togglePriorityArea(area)}
                          className="rounded-full border border-dashed border-primary/40 px-3 py-1 text-xs font-medium text-muted-foreground hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          + {priorityAreaLabels[area] || area}
                        </motion.button>
                      ))}
                  </div>

                  {/* Ranked list */}
                  {strata.priorityAreas.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {strata.priorityAreas.map((area, index) => (
                        <motion.div
                          key={area}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2"
                        >
                          <Badge variant="secondary" className="h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 text-[10px] font-bold">
                            {index + 1}
                          </Badge>
                          <GripVertical className="h-3.5 w-3.5 text-muted-foreground/50" />
                          <span className="flex-1 text-sm font-medium">{priorityAreaLabels[area] || area}</span>
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => movePriorityUp(index)}
                              disabled={index === 0}
                              className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => movePriorityDown(index)}
                              disabled={index === strata.priorityAreas.length - 1}
                              className="rounded p-0.5 hover:bg-muted disabled:opacity-30"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => togglePriorityArea(area)}
                              className="ml-1 rounded p-0.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                            >
                              <span className="text-xs font-medium">Remove</span>
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current Challenges */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <h3 className="mb-1 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Current Challenges</h3>
            <p className="mb-4 text-xs text-muted-foreground">What maintenance pain points does your strata face? Select all that apply.</p>
            <div className="space-y-2">
              {painPointOptions.map((pp) => {
                const isSelected = strata.currentPainPoints.includes(pp.value);
                return (
                  <motion.button
                    key={pp.value}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => togglePainPoint(pp.value)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all sm:p-4",
                      isSelected
                        ? "border-primary bg-primary/[0.04] shadow-sm"
                        : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <motion.div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                        isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                      )}
                      animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                    >
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </motion.div>
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <pp.icon className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <div className="min-w-0">
                        <span className="text-sm font-semibold">{pp.label}</span>
                        <p className="text-xs text-muted-foreground">{pp.description}</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});
