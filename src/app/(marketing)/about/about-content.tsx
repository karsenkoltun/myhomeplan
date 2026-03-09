"use client";

import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FadeIn, ShimmerButton, AnimatedCounter } from "@/components/ui/motion";
import { Gallery4 } from "@/components/ui/gallery4";
import type { Gallery4Item } from "@/components/ui/gallery4";
import { motion, useInView } from "framer-motion";
import { LocationMap } from "@/components/ui/location-map";
import {
  ArrowRight,
  Mail,
} from "lucide-react";

import { TestimonialsMarquee } from "@/components/marketing/testimonials-marquee";

const valueItems: Gallery4Item[] = [
  {
    id: "fair",
    title: "Fair for Everyone",
    description: "Contractors earn fair pay. Homeowners pay fair prices. Everyone wins.",
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "trust",
    title: "Trust & Transparency",
    description: "Vetted contractors. Upfront pricing. No hidden fees, ever.",
    image: "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "quality",
    title: "Quality Obsession",
    description: "Every service is guaranteed. If it's not right, we make it right.",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "simplicity",
    title: "Simplicity First",
    description: "One plan. One payment. One place for everything.",
    image: "https://images.pexels.com/photos/7578901/pexels-photo-7578901.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "local",
    title: "Local First",
    description: "We hire from your community. Your money stays local, supporting the pros in your area.",
    image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
  {
    id: "accountability",
    title: "Real Accountability",
    description: "Every promise comes with a guarantee. We don't just talk about quality - we back it up.",
    image: "https://images.pexels.com/photos/4491881/pexels-photo-4491881.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  },
];

const stats = [
  { value: 200, suffix: "K+", label: "Households" },
  { prefix: "$", value: 580, suffix: "M", label: "Annual Spending" },
  { value: 0, display: "0", label: "Subscription Competitors" },
  { value: 0, display: "1st", label: "Of Its Kind in Canada" },
];

export default function AboutContent() {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Our Story
              </p>
              <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Making home maintenance simple, fair, and reliable
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                We got tired of the same problem every homeowner faces.
                <br className="hidden sm:block" />
                So we built the solution.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <div className="grid gap-16 md:grid-cols-2 md:gap-20">
            <FadeIn direction="left">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  The problem
                </p>
                <div className="mt-8 space-y-6">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    The average homeowner juggles 8-12 service providers every
                    year. Finding reliable ones is stressful.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Pricing is unpredictable. You never know the real cost until
                    the invoice arrives.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Quality is inconsistent. There is no single platform in
                    Canada that bundles home services into a subscription.
                  </p>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="right">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Our solution
                </p>
                <div className="mt-8 space-y-6">
                  <p className="text-base text-muted-foreground leading-relaxed">
                    My Home Plan is the first Canadian home services
                    subscription. One monthly payment covers everything.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Every contractor is vetted and local. Every price is upfront
                    and transparent.
                  </p>
                  <p className="text-base text-muted-foreground leading-relaxed">
                    Homeowners get peace of mind. Contractors get steady,
                    reliable work.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <Gallery4
        title="Built on principles, not trends"
        description="What we stand for at My Home Plan."
        items={valueItems}
      />

      {/* Market Stats */}
      <section className="py-24 sm:py-32" ref={statsRef}>
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                The opportunity
              </p>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                The Okanagan home services market
              </h2>
            </div>
          </FadeIn>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {"display" in stat && stat.display ? (
                    stat.display
                  ) : (
                    <AnimatedCounter
                      target={stat.value}
                      prefix={stat.prefix || ""}
                      suffix={stat.suffix || ""}
                    />
                  )}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Testimonials
              </p>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                What people are saying
              </h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-16">
              <TestimonialsMarquee audience="all" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Contact
              </p>
              <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Get in touch
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Questions? We would love to hear from you.
              </p>
              <div className="mt-10 flex items-center justify-center">
                <a
                  href="mailto:hello@myhomeplan.ca"
                  className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  hello@myhomeplan.ca
                </a>
              </div>
              <div className="mt-10 flex justify-center pb-8">
                <LocationMap
                  location="Kelowna, BC, Canada"
                  coordinates="49.8880° N, 119.4960° W"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8 lg:px-12">
          <FadeIn>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Ready to simplify your home?
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Build your custom plan in under 2 minutes.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/plan-builder">
                  <ShimmerButton className="px-8 py-3 text-base">
                    Build Your Plan{" "}
                    <ArrowRight className="ml-2 inline h-4 w-4" />
                  </ShimmerButton>
                </Link>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/about#contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
