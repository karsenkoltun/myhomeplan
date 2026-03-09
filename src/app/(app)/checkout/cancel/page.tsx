"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mx-auto"
        >
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/20">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-3xl font-bold tracking-tight"
        >
          Payment cancelled
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-3 text-base text-muted-foreground"
        >
          No worries - your plan details have been saved. You can complete payment whenever you&apos;re ready.
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mx-auto mt-8 h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <button
            onClick={() => router.push("/onboarding")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
          >
            <RotateCcw className="h-4 w-4" /> Try Again
          </button>
          <button
            onClick={() => router.push("/account")}
            className="inline-flex items-center gap-2 rounded-full border px-8 py-3 text-sm font-medium transition-all hover:bg-muted/50"
          >
            Dashboard <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
