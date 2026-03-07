"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, type LucideIcon,
} from "lucide-react";
import { usePlanStore } from "@/stores/plan-store";
import { useBookingStore } from "@/stores/booking-store";
import { SERVICES } from "@/data/services";
import { FadeIn } from "@/components/ui/motion";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

export function StepService() {
  const { selectedServices } = usePlanStore();
  const { setDraft, setBookingStep } = useBookingStore();

  const subscribedServices = SERVICES.filter((s) => selectedServices.includes(s.id));
  const allServices = subscribedServices.length > 0 ? subscribedServices : SERVICES;

  function handleSelect(serviceId: string, serviceName: string) {
    setDraft({
      serviceId,
      serviceName,
      scheduledDate: "",
      scheduledTime: "",
      notes: "",
    });
    setBookingStep(1);
  }

  return (
    <div>
      <h2 className="text-lg font-semibold">Select a Service</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {subscribedServices.length > 0
          ? "Choose from your subscribed services"
          : "Choose a service to book"}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allServices.map((service, i) => {
          const Icon = ICON_MAP[service.icon] || CheckCircle2;
          return (
            <FadeIn key={service.id} delay={i * 0.05}>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className="cursor-pointer transition-colors hover:border-primary/30 hover:bg-muted/50"
                  onClick={() => handleSelect(service.id, service.name)}
                >
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {service.frequencyLabel}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
