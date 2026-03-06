import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Heart,
  Target,
  Lightbulb,
  Shield,
  Users,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Fair for Everyone",
    description:
      "We believe contractors deserve fair pay and homeowners deserve fair prices. Our model ensures both sides win.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "Every contractor is vetted. Every price is upfront. No hidden fees, no surprises, no fine print.",
  },
  {
    icon: Target,
    title: "Quality Obsession",
    description:
      "We guarantee every service. If it's not right, we make it right. Our reputation depends on it.",
  },
  {
    icon: Lightbulb,
    title: "Simplicity First",
    description:
      "Home maintenance shouldn't be complicated. One plan, one payment, one place to manage everything.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Badge
          variant="secondary"
          className="mb-4 border-primary/20 bg-primary/10 text-primary"
        >
          Our Story
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Making Home Maintenance
          <br />
          Simple, Fair, and Reliable
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          We started My Home Plan because we were tired of the same problem
          every homeowner faces: managing a dozen different contractors, never
          knowing the real price, and hoping for the best.
        </p>
      </section>

      {/* The Problem / The Solution */}
      <section className="border-y bg-muted/20 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold">The Problem</h2>
              <p className="mt-3 text-muted-foreground">
                The average homeowner deals with 8-12 different service
                providers every year. Finding them is stressful. Pricing is
                unpredictable. Quality is inconsistent. And on the
                contractor side, the feast-or-famine cycle of seasonal work
                makes it nearly impossible to build a sustainable business.
              </p>
              <p className="mt-3 text-muted-foreground">
                In Canada, there is no single platform that bundles home
                services into a simple subscription. Americans have options.
                Canadians don&apos;t.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Our Solution</h2>
              <p className="mt-3 text-muted-foreground">
                My Home Plan is the first Canadian platform to offer a
                complete home services subscription. One monthly payment
                covers lawn care, snow removal, HVAC servicing, cleaning,
                pest control, and more. All through vetted, local
                contractors who get guaranteed, fair-paying work year-round.
              </p>
              <p className="mt-3 text-muted-foreground">
                We&apos;re building a platform where homeowners get peace of
                mind and contractors get stability. Both sides win.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold">What We Stand For</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <Card
              key={value.title}
              className="border-border/50 text-center transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Numbers */}
      <section className="border-y bg-muted/20 py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold">
            The Okanagan Home Services Market
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: "200K+", label: "Households" },
              { value: "$580M", label: "Annual Spending" },
              { value: "0", label: "Subscription Competitors" },
              { value: "1st", label: "Of Its Kind in Canada" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section
        id="contact"
        className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold">Get In Touch</h2>
          <p className="mt-2 text-muted-foreground">
            Have questions? Want to learn more? We&apos;d love to hear from
            you.
          </p>
        </div>
        <div className="mx-auto mt-8 grid max-w-lg gap-4">
          {[
            {
              icon: Mail,
              label: "Email",
              value: "hello@myhomeplan.ca",
              href: "mailto:hello@myhomeplan.ca",
            },
            {
              icon: MapPin,
              label: "Location",
              value: "Kelowna, BC, Canada",
              href: "#",
            },
          ].map((contact) => (
            <a
              key={contact.label}
              href={contact.href}
              className="flex items-center gap-4 rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <contact.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  {contact.label}
                </p>
                <p className="font-medium">{contact.value}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button size="lg" asChild>
            <Link href="/plan-builder">
              Build Your Plan
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
