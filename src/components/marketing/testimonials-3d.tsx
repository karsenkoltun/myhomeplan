"use client";

import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { easings } from "@/lib/animations";
import { ALL_TESTIMONIALS } from "@/data/testimonials";
import type { Testimonial, TestimonialAudience } from "@/data/testimonials";

// Re-export for backward compatibility
export { ALL_TESTIMONIALS };
export type { Testimonial, TestimonialAudience };

function TestimonialCard3D({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  // Only enable 3D tilt on devices with a pointer (mouse), not touch
  const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: easings.smooth }}
      style={{ perspective: isTouchDevice ? undefined : 800 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => !isTouchDevice && setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={isTouchDevice ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full rounded-2xl border border-border/60 bg-card p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5 sm:p-7"
      >
        {/* Highlight badge */}
        {testimonial.highlight && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: index * 0.12 + 0.3 }}
            className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md"
          >
            {testimonial.highlight}
          </motion.div>
        )}

        {/* Quote icon */}
        <Quote className="mb-3 h-6 w-6 text-primary/20" />

        {/* Stars */}
        <div className="mb-3 flex gap-0.5">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-amber-400 text-amber-400"
            />
          ))}
        </div>

        {/* Quote text */}
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        {/* Author */}
        <div className="mt-5 flex items-center gap-3 border-t border-border/40 pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {testimonial.name[0]}
          </div>
          <div>
            <p className="text-sm font-semibold">{testimonial.name}</p>
            <p className="text-xs text-muted-foreground">
              {testimonial.role} &middot; {testimonial.location}
            </p>
          </div>
        </div>

        {/* Subtle shine effect on hover */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: isHovered
              ? "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 45%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 55%, transparent 60%)"
              : "none",
            transform: "translateZ(1px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

interface Testimonials3DProps {
  audience?: TestimonialAudience;
  testimonials?: Testimonial[];
  maxItems?: number;
}

export function Testimonials3D({
  audience = "all",
  testimonials,
  maxItems = 3,
}: Testimonials3DProps) {
  const items =
    testimonials ||
    (audience === "all"
      ? ALL_TESTIMONIALS.slice(0, maxItems)
      : ALL_TESTIMONIALS.filter((t) => t.audience === audience).slice(
          0,
          maxItems
        ));

  return (
    <div
      className={`grid gap-5 sm:gap-6 ${
        items.length === 2
          ? "md:grid-cols-2"
          : items.length >= 3
          ? "md:grid-cols-3"
          : ""
      }`}
    >
      {items.map((t, i) => (
        <TestimonialCard3D key={t.name} testimonial={t} index={i} />
      ))}
    </div>
  );
}
