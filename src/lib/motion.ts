import type { Transition, Variants } from "motion/react";

/**
 * Single source of truth for motion. Everything animated in the app pulls its
 * timing from here, so the whole site can be retuned by editing this file
 * rather than hunting transitions through components.
 *
 * Native-app feel comes from springs, not duration tweens: springs preserve
 * velocity when an animation is interrupted mid-flight, which is what makes a
 * gesture feel like it's being *followed* rather than replayed.
 */

/** Custom easing curves. `standard` is the workhorse for non-spring tweens. */
export const ease = {
  /** Decelerate: entering elements, most reveals. */
  out: [0.16, 1, 0.3, 1],
  /** Accelerate: exiting elements leaving the viewport. */
  in: [0.7, 0, 0.84, 0],
  /** Symmetric: colour/opacity crossfades where no direction is implied. */
  standard: [0.65, 0, 0.35, 1],
} as const;

export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
  /** Route-level changes read as slower than in-page ones. */
  page: 0.9,
} as const;

export const spring = {
  /** Default UI spring: snappy, barely overshoots. */
  snappy: { type: "spring", stiffness: 400, damping: 40, mass: 1 },
  /** Shared-element / layout moves: heavier, more deliberate. */
  smooth: { type: "spring", stiffness: 220, damping: 32, mass: 1 },
  /** Playful: hover affordances and small toggles. */
  bouncy: { type: "spring", stiffness: 500, damping: 24, mass: 0.8 },
} satisfies Record<string, Transition>;

/** Standard fade-and-rise, used for most scroll reveals. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: ease.out },
  },
};

/** Parent wrapper that cascades `reveal` across its children. */
export const stagger = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/**
 * Per-route enter/exit. Kept deliberately restrained: the reference language
 * is "seamless", which means the transition should be felt more than seen.
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: duration.fast, ease: ease.in },
  },
};
