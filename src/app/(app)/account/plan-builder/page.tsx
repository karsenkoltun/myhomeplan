import type { Metadata } from "next";
import PlanBuilderContent from "./plan-builder-content";

export const metadata: Metadata = {
  title: "Plan Builder | My Home Plan",
  description:
    "Build a custom home maintenance plan. Select your services and see instant pricing.",
};

export default function PlanBuilderPage() {
  return <PlanBuilderContent />;
}
