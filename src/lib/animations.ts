// Centralized spring configs and animation presets

export const springs = {
  snappy: { type: "spring" as const, stiffness: 500, damping: 30 },
  bouncy: { type: "spring" as const, stiffness: 300, damping: 15 },
  smooth: { type: "spring" as const, stiffness: 200, damping: 25 },
  gentle: { type: "spring" as const, stiffness: 120, damping: 20 },
  default: { type: "spring" as const, stiffness: 400, damping: 30 },
};

export const easings = {
  smooth: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number],
  snappy: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  easeOut: [0, 0, 0.2, 1] as [number, number, number, number],
  easeIn: [0.4, 0, 1, 1] as [number, number, number, number],
};

export const stagger = {
  fast: 0.04,
  normal: 0.08,
  slow: 0.12,
  verySlow: 0.2,
};

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const slideRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

export const slideLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 60 },
};
