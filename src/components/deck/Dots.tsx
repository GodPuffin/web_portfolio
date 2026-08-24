import { motion } from "motion/react";
import { spring } from "@/lib/motion";

type Props = {
  count: number;
  index: number;
  onSelect: (index: number) => void;
};

/** Pagination rail pinned to the right edge, vertically centred. */
export function Dots({ count, index, onSelect }: Props) {
  return (
    <motion.nav
      aria-label="Projects"
      className="fixed top-1/2 right-3 z-30 flex -translate-y-1/2 flex-col items-center sm:right-7"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={spring.snappy}
    >
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Go to project ${i + 1}`}
          aria-current={i === index}
          className="grid h-4 w-6 place-items-center cursor-pointer"
        >
          <motion.span
            className="block rounded-full bg-ink"
            animate={{
              scale: i === index ? 1 : 0.55,
              opacity: i === index ? 1 : 0.28,
            }}
            transition={spring.snappy}
            style={{ width: 6, height: 6 }}
          />
        </button>
      ))}
    </motion.nav>
  );
}
