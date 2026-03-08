import type { Metadata } from "next";
import HomePage from "./home-page";

export const metadata: Metadata = {
  title: "My Home Plan | All Your Home Services, One Monthly Plan",
  description:
    "Subscribe to a monthly plan covering lawn care, snow removal, HVAC, cleaning, pest control, and more. Vetted contractors, guaranteed scheduling, predictable pricing. Serving the Okanagan Valley, BC.",
  keywords: [
    "home services subscription",
    "home maintenance plan",
    "monthly home services",
    "lawn care Kelowna",
    "snow removal Okanagan",
    "HVAC maintenance BC",
    "house cleaning subscription",
    "pest control plan",
    "home services Okanagan",
    "Kelowna home maintenance",
  ],
  openGraph: {
    title: "My Home Plan | All Your Home Services, One Monthly Plan",
    description:
      "One subscription. Every home service. Zero hassle. Serving the Okanagan Valley, BC.",
    url: "https://myhomeplan.ca",
    siteName: "My Home Plan",
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Home Plan | All Your Home Services, One Monthly Plan",
    description:
      "One subscription. Every home service. Zero hassle. Serving the Okanagan Valley, BC.",
  },
  alternates: {
    canonical: "https://myhomeplan.ca",
  },
};

export default function Page() {
  return <HomePage />;
}
