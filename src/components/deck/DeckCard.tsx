import { motion } from "motion/react";
import { spring } from "@/lib/motion";
import { coverFor } from "@/content/covers";
import type { Project } from "@/content";

type Props = {
  project: Project;
  offset: number;
  expanded: boolean;
  onOpen: () => void;
};

/**
 * Deck geometry, read off the reference: neighbours sit just over a card-height
 * away, tilted hard enough that perspective foreshortens them into the
 * trapezoidal slivers that peek past the top and bottom of the viewport.
 */
const STEP_RATIO = 1.25;
const TILT_DEG = 34;
const DEPTH_PX = 300;

export function DeckCard({ project, offset, expanded, onOpen }: Props) {
  const isActive = offset === 0;
  const cover = coverFor(project.slug);
  const onDark = cover.scheme === "dark";

  // Beyond two steps the card is fully occluded — don't pay to composite it.
  if (Math.abs(offset) > 2) return null;

  return (
    <motion.div
      className="absolute inset-0 grid place-items-center"
      style={{ zIndex: 10 - Math.abs(offset), pointerEvents: isActive ? "auto" : "none" }}
      animate={{
        y: `${offset * STEP_RATIO * 100}%`,
        rotateX: -offset * TILT_DEG,
        z: -Math.abs(offset) * DEPTH_PX,
        opacity: Math.abs(offset) > 1 ? 0.5 : 1,
      }}
      transition={spring.smooth}
    >
      <motion.button
        type="button"
        onClick={isActive ? onOpen : undefined}
        aria-label={isActive ? `Open ${project.title}` : undefined}
        aria-hidden={!isActive}
        tabIndex={isActive ? 0 : -1}
        layoutId={`card-${project.slug}`}
        className="relative block w-full h-full overflow-hidden shadow-card cursor-pointer text-left"
        style={{ borderRadius: 28 }}
        whileHover={isActive && !expanded ? { scale: 1.015 } : undefined}
        whileTap={isActive && !expanded ? { scale: 0.985 } : undefined}
        transition={spring.smooth}
      >
        {/* Receding cards read as blank ghost surfaces, as in the reference. */}
        {isActive ? (
          <>
            <div
              className="absolute inset-0"
              style={{ background: `linear-gradient(160deg, ${cover.from}, ${cover.to})` }}
            />
            <Preview project={project} />
            <motion.span
              layoutId={`card-title-${project.slug}`}
              className="absolute left-6 bottom-5 text-label font-semibold"
              style={{ color: onDark ? "#ffffff" : "#0a0a0a" }}
            >
              {project.title}
            </motion.span>
          </>
        ) : (
          <div className="absolute inset-0 bg-ghost ring-1 ring-black/[0.03]" />
        )}
      </motion.button>
    </motion.div>
  );
}

/**
 * Stand-in for a product shot: an inset panel that drifts slowly upward while
 * the card is active, echoing the reference's scroll-through previews.
 * Replaced wholesale once a real screenshot exists for the slug.
 */
function Preview({ project }: { project: Project }) {
  return (
    <div className="absolute inset-x-[12%] top-[22%] bottom-[18%] overflow-hidden rounded-lg bg-white/95 shadow-lg">
      <motion.div
        className="flex flex-col gap-2 p-4"
        animate={{ y: ["0%", "-22%"] }}
        transition={{ duration: 14, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="flex gap-1.5 pb-1">
          <span className="size-1.5 rounded-full bg-black/15" />
          <span className="size-1.5 rounded-full bg-black/15" />
          <span className="size-1.5 rounded-full bg-black/15" />
        </div>
        <p className="text-[0.6rem] leading-snug font-semibold tracking-tight text-ink">
          {project.title}
        </p>
        {project.tech.map((tech) => (
          <span key={tech} className="text-[0.5rem] leading-tight text-muted">
            {tech}
          </span>
        ))}
        <span className="mt-1 h-px w-full bg-black/10" />
        <p className="text-[0.5rem] leading-relaxed text-muted">{project.description}</p>
      </motion.div>
      <div className="absolute inset-0 rounded-lg ring-1 ring-black/5" />
    </div>
  );
}
