import type { Metadata } from "next";
import { StrataContent } from "./strata-content";

export const metadata: Metadata = {
  title: "Strata Building Maintenance | One Contract, One Invoice | My Home Plan",
  description:
    "Simplify strata maintenance with one plan covering all building services. Vetted contractors, transparent pricing, guaranteed scheduling for strata councils in the Okanagan Valley.",
  alternates: {
    canonical: "https://myhomeplan.ca/strata",
  },
  openGraph: {
    title: "Strata Building Maintenance | One Contract, One Invoice | My Home Plan",
    description:
      "Simplify strata maintenance with one plan covering all building services. Vetted contractors, transparent pricing, guaranteed scheduling for strata councils in the Okanagan Valley.",
    url: "https://myhomeplan.ca/strata",
    siteName: "My Home Plan",
    type: "website",
    images: [
      {
        url: "https://myhomeplan.ca/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Home Plan - One Plan. One Payment. Your Entire Home Handled.",
      },
    ],
  },
};

export default function StrataPage() {
  return <StrataContent />;
}
