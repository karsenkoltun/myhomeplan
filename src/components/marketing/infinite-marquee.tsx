"use client";

import { type ReactNode } from "react";

interface InfiniteMarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
}

export function InfiniteMarquee({
  children,
  speed = 30,
  direction = "left",
  pauseOnHover = true,
  className = "",
}: InfiniteMarqueeProps) {
  return (
    <div
      className={`group relative flex overflow-hidden ${className}`}
      style={
        {
          "--marquee-speed": `${speed}s`,
          "--marquee-direction": direction === "left" ? "normal" : "reverse",
        } as React.CSSProperties
      }
    >
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-gradient-to-r from-background to-transparent sm:w-24" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-gradient-to-l from-background to-transparent sm:w-24" />

      {/* Track 1 */}
      <div
        className={`flex shrink-0 items-center gap-6 sm:gap-8 ${
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
        }`}
        style={{
          animation: `marquee-scroll var(--marquee-speed) linear infinite var(--marquee-direction)`,
        }}
      >
        {children}
      </div>

      {/* Track 2 (duplicate for seamless loop) */}
      <div
        className={`flex shrink-0 items-center gap-6 sm:gap-8 ${
          pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""
        }`}
        style={{
          animation: `marquee-scroll var(--marquee-speed) linear infinite var(--marquee-direction)`,
        }}
        aria-hidden
      >
        {children}
      </div>
    </div>
  );
}

// Pre-built marquee items
export function MarqueeServiceItem({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-border/50 bg-card px-4 py-2 shadow-sm sm:gap-3 sm:px-5 sm:py-2.5">
      <Icon className={`h-4 w-4 ${color} sm:h-5 sm:w-5`} />
      <span className="text-sm font-medium whitespace-nowrap sm:text-base">{label}</span>
    </div>
  );
}

export function MarqueeCityItem({ city }: { city: string }) {
  return (
    <span className="shrink-0 text-sm font-medium text-muted-foreground whitespace-nowrap sm:text-base">
      {city}
    </span>
  );
}

export function MarqueeTextItem({ text }: { text: string }) {
  return (
    <span className="shrink-0 text-lg font-semibold whitespace-nowrap text-foreground/80 sm:text-xl">
      {text}
    </span>
  );
}
