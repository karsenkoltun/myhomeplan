"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, type Variant } from "framer-motion";
import { springs, easings } from "@/lib/animations";

// Fade up animation - the workhorse
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  direction = "up",
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const directionMap = {
    up: { y: 24, x: 0 },
    down: { y: -24, x: 0 },
    left: { x: 24, y: 0 },
    right: { x: -24, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{
        opacity: 0,
        ...directionMap[direction],
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, ...directionMap[direction] }
      }
      transition={{
        duration,
        delay,
        ease: easings.smooth,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animations
export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
  delayStart = 0,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delayStart?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delayStart,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.45,
            ease: easings.smooth,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Animated counter for stats
export function AnimatedCounter({
  target,
  prefix = "",
  suffix = "",
  duration = 1.5,
  className = "",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {isInView ? count.toLocaleString() : "0"}
      {suffix}
    </span>
  );
}

// Scale on hover
export function ScaleOnHover({
  children,
  className = "",
  scale = 1.03,
}: {
  children: ReactNode;
  className?: string;
  scale?: number;
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={springs.default}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Slide in from side
export function SlideIn({
  children,
  className = "",
  from = "left",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  from?: "left" | "right";
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: from === "left" ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: easings.smooth,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Number ticker for smooth price transitions
export function NumberTicker({
  value,
  className = "",
}: {
  value: number;
  className?: string;
}) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      {value}
    </motion.span>
  );
}

// Pulse ring animation for CTAs
export function PulseRing({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
      {children}
    </div>
  );
}

// --- NEW MOTION COMPONENTS ---

// Staggered text reveal - letter by letter or word by word
export function TextReveal({
  text,
  className = "",
  delay = 0,
  wordByWord = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  wordByWord?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const parts = wordByWord ? text.split(" ") : text.split("");

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {parts.map((part, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 20, filter: "blur(8px)" }
          }
          transition={{
            duration: 0.5,
            delay: delay + i * (wordByWord ? 0.08 : 0.03),
            ease: easings.smooth,
          }}
          className="inline-block"
        >
          {part}
          {wordByWord && <span>&nbsp;</span>}
        </motion.span>
      ))}
    </span>
  );
}

// Glow on hover effect
export function GlowCard({
  children,
  className = "",
  glowColor = "primary",
}: {
  children: ReactNode;
  className?: string;
  glowColor?: "primary" | "sky" | "emerald" | "amber" | "violet";
}) {
  const colorMap = {
    primary: "hover:shadow-primary/20 hover:border-primary/40",
    sky: "hover:shadow-sky-500/20 hover:border-sky-500/40",
    emerald: "hover:shadow-emerald-500/20 hover:border-emerald-500/40",
    amber: "hover:shadow-amber-500/20 hover:border-amber-500/40",
    violet: "hover:shadow-violet-500/20 hover:border-violet-500/40",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={springs.smooth}
      className={`rounded-2xl border bg-card p-6 shadow-lg transition-all duration-300 ${colorMap[glowColor]} ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Spring number - animates on value change
export function SpringNumber({
  value,
  prefix = "",
  suffix = "",
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (v) => {
      setDisplay(Math.round(v));
    });
    return unsubscribe;
  }, [springValue]);

  return (
    <span className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

// Shimmer button effect
export function ShimmerButton({
  children,
  className = "",
  onClick,
  disabled,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={springs.snappy}
      className={`shimmer-button relative overflow-hidden rounded-xl bg-primary px-8 py-3 font-semibold text-primary-foreground ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <div className="shimmer-sweep absolute inset-0" />
    </motion.button>
  );
}

// Floating element with perpetual gentle animation
export function FloatingElement({
  children,
  className = "",
  amplitude = 10,
  duration = 6,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}) {
  return (
    <motion.div
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Progress ring - circular progress
export function ProgressRing({
  progress,
  size = 48,
  strokeWidth = 3,
  className = "",
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const springProgress = useSpring(0, { stiffness: 80, damping: 20 });

  useEffect(() => {
    springProgress.set(progress);
  }, [progress, springProgress]);

  const strokeDashoffset = useTransform(
    springProgress,
    [0, 100],
    [circumference, 0]
  );

  return (
    <svg width={size} height={size} className={className}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/30"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        style={{ strokeDashoffset }}
        className="text-primary"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

// Morphing blob SVG shape
export function MorphingBlob({
  className = "",
  size = 400,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
    >
      <motion.path
        d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
        fill="currentColor"
        animate={{
          d: [
            "M44.7,-76.4C58.8,-69.2,71.8,-58.7,79.6,-45.2C87.4,-31.7,90,-15.8,88.8,-0.7C87.6,14.5,82.5,28.9,74.1,41.1C65.7,53.3,54,63.2,40.8,70.3C27.6,77.4,13.8,81.6,-1.1,83.5C-16,85.3,-32.1,84.7,-45.5,78C-58.9,71.3,-69.7,58.4,-77.3,44C-84.9,29.5,-89.3,13.8,-87.5,1C-85.8,-11.7,-77.9,-23.4,-69.6,-34C-61.2,-44.6,-52.3,-54,-41.2,-62.5C-30.1,-71,-15,-78.5,0.3,-79.1C15.7,-79.6,31.5,-83.6,44.7,-76.4Z",
            "M39.5,-67.9C52.9,-60.1,66.8,-52.5,74.5,-40.7C82.1,-28.9,83.4,-14.5,82.2,-0.7C81,13.1,77.3,26.1,69.8,36.9C62.3,47.7,51,56.3,38.5,63.3C26,70.3,13,75.7,-0.8,77.1C-14.6,78.5,-29.3,75.9,-42.3,69.4C-55.3,62.9,-66.6,52.5,-73.7,39.5C-80.8,26.5,-83.7,11,-80,-2.2C-76.3,-15.3,-66.1,-26.3,-56.3,-35.8C-46.4,-45.3,-37,-53.4,-26.1,-62.8C-15.2,-72.1,-3,-82.7,6.3,-83.3C15.5,-83.9,26.2,-75.6,39.5,-67.9Z",
            "M44.7,-76.4C58.8,-69.2,71.8,-58.7,79.6,-45.2C87.4,-31.7,90,-15.8,88.8,-0.7C87.6,14.5,82.5,28.9,74.1,41.1C65.7,53.3,54,63.2,40.8,70.3C27.6,77.4,13.8,81.6,-1.1,83.5C-16,85.3,-32.1,84.7,-45.5,78C-58.9,71.3,-69.7,58.4,-77.3,44C-84.9,29.5,-89.3,13.8,-87.5,1C-85.8,-11.7,-77.9,-23.4,-69.6,-34C-61.2,-44.6,-52.3,-54,-41.2,-62.5C-30.1,-71,-15,-78.5,0.3,-79.1C15.7,-79.6,31.5,-83.6,44.7,-76.4Z",
          ],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.svg>
  );
}

// Gradient mesh background
export function GradientMesh({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%]"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "conic-gradient(from 0deg, oklch(0.55 0.18 250 / 0.08), oklch(0.7 0.15 200 / 0.06), oklch(0.6 0.12 280 / 0.08), oklch(0.55 0.18 250 / 0.08))",
        }}
      />
      <motion.div
        className="absolute -right-1/4 -bottom-1/4 h-[120%] w-[120%]"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "conic-gradient(from 180deg, oklch(0.7 0.14 180 / 0.06), oklch(0.5 0.16 260 / 0.08), oklch(0.65 0.13 220 / 0.06), oklch(0.7 0.14 180 / 0.06))",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-3xl" />
    </div>
  );
}
