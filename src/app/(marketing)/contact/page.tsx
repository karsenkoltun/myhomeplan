import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import ContactTestimonials from "./contact-testimonials";
import ContactMap from "./contact-map";

export const metadata: Metadata = {
  title: "Contact Us | My Home Plan",
  description:
    "Get in touch with My Home Plan. Questions about our home maintenance plans? We're here to help. Serving the Okanagan Valley, BC.",
  openGraph: {
    title: "Contact Us | My Home Plan",
    description:
      "Questions about our home maintenance plans? We're here to help. Serving the Okanagan Valley, BC.",
    url: "https://myhomeplan.ca/contact",
    type: "website",
  },
  alternates: {
    canonical: "https://myhomeplan.ca/contact",
  },
};

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    detail: "hello@myhomeplan.ca",
    href: "mailto:hello@myhomeplan.ca",
    description: "For general inquiries and support",
  },
  {
    icon: MapPin,
    title: "Location",
    detail: "Kelowna, BC, Canada",
    href: undefined,
    description: "Serving the Okanagan Valley",
  },
  {
    icon: Clock,
    title: "Hours",
    detail: "Mon - Fri, 8am - 6pm PST",
    href: undefined,
    description: "Emergency support available 24/7 for active subscribers",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get in Touch
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
          Have questions about our home maintenance plans? Want to join our
          contractor network? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {contactMethods.map((method) => (
          <Card
            key={method.title}
            className="text-center transition-shadow hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <method.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold">{method.title}</h3>
              {method.href ? (
                <a
                  href={method.href}
                  className="mt-1 block text-sm font-medium text-primary hover:underline"
                >
                  {method.detail}
                </a>
              ) : (
                <p className="mt-1 text-sm font-medium">{method.detail}</p>
              )}
              <p className="mt-2 text-sm text-muted-foreground sm:text-xs">
                {method.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Service Area Map */}
      <div className="mt-12">
        <h2 className="text-center text-xl font-bold sm:text-2xl">
          Our Service Area
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
          Currently serving 7 cities across the Okanagan Valley, BC.
        </p>
        <div className="mt-6">
          <ContactMap />
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-16">
        <h2 className="text-center text-xl font-bold sm:text-2xl">
          Trusted Across the Okanagan
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
          Hear from homeowners and contractors who use My Home Plan.
        </p>
        <div className="mt-8">
          <ContactTestimonials />
        </div>
      </div>

      <div className="mt-16">
        <Card>
          <CardContent className="p-8 sm:p-12">
            <h2 className="text-xl font-bold sm:text-2xl">
              Quick Answers
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold">For Homeowners</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Interested in a plan? Start with our{" "}
                  <a href="/plan-builder" className="text-primary hover:underline">
                    Plan Builder
                  </a>{" "}
                  to see pricing, or check our{" "}
                  <a href="/faq" className="text-primary hover:underline">
                    FAQ
                  </a>{" "}
                  for common questions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">For Contractors</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Want to join our contractor network? Visit our{" "}
                  <a href="/contractors" className="text-primary hover:underline">
                    Contractors page
                  </a>{" "}
                  to learn about the benefits and apply.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">For Strata Councils</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Looking for building-wide maintenance? See our{" "}
                  <a href="/strata" className="text-primary hover:underline">
                    Strata solutions
                  </a>{" "}
                  with volume pricing.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">For Property Managers</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Managing multiple properties? Our{" "}
                  <a
                    href="/property-managers"
                    className="text-primary hover:underline"
                  >
                    PM solutions
                  </a>{" "}
                  simplify portfolio maintenance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
