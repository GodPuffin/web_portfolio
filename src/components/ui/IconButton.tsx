import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { generateClipPath } from "@lisse/core";
import { accentInk, accentTint, type Accent } from "@/content/palette";
import { spring } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  label: string;
  onClick?: () => void;
  href?: string;
  /** Active buttons invert to a black circle: the close/back affordance. */
  active?: boolean;
  /** Tints the glyph and its wash. Falls back to ink when unset. */
  accent?: Accent;
  children: React.ReactNode;
};

/** How far the button may drift toward the pointer, as a share of its half-width. */
const PULL = 0.22;
/** Critically damped: it settles onto the cursor rather than springing past it. */
const FOLLOW = { stiffness: 320, damping: 32, mass: 0.6 } as const;
const SMOOTHING = 0.6;
const RESTING_RADIUS = 16;

/**
 * The one control in the system.
 *
 * Rests as a smooth-cornered squircle and morphs into a circle when active.
 *
 * The shape is a `clip-path` rather than a `border-radius`, so it cannot simply
 * be handed to Motion to interpolate. Instead the *radius* is the animated
 * value and the path is regenerated from it on every frame: driving a motion
 * value through `useTransform` keeps that off React's render path entirely.
 *
 * Hover is a magnetic pull rather than a bounce: the button leans a little way
 * toward the pointer and grows slightly, with the glyph leaning further so the
 * two read as parallax. Nothing overshoots.
 */
export function IconButton({ label, onClick, href, active = false, accent, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [size, setSize] = useState({ width: 0, height: 0 });

  // The button's size is set by breakpoint, so it has to be measured rather
  // than assumed; the path is regenerated whenever it changes.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry!.contentRect;
      setSize({ width: box.width, height: box.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /*
   * The morph runs on two numbers, not one. A superellipse at maximum radius is
   * still squarer than a circle, so smoothing has to fall to zero as the radius
   * rises; at radius = half the box with no smoothing the path is a true circle.
   *
   * Both springs track a motion value rather than a plain prop: a spring given
   * a bare number takes it as an initial value and will not chase later ones,
   * which left the path frozen at its resting shape.
   */
  const rawRadius = useMotionValue(RESTING_RADIUS);
  const rawSmoothing = useMotionValue(SMOOTHING);
  const radius = useSpring(rawRadius, spring.snappy);
  const smoothing = useSpring(rawSmoothing, spring.snappy);

  useEffect(() => {
    const full = Math.min(size.width, size.height) / 2;
    rawRadius.set(active && full > 0 ? full : RESTING_RADIUS);
    rawSmoothing.set(active ? 0 : SMOOTHING);
  }, [active, size.width, size.height, rawRadius, rawSmoothing]);

  const clipPath = useTransform([radius, smoothing], ([r, sm]: number[]) =>
    size.width && size.height
      ? generateClipPath(size.width, size.height, { radius: r!, smoothing: sm! })
      : "none",
  );

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, FOLLOW);
  const y = useSpring(rawY, FOLLOW);
  // The glyph travels further than its container, which reads as depth.
  const glyphX = useTransform(x, (v) => v * 0.45);
  const glyphY = useTransform(y, (v) => v * 0.45);

  const track = (event: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    rawX.set((event.clientX - (box.left + box.width / 2)) * PULL);
    rawY.set((event.clientY - (box.top + box.height / 2)) * PULL);
  };

  const release = () => {
    rawX.set(0);
    rawY.set(0);
  };

  // An inverted button always carries white; otherwise the accent, if any.
  const restInk = active ? "#ffffff" : accent ? accentInk(accent) : "#0a0a0a";
  const wash = accent ? accentTint(accent, 12) : "#ffffff";

  const shared = {
    ref: ref as never,
    className:
      "relative grid size-12 shrink-0 cursor-pointer place-items-center select-none sm:size-14",
    style: { x, y },
    initial: "rest",
    animate: "rest",
    whileHover: "hover",
    whileTap: "tap",
    onMouseMove: track,
    onMouseLeave: release,
    variants: {
      rest: { scale: 1, color: restInk },
      hover: { scale: 1.06, color: restInk },
      tap: { scale: 0.97, color: restInk },
    },
    transition: spring.snappy,
    "aria-label": label,
  } as const;

  const body = (
    <>
      {/*
        clip-path clips an element's box-shadow, so the shadow rides its own
        unclipped layer underneath. Its rounded-rect silhouette sits a hair
        inside the squircle at the corners, which no shadow this soft reveals.
        Keeping the clip off the button itself also leaves the focus ring,
        which is likewise an outline, intact.
      */}
      <motion.span
        className="absolute inset-0"
        variants={{
          rest: {
            borderRadius: active ? 999 : RESTING_RADIUS,
            boxShadow: "0 1px 2px rgb(0 0 0 / 0.05), 0 4px 12px rgb(0 0 0 / 0.03)",
          },
          hover: {
            borderRadius: active ? 999 : RESTING_RADIUS,
            boxShadow: "0 1px 3px rgb(0 0 0 / 0.06), 0 6px 16px rgb(0 0 0 / 0.07)",
          },
          tap: {
            borderRadius: active ? 999 : RESTING_RADIUS,
            boxShadow: "0 1px 2px rgb(0 0 0 / 0.06), 0 2px 6px rgb(0 0 0 / 0.05)",
          },
        }}
        transition={spring.snappy}
      />
      <motion.span
        className="absolute inset-0"
        style={{ clipPath }}
        variants={{
          rest: { backgroundColor: active ? "#0a0a0a" : "#ffffff" },
          // Hover washes the surface in the accent, the way the old navbar did.
          hover: { backgroundColor: active ? "#0a0a0a" : wash },
          tap: { backgroundColor: active ? "#0a0a0a" : wash },
        }}
        transition={spring.snappy}
      />
      <motion.span
        className="relative [&>svg]:size-[1.35rem]"
        style={{ x: glyphX, y: glyphY }}
      >
        {children}
      </motion.span>
    </>
  );

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    return (
      <motion.a
        {...shared}
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : null)}
      >
        {body}
      </motion.a>
    );
  }

  return (
    <motion.button {...shared} type="button" onClick={onClick}>
      {body}
    </motion.button>
  );
}
