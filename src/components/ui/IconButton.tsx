import { motion } from "motion/react";
import { spring } from "@/lib/motion";

type Props = {
  label: string;
  onClick?: () => void;
  href?: string;
  /** Active buttons invert to a black circle: the close/back affordance. */
  active?: boolean;
  children: React.ReactNode;
};

const shadow = {
  rest: "0 1px 2px rgb(0 0 0 / 0.05), 0 4px 12px rgb(0 0 0 / 0.03)",
  hover: "0 2px 4px rgb(0 0 0 / 0.06), 0 10px 24px rgb(0 0 0 / 0.10)",
  tap: "0 1px 2px rgb(0 0 0 / 0.06), 0 2px 6px rgb(0 0 0 / 0.05)",
} as const;

/**
 * The one control in the system.
 *
 * Rests as a white squircle and morphs into a black circle when active,
 * animating border-radius and colour together so the shape change reads as one
 * gesture. Hover and press are layered rather than uniform: the button lifts,
 * its shadow deepens as though it left the page, and the glyph scales slightly
 * further than its container so the icon leads the motion.
 *
 * The states are variants on the button so they cascade to the surface and the
 * glyph. An object `animate` on those children would opt them out of the
 * cascade, so the morph values live inside each variant instead.
 */
export function IconButton({ label, onClick, href, active = false, children }: Props) {
  const surface = {
    borderRadius: active ? 999 : 16,
    backgroundColor: active ? "#0a0a0a" : "#ffffff",
  };
  const ink = { color: active ? "#ffffff" : "#0a0a0a" };

  const shared = {
    className:
      "relative grid size-12 shrink-0 cursor-pointer place-items-center select-none sm:size-14",
    initial: "rest",
    animate: "rest",
    whileHover: "hover",
    whileTap: "tap",
    variants: {
      rest: { y: 0, scale: 1, ...ink },
      hover: { y: -3, scale: 1.04, ...ink },
      tap: { y: -1, scale: 0.93, ...ink },
    },
    transition: spring.snappy,
    "aria-label": label,
  } as const;

  const body = (
    <>
      <motion.span
        className="absolute inset-0"
        variants={{
          rest: { ...surface, boxShadow: shadow.rest },
          hover: { ...surface, boxShadow: shadow.hover },
          tap: { ...surface, boxShadow: shadow.tap },
        }}
        transition={spring.snappy}
      />
      <motion.span
        className="relative [&>svg]:size-[1.35rem]"
        variants={{
          rest: { scale: 1, rotate: 0 },
          hover: { scale: 1.12, rotate: active ? 90 : 0 },
          tap: { scale: 0.88, rotate: 0 },
        }}
        transition={spring.bouncy}
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
