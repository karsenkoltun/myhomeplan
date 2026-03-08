import type { Metadata } from "next";
import { PropertyManagersContent } from "./property-managers-content";

export const metadata: Metadata = {
  title: "Property Managers | Simplify Portfolio Maintenance | My Home Plan",
  description:
    "Manage maintenance across your entire portfolio with one platform. Vetted contractors, volume pricing, centralized scheduling for property managers in the Okanagan.",
  openGraph: {
    title: "Property Managers | Simplify Portfolio Maintenance | My Home Plan",
    description:
      "Manage maintenance across your entire portfolio with one platform. Vetted contractors, volume pricing, centralized scheduling for property managers in the Okanagan.",
    url: "https://myhomeplan.ca/property-managers",
    siteName: "My Home Plan",
    type: "website",
  },
};

export default function PropertyManagersPage() {
  return <PropertyManagersContent />;
}
