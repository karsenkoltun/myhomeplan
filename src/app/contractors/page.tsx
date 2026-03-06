import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  ArrowRight,
  DollarSign,
  Calendar,
  Shield,
  TrendingUp,
  Clock,
  Star,
  Users,
  Briefcase,
} from "lucide-react";

const benefits = [
  {
    icon: Briefcase,
    title: "Guaranteed Booked Jobs",
    description:
      "No more chasing leads. We send you confirmed, paid jobs from homeowners in your area.",
  },
  {
    icon: DollarSign,
    title: "Fair Pay, Fast",
    description:
      "Keep 70-80% of service value. Get paid within 7 days of job completion, guaranteed.",
  },
  {
    icon: Calendar,
    title: "Year-Round Work",
    description:
      "Our bundled plans mean homeowners need services every season. No more dead months.",
  },
  {
    icon: Shield,
    title: "No Lead Fees",
    description:
      "Zero cost to receive jobs. No advertising spend needed. We bring the customers to you.",
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description:
      "Your profile, ratings, and reviews help you stand out. Great work gets rewarded with more jobs.",
  },
  {
    icon: TrendingUp,
    title: "Grow Your Business",
    description:
      "Top-rated contractors get priority placement, premium jobs, and the best customers.",
  },
];

const requirements = [
  "Valid business license in British Columbia",
  "Proof of liability insurance ($2M minimum)",
  "WorkSafe BC coverage (where applicable)",
  "3+ years of experience in your trade",
  "Clean background check",
  "2 professional references",
  "Commitment to our service standards",
];

const serviceTypes = [
  "Lawn Care & Landscaping",
  "Snow Removal",
  "HVAC (Heating & Cooling)",
  "Plumbing",
  "Electrical",
  "House Cleaning",
  "Window Washing",
  "Pest Control",
  "Handyman Services",
  "Painting",
  "Pressure Washing",
  "Gutter Cleaning",
];

export default function ContractorsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge className="mb-4 bg-white/20 text-white">
            For Service Professionals
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Stop Chasing Leads.
            <br />
            Start Getting Guaranteed Work.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            Join the Okanagan&apos;s first home services subscription
            platform. Get a reliable pipeline of year-round, pre-paid jobs
            from homeowners in your area.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="h-12 px-8 text-base"
            >
              Apply to Join
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 border-white/30 px-8 text-base text-white hover:bg-white/10"
              asChild
            >
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Contractors Choose Us
          </h2>
          <p className="mt-3 text-lg text-muted-foreground">
            We built this platform to solve the biggest pain points
            contractors face.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <Card
              key={benefit.title}
              className="border-border/50 transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <benefit.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="border-y bg-muted/20 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold">
            My Home Plan vs. Traditional Lead Gen
          </h2>
          <div className="mx-auto mt-8 max-w-2xl overflow-hidden rounded-2xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-4 text-left">Feature</th>
                  <th className="p-4 text-center font-semibold text-blue-600">
                    My Home Plan
                  </th>
                  <th className="p-4 text-center text-muted-foreground">
                    Lead Sites
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Cost per lead", "Free", "$30-$100+"],
                  ["Job guarantee", "Yes - pre-booked", "No - just leads"],
                  ["Payment speed", "7 days", "You invoice"],
                  ["Year-round work", "Yes", "Seasonal"],
                  ["Customer quality", "Subscribed homeowners", "One-time"],
                  ["Reviews carry over", "Yes", "Platform-locked"],
                ].map(([feature, us, them]) => (
                  <tr key={feature} className="border-b last:border-0">
                    <td className="p-4 font-medium">{feature}</td>
                    <td className="p-4 text-center text-blue-600">{us}</td>
                    <td className="p-4 text-center text-muted-foreground">
                      {them}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Requirements & Service Types */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Requirements */}
          <div>
            <h2 className="text-2xl font-bold">What We Look For</h2>
            <p className="mt-2 text-muted-foreground">
              We vet every contractor to ensure homeowners get the best
              service possible.
            </p>
            <ul className="mt-6 space-y-3">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
                  <span className="text-sm">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Types */}
          <div>
            <h2 className="text-2xl font-bold">Services We Need</h2>
            <p className="mt-2 text-muted-foreground">
              We&apos;re actively recruiting contractors in these
              categories.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-2">
              {serviceTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center gap-2 rounded-lg border bg-card p-3"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section className="border-y bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <Users className="h-12 w-12 opacity-80" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Earn More. Stress Less.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg opacity-90">
            Our contractors average 20+ guaranteed jobs per month. No
            advertising costs. No lead fees. Just reliable, well-paying work.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              { label: "Avg. Jobs/Month", value: "20+" },
              { label: "Pay Received Within", value: "7 Days" },
              { label: "Contractor Retention", value: "85-95%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white/10 p-6 backdrop-blur-sm"
              >
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="mt-1 text-sm opacity-80">{stat.label}</p>
              </div>
            ))}
          </div>
          <Button
            size="lg"
            variant="secondary"
            className="mt-10 h-12 px-8 text-base"
          >
            Apply Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold">
          Contractor FAQ
        </h2>
        <div className="mt-8 space-y-6">
          {[
            {
              q: "Is there a cost to join?",
              a: "No. There is zero cost to join our contractor network. You don't pay for leads, listings, or advertising. We bring the customers to you.",
            },
            {
              q: "How do I get paid?",
              a: "We pay you within 7 days of job completion via direct deposit. You keep 70-80% of the service value depending on your tier.",
            },
            {
              q: "Can I set my own schedule?",
              a: "Yes. You choose which jobs to accept and set your availability. We'll only send you jobs that match your schedule and service area.",
            },
            {
              q: "What if a customer is unhappy?",
              a: "We handle all customer communication and disputes. If a redo is needed, you'll be compensated for your time.",
            },
            {
              q: "How many jobs will I get?",
              a: "This depends on your service area and the number of subscribers. Our goal is to keep your schedule as full as you want it.",
            },
          ].map((faq) => (
            <div key={faq.q} className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold">{faq.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
