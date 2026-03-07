"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { easings } from "@/lib/animations";

interface BentoItem {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  span?: "large" | "tall" | "default";
}

interface BentoGridProps {
  items: BentoItem[];
  className?: string;
}

function BentoCard({ item, index }: { item: BentoItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = item.icon;

  const spanClass =
    item.span === "large"
      ? "md:col-span-2"
      : item.span === "tall"
      ? "md:row-span-2"
      : "";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: easings.smooth,
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5 sm:p-7 ${spanClass}`}
    >
      {/* Subtle gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.bg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className={`h-5 w-5 ${item.color}`} />
        </div>

        <h3 className="text-base font-bold sm:text-lg">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export function BentoGrid({ items, className = "" }: BentoGridProps) {
  return (
    <div
      className={`grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 ${className}`}
    >
      {items.map((item, i) => (
        <BentoCard key={item.title} item={item} index={i} />
      ))}
    </div>
  );
}

// Standalone gradient CTA card for use inside bento grids or anywhere
export function GradientCTACard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: easings.smooth }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-blue-700 p-6 text-primary-foreground shadow-lg sm:p-8 ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      <div className="relative">
        <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
        {subtitle && (
          <p className="mt-2 text-sm opacity-90 sm:text-base">{subtitle}</p>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>
    </motion.div>
  );
}
