import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import { coverFor } from "@/content/covers";
import { accentFor, accentLit, accentTint } from "@/content/palette";
import type { Project } from "@/content";

type Props = {
  project: Project;
  onClose: () => void;
};

/**
 * The opened state of a deck card.
 *
 * Shares `layoutId` with its collapsed counterpart in `DeckCard`, so Motion
 * interpolates position, size and radius between the two: the card is never
 * unmounted and remounted, which is what sells it as one continuous object.
 *
 * Deliberately holds no prose: the title, category and description all live in
 * the shell's left column, so the card stays purely visual rather than
 * restating them.
 */
export function ExpandedCard({ project, onClose }: Props) {
  const cover = coverFor(project);
  const onDark = cover.scheme === "dark";
  const ink = onDark ? "#ffffff" : "#0a0a0a";

  return (
    <motion.div
      layoutId={`card-${project.slug}`}
      className="relative h-full w-full overflow-hidden shadow-card"
      style={{ borderRadius: 32 }}
      transition={spring.smooth}
    >
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${cover.from}, ${cover.to})` }}
      />

      <motion.div
        className="absolute inset-0 grid place-items-center px-10 text-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ ...spring.smooth, delay: 0.1 }}
      >
        <div className="flex flex-col items-center gap-7">
          <p
            className="text-[clamp(1.75rem,3.4vw,3.25rem)] font-semibold leading-[1.05] tracking-tight"
            style={{ color: ink }}
          >
            {project.title}
          </p>
          <ul className="flex max-w-md flex-wrap justify-center gap-2">
            {project.tech.map((tech) => {
              const accent = accentFor(tech);
              return (
                <li
                  key={tech}
                  className="rounded-full px-3 py-1.5 font-mono text-[0.72rem] backdrop-blur-sm"
                  style={{
                    /*
                      The previous site's badge, with one change forced by the
                      setting: the wash is neutral rather than the accent. The
                      cover is itself derived from the leading technology, so an
                      accent-tinted chip of that same technology disappeared into
                      its own background. Holding the wash neutral keeps every
                      chip legible whatever hue the card is.
                    */
                    color: accentLit(accent),
                    backgroundColor: "rgb(0 0 0 / 0.3)",
                    boxShadow: `inset 0 0 0 1px ${accentTint(accent, 38)}`,
                  }}
                >
                  {tech}
                </li>
              );
            })}
          </ul>
        </div>
      </motion.div>

      <motion.span
        layoutId={`card-title-${project.slug}`}
        className="absolute bottom-6 left-8 text-label font-semibold"
        style={{ color: ink }}
      >
        {project.title}
      </motion.span>

      {/* Tapping the card's own surface closes it, mirroring tap-to-open. */}
      <button
        type="button"
        onClick={onClose}
        aria-label={`Close ${project.title}`}
        className="absolute inset-0 cursor-default"
        tabIndex={-1}
      />
    </motion.div>
  );
}
