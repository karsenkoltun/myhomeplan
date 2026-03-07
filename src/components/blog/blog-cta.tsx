import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Home, Wrench } from "lucide-react";
import { SERVICES } from "@/data/services";

export function BlogCTABanner({
  title = "Ready to simplify your home maintenance?",
  description = "Get all your home services in one monthly plan. Vetted contractors, guaranteed scheduling, predictable pricing.",
  buttonText = "Build Your Plan",
  buttonHref = "/plan-builder",
}: {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
}) {
  return (
    <div className="my-8 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 p-6 sm:p-8">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-lg">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link href={buttonHref}>
            {buttonText} <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function BlogCTAInline({
  serviceId,
}: {
  serviceId?: string;
}) {
  const service = serviceId
    ? SERVICES.find((s) => s.id === serviceId)
    : null;

  if (service) {
    return (
      <Card className="my-6 border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Wrench className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">{service.name}</p>
              <p className="text-sm text-muted-foreground">
                Starting at ${service.basePrice}/{service.frequency === "as-needed" ? "hr" : "visit"} - included in your plan
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link href="/plan-builder">
              Add to Plan <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="my-6 border-primary/20 bg-primary/5">
      <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">My Home Plan</p>
            <p className="text-sm text-muted-foreground">
              Plans starting at $89/mo - all services included
            </p>
          </div>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/plan-builder">
            Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function BlogCTACompare() {
  return (
    <div className="my-8 rounded-xl border bg-card p-6 sm:p-8">
      <h3 className="mb-4 text-center text-lg font-semibold">
        Why Homeowners Choose My Home Plan
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            title: "Predictable Pricing",
            desc: "One monthly payment covers everything. No surprise quotes or hidden fees.",
          },
          {
            title: "Vetted Contractors",
            desc: "Every contractor is background-checked, insured, and reviewed.",
          },
          {
            title: "Zero Hassle",
            desc: "We handle scheduling, quality control, and follow-ups. You relax.",
          },
        ].map((item) => (
          <div key={item.title} className="text-center">
            <CheckCircle className="mx-auto mb-2 h-8 w-8 text-primary" />
            <p className="font-medium">{item.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button asChild size="lg">
          <Link href="/plan-builder">
            Build Your Plan <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
