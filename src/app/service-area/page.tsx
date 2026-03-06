"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeIn, StaggerContainer, StaggerItem, ScaleOnHover } from "@/components/ui/motion";
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
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <FadeIn>
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4 border-primary/20 bg-primary/10 text-primary">
            <MapPin className="mr-1 h-3 w-3" />Service Coverage
          </Badge>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">Serving the Okanagan Valley</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base md:text-lg">
            Currently operating in the Okanagan Valley, BC with plans to expand across British Columbia.
          </p>
        </div>
      </FadeIn>

      {/* Active Cities */}
      <div className="mt-12 sm:mt-16">
        <FadeIn>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold sm:text-2xl">Currently Serving</h2>
          </div>
        </FadeIn>
        <StaggerContainer className="mt-4 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {activeCities.map((city) => (
            <StaggerItem key={city.name}>
              <ScaleOnHover scale={1.02}>
                <Card className="border-primary/20">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold sm:text-lg">{city.name}</h3>
                        <p className="text-xs text-muted-foreground sm:text-sm">Pop. {city.population}</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary text-[10px] sm:text-xs">Active</Badge>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground sm:mt-3 sm:text-sm">
                      <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      <span>{city.contractors}</span>
                    </div>
                  </CardContent>
                </Card>
              </ScaleOnHover>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* Map Placeholder */}
      <FadeIn delay={0.2}>
        <div className="mt-8 sm:mt-12">
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
      <FadeIn delay={0.3}>
        <div className="mt-12 sm:mt-16">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold sm:text-2xl">Coming Soon</h2>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground sm:mt-2">Expanding! These cities are next.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-3">
            {comingSoon.map((city) => (
              <div key={city} className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/30 p-2.5 sm:p-3">
                <Clock className="h-3 w-3 text-amber-500 sm:h-3.5 sm:w-3.5" />
                <span className="text-xs font-medium sm:text-sm">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>

      {/* CTA */}
      <FadeIn delay={0.4}>
        <div className="mx-auto mt-12 max-w-2xl text-center sm:mt-16">
          <Card className="border-primary/20 bg-primary/[0.04]">
            <CardContent className="p-5 sm:p-8">
              <h3 className="text-lg font-bold sm:text-xl">Don&apos;t See Your City?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Let us know and we&apos;ll prioritize expansion to areas with the most demand.
              </p>
              <div className="mt-4 flex flex-col items-center gap-2.5 sm:mt-6 sm:flex-row sm:justify-center sm:gap-3">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/plan-builder">Get Started in the Okanagan <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">Request My City</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>
    </div>
  );
}
