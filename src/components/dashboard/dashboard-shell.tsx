"use client";

import type { ReactNode } from "react";
import { FadeIn } from "@/components/ui/motion";
import { motion } from "framer-motion";

export function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <FadeIn>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
        </motion.div>
      </FadeIn>
      <div className="mt-8">{children}</div>
    </div>
  );
}
