"use client";

export function HeroScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Stripe-inspired vibrant gradient mesh with flowing color ribbons */}
      <div className="absolute inset-0">
        {/* Base warm gradient wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #fff7ed 0%, #fdf2f8 20%, #f5f3ff 40%, #eff6ff 60%, #f0fdfa 80%, #fefce8 100%)",
          }}
        />

        {/* Animated flowing color ribbons - Stripe signature */}
        <div
          className="absolute -right-[20%] -top-[30%] h-[90%] w-[70%] rounded-full opacity-50 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #f97316 0%, transparent 70%)",
            animation: "hero-blob-1 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-[5%] top-[5%] h-[70%] w-[55%] rounded-full opacity-40 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
            animation: "hero-blob-2 25s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-[15%] top-[25%] h-[55%] w-[45%] rounded-full opacity-35 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            animation: "hero-blob-3 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[0%] right-[25%] h-[45%] w-[40%] rounded-full opacity-25 blur-[90px]"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            animation: "hero-blob-1 18s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute -right-[10%] -top-[15%] h-[50%] w-[35%] rounded-full opacity-35 blur-[80px]"
          style={{
            background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)",
            animation: "hero-blob-2 15s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top fade for navbar */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/60 to-transparent" />
    </div>
  );
}
