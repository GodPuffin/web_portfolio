import { motion } from "motion/react";
import { spring } from "@/lib/motion";

type Props<T extends string> = {
  tabs: readonly T[];
  active: T;
  onSelect: (tab: T) => void;
  /** Groups the sliding indicator; must be unique per Tabs instance on screen. */
  layoutId: string;
};

/**
 * Small mono tab row that replaces the stacked section headings.
 *
 * The active pill is a single `layoutId` element rather than one per tab, so
 * Motion slides it between positions instead of cross-fading two of them.
 */
export function Tabs<T extends string>({ tabs, active, onSelect, layoutId }: Props<T>) {
  return (
    <div role="tablist" aria-label="Sections" className="flex items-center gap-1">
      {tabs.map((tab) => {
        const selected = tab === active;
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onSelect(tab)}
            className="relative cursor-pointer rounded-full px-3.5 py-2 font-mono text-[0.75rem] uppercase tracking-[0.16em]"
          >
            {selected ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-ink"
                transition={spring.smooth}
              />
            ) : null}
            <span
              className={`relative z-10 transition-colors duration-200 ${
                selected ? "text-ground" : "text-muted hover:text-ink"
              }`}
            >
              {tab}
            </span>
          </button>
        );
      })}
    </div>
  );
}
