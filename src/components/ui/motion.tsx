"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useAnimation, type Variant } from "framer-motion";

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
        ease: [0.21, 0.47, 0.32, 0.98],
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
            ease: [0.21, 0.47, 0.32, 0.98],
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
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
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
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
      initial={{ opacity: 0, x: from === "left" ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
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
