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
 * Each card is hinged at the edge facing the active one: cards above pivot on
 * their bottom edge, cards below on their top. Rotating about that hinge reads
 * as a fold rather than a slide, which is the whole effect. The hinge can flip
 * sides only while a card passes through offset 0, where rotation is zero and
 * the transform origin has no visible consequence, so the swap never jumps.
 *
 * Steps back add only a little more offset but a lot more tilt and depth, so
 * far layers compress against the viewport edge into nested trapezoids.
 */
const VISIBLE_STEPS = 3;
const offsetY = (step: number) => 1.3 + (step - 1) * 0.16;
const tiltDeg = (step: number) => 52 + (step - 1) * 9;
const depthPx = (step: number) => 210 + (step - 1) * 200;
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
      style={{
        zIndex: 10 - step,
        pointerEvents: isActive ? "auto" : "none",
        transformOrigin: offset > 0 ? "50% 0%" : "50% 100%",
      }}
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
        className="relative block h-full w-full cursor-pointer overflow-hidden bg-ghost text-left shadow-card"
        style={{ borderRadius: 28 }}
        whileHover={isActive && !expanded ? { scale: 1.015 } : undefined}
        whileTap={isActive && !expanded ? { scale: 0.985 } : undefined}
        transition={spring.smooth}
      >
        {/*
          Content stays mounted for every visible card and crossfades on
          opacity, so a card's artwork resolves as it turns to face the viewer
          instead of popping in once it lands.
        */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ ...spring.smooth, opacity: { duration: 0.28 } }}
        >
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${cover.from}, ${cover.to})` }}
          />
          <Preview project={project} />
          <motion.span
            layoutId={`card-title-${project.slug}`}
            className="text-label absolute bottom-5 left-6 font-semibold"
            style={{ color: onDark ? "#ffffff" : "#0a0a0a" }}
          >
            {project.title}
          </motion.span>
        </motion.div>
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
        animate={{ y: ["0%", "-11%"] }}
        transition={{ duration: 14, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <div className="flex gap-1.5 pb-1">
          <span className="size-1.5 rounded-full bg-black/15" />
          <span className="size-1.5 rounded-full bg-black/15" />
          <span className="size-1.5 rounded-full bg-black/15" />
        </div>
        <p className="text-ink text-[0.6rem] leading-snug font-semibold tracking-tight">
          {project.title}
        </p>
        {project.tech.map((tech) => (
          <span key={tech} className="text-muted text-[0.5rem] leading-tight">
            {tech}
          </span>
        ))}
        <span className="mt-1 h-px w-full bg-black/10" />
        <p className="text-muted text-[0.5rem] leading-relaxed">{project.description}</p>
      </motion.div>
      <div className="absolute inset-0 rounded-lg ring-1 ring-black/5" />
    </div>
  );
}
