"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  ShimmerButton,
} from "@/components/ui/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SERVICES, SERVICE_CATEGORIES, type ServiceCategory } from "@/data/services";
import { getServiceIcon } from "@/lib/icon-map";
import type { CityData } from "@/data/service-areas";
import type { Testimonial } from "@/data/testimonials";
import {
  MapPin,
  ArrowRight,
  CheckCircle2,
  Home,
  Snowflake,
  Sun,
  Calendar,
  ChevronRight,
  Star,
  TreePine,
  Quote,
} from "lucide-react";

interface CityContentProps {
  city: CityData;
  faqs: Array<{ question: string; answer: string }>;
  testimonial: Testimonial | null;
  nearbyLinks: Array<{ name: string; slug: string }>;
  relatedPostSlugs: string[];
}

export default function CityContent({
  city,
  faqs,
  testimonial,
  nearbyLinks,
  relatedPostSlugs,
}: CityContentProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | "all">(
    "all"
  );

  const filteredServices =
    activeCategory === "all"
      ? SERVICES
      : SERVICES.filter((s) => s.category === activeCategory);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 flex items-center justify-center gap-2">
                <Badge variant="secondary" className="gap-1.5">
                  <MapPin className="h-3 w-3" />
                  {city.region}
                </Badge>
                <Badge
                  variant="outline"
                  className="gap-1.5 border-emerald-500/30 text-emerald-600"
                >
                  <CheckCircle2 className="h-3 w-3" />
                  Now Serving
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Home Maintenance in {city.name}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                {city.description}
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/plan-builder">
                  <ShimmerButton className="px-8 py-3 text-base">
                    Build Your Plan{" "}
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* City Highlights */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Why {city.name} homeowners choose us
            </p>
            <h2 className="mt-4 text-center text-2xl font-bold tracking-tight sm:text-3xl">
              Local expertise for {city.name} homes
            </h2>
          </FadeIn>
          <StaggerContainer className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2">
            {city.highlights.map((highlight) => (
              <StaggerItem key={highlight}>
                <div className="flex items-start gap-3 rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span className="text-sm font-medium">{highlight}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Home Types + Seasonal Notes */}
      <section className="py-16 sm:py-24 border-t">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Common Home Types */}
            <FadeIn>
              <div className="rounded-2xl border border-border/50 bg-card p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    Home Types We Serve in {city.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {city.commonHomeTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm"
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Our plans are flexible enough to cover any residential
                  property in {city.name}, from compact condos to sprawling
                  acreages. Pricing scales with your property and lot size.
                </p>
              </div>
            </FadeIn>

            {/* Seasonal Notes */}
            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-border/50 bg-card p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                    <Calendar className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    Seasonal Maintenance in {city.name}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {city.seasonalNotes}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-sky-500/30 text-sky-600"
                  >
                    <Snowflake className="h-3 w-3" />
                    Winter Ready
                  </Badge>
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-amber-500/30 text-amber-600"
                  >
                    <Sun className="h-3 w-3" />
                    Summer Covered
                  </Badge>
                  <Badge
                    variant="outline"
                    className="gap-1.5 border-emerald-500/30 text-emerald-600"
                  >
                    <TreePine className="h-3 w-3" />
                    Year-Round Care
                  </Badge>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-24 border-t" id="services">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Full Service Menu
              </p>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                32 Services Available in {city.name}
              </h2>
              <p className="mt-3 text-muted-foreground">
                Every service is available as part of your monthly plan. Mix and
                match to build the perfect maintenance package for your{" "}
                {city.name} home.
              </p>
            </div>
          </FadeIn>

          {/* Category Filters */}
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All ({SERVICES.length})
            </button>
            {(
              Object.keys(SERVICE_CATEGORIES) as ServiceCategory[]
            ).map((cat) => {
              const count = SERVICES.filter(
                (s) => s.category === cat
              ).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {SERVICE_CATEGORIES[cat].label} ({count})
                </button>
              );
            })}
          </div>

          {/* Services Grid */}
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredServices.map((service, i) => {
              const Icon = getServiceIcon(service.icon);
              return (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className="group rounded-xl border border-border/50 bg-card p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold leading-tight">
                        {service.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs font-medium text-primary">
                          From ${service.basePrice}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {service.frequencyLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link href="/plan-builder">
                Build Your Custom Plan{" "}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      {testimonial && (
        <section className="py-16 sm:py-24 border-t">
          <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
            <FadeIn>
              <div className="mx-auto max-w-3xl">
                <div className="rounded-2xl border border-border/50 bg-card p-8 sm:p-10">
                  <Quote className="mb-4 h-8 w-8 text-primary/30" />
                  <blockquote className="text-lg leading-relaxed text-foreground sm:text-xl">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} - {testimonial.location}
                      </p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        )
                      )}
                    </div>
                  </div>
                  {testimonial.highlight && (
                    <Badge
                      variant="secondary"
                      className="mt-4"
                    >
                      {testimonial.highlight}
                    </Badge>
                  )}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-16 sm:py-24 border-t" id="faq">
          <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
            <FadeIn>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Common Questions
                </p>
                <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  Home Maintenance FAQ for {city.name}
                </h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.15}>
              <div className="mx-auto mt-10 max-w-3xl">
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left text-base">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Nearby Cities */}
      {nearbyLinks.length > 0 && (
        <section className="py-16 sm:py-24 border-t">
          <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
            <FadeIn>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Nearby Service Areas
                </p>
                <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                  Also serving communities near {city.name}
                </h2>
              </div>
            </FadeIn>
            <StaggerContainer className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-3">
              {nearbyLinks.map((nearby) => (
                <StaggerItem key={nearby.slug}>
                  <Link
                    href={`/service-area/${nearby.slug}`}
                    className="group flex items-center gap-2 rounded-full border border-border/50 bg-card px-5 py-2.5 text-sm font-medium transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
                  >
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                    {nearby.name}
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary" />
                  </Link>
                </StaggerItem>
              ))}
              <StaggerItem>
                <Link
                  href="/service-area"
                  className="flex items-center gap-2 rounded-full border border-dashed border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary/30 hover:text-foreground"
                >
                  View All Cities
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 sm:py-32 border-t">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to simplify home maintenance in {city.name}?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Join {city.name} homeowners who have traded contractor headaches
                for one simple monthly plan. 32 services, vetted contractors,
                predictable pricing.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/plan-builder">
                  <ShimmerButton className="px-8 py-3 text-base">
                    Build Your Plan{" "}
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Plans from $89/month. No contracts. Cancel anytime.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
