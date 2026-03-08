"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBookingStore } from "@/stores/booking-store";
import { FadeIn } from "@/components/ui/motion";
import { motion, AnimatePresence } from "framer-motion";
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
  AlertTriangle,
  LayoutGrid,
  Rows3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FullScreenCalendar = dynamic(
  () =>
    import("@/components/ui/fullscreen-calendar").then((mod) => ({
      default: mod.FullScreenCalendar,
    })),
  { ssr: false }
);

const TIME_SLOTS = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
];

type ViewMode = "week" | "calendar";

export function StepDatetime() {
  const { draft, updateDraft, setBookingStep } = useBookingStore();
  const today = startOfToday();
  const [weekStart, setWeekStart] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("week");

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

  function handleCalendarDateSelect(date: Date) {
    setSelectedDate(date);
    setSelectedTime(null);
    if (validationError) setValidationError(null);
  }

  function handleContinue() {
    if (!selectedDate) {
      setValidationError("Please select a date for your service");
      return;
    }
    if (!selectedTime) {
      setValidationError("Please select a time slot");
      return;
    }
    setValidationError(null);
    updateDraft({
      scheduledDate: format(selectedDate, "yyyy-MM-dd"),
      scheduledTime: selectedTime,
    });
    setBookingStep(2);
  }

  // Shared time slots component
  const timeSlots = selectedDate && (
    <div className="mt-6">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Clock className="h-4 w-4 text-muted-foreground" />
        Available times for {format(selectedDate, "EEEE, MMM d")}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
        {TIME_SLOTS.map((time) => (
          <button
            key={time}
            onClick={() => {
              setSelectedTime(time);
              if (validationError) setValidationError(null);
            }}
            className={cn(
              "rounded-lg border px-3 py-2.5 text-sm transition-colors min-h-[44px]",
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
  );

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Pick Date & Time</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select your preferred date and time for {draft?.serviceName}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex shrink-0 -space-x-px rounded-lg shadow-sm shadow-black/5">
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            className="rounded-none rounded-l-lg shadow-none focus-visible:z-10"
            onClick={() => setViewMode("week")}
          >
            <Rows3 className="mr-1.5 h-3.5 w-3.5" />
            Week
          </Button>
          <Button
            variant={viewMode === "calendar" ? "default" : "outline"}
            size="sm"
            className="rounded-none rounded-r-lg shadow-none focus-visible:z-10"
            onClick={() => setViewMode("calendar")}
          >
            <LayoutGrid className="mr-1.5 h-3.5 w-3.5" />
            Month
          </Button>
        </div>
      </div>

      <FadeIn delay={0.1}>
        {viewMode === "week" ? (
          /* Week View */
          <Card className="mt-6">
            <CardContent className="p-4">
              {/* Week Navigation */}
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" className="h-11 w-11 min-h-[44px] min-w-[44px]" onClick={prevWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {format(weekStart, "MMM d")} - {format(endOfWeek(weekStart, { weekStartsOn: 1 }), "MMM d, yyyy")}
                </div>
                <Button variant="ghost" size="icon" className="h-11 w-11 min-h-[44px] min-w-[44px]" onClick={nextWeek}>
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
                        if (validationError) setValidationError(null);
                      }}
                      className={cn(
                        "flex flex-col items-center rounded-lg border p-2 text-center transition-colors min-h-[44px] justify-center",
                        isPast && "cursor-not-allowed opacity-40",
                        !isPast && !isSelected && "hover:border-primary/30 hover:bg-muted/50",
                        isSelected && "border-primary bg-primary/10",
                      )}
                    >
                      <span className="text-xs font-medium text-muted-foreground">
                        {format(day, "EEE")}
                      </span>
                      <span className="text-sm font-semibold">{format(day, "d")}</span>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots */}
              {timeSlots}
            </CardContent>
          </Card>
        ) : (
          /* Calendar (Month) View */
          <div className="mt-6 space-y-4">
            <Card>
              <CardContent className="p-0">
                <FullScreenCalendar
                  data={[]}
                  onDateSelect={handleCalendarDateSelect}
                  selectedDate={selectedDate}
                  disablePastDates
                />
              </CardContent>
            </Card>

            {/* Time Slots below calendar */}
            {selectedDate && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Available times for {format(selectedDate, "EEEE, MMM d")}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {TIME_SLOTS.map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          if (validationError) setValidationError(null);
                        }}
                        className={cn(
                          "rounded-lg border px-3 py-2.5 text-sm transition-colors min-h-[44px]",
                          selectedTime === time
                            ? "border-primary bg-primary/10 font-medium text-primary"
                            : "hover:border-primary/30 hover:bg-muted/50",
                        )}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </FadeIn>

      {/* Validation Alert */}
      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-4"
          >
            <Alert variant="warning" icon={<AlertTriangle className="h-4 w-4" />}>
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={() => setBookingStep(0)}>
          Back
        </Button>
        <Button onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
