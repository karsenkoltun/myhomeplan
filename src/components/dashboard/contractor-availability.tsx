"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { FadeIn } from "@/components/ui/motion";
import { Calendar, Clock, Briefcase, CheckCircle2, Loader2 } from "lucide-react";
import { updateContractorAvailability } from "@/lib/supabase/queries";
import { toast } from "sonner";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const HOURS = [
  { value: "morning", label: "Morning", time: "6 AM - 12 PM" },
  { value: "afternoon", label: "Afternoon", time: "12 PM - 5 PM" },
  { value: "evening", label: "Evening", time: "5 PM - 9 PM" },
] as const;

export function ContractorAvailability({
  contractorProfileId,
  initialDays,
  initialHours,
  initialJobsPerWeek,
}: {
  contractorProfileId: string;
  initialDays: string[];
  initialHours: string[];
  initialJobsPerWeek: number;
}) {
  const [selectedDays, setSelectedDays] = useState<string[]>(initialDays);
  const [selectedHours, setSelectedHours] = useState<string[]>(initialHours);
  const [jobsPerWeek, setJobsPerWeek] = useState(initialJobsPerWeek);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleDay = (day: string) => {
    setSaved(false);
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleHour = (hour: string) => {
    setSaved(false);
    setSelectedHours((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour]
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaved(false);
      await updateContractorAvailability(
        contractorProfileId,
        selectedDays,
        selectedHours,
        jobsPerWeek
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Failed to save availability. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FadeIn>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="h-4 w-4" />
            Availability
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Available Days */}
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              Available Days
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {DAYS.map((day) => (
                <label
                  key={day}
                  className="flex cursor-pointer items-center gap-2 rounded-md border p-2.5 transition-colors hover:bg-muted/50 has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5"
                >
                  <Checkbox
                    checked={selectedDays.includes(day)}
                    onCheckedChange={() => toggleDay(day)}
                  />
                  <span className="text-sm">{day}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Available Hours */}
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-sm font-medium">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              Available Hours
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {HOURS.map((hour) => (
                <label
                  key={hour.value}
                  className="flex cursor-pointer items-center gap-2 rounded-md border p-3 transition-colors hover:bg-muted/50 has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/5"
                >
                  <Checkbox
                    checked={selectedHours.includes(hour.value)}
                    onCheckedChange={() => toggleHour(hour.value)}
                  />
                  <div>
                    <p className="text-sm font-medium">{hour.label}</p>
                    <p className="text-xs text-muted-foreground">{hour.time}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Separator />

          {/* Jobs Per Week */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-sm font-medium">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                Jobs Per Week
              </p>
              <span className="text-sm font-semibold">{jobsPerWeek}</span>
            </div>
            <Slider
              value={[jobsPerWeek]}
              onValueChange={([val]) => {
                setJobsPerWeek(val);
                setSaved(false);
              }}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
            </div>
          </div>

          <Separator />

          {/* Save Button */}
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Availability"
              )}
            </Button>
            {saved && (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Saved successfully
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
