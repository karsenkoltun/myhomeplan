"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function StarRating({
  rating,
  onRate,
  size = "md",
  readonly = false,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const interactive = !readonly && !!onRate;

  return (
    <div
      className="flex gap-1"
      onMouseLeave={() => {
        if (interactive) setHovered(0);
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (interactive ? hovered || rating : rating);

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onMouseEnter={() => {
              if (interactive) setHovered(star);
            }}
            onClick={() => {
              if (interactive) onRate!(star);
            }}
            className={cn(
              "transition-transform duration-150",
              interactive
                ? "cursor-pointer hover:scale-110 active:scale-95 focus:outline-none"
                : "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeMap[size],
                "transition-colors duration-150",
                filled
                  ? "fill-amber-400 text-amber-400"
                  : "fill-none text-muted-foreground/30"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
