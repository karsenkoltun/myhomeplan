import type { Metadata } from "next";
import PricingContent from "./pricing-content";

export const metadata: Metadata = {
  title: "Pricing | Home Service Plans Starting at $89/mo | My Home Plan",
  description:
    "Transparent pricing for home maintenance plans. Essential, Complete, and Premium tiers with monthly, quarterly, and annual billing. Price lock guarantee included.",
  alternates: {
    canonical: "https://myhomeplan.ca/pricing",
  },
  openGraph: {
    title: "Pricing | Home Service Plans Starting at $89/mo | My Home Plan",
    description:
      "Transparent pricing for home maintenance plans. Essential, Complete, and Premium tiers with monthly, quarterly, and annual billing. Price lock guarantee included.",
    url: "https://myhomeplan.ca/pricing",
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

export default function PricingPage() {
  return <PricingContent />;
}
