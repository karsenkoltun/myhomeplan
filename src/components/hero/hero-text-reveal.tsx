"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Check,
  Calendar,
  Shield,
  Scissors,
  Snowflake,
  Zap,
  Sparkles,
  Home,
  TrendingDown,
  Bell,
  Clock,
  Star,
  Droplets,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShimmerButton } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

export function HeroTextReveal() {
  return (
    <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-[1280px] items-center px-6 sm:px-8 lg:px-12">
      <div className="grid w-full grid-cols-1 items-center gap-12 py-32 lg:grid-cols-2 lg:gap-20">
        {/* ── LEFT: TEXT ── */}
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Badge
              variant="secondary"
              className="mb-8 gap-1.5 border-primary/20 bg-white/70 px-4 py-1.5 text-primary backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Now Serving the Okanagan Valley
            </Badge>
          </motion.div>

          <h1 className="text-[2.75rem] font-bold leading-[1.08] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-[4.25rem] xl:text-[5rem]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              Every home
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease }}
            >
              service.
            </motion.span>
            <motion.span
              className="block animated-gradient-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease }}
            >
              One simple plan.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Lawn care, snow removal, cleaning, and 15+ services bundled into one
            predictable monthly price.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
          >
            <Link href="/onboarding">
              <ShimmerButton className="h-12 px-8 text-base">
                Build Your Plan
                <ArrowRight className="ml-2 inline h-4 w-4" />
              </ShimmerButton>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              className="h-12 px-6 text-base text-muted-foreground hover:text-foreground"
              asChild
            >
              <Link href="/how-it-works">
                See How It Works
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
            className="mt-5 text-sm text-muted-foreground/70"
          >
            Plans starting at $89/month &middot; Cancel anytime
          </motion.p>
        </div>

        {/* ── RIGHT: PRODUCT DASHBOARD ── */}
        <div className="relative hidden lg:block">
          <div className="relative h-[580px] w-full">
            {/* Main dashboard card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease }}
              className="relative z-10 mx-auto w-[420px]"
            >
              <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/95 shadow-2xl shadow-black/10 backdrop-blur-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                      <Home className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">My Home Plan</p>
                      <p className="text-[11px] text-gray-500">4 bed &middot; 2 bath &middot; 0.25 acres</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-semibold text-emerald-700">Active</span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                  <div className="px-4 py-3.5 text-center">
                    <p className="text-lg font-bold text-gray-900">6</p>
                    <p className="text-[10px] text-gray-400">Services</p>
                  </div>
                  <div className="px-4 py-3.5 text-center">
                    <p className="text-lg font-bold text-emerald-600">$847</p>
                    <p className="text-[10px] text-gray-400">Saved / yr</p>
                  </div>
                  <div className="px-4 py-3.5 text-center">
                    <p className="text-lg font-bold text-gray-900">$159</p>
                    <p className="text-[10px] text-gray-400">Per month</p>
                  </div>
                </div>

                {/* Upcoming schedule */}
                <div className="px-6 py-4">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Upcoming Schedule
                  </p>
                  <div className="space-y-2">
                    {[
                      { icon: Scissors, label: "Lawn Mowing", date: "Mar 12", time: "9:00 AM", color: "text-emerald-600", bg: "bg-emerald-50", status: "Confirmed" },
                      { icon: Droplets, label: "Gutter Cleaning", date: "Mar 18", time: "10:30 AM", color: "text-blue-600", bg: "bg-blue-50", status: "Scheduled" },
                      { icon: Sparkles, label: "House Cleaning", date: "Mar 22", time: "1:00 PM", color: "text-violet-600", bg: "bg-violet-50", status: "Scheduled" },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between rounded-xl bg-gray-50/80 px-3.5 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                            <s.icon className={`h-4 w-4 ${s.color}`} />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900">{s.label}</p>
                            <p className="text-[10px] text-gray-400">{s.date} &middot; {s.time}</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-500 shadow-sm">
                          {s.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recently completed */}
                <div className="border-t border-gray-100 px-6 py-4">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Recently Completed
                  </p>
                  <div className="space-y-2">
                    {[
                      { icon: Snowflake, label: "Snow Removal", date: "Mar 8", color: "text-sky-600", bg: "bg-sky-50", rating: 5 },
                      { icon: Zap, label: "HVAC Tune-up", date: "Mar 3", color: "text-amber-600", bg: "bg-amber-50", rating: 5 },
                    ].map((s) => (
                      <div key={s.label} className="flex items-center justify-between rounded-xl bg-gray-50/80 px-3.5 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.bg}`}>
                            <s.icon className={`h-4 w-4 ${s.color}`} />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-900">{s.label}</p>
                            <p className="text-[10px] text-gray-400">{s.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: s.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating notification - top right, not overlapping */}
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.3, ease }}
              className="absolute -right-4 top-2 z-20"
              style={{ animation: "hero-card-float 6s ease-in-out infinite 0.5s" }}
            >
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/95 py-2.5 pl-3 pr-4 shadow-lg shadow-black/5 backdrop-blur-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Snow Removal Done</p>
                  <p className="text-[10px] text-gray-400">Driveway cleared at 6:00 AM</p>
                </div>
              </div>
            </motion.div>

            {/* Savings badge - bottom left, not overlapping */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5, ease }}
              className="absolute -left-6 bottom-24 z-20"
              style={{ animation: "hero-card-float 7s ease-in-out infinite 2s" }}
            >
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/70 bg-white/95 py-2.5 pl-3 pr-4 shadow-lg shadow-black/5 backdrop-blur-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">All Pros Vetted</p>
                  <p className="text-[10px] text-gray-400">Licensed, insured, verified</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile product preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease }}
          className="lg:hidden"
        >
          <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-lg backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Home className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm font-semibold text-gray-900">My Home Plan</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-semibold text-emerald-700">Active</span>
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-gray-100 px-2 py-3">
              <div className="text-center">
                <p className="text-base font-bold text-gray-900">6</p>
                <p className="text-[10px] text-gray-400">Services</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-emerald-600">$847</p>
                <p className="text-[10px] text-gray-400">Saved / yr</p>
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-gray-900">$159</p>
                <p className="text-[10px] text-gray-400">Per month</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground/40" />
        </motion.div>
      </motion.div>
    </div>
  );
}
