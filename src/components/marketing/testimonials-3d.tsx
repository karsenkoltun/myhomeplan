"use client";

import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { easings } from "@/lib/animations";

export type TestimonialAudience = "homeowner" | "contractor" | "strata" | "pm" | "all";

export interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  audience: TestimonialAudience;
  highlight?: string;
}

// Master testimonial bank
export const ALL_TESTIMONIALS: Testimonial[] = [
  // Homeowner testimonials
  {
    name: "Sarah M.",
    role: "Busy Parent",
    location: "Kelowna, BC",
    quote:
      "Between the kids, work, and just life - I had zero time to deal with home maintenance. My Home Plan handles everything. I haven't called a contractor in 8 months.",
    rating: 5,
    audience: "homeowner",
    highlight: "8 months contractor-free",
  },
  {
    name: "Greg & Linda T.",
    role: "Snowbirds",
    location: "Penticton, BC",
    quote:
      "We spend winters in Arizona. Before My Home Plan, we'd come back to a disaster every spring. Now everything happens automatically. Total peace of mind.",
    rating: 5,
    audience: "homeowner",
    highlight: "Total peace of mind",
  },
  {
    name: "Jordan K.",
    role: "First-Time Homeowner",
    location: "Vernon, BC",
    quote:
      "I had no idea how much maintenance a house needed. My Home Plan was a lifesaver. They told me what I needed, scheduled it all, and I save over $200/month.",
    rating: 5,
    audience: "homeowner",
    highlight: "Saves $200/month",
  },
  {
    name: "Michelle D.",
    role: "Working Professional",
    location: "West Kelowna, BC",
    quote:
      "I used to spend every Saturday dealing with yard work and house stuff. Now I actually have my weekends back. Worth every penny.",
    rating: 5,
    audience: "homeowner",
    highlight: "Weekends back",
  },
  // Contractor testimonials
  {
    name: "Dave R.",
    role: "Landscaping Pro",
    location: "Kelowna, BC",
    quote:
      "I used to spend 15 hours a week marketing and chasing leads. Now MHP sends me steady work, I get paid on time every time, and I can focus on what I'm good at.",
    rating: 5,
    audience: "contractor",
    highlight: "15 hrs/week saved",
  },
  {
    name: "Maria S.",
    role: "Cleaning Services",
    location: "Lake Country, BC",
    quote:
      "The consistency is what sold me. I know exactly what my month looks like. No more feast-or-famine. My income has been stable since I joined.",
    rating: 5,
    audience: "contractor",
    highlight: "Stable income",
  },
  {
    name: "Tyler B.",
    role: "HVAC Technician",
    location: "Penticton, BC",
    quote:
      "Zero cost to join, guaranteed payment, and I don't have to deal with billing or scheduling. I just show up, do great work, and get paid. Simple.",
    rating: 5,
    audience: "contractor",
    highlight: "$0 cost to join",
  },
  // Strata testimonials
  {
    name: "Pinnacle Strata Council",
    role: "48-Unit Complex",
    location: "Kelowna, BC",
    quote:
      "Managing 6 different vendors was a nightmare. My Home Plan consolidated everything into one contract. Our costs dropped 30% and quality went up.",
    rating: 5,
    audience: "strata",
    highlight: "30% cost reduction",
  },
  {
    name: "Lakeview Towers",
    role: "120-Unit Building",
    location: "West Kelowna, BC",
    quote:
      "The volume pricing alone saved us over $40,000 annually. But the real win is having one point of contact for everything. Our property manager loves it.",
    rating: 5,
    audience: "strata",
    highlight: "$40K annual savings",
  },
  {
    name: "Summit Ridge Strata",
    role: "75-Unit Complex",
    location: "Vernon, BC",
    quote:
      "Quality consistency across all our common areas improved dramatically. Residents notice the difference and complaints about maintenance have dropped to near zero.",
    rating: 5,
    audience: "strata",
    highlight: "Near-zero complaints",
  },
  // PM testimonials
  {
    name: "Rachel F.",
    role: "Portfolio Manager (35 properties)",
    location: "Kelowna, BC",
    quote:
      "I manage 35 rental properties. Before MHP, I had a spreadsheet of 40+ contractors. Now I have one dashboard, one invoice, and 60% less admin time.",
    rating: 5,
    audience: "pm",
    highlight: "60% less admin",
  },
  {
    name: "Pacific Properties Group",
    role: "Property Management Co.",
    location: "Penticton, BC",
    quote:
      "Tenant satisfaction scores went up 25% since we switched to My Home Plan. Maintenance requests get handled faster and our owners are thrilled with the cost savings.",
    rating: 5,
    audience: "pm",
    highlight: "25% higher satisfaction",
  },
  {
    name: "James W.",
    role: "Independent PM (12 properties)",
    location: "Lake Country, BC",
    quote:
      "As a solo property manager, I was drowning in maintenance coordination. MHP gave me my life back. My clients get better service and I have time to grow my business.",
    rating: 5,
    audience: "pm",
    highlight: "Time to grow",
  },
];

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

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
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
      style={{ perspective: 800 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
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
