"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingStore } from "@/stores/booking-store";
import { FadeIn } from "@/components/ui/motion";
import {
  add,
  eachDayOfInterval,
  format,
  startOfToday,
  startOfWeek,
  endOfWeek,
  isBefore,
  isEqual,
  isSameDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

export function StepDatetime() {
  const { draft, updateDraft, setBookingStep } = useBookingStore();
  const today = startOfToday();
  const [weekStart, setWeekStart] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 }),
  });

  function prevWeek() {
    const prev = add(weekStart, { weeks: -1 });
    if (!isBefore(prev, startOfWeek(today, { weekStartsOn: 1 }))) {
      setWeekStart(prev);
    }
  }

  function nextWeek() {
    setWeekStart(add(weekStart, { weeks: 1 }));
  }

  function handleContinue() {
    if (!selectedDate || !selectedTime) return;
    updateDraft({
      scheduledDate: format(selectedDate, "yyyy-MM-dd"),
      scheduledTime: selectedTime,
    });
    setBookingStep(2);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Pick Date & Time</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Select your preferred date and time for {draft?.serviceName}
      </p>

      <FadeIn delay={0.1}>
        <Card className="mt-6">
          <CardContent className="p-4">
            {/* Week Navigation */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={prevWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                {format(weekStart, "MMM d")} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), "MMM d, yyyy")}
              </div>
              <Button variant="ghost" size="icon" onClick={nextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Day Grid */}
            <div className="mt-4 grid grid-cols-7 gap-2">
              {weekDays.map((day) => {
                const isPast = isBefore(day, today);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                return (
                  <button
                    key={day.toISOString()}
                    disabled={isPast}
                    onClick={() => {
                      setSelectedDate(day);
                      setSelectedTime(null);
                    }}
                    className={cn(
                      "flex flex-col items-center rounded-lg border p-2 text-center transition-colors",
                      isPast && "cursor-not-allowed opacity-40",
                      !isPast && !isSelected && "hover:border-primary/30 hover:bg-muted/50",
                      isSelected && "border-primary bg-primary/10",
                    )}
                  >
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {format(day, "EEE")}
                    </span>
                    <span className="text-sm font-semibold">{format(day, "d")}</span>
                  </button>
                );
              })}
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="mt-6">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Available times for {format(selectedDate, "EEEE, MMM d")}
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {TIME_SLOTS.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm transition-colors",
                        selectedTime === time
                          ? "border-primary bg-primary/10 font-medium text-primary"
                          : "hover:border-primary/30 hover:bg-muted/50",
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => setBookingStep(0)}>
          Back
        </Button>
        <Button disabled={!selectedDate || !selectedTime} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
