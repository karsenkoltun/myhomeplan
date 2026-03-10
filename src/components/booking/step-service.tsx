"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair, Package, Loader2,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useUserStore } from "@/stores/user-store";
import { useBookingStore } from "@/stores/booking-store";
import { getSubscriptionForProperty, getSubscription } from "@/lib/supabase/queries";
import { SERVICES } from "@/data/services";
import { FadeIn } from "@/components/ui/motion";
import { motion } from "framer-motion";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

export function StepService() {
  const { user } = useAuth();
  const { activePropertyId } = useUserStore();
  const { setDraft, setBookingStep } = useBookingStore();
  const [planServiceIds, setPlanServiceIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlanServices() {
      if (!user) return;
      try {
        let sub = null;
        if (activePropertyId) {
          sub = await getSubscriptionForProperty(activePropertyId);
        }
        if (!sub) {
          sub = await getSubscription(user.id);
        }
        if (sub) {
          const services = (sub.subscription_services ?? []) as { service_id: string }[];
          setPlanServiceIds(services.map((s) => s.service_id));
        } else {
          setPlanServiceIds([]);
        }
      } catch {
        setPlanServiceIds([]);
      } finally {
        setLoading(false);
      }
    }
    loadPlanServices();
  }, [user, activePropertyId]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // No plan - show empty state
  if (planServiceIds.length === 0) {
    return (
      <FadeIn>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 text-lg font-semibold">No active plan</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Build and save a plan first, then you can book your included services.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/plan-builder">Build Your Plan</Link>
          </Button>
        </div>
      </FadeIn>
    );
  }

  const bookableServices = SERVICES.filter((s) => planServiceIds.includes(s.id));

  return (
    <div>
      <h2 className="text-lg font-semibold">Select a Service</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose from your plan&apos;s included services
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bookableServices.map((service, i) => {
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
