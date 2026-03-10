import type { Metadata } from "next";
import { ContractorsContent } from "./contractors-content";

export const metadata: Metadata = {
  title: "Join as a Contractor | Free Leads & Guaranteed Pay | My Home Plan",
  description:
    "Get free qualified leads, guaranteed payment, and zero marketing costs. Join the Okanagan's fastest-growing home service network. Licensed contractors welcome.",
  alternates: {
    canonical: "https://myhomeplan.ca/contractors",
  },
  openGraph: {
    title: "Join as a Contractor | Free Leads & Guaranteed Pay | My Home Plan",
    description:
      "Get free qualified leads, guaranteed payment, and zero marketing costs. Join the Okanagan's fastest-growing home service network. Licensed contractors welcome.",
    url: "https://myhomeplan.ca/contractors",
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

export default function ContractorsPage() {
  return <ContractorsContent />;
}
