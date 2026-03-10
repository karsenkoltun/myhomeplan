import type { Metadata } from "next";
import AboutContent from "./about-content";

export const metadata: Metadata = {
  title: "About Us | Making Home Maintenance Simple | My Home Plan",
  description:
    "Learn about My Home Plan's mission to make home maintenance simple, fair, and reliable for homeowners in the Okanagan Valley, BC.",
  alternates: {
    canonical: "https://myhomeplan.ca/about",
  },
  openGraph: {
    title: "About Us | Making Home Maintenance Simple | My Home Plan",
    description:
      "Learn about My Home Plan's mission to make home maintenance simple, fair, and reliable for homeowners in the Okanagan Valley, BC.",
    url: "https://myhomeplan.ca/about",
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

export default function AboutPage() {
  return <AboutContent />;
}
