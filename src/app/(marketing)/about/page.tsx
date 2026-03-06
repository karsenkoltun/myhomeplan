"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover, AnimatedCounter } from "@/components/ui/motion";
import { ArrowRight, Heart, Target, Lightbulb, Shield, MapPin, Mail } from "lucide-react";

const values = [
  { icon: Heart, title: "Fair for Everyone", description: "We believe contractors deserve fair pay and homeowners deserve fair prices. Our model ensures both sides win." },
  { icon: Shield, title: "Trust & Transparency", description: "Every contractor is vetted. Every price is upfront. No hidden fees, no surprises, no fine print." },
  { icon: Target, title: "Quality Obsession", description: "We guarantee every service. If it's not right, we make it right. Our reputation depends on it." },
  { icon: Lightbulb, title: "Simplicity First", description: "Home maintenance shouldn't be complicated. One plan, one payment, one place to manage everything." },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
        <FadeIn>
          <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary/10 text-primary">Our Story</Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            Making Home Maintenance<br />Simple, Fair, and Reliable
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
            We started My Home Plan because we were tired of the same problem every homeowner faces: managing a dozen different
            contractors, never knowing the real price, and hoping for the best.
          </p>
        </FadeIn>
      </section>

      {/* Problem / Solution */}
      <section className="border-y bg-muted/20 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-12 md:grid-cols-2">
            <FadeIn direction="left">
              <h2 className="text-xl font-bold sm:text-2xl">The Problem</h2>
              <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                The average homeowner deals with 8-12 different service providers every year. Finding them is stressful. Pricing is unpredictable. Quality is inconsistent.
              </p>
              <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                In Canada, there is no single platform that bundles home services into a simple subscription. Americans have options. Canadians don&apos;t.
              </p>
            </FadeIn>
            <FadeIn direction="right">
              <h2 className="text-xl font-bold sm:text-2xl">Our Solution</h2>
              <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                My Home Plan is the first Canadian platform to offer a complete home services subscription. One monthly payment covers everything through vetted, local contractors.
              </p>
              <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                We&apos;re building a platform where homeowners get peace of mind and contractors get stability. Both sides win.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <FadeIn><h2 className="text-center text-xl font-bold sm:text-2xl">What We Stand For</h2></FadeIn>
        <StaggerContainer className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {values.map((value) => (
            <StaggerItem key={value.title}>
              <ScaleOnHover scale={1.03}>
                <Card className="h-full border-border/50 text-center">
                  <CardContent className="p-4 sm:p-6">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 sm:h-12 sm:w-12">
                      <value.icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold sm:mt-4">{value.title}</h3>
                    <p className="mt-1.5 text-xs text-muted-foreground sm:mt-2 sm:text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Numbers */}
      <section className="border-y bg-muted/20 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn><h2 className="text-center text-xl font-bold sm:text-2xl">The Okanagan Home Services Market</h2></FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-6 md:grid-cols-4">
              {[
                { value: 200, suffix: "K+", label: "Households" },
                { prefix: "$", value: 580, suffix: "M", label: "Annual Spending" },
                { value: 0, label: "Subscription Competitors" },
                { display: "1st", label: "Of Its Kind in Canada" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-bold text-primary sm:text-3xl">
                    {"display" in stat ? stat.display : <AnimatedCounter target={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} />}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-xl font-bold sm:text-2xl">Get In Touch</h2>
            <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2">Questions? We&apos;d love to hear from you.</p>
          </div>
        </FadeIn>
        <FadeIn delay={0.2}>
          <div className="mx-auto mt-6 grid max-w-lg gap-3 sm:mt-8 sm:gap-4">
            {[
              { icon: Mail, label: "Email", value: "hello@myhomeplan.ca", href: "mailto:hello@myhomeplan.ca" },
              { icon: MapPin, label: "Location", value: "Kelowna, BC, Canada", href: "#" },
            ].map((contact) => (
              <a key={contact.label} href={contact.href} className="flex items-center gap-3 rounded-xl border bg-card p-3.5 transition-shadow hover:shadow-md sm:gap-4 sm:p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
                  <contact.icon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground sm:text-xs">{contact.label}</p>
                  <p className="text-sm font-medium">{contact.value}</p>
                </div>
              </a>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div className="mt-8 text-center sm:mt-10">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/plan-builder">Build Your Plan <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
