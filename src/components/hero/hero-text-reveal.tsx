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

        {/* ── RIGHT: FLOATING PRODUCT CARDS ── */}
        <div className="relative hidden lg:block">
          <div className="relative h-[560px] w-full">
            {/* Main card - Plan Overview */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease }}
              className="absolute left-4 top-8 z-20 w-[300px]"
              style={{ animation: "hero-card-float 6s ease-in-out infinite" }}
            >
              <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-2xl shadow-black/10 backdrop-blur-xl">
                <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                      <Home className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900">
                        Your Home Plan
                      </p>
                      <p className="text-[10px] text-gray-500">
                        3 bed &middot; 2 bath &middot; 0.25 acres
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4">
                  <p className="mb-3 text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Selected Services
                  </p>
                  <div className="space-y-2.5">
                    {[
                      { icon: Scissors, label: "Lawn Care", freq: "Bi-weekly", color: "text-emerald-600", bg: "bg-emerald-50" },
                      { icon: Snowflake, label: "Snow Removal", freq: "On-demand", color: "text-sky-600", bg: "bg-sky-50" },
                      { icon: Sparkles, label: "House Cleaning", freq: "Monthly", color: "text-violet-600", bg: "bg-violet-50" },
                      { icon: Zap, label: "Electrical Check", freq: "Annual", color: "text-amber-600", bg: "bg-amber-50" },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-md ${s.bg}`}
                          >
                            <s.icon className={`h-3 w-3 ${s.color}`} />
                          </div>
                          <span className="text-xs font-medium text-gray-800">
                            {s.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-400">
                            {s.freq}
                          </span>
                          <Check className="h-3 w-3 text-emerald-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="my-4 border-t border-dashed border-gray-200" />
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400">Monthly total</p>
                      <p className="text-2xl font-bold tracking-tight text-gray-900">
                        $159
                        <span className="text-sm font-normal text-gray-400">
                          /mo
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5">
                      <TrendingDown className="h-3 w-3 text-emerald-600" />
                      <span className="text-[10px] font-semibold text-emerald-700">
                        Save 34%
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 w-full cursor-pointer rounded-lg bg-primary py-2.5 text-xs font-semibold text-white transition-colors hover:bg-primary/90">
                    Start Your Plan
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Dashboard stats card */}
            <motion.div
              initial={{ opacity: 0, x: 60, y: 40 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: 0.85, ease }}
              className="absolute right-0 top-28 z-10 w-[270px]"
              style={{
                animation: "hero-card-float 6s ease-in-out infinite 1s",
              }}
            >
              <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-xl shadow-black/8 backdrop-blur-xl">
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-gray-900">
                      This Month
                    </p>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                      Active
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-[10px] text-gray-400">Completed</p>
                      <p className="mt-0.5 text-xl font-bold text-gray-900">
                        12
                      </p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <div className="h-1 flex-1 rounded-full bg-gray-200">
                          <div className="h-1 w-[75%] rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-[9px] text-gray-400">75%</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-[10px] text-gray-400">Saved</p>
                      <p className="mt-0.5 text-xl font-bold text-emerald-600">
                        $847
                      </p>
                      <p className="mt-1 text-[9px] text-gray-400">
                        vs. individual
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-primary/5 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400">Next service</p>
                      <p className="text-xs font-semibold text-gray-800">
                        Lawn Care &middot; Mar 15
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating notification */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2, ease }}
              className="absolute left-0 top-0 z-30"
              style={{
                animation: "hero-card-float 5s ease-in-out infinite 0.5s",
              }}
            >
              <div className="flex items-center gap-2.5 rounded-full border border-white/60 bg-white/90 py-2 pl-2.5 pr-4 shadow-lg shadow-black/5 backdrop-blur-xl">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Snow Removal Complete
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Driveway cleared at 6:00 AM
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4, ease }}
              className="absolute bottom-16 left-12 z-30"
              style={{
                animation: "hero-card-float 7s ease-in-out infinite 2s",
              }}
            >
              <div className="flex items-center gap-2 rounded-full border border-white/60 bg-white/90 py-2 pl-2.5 pr-4 shadow-lg shadow-black/5 backdrop-blur-xl">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-3.5 w-3.5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Vetted & Insured
                  </p>
                  <p className="text-[10px] text-gray-400">
                    All contractors verified
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Mobile product card preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0, ease }}
          className="flex justify-center lg:hidden"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-lg backdrop-blur-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Home className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                4 services &middot; $159/mo
              </p>
              <p className="text-xs text-gray-500">
                Save 34% vs. hiring individually
              </p>
            </div>
            <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-4 w-4 text-emerald-600" />
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
