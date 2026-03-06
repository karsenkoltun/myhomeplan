import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, ArrowRight, Clock } from "lucide-react";

const activeCities = [
  {
    name: "Kelowna",
    population: "150,000+",
    status: "active" as const,
    contractors: "Growing network",
  },
  {
    name: "West Kelowna",
    population: "36,000+",
    status: "active" as const,
    contractors: "Growing network",
  },
  {
    name: "Vernon",
    population: "44,000+",
    status: "active" as const,
    contractors: "Growing network",
  },
  {
    name: "Penticton",
    population: "37,000+",
    status: "active" as const,
    contractors: "Growing network",
  },
  {
    name: "Lake Country",
    population: "15,000+",
    status: "active" as const,
    contractors: "Growing network",
  },
  {
    name: "Summerland",
    population: "12,000+",
    status: "active" as const,
    contractors: "Growing network",
  },
  {
    name: "Peachland",
    population: "5,500+",
    status: "active" as const,
    contractors: "Growing network",
  },
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

export default function ServiceAreaPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Badge
          variant="secondary"
          className="mb-4 border-primary/20 bg-primary/10 text-primary"
        >
          <MapPin className="mr-1 h-3 w-3" />
          Service Coverage
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Serving the Okanagan Valley
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          We&apos;re currently operating in the Okanagan Valley, BC with
          plans to expand across British Columbia and beyond.
        </p>
      </div>

      {/* Active Cities */}
      <div className="mt-16">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Currently Serving</h2>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeCities.map((city) => (
            <Card
              key={city.name}
              className="border-primary/20 transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{city.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Pop. {city.population}
                    </p>
                  </div>
                  <Badge className="bg-primary/10 text-primary">Active</Badge>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{city.contractors}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mt-12">
        <Card className="overflow-hidden">
          <div className="flex h-80 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <MapPin className="mx-auto h-12 w-12 text-primary/40" />
              <p className="mt-4 text-lg font-semibold text-muted-foreground">
                Interactive Map Coming Soon
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                View contractor coverage density across the Okanagan
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Coming Soon */}
      <div className="mt-16">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-amber-500" />
          <h2 className="text-2xl font-bold">Coming Soon</h2>
        </div>
        <p className="mt-2 text-muted-foreground">
          We&apos;re expanding! These cities are next on our list.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {comingSoon.map((city) => (
            <div
              key={city}
              className="flex items-center gap-2 rounded-lg border border-dashed bg-muted/30 p-3"
            >
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span className="text-sm font-medium">{city}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mx-auto mt-16 max-w-2xl text-center">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold">
              Don&apos;t See Your City?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Let us know where you are and we&apos;ll prioritize expansion
              to areas with the most demand.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/plan-builder">
                  Get Started in the Okanagan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline">
                Request My City
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
