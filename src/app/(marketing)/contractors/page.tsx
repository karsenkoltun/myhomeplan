import type { Metadata } from "next";
import { ContractorsContent } from "./contractors-content";

export const metadata: Metadata = {
  title: "Join as a Contractor | Free Leads & Guaranteed Pay | My Home Plan",
  description:
    "Get free qualified leads, guaranteed payment, and zero marketing costs. Join the Okanagan's fastest-growing home service network. Licensed contractors welcome.",
  openGraph: {
    title: "Join as a Contractor | Free Leads & Guaranteed Pay | My Home Plan",
    description:
      "Get free qualified leads, guaranteed payment, and zero marketing costs. Join the Okanagan's fastest-growing home service network. Licensed contractors welcome.",
    url: "https://myhomeplan.ca/contractors",
    siteName: "My Home Plan",
    type: "website",
  },
};

export default function ContractorsPage() {
  return <ContractorsContent />;
}
