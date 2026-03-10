import type { Metadata } from "next";
import ServiceAreaContent from "./service-area-content";

export const metadata: Metadata = {
  title: "Service Area | Okanagan Valley, BC | My Home Plan",
  description:
    "My Home Plan serves Kelowna, West Kelowna, Vernon, Penticton, Lake Country, Summerland, and Peachland. Expanding soon to more BC communities.",
  alternates: {
    canonical: "https://myhomeplan.ca/service-area",
  },
  openGraph: {
    title: "Service Area | Okanagan Valley, BC | My Home Plan",
    description:
      "My Home Plan serves Kelowna, West Kelowna, Vernon, Penticton, Lake Country, Summerland, and Peachland. Expanding soon to more BC communities.",
    url: "https://myhomeplan.ca/service-area",
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

export default function ServiceAreaPage() {
  return <ServiceAreaContent />;
}
