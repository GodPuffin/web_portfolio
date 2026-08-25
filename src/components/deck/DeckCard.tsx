import { useRef } from "react";
import { motion } from "motion/react";
import { useSmoothCorners } from "@lisse/react";
import { spring } from "@/lib/motion";
import { coverFor } from "@/content/covers";
import type { Project } from "@/content";

type Props = {
  project: Project;
  offset: number;
  /** The step at which offsets wrap around; that layer is held invisible. */
  edgeStep: number;
  expanded: boolean;
  onOpen: () => void;
};

/**
 * Deck geometry.
 *
 * The deck behaves like a hand of cards rather than a wheel. Cards waiting
 * their turn lie face up in a staggered stack below; the active card has risen
 * to the middle and rotated a quarter turn to face the viewer; spent cards lie
 * face down in a matching stack above. Advancing therefore reads as one card
 * lifting off the lower stack, turning over as it comes up, and settling onto
 * the upper one, and the whole motion runs in reverse going back.
 *
 * A card at exactly 90 degrees is edge on, so the stacks are only visible
 * because they sit away from the vanishing point: perspective projects a flat
 * card offset from centre as a foreshortened band. Its depth is what makes the
 * stacks readable, so the vertical offsets below are load bearing, not spacing.
 */
const VISIBLE_STEPS = 3;
/**
 * Exactly 90 degrees leaves a card edge on, where CSS cannot tell front from
 * back and browsers pick arbitrarily. Waiting cards stop just short of the
 * quarter turn so their faces stay up; spent cards carry just past it so they
 * present their reverse. The swap happens mid-animation, which is the flip.
 */
const faceUp = (step: number) => 86 - (step - 1) * 2;
const faceDown = (step: number) => -(94 + (step - 1) * 2);
const stackY = (step: number) => 0.95 + (step - 1) * 0.09;
const stackZ = (step: number) => (step - 1) * 60;

/**
 * Opacity by distance from the middle.
 *
 * The wrap-around layer is held fully transparent on purpose. The deck is a
 * ring, so on every advance one card has to travel from the end of the upper
 * stack to the end of the lower one; at zero opacity that journey happens out
 * of sight, instead of a card visibly sailing down the screen and joining the
 * bottom of the stack. `edgeStep` comes from the project count rather than
 * being hardcoded, so adding a project cannot quietly expose the trip again.
 */
const FADE = [1, 1, 0.5];
const fade = (step: number, edgeStep: number) =>
  step >= edgeStep ? 0 : (FADE[step] ?? 0);

/** Corner shape shared by both faces of a card. */
const CORNERS = { radius: 28, smoothing: 0.6 } as const;

export function DeckCard({ project, offset, edgeStep, expanded, onOpen }: Props) {
  const isActive = offset === 0;
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  // The hook applies clip-path to the element itself. The <SmoothCorners>
  // component would wrap each face in a div for its SVG effects, and that
  // wrapper does not carry `absolute inset-0`, so the faces collapse and the
  // deck disappears. Inside a preserve-3d context the hook is the only safe
  // form of this.
  useSmoothCorners(frontRef, CORNERS);
  useSmoothCorners(backRef, CORNERS);
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
        y: `${direction * stackY(step) * 100}%`,
        // Below the middle a card lies face up, above it face down.
        rotateX: step === 0 ? 0 : direction > 0 ? faceUp(step) : faceDown(step),
        z: -stackZ(step),
        opacity: fade(step, edgeStep),
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
        className="relative block h-full w-full cursor-pointer text-left"
        // `overflow: hidden` would collapse this to a flat plane and kill the
        // back face, so rounding and clipping live on each face instead.
        style={{ transformStyle: "preserve-3d" }}
        whileHover={isActive && !expanded ? { scale: 1.015 } : undefined}
        whileTap={isActive && !expanded ? { scale: 0.985 } : undefined}
        transition={spring.smooth}
      >
        {/*
          clip-path clips an element's box-shadow along with everything else,
          so the shadow rides a plain rounded sibling behind both faces. At this
          blur the rounded-rect silhouette is indistinguishable from the
          squircle it sits under.
        */}
        <div className="shadow-card absolute inset-0 rounded-[28px]" aria-hidden="true" />

        <div
          ref={frontRef}
          className="bg-ghost absolute inset-0 overflow-hidden ring-1 ring-black/[0.03]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/*
            Waiting and spent cards read as blank grey stock. Colour and detail
            arrive together as a card turns to face the viewer, so the stacks
            stay quiet and the middle card is the only thing with any weight.
          */}
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.3 }}
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
        </div>

        {/* The reverse of the card, seen only on the spent stack above. */}
        <div
          ref={backRef}
          className="bg-ghost absolute inset-0 overflow-hidden ring-1 ring-black/[0.03]"
          style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
        />
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
