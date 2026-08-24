import { AnimatePresence, motion } from "motion/react";
import { duration, ease } from "@/lib/motion";

type Props = {
  title: string;
  subtitle: string;
  /** Changing the key crossfades the pair as a unit. */
  transitionKey: string;
};

/**
 * The two-line identity block: ink title over muted subtitle. It never
 * unmounts — only its contents swap — which is what keeps the shell feeling
 * like one continuous surface as the deck moves under it.
 */
export function TitleBlock({ title, subtitle, transitionKey }: Props) {
  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        <motion.h1
          key={transitionKey}
          className="text-title font-semibold text-ink"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: duration.base, ease: ease.out }}
        >
          {title}
          <span className="block text-muted font-semibold">{subtitle}</span>
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
