import { motion } from "motion/react";
import { spring } from "@/lib/motion";

type Props = {
  label: string;
  onClick?: () => void;
  href?: string;
  /** Active buttons invert to a black circle — the reference's close/back affordance. */
  active?: boolean;
  children: React.ReactNode;
};

/**
 * The one control in the system. Rests as a white squircle and morphs into a
 * black circle when active, animating `border-radius` and colour together so
 * the shape change reads as a single gesture rather than two.
 */
export function IconButton({ label, onClick, href, active = false, children }: Props) {
  const shared = {
    className:
      "relative grid place-items-center size-13 sm:size-14 shrink-0 " +
      "shadow-control cursor-pointer select-none",
    initial: false,
    animate: {
      borderRadius: active ? 999 : 16,
      backgroundColor: active ? "#0a0a0a" : "#ffffff",
      color: active ? "#ffffff" : "#0a0a0a",
    },
    transition: spring.snappy,
    whileHover: { y: -2, scale: 1.03 },
    whileTap: { scale: 0.94 },
    "aria-label": label,
  } as const;

  const icon = <span className="[&>svg]:size-5">{children}</span>;

  if (href) {
    const external = href.startsWith("http") || href.startsWith("mailto:");
    return (
      <motion.a
        {...shared}
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer noopener" } : null)}
      >
        {icon}
      </motion.a>
    );
  }

  return (
    <motion.button {...shared} type="button" onClick={onClick}>
      {icon}
    </motion.button>
  );
}
