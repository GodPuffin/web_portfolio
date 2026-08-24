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
 * Deck geometry.
 *
 * Cards do not recede linearly. Each step back adds only a little more offset
 * but a lot more tilt and depth, so the far cards compress against the
 * viewport edge into a stack of nested trapezoids that fades out, rather than
 * marching evenly off-screen. `DEPTH` is what does most of the work: combined
 * with the shared perspective origin it shrinks each layer inside the one in
 * front of it.
 */
const VISIBLE_STEPS = 3;
const offsetY = (step: number) => 1.22 + (step - 1) * 0.17;
const tiltDeg = (step: number) => 34 + (step - 1) * 10;
const depthPx = (step: number) => 300 + (step - 1) * 240;
const fade = (step: number) => (step === 0 ? 1 : Math.max(0, 0.66 - (step - 1) * 0.26));

export function DeckCard({ project, offset, expanded, onOpen }: Props) {
  const isActive = offset === 0;
  const cover = coverFor(project.slug);
  const onDark = cover.scheme === "dark";

  const step = Math.abs(offset);
  // Past the last visible layer the card contributes nothing; don't composite it.
  if (step > VISIBLE_STEPS) return null;

  const direction = Math.sign(offset);

  return (
    <motion.div
      className="absolute inset-0 grid place-items-center"
      style={{ zIndex: 10 - step, pointerEvents: isActive ? "auto" : "none" }}
      animate={{
        y: `${direction * offsetY(step) * 100}%`,
        rotateX: -direction * tiltDeg(step),
        z: step === 0 ? 0 : -depthPx(step),
        opacity: fade(step),
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
