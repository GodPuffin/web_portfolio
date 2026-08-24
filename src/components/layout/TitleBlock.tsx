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
 * The name's position is carried by reflow rather than a layout animation:
 * every block that grows or shrinks the identity column animates its own
 * height, so the centred column moves a little each frame and the name rides
 * it. A layout animation on top of that would animate toward a target that is
 * itself still moving.
 */
export function TitleBlock({ title, subtitle, transitionKey, subtitleDelay = 0 }: Props) {
  return (
    <motion.h1 className="text-title font-semibold text-ink">
      {/* popLayout, not wait: the incoming line takes its place immediately
          instead of the heading collapsing while the old one leaves. */}
      <AnimatePresence mode="popLayout" initial={false}>
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
