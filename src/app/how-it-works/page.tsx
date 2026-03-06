import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ListChecks,
  CreditCard,
  CalendarCheck,
  Bell,
  Star,
  ArrowRight,
  Users,
  Shield,
  Clock,
  DollarSign,
  CheckCircle2,
  ClipboardCheck,
  Briefcase,
  TrendingUp,
} from "lucide-react";

const homeownerSteps = [
  {
    icon: Home,
    title: "Enter Your Property Details",
    description:
      "Tell us about your home - square footage, lot size, heating type. This helps us give you an accurate, personalized price.",
  },
  {
    icon: ListChecks,
    title: "Select Your Services",
    description:
      "Browse our full service menu - lawn care, snow removal, HVAC, cleaning, pest control, handyman, and more. Pick what you need.",
  },
  {
    icon: CreditCard,
    title: "Choose Your Plan & Subscribe",
    description:
      "See your monthly price build in real-time. Choose monthly, quarterly (save 5%), or annual (save 15%). One simple payment.",
  },
  {
    icon: CalendarCheck,
    title: "Schedule Your Services",
    description:
      "Through your dashboard, book any service at a time that works for you. We handle the rest - matching you with the best available contractor.",
  },
  {
    icon: Bell,
    title: "Get Updates & Confirmations",
    description:
      "Receive notifications when your service is confirmed, when the contractor is on the way, and when the job is complete.",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description:
      "After each service, rate your experience. Your feedback keeps our contractor network sharp and helps other homeowners.",
  },
];

const contractorSteps = [
  {
    icon: ClipboardCheck,
    title: "Apply to Join",
    description:
      "Submit your business info, licenses, insurance, and service areas. Our team reviews every application.",
  },
  {
    icon: Shield,
    title: "Get Vetted",
    description:
      "We verify your business license, insurance ($2M liability min), WorkSafe BC coverage, and run background checks.",
  },
  {
    icon: Briefcase,
    title: "Get Listed & Receive Jobs",
    description:
      "Once approved, you start receiving guaranteed booked jobs - not leads. Accept jobs that fit your schedule.",
  },
  {
    icon: DollarSign,
    title: "Complete Work & Get Paid",
    description:
      "Do great work, get paid within 7 days. Keep 70-80% of service value. No chasing invoices, ever.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description:
      "Build your reputation with ratings and reviews. Top-rated contractors get priority placement and more jobs.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mx-auto max-w-2xl text-center">
        <Badge
          variant="secondary"
          className="mb-4 border-primary/20 bg-primary/10 text-primary"
        >
          Simple & Transparent
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How My Home Plan Works
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Whether you&apos;re a homeowner looking for hassle-free maintenance
          or a contractor looking for reliable work, here&apos;s how it all
          comes together.
        </p>
      </div>

      {/* Homeowner Section */}
      <div className="mt-20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Home className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">For Homeowners</h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {homeownerSteps.map((step, i) => (
            <Card
              key={step.title}
              className="relative border-border/50 transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button size="lg" asChild>
            <Link href="/plan-builder">
              Build Your Plan Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Contractor Section */}
      <div className="mt-24">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">For Contractors</h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contractorSteps.map((step, i) => (
            <Card
              key={step.title}
              className="relative border-border/50 transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <step.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-blue-500/30 text-blue-600 hover:bg-blue-50"
            asChild
          >
            <Link href="/contractors">
              Join Our Contractor Network
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Guarantees */}
      <div className="mx-auto mt-24 max-w-4xl">
        <h2 className="text-center text-2xl font-bold">Our Guarantees</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {[
            {
              icon: Clock,
              title: "Scheduling Guarantee",
              desc: "Service happens in your scheduled window, or the next one is free.",
            },
            {
              icon: CheckCircle2,
              title: "Quality Guarantee",
              desc: "Not satisfied? We send another contractor at no cost.",
            },
            {
              icon: DollarSign,
              title: "Price Lock Guarantee",
              desc: "Your rate is locked for 12 months. No surprise increases.",
            },
            {
              icon: Shield,
              title: "Contractor Pay Guarantee",
              desc: "Every contractor gets paid within 7 days. No exceptions.",
            },
          ].map((g) => (
            <Card key={g.title} className="border-border/50">
              <CardContent className="flex gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <g.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{g.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {g.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
