"use client";

import dynamic from "next/dynamic";

const Testimonials3D = dynamic(
  () => import("@/components/marketing/testimonials-3d").then((mod) => ({ default: mod.Testimonials3D })),
  { ssr: false }
);

export default function ContactTestimonials() {
  return <Testimonials3D audience="all" maxItems={3} />;
}
