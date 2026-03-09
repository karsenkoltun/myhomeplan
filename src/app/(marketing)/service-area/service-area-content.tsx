"use client";

import { useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton } from "@/components/ui/motion";
import {
  InfiniteMarquee,
  MarqueeCityItem,
} from "@/components/marketing/infinite-marquee";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, MapPin, ArrowRight, Clock } from "lucide-react";

const ServiceMap = dynamic(() => import("@/components/ui/service-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-2xl border bg-muted/20 sm:h-[500px]">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <MapPin className="h-8 w-8 animate-pulse" />
        <span className="text-sm">Loading map...</span>
      </div>
    </div>
  ),
});

const ExpandMap = dynamic(() => import("@/components/ui/expand-map"), {
  ssr: false,
});

const activeCities = [
  { name: "Kelowna", population: "150,000+" },
  { name: "West Kelowna", population: "36,000+" },
  { name: "Vernon", population: "44,000+" },
  { name: "Penticton", population: "37,000+" },
  { name: "Lake Country", population: "15,000+" },
  { name: "Summerland", population: "12,000+" },
  { name: "Peachland", population: "5,500+" },
];

const comingSoon = [
  "Kamloops",
  "Vancouver",
  "Victoria",
  "Nanaimo",
  "Prince George",
  "Abbotsford",
  "Chilliwack",
  "Courtenay",
];

export default function ServiceAreaContent() {
  const citiesRef = useRef(null);
  const citiesInView = useInView(citiesRef, { once: true, margin: "-100px" });

  const comingSoonRef = useRef(null);
  const comingSoonInView = useInView(comingSoonRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Service Coverage
              </p>
              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Serving the Okanagan Valley
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Currently live in 7 cities with plans to expand across British
                Columbia.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Cities Marquee */}
      <section className="py-12">
        <InfiniteMarquee speed={40} direction="right">
          {[...activeCities.map((c) => c.name), ...comingSoon].map((city) => (
            <MarqueeCityItem key={city} city={city} />
          ))}
        </InfiniteMarquee>
      </section>

      {/* Active Cities */}
      <section className="py-24 sm:py-32" ref={citiesRef}>
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Currently serving
              </p>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                7 cities and counting
              </h2>
            </div>
          </FadeIn>
          <div className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeCities.map((city, i) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 30 }}
                animate={citiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group rounded-2xl border border-border/50 bg-card p-6 hover:shadow-lg hover:shadow-black/5 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {city.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pop. {city.population}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Active
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Interactive map
              </p>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Explore our service area
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-16">
              <div className="mb-3 flex items-center justify-end">
                <ExpandMap />
              </div>
              <ServiceMap />
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Click any marker to see city details. Use controls or pinch to
                zoom.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-24 sm:py-32" ref={comingSoonRef}>
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Coming soon
              </p>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Expanding across BC
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                These cities are next on our roadmap.
              </p>
            </div>
          </FadeIn>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {comingSoon.map((city, i) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, y: 20 }}
                animate={comingSoonInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-center gap-2.5 rounded-2xl border border-border/50 p-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
              >
                <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">{city}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Don&apos;t see your city?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Let us know and we will prioritize expansion to your area.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/plan-builder">
                  <ShimmerButton className="px-8 py-3 text-base">
                    Get Started in the Okanagan{" "}
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button variant="outline" size="lg" asChild>
                  <a href="mailto:hello@myhomeplan.ca">Request My City</a>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
