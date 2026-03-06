"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { Clock, Check, Truck } from "lucide-react";
import { usePropertyStore, type AvailableDay, type AvailableHour, type VehicleType } from "@/stores/property-store";
import { cn } from "@/lib/utils";

const days: { value: AvailableDay; label: string; short: string }[] = [
  { value: "mon", label: "Monday", short: "Mon" },
  { value: "tue", label: "Tuesday", short: "Tue" },
  { value: "wed", label: "Wednesday", short: "Wed" },
  { value: "thu", label: "Thursday", short: "Thu" },
  { value: "fri", label: "Friday", short: "Fri" },
  { value: "sat", label: "Saturday", short: "Sat" },
  { value: "sun", label: "Sunday", short: "Sun" },
];

const hourPeriods: { value: AvailableHour; label: string; time: string }[] = [
  { value: "morning", label: "Morning", time: "6 AM - 12 PM" },
  { value: "afternoon", label: "Afternoon", time: "12 PM - 6 PM" },
  { value: "evening", label: "Evening", time: "6 PM - 10 PM" },
];

const vehicleTypes: { value: VehicleType; label: string }[] = [
  { value: "pickup-truck", label: "Pickup Truck" },
  { value: "cargo-van", label: "Cargo Van" },
  { value: "box-truck", label: "Box Truck" },
  { value: "trailer", label: "Trailer" },
  { value: "other", label: "Other" },
];

export function StepContractorAvailability() {
  const { contractor, setContractor } = usePropertyStore();

  const toggleDay = (day: AvailableDay) => {
    const current = contractor.availableDays;
    if (current.includes(day)) {
      setContractor({ availableDays: current.filter((d) => d !== day) });
    } else {
      setContractor({ availableDays: [...current, day] });
    }
  };

  const toggleHour = (hour: AvailableHour) => {
    const current = contractor.availableHours;
    if (current.includes(hour)) {
      setContractor({ availableHours: current.filter((h) => h !== hour) });
    } else {
      setContractor({ availableHours: [...current, hour] });
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
          <Clock className="h-6 w-6" />
        </div>
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Availability</h2>
        <p className="mt-2 text-center text-muted-foreground">Let us know when you are available to take on jobs.</p>
      </div>

      <div className="mt-8 space-y-6">
        {/* Available Days */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <Label className="mb-3 block text-sm font-semibold">Available Days</Label>
            <div className="flex flex-wrap gap-2">
              {days.map((day) => {
                const isSelected = contractor.availableDays.includes(day.value);
                return (
                  <motion.button
                    key={day.value}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => toggleDay(day.value)}
                    className={cn(
                      "flex h-12 w-12 flex-col items-center justify-center rounded-full border-2 text-xs font-semibold transition-all sm:h-14 sm:w-14",
                      isSelected
                        ? "border-sky-500 bg-sky-500 text-white shadow-md"
                        : "border-border text-muted-foreground hover:border-sky-500/40 hover:bg-muted/50"
                    )}
                  >
                    {isSelected ? (
                      <Check className="h-4 w-4" />
                    ) : null}
                    <span className={isSelected ? "text-[10px]" : "text-xs"}>{day.short}</span>
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Available Hours */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <Label className="mb-3 block text-sm font-semibold">Available Hours</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {hourPeriods.map((period) => {
                const isSelected = contractor.availableHours.includes(period.value);
                return (
                  <motion.button
                    key={period.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleHour(period.value)}
                    className={cn(
                      "relative rounded-xl border-2 p-4 text-center transition-all",
                      isSelected
                        ? "border-sky-500 bg-sky-500/[0.06] shadow-sm"
                        : "border-border/50 hover:border-sky-500/30 hover:bg-muted/50"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-500"
                      >
                        <Check className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                    <p className="text-sm font-semibold">{period.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{period.time}</p>
                  </motion.button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Jobs Per Week */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Jobs Per Week Capacity</Label>
              <motion.span
                key={contractor.jobsPerWeek}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="text-xl font-bold text-sky-600"
              >
                {contractor.jobsPerWeek}
              </motion.span>
            </div>
            <Slider
              value={[contractor.jobsPerWeek]}
              onValueChange={([v]) => setContractor({ jobsPerWeek: v })}
              min={1}
              max={20}
              step={1}
              className="mt-4"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>1 job</span>
              <span>20 jobs</span>
            </div>
          </CardContent>
        </Card>

        {/* Equipment & Vehicle */}
        <Card>
          <CardContent className="space-y-5 p-5 sm:p-6">
            <div className="flex items-center justify-between rounded-xl border p-4">
              <div>
                <Label className="text-sm font-semibold">Own Equipment</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Do you have your own tools and equipment for the services you offer?
                </p>
              </div>
              <Switch
                checked={contractor.hasOwnEquipment}
                onCheckedChange={(v) => setContractor({ hasOwnEquipment: v })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-semibold">Vehicle Type</Label>
              </div>
              <Select
                value={contractor.vehicleType}
                onValueChange={(v: VehicleType) => setContractor({ vehicleType: v })}
              >
                <SelectTrigger className="h-11 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((vt) => (
                    <SelectItem key={vt.value} value={vt.value}>
                      {vt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
