"use client";

import { useRef, type CSSProperties } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from "framer-motion";
import {
  Home,
  CheckSquare,
  SlidersHorizontal,
  Users,
  ClipboardCheck,
  Armchair,
  type LucideIcon,
} from "lucide-react";
import { easings } from "@/lib/animations";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface Milestone {
  icon: LucideIcon;
  title: string;
  description: string;
}

const milestones: Milestone[] = [
  {
    icon: Home,
    title: "Tell Us About Your Home",
    description:
      "Share your property details so we can match you with the right services and pros.",
  },
  {
    icon: CheckSquare,
    title: "Choose Your Services",
    description:
      "Pick from 15+ home services. Lawn care, cleaning, snow removal, maintenance - build your perfect plan.",
  },
  {
    icon: SlidersHorizontal,
    title: "Set Your Preferences",
    description:
      "Choose frequency, add-ons, and customize each service to fit your exact needs and budget.",
  },
  {
    icon: Users,
    title: "We Match You With Pros",
    description:
      "We pair your home with licensed, insured local contractors who specialize in what you need.",
  },
  {
    icon: ClipboardCheck,
    title: "Review & Confirm",
    description:
      "See your complete plan with transparent pricing. No hidden fees. Adjust anything before confirming.",
  },
  {
    icon: Armchair,
    title: "Sit Back & Relax",
    description:
      "We handle scheduling, quality control, and communication. Enjoy your home.",
  },
];

// ---------------------------------------------------------------------------
// SVG road paths - designed for natural, organic-looking curves
// ---------------------------------------------------------------------------

// Desktop: S-curve winding through center. ViewBox 800 x 2400.
// The path swings between x~240 (left) and x~560 (right), centering around x=400.
// Milestones sit at the peaks/troughs of each curve.
const DESKTOP_VIEWBOX = { w: 800, h: 2400 };
const DESKTOP_PATH =
  "M 400 40 " +
  "C 400 120, 570 160, 570 300 " + // curve right to milestone 1
  "C 570 440, 230 440, 230 620 " + // swing left to milestone 2
  "C 230 800, 570 800, 570 980 " + // swing right to milestone 3
  "C 570 1160, 230 1160, 230 1340 " + // swing left to milestone 4
  "C 230 1520, 570 1520, 570 1700 " + // swing right to milestone 5
  "C 570 1880, 400 1960, 400 2100"; // center for milestone 6

// Dot positions on the desktop path (at each peak/trough)
const DESKTOP_DOTS = [
  { x: 570, y: 300 },
  { x: 230, y: 620 },
  { x: 570, y: 980 },
  { x: 230, y: 1340 },
  { x: 570, y: 1700 },
  { x: 400, y: 2100 },
];

// Card side: when dot is on the right (x=570), card goes left; vice versa
const CARD_SIDE: ("left" | "right")[] = [
  "left", // dot right, card left
  "right", // dot left, card right
  "left",
  "right",
  "left",
  "right", // final one - dot center, card right
];

// Mobile: straight vertical line down the left side. ViewBox 60 x 2400.
const MOBILE_VIEWBOX = { w: 60, h: 2400 };
const MOBILE_PATH = "M 30 40 L 30 2360";

// Evenly spaced dots along the vertical line
const MOBILE_DOTS = [
  { x: 30, y: 300 },
  { x: 30, y: 620 },
  { x: 30, y: 980 },
  { x: 30, y: 1340 },
  { x: 30, y: 1700 },
  { x: 30, y: 2100 },
];

// ---------------------------------------------------------------------------
// Milestone dot - lights up with a bounce when the road reaches it
// ---------------------------------------------------------------------------

function MilestoneDot({
  index,
  cx,
  cy,
  scrollProgress,
}: {
  index: number;
  cx: number;
  cy: number;
  scrollProgress: ReturnType<typeof useSpring>;
}) {
  const threshold = (index + 0.6) / milestones.length;
  const scale = useTransform(
    scrollProgress,
    [threshold - 0.05, threshold, threshold + 0.04],
    [0.5, 1.3, 1]
  );
  const fillOpacity = useTransform(
    scrollProgress,
    [threshold - 0.05, threshold],
    [0.15, 1]
  );

  return (
    <g>
      {/* Outer glow ring */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={18}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={2}
        style={{
          scale,
          opacity: fillOpacity,
          originX: `${cx}px`,
          originY: `${cy}px`,
        }}
      />
      {/* Inner filled dot */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={10}
        fill="var(--color-primary)"
        style={{
          scale,
          fillOpacity,
          originX: `${cx}px`,
          originY: `${cy}px`,
        }}
        className="roadmap-milestone-dot"
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// Step card - fades/slides in from its side when scrolled into view
// ---------------------------------------------------------------------------

function StepCard({
  milestone,
  index,
  side,
}: {
  milestone: Milestone;
  index: number;
  side: "left" | "right";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = milestone.icon;

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        x: side === "left" ? -50 : 50,
        scale: 0.92,
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, scale: 1 }
          : { opacity: 0, x: side === "left" ? -50 : 50, scale: 0.92 }
      }
      transition={{
        duration: 0.6,
        ease: easings.smooth,
      }}
      className="roadmap-card relative rounded-2xl border border-border/60 bg-card/95 p-5 shadow-md backdrop-blur-sm transition-shadow hover:shadow-lg sm:p-6"
    >
      {/* Header: numbered badge + icon */}
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
          {index + 1}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>

      <h3 className="text-base font-semibold leading-snug sm:text-lg">
        {milestone.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {milestone.description}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Connecting line from card to road dot (desktop only)
// ---------------------------------------------------------------------------

function ConnectorLine({
  dotX,
  dotY,
  side,
  scrollProgress,
  index,
}: {
  dotX: number;
  dotY: number;
  side: "left" | "right";
  scrollProgress: ReturnType<typeof useSpring>;
  index: number;
}) {
  const threshold = (index + 0.6) / milestones.length;
  const opacity = useTransform(
    scrollProgress,
    [threshold - 0.05, threshold],
    [0, 0.4]
  );

  // Line extends from the dot outward toward the card
  const lineLength = 40;
  const x1 = side === "left" ? dotX - 22 : dotX + 22;
  const x2 = side === "left" ? dotX - 22 - lineLength : dotX + 22 + lineLength;

  return (
    <motion.line
      x1={x1}
      y1={dotY}
      x2={x2}
      y2={dotY}
      stroke="var(--color-primary)"
      strokeWidth={2}
      strokeDasharray="4 4"
      style={{ opacity }}
    />
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ScrollRoadmap() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  // Path draws from 0 to 1 as user scrolls through the section
  const pathLength = useTransform(smoothProgress, [0.05, 0.88], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-20"
    >
      {/* ======================= DESKTOP LAYOUT ======================= */}
      <div
        className="relative hidden md:block"
        style={{ height: `${DESKTOP_VIEWBOX.h}px` }}
      >
        {/* SVG road layer */}
        <svg
          viewBox={`0 0 ${DESKTOP_VIEWBOX.w} ${DESKTOP_VIEWBOX.h}`}
          fill="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="oklch(0.65 0.15 200)" />
            </linearGradient>
            <filter id="roadGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Faint background track */}
          <path
            d={DESKTOP_PATH}
            stroke="var(--color-border)"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
          />

          {/* Dashed center line for realism */}
          <path
            d={DESKTOP_PATH}
            stroke="var(--color-muted-foreground)"
            strokeWidth={1}
            strokeDasharray="10 14"
            strokeLinecap="round"
            fill="none"
            opacity={0.2}
          />

          {/* Animated road that draws on scroll */}
          <motion.path
            d={DESKTOP_PATH}
            stroke="url(#roadGrad)"
            strokeWidth={5}
            strokeLinecap="round"
            fill="none"
            filter="url(#roadGlow)"
            style={{ pathLength }}
          />

          {/* Connector lines from dots to cards */}
          {DESKTOP_DOTS.map((dot, i) => (
            <ConnectorLine
              key={`conn-${i}`}
              dotX={dot.x}
              dotY={dot.y}
              side={CARD_SIDE[i]}
              scrollProgress={smoothProgress}
              index={i}
            />
          ))}

          {/* Milestone dots */}
          {DESKTOP_DOTS.map((dot, i) => (
            <MilestoneDot
              key={`dot-${i}`}
              index={i}
              cx={dot.x}
              cy={dot.y}
              scrollProgress={smoothProgress}
            />
          ))}
        </svg>

        {/* Desktop step cards - absolutely positioned beside the road */}
        {milestones.map((ms, i) => {
          const dot = DESKTOP_DOTS[i];
          const dotXPct = (dot.x / DESKTOP_VIEWBOX.w) * 100;
          const dotYPct = (dot.y / DESKTOP_VIEWBOX.h) * 100;
          const isLeft = CARD_SIDE[i] === "left";

          const cardStyle: CSSProperties = {
            position: "absolute",
            top: `calc(${dotYPct}% - 56px)`,
            width: "min(320px, 35%)",
            ...(isLeft
              ? { right: `calc(100% - ${dotXPct}% + 48px)` }
              : { left: `calc(${dotXPct}% + 48px)` }),
          };

          return (
            <div key={i} style={cardStyle}>
              <StepCard milestone={ms} index={i} side={CARD_SIDE[i]} />
            </div>
          );
        })}
      </div>

      {/* ======================== MOBILE LAYOUT ======================== */}
      <div className="relative md:hidden">
        {/* Vertical road line on the left */}
        <div className="absolute left-6 top-0 bottom-0 w-[60px]">
          <svg
            viewBox={`0 0 ${MOBILE_VIEWBOX.w} ${MOBILE_VIEWBOX.h}`}
            fill="none"
            className="h-full w-full"
            preserveAspectRatio="xMidYMin meet"
          >
            <defs>
              <linearGradient
                id="roadGradMobile"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="oklch(0.65 0.15 200)" />
              </linearGradient>
              <filter id="roadGlowMobile">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background track */}
            <path
              d={MOBILE_PATH}
              stroke="var(--color-border)"
              strokeWidth={3}
              strokeLinecap="round"
              fill="none"
            />

            {/* Dashed center line */}
            <path
              d={MOBILE_PATH}
              stroke="var(--color-muted-foreground)"
              strokeWidth={1}
              strokeDasharray="8 12"
              strokeLinecap="round"
              fill="none"
              opacity={0.2}
            />

            {/* Animated road */}
            <motion.path
              d={MOBILE_PATH}
              stroke="url(#roadGradMobile)"
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
              filter="url(#roadGlowMobile)"
              style={{ pathLength }}
            />

            {/* Milestone dots */}
            {MOBILE_DOTS.map((dot, i) => (
              <MilestoneDot
                key={`mdot-${i}`}
                index={i}
                cx={dot.x}
                cy={dot.y}
                scrollProgress={smoothProgress}
              />
            ))}
          </svg>
        </div>

        {/* Mobile cards - stacked vertically with left margin for road */}
        <div className="flex flex-col gap-6 pl-20 sm:pl-24">
          {milestones.map((ms, i) => (
            <div
              key={i}
              style={{
                // Space cards to roughly align with dots
                paddingTop: i === 0 ? "40px" : "100px",
              }}
            >
              <StepCard
                milestone={ms}
                index={i}
                side="right"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ScrollRoadmap;
