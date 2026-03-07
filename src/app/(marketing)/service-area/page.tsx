"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  GlowCard,
  ShimmerButton,
} from "@/components/ui/motion";
import { SectionHeader } from "@/components/marketing/section-header";
import { SocialProofBar } from "@/components/marketing/social-proof-bar";
import {
  InfiniteMarquee,
  MarqueeCityItem,
} from "@/components/marketing/infinite-marquee";
import { CheckCircle2, MapPin, ArrowRight, Clock } from "lucide-react";

const activeCities = [
  { name: "Kelowna", population: "150,000+", contractors: "Growing network" },
  { name: "West Kelowna", population: "36,000+", contractors: "Growing network" },
  { name: "Vernon", population: "44,000+", contractors: "Growing network" },
  { name: "Penticton", population: "37,000+", contractors: "Growing network" },
  { name: "Lake Country", population: "15,000+", contractors: "Growing network" },
  { name: "Summerland", population: "12,000+", contractors: "Growing network" },
  { name: "Peachland", population: "5,500+", contractors: "Growing network" },
];

const comingSoon = ["Kamloops", "Vancouver", "Victoria", "Nanaimo", "Prince George", "Abbotsford", "Chilliwack", "Courtenay"];

export default function ServiceAreaPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <SectionHeader
          badge="Service Coverage"
          badgeColor="primary"
          title="Serving the Okanagan Valley"
          subtitle="Currently operating in 7 Okanagan cities with plans to expand across British Columbia."
        />
      </section>

      {/* Social Proof */}
      <div className="mt-8">
        <SocialProofBar />
      </div>

      {/* Cities Marquee */}
      <section className="py-10 sm:py-14">
        <InfiniteMarquee speed={40} direction="right">
          {[...activeCities.map(c => c.name), ...comingSoon].map((city) => (
            <MarqueeCityItem key={city} city={city} />
          ))}
        </InfiniteMarquee>
      </section>

      {/* Active Cities */}
      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold sm:text-2xl">Currently Serving</h2>
          </div>
        </FadeIn>
        <StaggerContainer className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {activeCities.map((city) => (
            <StaggerItem key={city.name}>
              <GlowCard glowColor="primary" className="h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold sm:text-lg">{city.name}</h3>
                    <p className="text-xs text-muted-foreground sm:text-sm">Pop. {city.population}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary sm:text-xs">Active</span>
                </div>
                <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground sm:mt-3 sm:text-sm">
                  <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{city.contractors}</span>
                </div>
              </GlowCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Map Placeholder */}
      <FadeIn delay={0.2}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="overflow-hidden">
            <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 sm:h-80">
              <div className="text-center">
                <MapPin className="mx-auto h-10 w-10 text-primary/40 sm:h-12 sm:w-12" />
                <p className="mt-3 text-sm font-semibold text-muted-foreground sm:mt-4 sm:text-lg">Interactive Map Coming Soon</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">View contractor coverage across the Okanagan</p>
              </div>
            </div>
          </Card>
        </div>
      </FadeIn>

      {/* Coming Soon */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <FadeIn>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold sm:text-2xl">Coming Soon</h2>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2">Expanding! These cities are next.</p>
        </FadeIn>
        <StaggerContainer className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-3">
          {comingSoon.map((city) => (
            <StaggerItem key={city}>
              <div className="flex items-center gap-2 rounded-xl border border-dashed border-amber-300/40 bg-amber-50/30 p-2.5 transition-colors hover:bg-amber-50/60 sm:p-3">
                <Clock className="h-3 w-3 text-amber-500 sm:h-3.5 sm:w-3.5" />
                <span className="text-xs font-medium sm:text-sm">{city}</span>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 py-12 text-primary-foreground sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
        <FadeIn>
          <div className="relative mx-auto max-w-2xl px-4 text-center">
            <h3 className="text-xl font-bold sm:text-2xl">Don&apos;t See Your City?</h3>
            <p className="mt-2 text-sm opacity-90">
              Let us know and we&apos;ll prioritize expansion to areas with the most demand.
            </p>
            <div className="mt-6 flex flex-col items-center gap-2.5 sm:flex-row sm:justify-center sm:gap-3">
              <Button size="lg" variant="secondary" className="w-full text-primary sm:w-auto" asChild>
                <Link href="/plan-builder">Get Started in the Okanagan <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 sm:w-auto">
                Request My City
              </Button>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
