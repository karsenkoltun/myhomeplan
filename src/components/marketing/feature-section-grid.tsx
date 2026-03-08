"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { easings } from "@/lib/animations";
import {
  Leaf,
  Thermometer,
  Flower2,
  Snowflake,
  Bug,
  Sparkles,
  Hammer,
  Wifi,
  DollarSign,
  Home,
  Shield,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const ICON_MAP: Record<string, LucideIcon> = {
  Leaf,
  Thermometer,
  Flower2,
  Snowflake,
  Bug,
  Sparkles,
  Hammer,
  Wifi,
  DollarSign,
  Home,
  Shield,
  Wrench,
};

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  href?: string;
  color: string;
  bg: string;
}

interface FeatureSectionGridProps {
  badge?: string;
  title: string;
  subtitle?: string;
  items: FeatureItem[];
  columns?: 2 | 3;
}

function FeatureCard({ item, index }: { item: FeatureItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const Icon = ICON_MAP[item.icon] || Home;

  const content = (
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
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.bg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className={`h-5 w-5 ${item.color}`} />
        </div>

        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </motion.div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

export function FeatureSectionGrid({
  badge,
  title,
  subtitle,
  items,
  columns = 3,
}: FeatureSectionGridProps) {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-60px" });

  const gridCols =
    columns === 2
      ? "sm:grid-cols-2"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section>
      {/* Header */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 24 }}
        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: easings.smooth }}
        className="mb-8"
      >
        {badge && (
          <Badge
            variant="secondary"
            className="mb-3 border-primary/20 bg-primary/10 text-primary"
          >
            {badge}
          </Badge>
        )}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {subtitle}
          </p>
        )}
      </motion.div>

      {/* Grid */}
      <div className={`grid gap-4 sm:gap-5 ${gridCols}`}>
        {items.map((item, i) => (
          <FeatureCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
