import type { Metadata } from "next";
import { HowItWorksContent } from "./how-it-works-content";

export const metadata: Metadata = {
  title: "How It Works | Your Home Maintenance Plan Explained | My Home Plan",
  description:
    "See how My Home Plan works in 3 simple steps. Choose your services, we match you with vetted contractors, and your home is maintained year-round. No contracts on monthly plans.",
  alternates: {
    canonical: "https://myhomeplan.ca/how-it-works",
  },
  openGraph: {
    title: "How It Works | Your Home Maintenance Plan Explained | My Home Plan",
    description:
      "See how My Home Plan works in 3 simple steps. Choose your services, we match you with vetted contractors, and your home is maintained year-round. No contracts on monthly plans.",
    url: "https://myhomeplan.ca/how-it-works",
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

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}
