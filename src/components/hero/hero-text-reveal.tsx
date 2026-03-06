"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShimmerButton } from "@/components/ui/motion";
import { Button } from "@/components/ui/button";

const line1Words = ["One", "Plan.", "One", "Payment."];
const line2Words = ["Your", "Entire", "Home", "-", "Handled."];

export function HeroTextReveal() {
  return (
    <div className="relative z-10 mx-auto flex min-h-[100vh] max-w-5xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Badge
          variant="secondary"
          className="mb-8 gap-1.5 border-primary/20 bg-primary/10 px-4 py-1.5 text-primary"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          Now Serving the Okanagan Valley
        </Badge>
      </motion.div>

      {/* Main heading - word by word reveal */}
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
        <span className="block">
          {line1Words.map((word, i) => (
            <motion.span
              key={`l1-${i}`}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                delay: 0.4 + i * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="inline-block"
            >
              {word}
              {i < line1Words.length - 1 && <span>&nbsp;</span>}
            </motion.span>
          ))}
        </span>
        <span className="mt-1 block sm:mt-2">
          {line2Words.map((word, i) => (
            <motion.span
              key={`l2-${i}`}
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                delay: 0.85 + i * 0.1,
                ease: [0.21, 0.47, 0.32, 0.98],
              }}
              className="inline-block animated-gradient-text"
            >
              {word}
              {i < line2Words.length - 1 && <span>&nbsp;</span>}
            </motion.span>
          ))}
        </span>
      </h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:mt-8 sm:text-lg md:text-xl"
      >
        Stop juggling contractors, negotiating quotes, and hoping someone shows
        up. My Home Plan manages every service your home needs for one
        predictable monthly price.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:gap-4"
      >
        <Link href="/onboarding">
          <ShimmerButton className="h-12 px-8 text-base">
            Build Your Plan
            <ArrowRight className="ml-2 inline h-4 w-4" />
          </ShimmerButton>
        </Link>
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-full px-8 text-base sm:w-auto"
          asChild
        >
          <Link href="/how-it-works">See How It Works</Link>
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="mt-4 text-sm text-muted-foreground"
      >
        Plans starting at $89/month - Cancel anytime
      </motion.p>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </div>
  );
}
