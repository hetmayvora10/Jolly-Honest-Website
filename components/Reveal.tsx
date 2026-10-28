"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const OFFSETS = {
  up: "translateY(16px)",
  left: "translateX(-16px)",
  right: "translateX(16px)",
  scale: "scale(0.96)",
} as const;

// Each end state must use the same transform function as its start. Framer
// can't interpolate "scale(0.96)" -> "none" and resolves it to scale(0).
const IDENTITY = {
  up: "translateY(0px)",
  left: "translateX(0px)",
  right: "translateX(0px)",
  scale: "scale(1)",
} as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  from?: keyof typeof OFFSETS;
  /** Animate on mount (above the fold) instead of when scrolled into view. */
  onMount?: boolean;
};

// Full transform strings, not Framer's x/y/scale shorthands: shorthands run on
// the main thread and drop frames while the page is still loading.
export default function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  onMount = false,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const hidden = {
    opacity: 0,
    transform: reduceMotion ? "none" : OFFSETS[from],
  };
  const shown = {
    opacity: 1,
    transform: reduceMotion ? "none" : IDENTITY[from],
  };
  const transition = { duration: 0.45, delay, ease: EASE_OUT };

  return onMount ? (
    <motion.div className={className} initial={hidden} animate={shown} transition={transition}>
      {children}
    </motion.div>
  ) : (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "-80px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
