"use client";

import { GlowCard } from "@/components/ui/motion";
import { Home, HardHat, Building2 } from "lucide-react";
import type { UserType } from "@/stores/user-store";

const options = [
  {
    type: "homeowner" as UserType,
    title: "I'm a Homeowner",
    description: "I want a maintenance plan for my home",
    icon: Home,
    color: "primary" as const,
    accent: "bg-primary/10 text-primary",
  },
  {
    type: "contractor" as UserType,
    title: "I'm a Contractor",
    description: "I want to join the contractor network",
    icon: HardHat,
    color: "sky" as const,
    accent: "bg-sky-500/10 text-sky-600",
  },
  {
    type: "strata" as UserType,
    title: "I Manage a Strata",
    description: "I need building maintenance services",
    icon: Building2,
    color: "emerald" as const,
    accent: "bg-emerald-500/10 text-emerald-600",
  },
];

export function StepUserType({
  onSelect,
}: {
  onSelect: (type: UserType) => void;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Welcome to My Home Plan</h2>
      <p className="mt-2 text-center text-muted-foreground">Let&apos;s get you set up. Who are you?</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {options.map((opt) => (
          <button key={opt.type} onClick={() => onSelect(opt.type)} className="text-left">
            <GlowCard glowColor={opt.color} className="h-full cursor-pointer">
              <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${opt.accent}`}>
                <opt.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold">{opt.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{opt.description}</p>
            </GlowCard>
          </button>
        ))}
      </div>
    </div>
  );
}
