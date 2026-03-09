"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/3d-testimonails";
import { ALL_TESTIMONIALS, type TestimonialAudience } from "@/data/testimonials";
import { MapPin, Star } from "lucide-react";

function TestimonialCard({
  name,
  role,
  location,
  quote,
  rating,
  highlight,
}: {
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  highlight?: string;
}) {
  return (
    <Card className="w-72 shrink-0">
      <CardContent className="p-5">
        <div className="flex items-center gap-2.5">
          <Avatar className="size-9">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <figcaption className="flex items-center gap-1.5 text-sm font-medium text-foreground">
              {name}
            </figcaption>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
            <MapPin className="h-3 w-3" />
            {location}
          </div>
          {highlight && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {highlight}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface TestimonialsMarqueeProps {
  audience?: TestimonialAudience;
  maxItems?: number;
}

export function TestimonialsMarquee({
  audience = "all",
  maxItems,
}: TestimonialsMarqueeProps) {
  const filtered =
    audience === "all"
      ? ALL_TESTIMONIALS
      : ALL_TESTIMONIALS.filter((t) => t.audience === audience);

  const testimonials = maxItems ? filtered.slice(0, maxItems) : filtered;

  // Split testimonials into columns for the 3D effect
  const colCount = 4;
  const columns: (typeof testimonials)[] = Array.from(
    { length: colCount },
    (_, i) => testimonials.filter((_, idx) => idx % colCount === i)
  );

  // If we don't have enough testimonials for 4 columns, reuse them
  while (columns.some((col) => col.length === 0)) {
    columns.forEach((col, i) => {
      if (col.length === 0) {
        columns[i] = [...testimonials];
      }
    });
  }

  return (
    <div className="relative flex h-[500px] w-full flex-row items-center justify-center overflow-hidden rounded-2xl border border-border/50 bg-muted/20 [perspective:300px]">
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}
      >
        {columns.map((col, colIdx) => (
          <Marquee
            key={colIdx}
            vertical
            pauseOnHover
            reverse={colIdx % 2 === 1}
            repeat={3}
            className="[--duration:40s]"
          >
            {col.map((t) => (
              <TestimonialCard
                key={`${t.name}-${colIdx}`}
                name={t.name}
                role={t.role}
                location={t.location}
                quote={t.quote}
                rating={t.rating}
                highlight={t.highlight}
              />
            ))}
          </Marquee>
        ))}
      </div>
      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
    </div>
  );
}
