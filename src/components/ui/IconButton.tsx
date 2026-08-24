import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { spring } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type Props = {
  label: string;
  onClick?: () => void;
  href?: string;
  /** Active buttons invert to a black circle: the close/back affordance. */
  active?: boolean;
  children: React.ReactNode;
};

/** How far the button may drift toward the pointer, as a share of its half-width. */
const PULL = 0.22;
/** Critically damped: it settles onto the cursor rather than springing past it. */
const FOLLOW = { stiffness: 320, damping: 32, mass: 0.6 } as const;

/**
 * The one control in the system.
 *
 * Rests as a white squircle and morphs into a black circle when active,
 * animating border-radius and colour together so the shape change reads as one
 * gesture.
 *
 * Hover is a magnetic pull rather than a bounce: the button leans a little way
 * toward the pointer and grows slightly, with the glyph leaning further so the
 * two read as parallax rather than a single scale. Nothing overshoots.
 */
export function IconButton({ label, onClick, href, active = false, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

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
      rest: { scale: 1, color: active ? "#ffffff" : "#0a0a0a" },
      hover: { scale: 1.06, color: active ? "#ffffff" : "#0a0a0a" },
      tap: { scale: 0.97, color: active ? "#ffffff" : "#0a0a0a" },
    },
    transition: spring.snappy,
    "aria-label": label,
  } as const;

  const body = (
    <>
      <motion.span
        className="absolute inset-0"
        variants={{
          rest: {
            borderRadius: active ? 999 : 16,
            backgroundColor: active ? "#0a0a0a" : "#ffffff",
            boxShadow: "0 1px 2px rgb(0 0 0 / 0.05), 0 4px 12px rgb(0 0 0 / 0.03)",
          },
          hover: {
            borderRadius: active ? 999 : 16,
            backgroundColor: active ? "#0a0a0a" : "#ffffff",
            boxShadow: "0 1px 3px rgb(0 0 0 / 0.06), 0 6px 16px rgb(0 0 0 / 0.07)",
          },
          tap: {
            borderRadius: active ? 999 : 16,
            backgroundColor: active ? "#0a0a0a" : "#ffffff",
            boxShadow: "0 1px 2px rgb(0 0 0 / 0.06), 0 2px 6px rgb(0 0 0 / 0.05)",
          },
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
