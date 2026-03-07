"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/motion";
import { Home, Users, MapPin, TrendingDown } from "lucide-react";

const stats = [
  { icon: Home, value: 200, suffix: "+", label: "Homes Served", color: "text-primary" },
  { icon: Users, value: 50, suffix: "+", label: "Vetted Contractors", color: "text-emerald-500" },
  { icon: MapPin, value: 7, suffix: "", label: "Cities Covered", color: "text-sky-500" },
  { icon: TrendingDown, value: 35, suffix: "%", label: "Avg. Savings", color: "text-amber-500" },
];

export function SocialProofBar({ dark = false }: { dark?: boolean }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <section
      ref={ref}
      className={`border-y py-6 sm:py-8 ${
        dark
          ? "border-white/10 bg-white/[0.02]"
          : "border-border/50 bg-muted/30"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <stat.icon
                className={`mb-2 h-5 w-5 ${stat.color} sm:h-6 sm:w-6`}
              />
              <p
                className={`text-2xl font-bold sm:text-3xl ${
                  dark ? "text-white" : ""
                }`}
              >
                {isInView ? (
                  <AnimatedCounter
                    target={stat.value}
                    suffix={stat.suffix}
                    duration={1.5}
                  />
                ) : (
                  "0"
                )}
              </p>
              <p
                className={`mt-0.5 text-xs sm:text-sm ${
                  dark ? "text-white/50" : "text-muted-foreground"
                }`}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
