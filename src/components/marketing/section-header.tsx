"use client";

import { Badge } from "@/components/ui/badge";
import { FadeIn } from "@/components/ui/motion";

interface SectionHeaderProps {
  badge?: string;
  badgeColor?: "primary" | "emerald" | "sky" | "amber" | "violet" | "rose";
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
}

const badgeColors = {
  primary: "border-primary/20 bg-primary/10 text-primary",
  emerald: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  sky: "border-sky-500/20 bg-sky-500/10 text-sky-700",
  amber: "border-amber-500/20 bg-amber-500/10 text-amber-700",
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-700",
  rose: "border-rose-500/20 bg-rose-500/10 text-rose-700",
};

export function SectionHeader({
  badge,
  badgeColor = "primary",
  title,
  subtitle,
  align = "center",
  dark = false,
}: SectionHeaderProps) {
  return (
    <FadeIn>
      <div
        className={`mx-auto max-w-3xl ${
          align === "center" ? "text-center" : "text-left"
        }`}
      >
        {badge && (
          <Badge
            variant="secondary"
            className={`mb-4 ${badgeColors[badgeColor]}`}
          >
            {badge}
          </Badge>
        )}
        <h2
          className={`text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl ${
            dark ? "text-white" : ""
          }`}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={`mt-3 text-base sm:text-lg ${
              dark ? "text-white/60" : "text-muted-foreground"
            }`}
          >
            {subtitle}
          </p>
        )}
      </div>
    </FadeIn>
  );
}
