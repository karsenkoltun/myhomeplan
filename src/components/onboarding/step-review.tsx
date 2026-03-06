"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles, type LucideIcon, Scissors, Snowflake, Thermometer, Bug, Hammer, Wrench, Zap, Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { usePropertyStore } from "@/stores/property-store";
import { usePlanStore } from "@/stores/plan-store";
import { SERVICES, PLAN_DISCOUNTS } from "@/data/services";
import { calculateServicePrice } from "@/lib/pricing";
import { SpringNumber, ShimmerButton } from "@/components/ui/motion";
import { toast } from "sonner";

const ICON_MAP: Record<string, LucideIcon> = {
  Scissors, Snowflake, Thermometer, Sparkles, Bug, Hammer, Wrench, Zap,
  Sprout, Leaf, Droplets, Waves, Sun, Paintbrush, Armchair,
};

export function StepReview({ onComplete }: { onComplete: () => void }) {
  const { setAccount, completeOnboarding } = useUserStore();
  const { property, serviceSpecs } = usePropertyStore();
  const { selectedServices, planInterval, setPlanInterval } = usePlanStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedServiceData = SERVICES.filter((s) => selectedServices.includes(s.id));

  const subtotal = selectedServiceData.reduce(
    (sum, s) => sum + calculateServicePrice(s, property.homeSqft, property.lotSqft, serviceSpecs[s.id]),
    0
  );
  const discount = PLAN_DISCOUNTS[planInterval].discount;
  const total = subtotal * (1 - discount);

  const handleSubmit = () => {
    if (!name || !email) {
      toast.error("Please fill in your name and email");
      return;
    }
    setAccount({ name, email, phone });
    completeOnboarding();
    setSubmitted(true);
    toast.success("Welcome to My Home Plan!");
    setTimeout(onComplete, 1500);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10"
        >
          <CheckCircle2 className="h-10 w-10 text-primary" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-2xl font-bold"
        >
          You&apos;re all set!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-muted-foreground"
        >
          Redirecting to your account...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Review your plan</h2>
      <p className="mt-2 text-center text-muted-foreground">Almost done! Review your selections and create your account.</p>

      <div className="mt-8 space-y-6">
        {/* Property summary */}
        <Card>
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-muted-foreground">Your Property</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
              <div><span className="text-muted-foreground">Home:</span> {property.homeSqft.toLocaleString()} sqft</div>
              <div><span className="text-muted-foreground">Lot:</span> {property.lotSqft.toLocaleString()} sqft</div>
              <div><span className="text-muted-foreground">Bed/Bath:</span> {property.bedrooms}/{property.bathrooms}</div>
              <div><span className="text-muted-foreground">Type:</span> {property.homeType}</div>
            </div>
          </CardContent>
        </Card>

        {/* Plan summary */}
        <Card className="border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground">Your Services</h3>
              <Badge className="bg-primary/10 text-primary">{selectedServices.length} services</Badge>
            </div>

            <div className="mt-4 space-y-2">
              {selectedServiceData.map((service) => {
                const Icon = ICON_MAP[service.icon] || CheckCircle2;
                const price = calculateServicePrice(service, property.homeSqft, property.lotSqft, serviceSpecs[service.id]);
                return (
                  <div key={service.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{service.name}</span>
                    </div>
                    <span className="font-medium">${price.toFixed(0)}/mo</span>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            {/* Payment frequency */}
            <div className="mb-4">
              <Label className="text-xs text-muted-foreground">Payment Frequency</Label>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {(Object.entries(PLAN_DISCOUNTS) as [string, { label: string; discount: number; description: string }][]).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setPlanInterval(key as "monthly" | "quarterly" | "annual")}
                    className={`rounded-lg border px-2 py-2 text-center text-xs font-medium transition-all ${
                      planInterval === key ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/30"
                    }`}
                  >
                    {val.label}
                    {val.discount > 0 && <span className="block text-[10px] text-primary">{val.description}</span>}
                  </button>
                ))}
              </div>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(0)}/mo</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex items-center justify-between text-sm text-primary">
                <span>{PLAN_DISCOUNTS[planInterval].label} discount</span>
                <span>-${(subtotal * discount).toFixed(0)}/mo</span>
              </div>
            )}

            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-bold">Monthly Total</span>
              <span className="text-2xl font-bold text-primary">
                $<SpringNumber value={Math.round(total)} /><span className="text-sm font-normal text-muted-foreground">/mo</span>
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Account creation */}
        <Card>
          <CardContent className="p-5">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground">Create Your Account</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone (optional)</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="250-555-0123" className="h-11" />
              </div>
            </div>
          </CardContent>
        </Card>

        <ShimmerButton onClick={handleSubmit} className="h-12 w-full text-base">
          Complete Setup <Sparkles className="ml-2 inline h-4 w-4" />
        </ShimmerButton>
        <p className="text-center text-xs text-muted-foreground">No payment required today. This is a simulated signup.</p>
      </div>
    </div>
  );
}
