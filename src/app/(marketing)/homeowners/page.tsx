import type { Metadata } from "next";
import { HomeownersContent } from "./homeowners-content";

export const metadata: Metadata = {
  title: "Homeowners | Save 20-40% on Home Maintenance | My Home Plan",
  description:
    "Stop overpaying for home services. One monthly plan covers lawn care, snow removal, HVAC, cleaning, pest control and more. Vetted contractors, guaranteed scheduling. Serving the Okanagan Valley, BC.",
  openGraph: {
    title: "Homeowners | Save 20-40% on Home Maintenance | My Home Plan",
    description:
      "Stop overpaying for home services. One monthly plan covers lawn care, snow removal, HVAC, cleaning, pest control and more. Vetted contractors, guaranteed scheduling. Serving the Okanagan Valley, BC.",
    url: "https://myhomeplan.ca/homeowners",
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

export default function HomeownersPage() {
  return <HomeownersContent />;
}
