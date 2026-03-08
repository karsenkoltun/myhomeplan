import type { Metadata } from "next";
import PlanBuilderContent from "./plan-builder-content";

export const metadata: Metadata = {
  title: "Build Your Custom Home Plan | See Live Pricing | My Home Plan",
  description:
    "Use our Plan Builder to create a custom home maintenance plan. Select your services, property size, and see instant pricing. No commitment required.",
  openGraph: {
    title: "Build Your Custom Home Plan | See Live Pricing | My Home Plan",
    description:
      "Use our Plan Builder to create a custom home maintenance plan. Select your services, property size, and see instant pricing. No commitment required.",
    url: "https://myhomeplan.ca/plan-builder",
    siteName: "My Home Plan",
    type: "website",
  },
};

export default function PlanBuilderPage() {
  return <PlanBuilderContent />;
}
