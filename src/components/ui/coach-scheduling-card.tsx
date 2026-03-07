"use client"

import { motion, useReducedMotion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, ChevronDown, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeSlot {
  time: string
  available: boolean
}

interface DaySchedule {
  date: string
  dayName: string
  dayNumber: number
  slots: TimeSlot[]
  hasAvailability: boolean
}

interface Coach {
  name: string
  title: string
  location: string
  rating: number
  reviewCount: number
  imageUrl: string
}

interface CoachSchedulingProps {
  coach?: Coach
  locations?: string[]
  weekSchedule?: DaySchedule[]
  onLocationChange?: (location: string) => void
  onTimeSlotSelect?: (day: string, time: string) => void
  onWeekChange?: (direction: "prev" | "next") => void
  enableAnimations?: boolean
  className?: string
}

const defaultCoach: Coach = {
  name: "Michael Baumgardner",
  title: "Tennis coach",
  location: "New York",
  rating: 5.0,
  reviewCount: 7,
  imageUrl: "https://images.unsplash.com/photo-1660463532854-f887f2a6c674",
}

const defaultLocations = [
  "Riverbank State Park Tennis Courts",
  "Central Park Tennis Center",
  "Brooklyn Bridge Park Courts",
  "Prospect Park Tennis Center",
]

const defaultWeekSchedule: DaySchedule[] = [
  {
    date: "Aug 17",
    dayName: "Today",
    dayNumber: 17,
    hasAvailability: true,
    slots: [
      { time: "10:30 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "11:30 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "12:30 PM", available: true },
      { time: "01:00 PM", available: false },
      { time: "01:30 PM", available: true },
      { time: "02:00 PM", available: true },
    ],
  },
  {
    date: "Aug 18",
    dayName: "Tue",
    dayNumber: 18,
    hasAvailability: true,
    slots: [
      { time: "10:30 AM", available: true },
      { time: "11:00 AM", available: true },
      { time: "11:30 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "03:00 PM", available: true },
    ],
  },
  {
    date: "Aug 19",
    dayName: "Wed",
    dayNumber: 19,
    hasAvailability: true,
    slots: [
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: true },
      { time: "12:30 PM", available: true },
      { time: "01:30 PM", available: false },
      { time: "02:00 PM", available: true },
    ],
  },
  {
    date: "Aug 20",
    dayName: "Thu",
    dayNumber: 20,
    hasAvailability: false,
    slots: [],
  },
  {
    date: "Aug 21",
    dayName: "Fri",
    dayNumber: 21,
    hasAvailability: false,
    slots: [],
  },
  {
    date: "Aug 22",
    dayName: "Sat",
    dayNumber: 22,
    hasAvailability: false,
    slots: [],
  },
]

export function CoachSchedulingCard({
  coach = defaultCoach,
  locations = defaultLocations,
  weekSchedule = defaultWeekSchedule,
  onLocationChange,
  onTimeSlotSelect,
  onWeekChange,
  enableAnimations = true,
  className,
}: CoachSchedulingProps) {
  const [selectedLocation, setSelectedLocation] = useState(locations[0])
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false)
  const [weekRange] = useState("Aug 17 - Aug 22")
  const [showConfirmationView, setShowConfirmationView] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    day: string
    time: string
    dayName: string
  } | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = enableAnimations && !shouldReduceMotion
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLocationDropdownOpen(false)
    }
    document.addEventListener("keydown", handleEscapeKey)
    return () => document.removeEventListener("keydown", handleEscapeKey)
  }, [])

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location)
    setIsLocationDropdownOpen(false)
    onLocationChange?.(location)
  }

  const handleTimeSlotClick = (day: string, time: string) => {
    const dayInfo = weekSchedule.find((d) => d.date === day)
    setSelectedTimeSlot({ day, time, dayName: dayInfo?.dayName || day })
    setShowConfirmationView(true)
    onTimeSlotSelect?.(day, time)
  }

  const handleBackToMain = () => {
    setShowConfirmationView(false)
    setSelectedTimeSlot(null)
  }

  const handleConfirmBooking = () => {
    setShowConfirmationView(false)
    setSelectedTimeSlot(null)
  }

  const handleWeekNavigation = (direction: "prev" | "next") => {
    onWeekChange?.(direction)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -25, scale: 0.95, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 400, damping: 28, mass: 0.6 },
    },
  }

  const timeSlotVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 400, damping: 25 },
    },
  }

  return (
    <motion.div
      variants={shouldAnimate ? containerVariants : {}}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      className={cn(
        "bg-card rounded-xl border border-border/50 shadow-lg overflow-hidden max-w-2xl relative",
        className,
      )}
    >
      <div className="relative h-auto">
        <motion.div
          initial={false}
          animate={{
            y: showConfirmationView ? "-20px" : "0px",
            opacity: showConfirmationView ? 0.3 : 1,
            scale: showConfirmationView ? 0.95 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
          className="w-full"
        >
          {/* Coach Profile Header */}
          <motion.div variants={shouldAnimate ? itemVariants : {}} className="p-6 pb-6">
            <div className="flex items-start justify-between gap-6">
              <motion.div
                whileHover={
                  shouldAnimate
                    ? { scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 25 } }
                    : {}
                }
                className="flex-shrink-0"
              >
                <img
                  src={coach.imageUrl}
                  alt={coach.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </motion.div>
              <div className="flex-1 min-w-0 space-y-4">
                <h2 className="text-xl font-semibold text-foreground">{coach.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-medium">{coach.rating}</span>
                    <span className="underline hover:text-foreground transition-colors cursor-pointer">
                      ({coach.reviewCount} reviews)
                    </span>
                  </div>
                  <span>-</span>
                  <span>{coach.title}</span>
                  <span>-</span>
                  <span>{coach.location}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Per Session
                </p>
                <p className="text-2xl font-bold text-primary">$75</p>
              </div>
            </div>
          </motion.div>

          {/* Location Selector */}
          <motion.div
            variants={shouldAnimate ? itemVariants : {}}
            className="px-6 pb-4 relative z-50"
            style={{ overflow: "visible" }}
          >
            <label className="block text-sm text-muted-foreground mb-2">Choose location</label>
            <div className="relative z-50" ref={dropdownRef}>
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                aria-expanded={isLocationDropdownOpen}
                aria-haspopup="listbox"
                className="w-full flex items-center justify-between p-3 bg-muted rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <span className="text-foreground">{selectedLocation}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform",
                    isLocationDropdownOpen && "rotate-180",
                  )}
                />
              </button>
              <AnimatePresence>
                {isLocationDropdownOpen && (
                  <motion.div
                    initial={shouldAnimate ? { opacity: 0, y: -10, scale: 0.95 } : {}}
                    animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : {}}
                    exit={shouldAnimate ? { opacity: 0, y: -10, scale: 0.95 } : {}}
                    transition={shouldAnimate ? { type: "spring", stiffness: 400, damping: 25 } : {}}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/50 rounded-lg shadow-xl z-[9999] overflow-hidden"
                    role="listbox"
                  >
                    {locations.map((location, index) => (
                      <motion.button
                        key={location}
                        initial={shouldAnimate ? { opacity: 0, x: -10 } : {}}
                        animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
                        transition={shouldAnimate ? { delay: index * 0.05 } : {}}
                        onClick={() => handleLocationChange(location)}
                        role="option"
                        aria-selected={location === selectedLocation}
                        className="w-full text-left p-3 hover:bg-muted transition-colors text-foreground"
                      >
                        {location}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div variants={shouldAnimate ? itemVariants : {}} className="mx-6 border-t border-border/50" />

          {/* Week Navigation */}
          <motion.div variants={shouldAnimate ? itemVariants : {}} className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => handleWeekNavigation("prev")}
                aria-label="Previous week"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h3 className="font-semibold text-foreground">{weekRange}</h3>
              <button
                onClick={() => handleWeekNavigation("next")}
                aria-label="Next week"
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </motion.div>

          {/* Daily Schedule */}
          <motion.div variants={shouldAnimate ? itemVariants : {}} className="px-6 pb-6 space-y-4">
            {weekSchedule.map((day) => (
              <motion.div key={day.date} variants={shouldAnimate ? itemVariants : {}} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">
                    {day.dayName}, {day.date}
                  </h4>
                  {!day.hasAvailability && (
                    <span className="text-sm text-muted-foreground">No Availability</span>
                  )}
                </div>
                {day.hasAvailability && (
                  <motion.div variants={shouldAnimate ? containerVariants : {}} className="flex flex-wrap gap-2">
                    {day.slots.map((slot) => (
                      <motion.button
                        key={`${day.date}-${slot.time}`}
                        variants={shouldAnimate ? timeSlotVariants : {}}
                        whileHover={
                          shouldAnimate && slot.available
                            ? { scale: 1.05, y: -2, transition: { type: "spring", stiffness: 400, damping: 25 } }
                            : {}
                        }
                        whileTap={shouldAnimate && slot.available ? { scale: 0.98 } : {}}
                        onClick={() => slot.available && handleTimeSlotClick(day.date, slot.time)}
                        disabled={!slot.available}
                        className={cn(
                          "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                          slot.available
                            ? "bg-background border-border/50 hover:border-border hover:bg-muted text-foreground cursor-pointer"
                            : "bg-muted/50 border-border/30 text-muted-foreground cursor-not-allowed opacity-60",
                        )}
                      >
                        {slot.time}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom Actions */}
          <motion.div variants={shouldAnimate ? itemVariants : {}} className="border-t border-border/50 p-6">
            <div className="flex gap-3">
              <button className="flex-1 bg-muted text-muted-foreground py-2.5 rounded-lg hover:bg-muted/80 transition-colors">
                Cancel
              </button>
              <button className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium">
                Next
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Confirmation View */}
        <motion.div
          initial={false}
          animate={{
            y: showConfirmationView ? "0%" : "100%",
            opacity: showConfirmationView ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
          className="absolute top-0 left-0 w-full h-full bg-card"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h3 className="text-lg font-semibold text-foreground">Confirm Booking</h3>
              <div />
            </div>
            <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <img src={coach.imageUrl} alt={coach.name} className="w-12 h-12 rounded-lg object-cover" />
              <div>
                <h4 className="font-semibold text-foreground">{coach.name}</h4>
                <p className="text-sm text-muted-foreground">{coach.title}</p>
              </div>
            </div>
            {selectedTimeSlot && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">Your Booking</p>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <p className="text-lg font-semibold text-foreground">
                      {selectedTimeSlot.dayName}, {selectedTimeSlot.day}
                    </p>
                    <p className="text-xl font-bold text-primary">{selectedTimeSlot.time}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground font-medium">{selectedLocation}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="text-foreground font-medium">1 hour</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="text-foreground font-medium">$75</span>
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={handleConfirmBooking}
              className="w-full relative overflow-hidden py-3 rounded-lg font-semibold transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground border cursor-pointer group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                CONFIRM BOOKING
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
