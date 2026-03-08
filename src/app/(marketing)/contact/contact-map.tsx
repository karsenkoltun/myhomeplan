"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

const ServiceMap = dynamic(() => import("@/components/ui/service-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] items-center justify-center rounded-2xl border bg-muted/20">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <MapPin className="h-6 w-6 animate-pulse" />
        <span className="text-sm">Loading map...</span>
      </div>
    </div>
  ),
});

export default function ContactMap() {
  return <ServiceMap compact zoom={9} />;
}
