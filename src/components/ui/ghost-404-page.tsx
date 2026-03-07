"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

const ease = [0.43, 0.13, 0.23, 0.96] as const

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease,
      delayChildren: 0.1,
      staggerChildren: 0.1,
    },
  },
} as const

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease,
    },
  },
} as const

const numberVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    x: direction * 40,
    y: 15,
    rotate: direction * 5,
  }),
  visible: {
    opacity: 0.7,
    x: 0,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease,
    },
  },
}

const ghostVariants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 15,
    rotate: -5,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease,
    },
  },
  hover: {
    scale: 1.1,
    y: -10,
    rotate: [0, -5, 5, -5, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut" as const,
      rotate: {
        duration: 2,
        ease: "linear" as const,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  },
  floating: {
    y: [-5, 5],
    transition: {
      y: {
        duration: 2,
        ease: "easeInOut" as const,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  },
}

// Ghost SVG rendered inline to avoid external image dependency
function GhostIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M60 10C35.15 10 15 30.15 15 55v45c0 2 1.5 3.5 3 2.5l12-8c2-1.5 4.5-1.5 6.5 0l10 7c2 1.5 4.5 1.5 6.5 0l10-7c2-1.5 4.5-1.5 6.5 0l10 7c2 1.5 4.5 1.5 6.5 0l10-7c2-1.5 4.5-1.5 6.5 0l12 8c1.5 1 3-0.5 3-2.5V55c0-24.85-20.15-45-45-45z"
        className="fill-primary/20 stroke-primary/40"
        strokeWidth="2"
      />
      <circle cx="42" cy="52" r="6" className="fill-foreground/60" />
      <circle cx="78" cy="52" r="6" className="fill-foreground/60" />
      <path
        d="M48 72c0 0 6 8 12 8s12-8 12-8"
        className="stroke-foreground/40"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <AnimatePresence mode="wait">
        <motion.div
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <div className="flex items-center justify-center gap-4 md:gap-6 mb-8 md:mb-12">
            <motion.span
              className="text-[80px] md:text-[120px] font-bold text-foreground/70 select-none"
              variants={numberVariants}
              custom={-1}
            >
              4
            </motion.span>
            <motion.div
              variants={ghostVariants}
              whileHover="hover"
              animate={["visible", "floating"]}
            >
              <GhostIcon className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] select-none" />
            </motion.div>
            <motion.span
              className="text-[80px] md:text-[120px] font-bold text-foreground/70 select-none"
              variants={numberVariants}
              custom={1}
            >
              4
            </motion.span>
          </div>

          <motion.h1
            className="text-3xl md:text-5xl font-bold text-foreground/70 mb-4 md:mb-6 select-none"
            variants={itemVariants}
          >
            Boo! Page missing!
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-foreground/50 mb-8 md:mb-12 select-none"
            variants={itemVariants}
          >
            Whoops! This page must be a ghost - it&apos;s not here!
          </motion.p>

          <motion.div
            variants={itemVariants}
            whileHover={{
              scale: 1.05,
              transition: {
                duration: 0.3,
                ease,
              },
            }}
          >
            <Link
              href="/"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg font-medium hover:bg-primary/90 transition-colors select-none"
            >
              Go Home
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
