import { AnimatePresence, motion } from "motion/react";
import { duration, ease, spring } from "@/lib/motion";

type Props = {
  title: string;
  /** Omitted on the home view: only About and open projects carry a second line. */
  subtitle?: string;
  /** Changing the key crossfades the title as a unit. */
  transitionKey: string;
  /** Delay the subtitle's entrance, e.g. behind a panel transition. */
  subtitleDelay?: number;
};

/**
 * The two-line identity block: ink title over muted subtitle.
 *
 * The subtitle animates its own height as well as its opacity, so gaining or
 * losing the second line reflows the block smoothly instead of snapping the
 * layout under it.
 *
 * The heading also animates its own position. The identity column is centred
 * in its row, so anything that grows it, the role line and the about blurb
 * both, shifts the name upward; without this the name arrives at its new
 * position in a single jump. `layout="position"` animates the move but not the
 * box, so the type glides instead of being scaled through the transition.
 */
export function TitleBlock({ title, subtitle, transitionKey, subtitleDelay = 0 }: Props) {
  return (
    <motion.h1
      layout="position"
      transition={spring.smooth}
      className="text-title font-semibold text-ink"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={transitionKey}
          className="block"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: duration.base, ease: ease.out }}
        >
          {title}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence initial={true}>
        {subtitle ? (
          <motion.span
            key={subtitle}
            className="block overflow-hidden text-muted"
            initial={{ opacity: 0, height: 0, y: -6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -6 }}
            transition={{ ...spring.smooth, delay: subtitleDelay }}
          >
            {subtitle}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.h1>
  );
}
