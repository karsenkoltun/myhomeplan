"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Maximize2, X, MapPin } from "lucide-react";

const ServiceMap = dynamic(() => import("@/components/ui/service-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        <MapPin className="h-8 w-8 animate-pulse" />
        <span className="text-sm">Loading map...</span>
      </div>
    </div>
  ),
});

interface ExpandMapProps {
  className?: string;
}

export default function ExpandMap({ className }: ExpandMapProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = useCallback(() => setIsOpen(true), []);
  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpen}
        className={className}
      >
        <Maximize2 className="mr-1.5 h-3.5 w-3.5" />
        View Full Map
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
          {/* Header bar */}
          <div className="flex items-center justify-between border-b bg-background px-4 py-3 shadow-sm sm:px-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <h2 className="text-sm font-semibold sm:text-base">
                  Service Area Map
                </h2>
                <p className="text-xs text-muted-foreground">
                  Serving 7 cities across the Okanagan Valley
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-9 w-9 rounded-full"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close map</span>
            </Button>
          </div>

          {/* Map fills remaining space */}
          <div className="flex-1 p-2 sm:p-4">
            <ServiceMap className="h-full rounded-xl" zoom={10} />
          </div>
        </div>
      )}
    </>
  );
}
