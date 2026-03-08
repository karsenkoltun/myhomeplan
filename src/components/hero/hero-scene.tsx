"use client";

import { MorphingBlob, GradientMesh } from "@/components/ui/motion";
import { HeroParticles } from "./hero-particles";

export function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient mesh base */}
      <GradientMesh />

      {/* Morphing blobs - hidden on mobile for performance */}
      <div className="absolute -right-32 -top-32 text-primary/[0.06] hidden sm:block">
        <MorphingBlob size={500} />
      </div>
      <div className="absolute -left-24 bottom-0 text-sky-400/[0.05] hidden sm:block">
        <MorphingBlob size={400} />
      </div>
      <div className="absolute right-1/4 top-1/3 text-violet-400/[0.04] hidden md:block">
        <MorphingBlob size={300} />
      </div>

      {/* Particles - hidden on mobile for performance */}
      <div className="hidden sm:block">
        <HeroParticles />
      </div>

      {/* Subtle grain overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
