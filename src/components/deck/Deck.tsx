import { DeckCard } from "./DeckCard";
import type { Project } from "@/content";

type Props = {
  projects: Project[];
  index: number;
  expanded: boolean;
  /** The card currently owning the shared `layoutId` in the expanded overlay. */
  hiddenSlug: string | null;
  onOpen: (slug: string) => void;
};

/**
 * The 3D card deck.
 *
 * `perspective` lives on the outer box and `preserve-3d` on the inner one, so
 * sibling cards share a single vanishing point: that's what turns the tilted
 * neighbours into trapezoids rather than flatly-scaled rectangles.
 */
/**
 * Shortest signed distance around the ring, so the card one step "before" the
 * first is the last one rather than something six positions away.
 */
function wrappedOffset(raw: number, count: number) {
  const half = count / 2;
  if (raw > half) return raw - count;
  if (raw < -half) return raw + count;
  return raw;
}

export function Deck({ projects, index, expanded, hiddenSlug, onOpen }: Props) {
  return (
    <div
      className="relative w-full grid place-items-center"
      style={{ perspective: 1200, perspectiveOrigin: "50% 50%" }}
    >
      <div
        className="relative w-[72vw] max-w-[300px] lg:w-[23vw] lg:max-w-[400px] aspect-[41/42]"
        style={{ transformStyle: "preserve-3d" }}
      >
        {projects.map((project, i) =>
          // Only one element may hold a given layoutId at a time, so the card
          // being expanded yields ownership to the overlay.
          project.slug === hiddenSlug ? null : (
            <DeckCard
              key={project.slug}
              project={project}
              offset={wrappedOffset(i - index, projects.length)}
              expanded={expanded}
              onOpen={() => onOpen(project.slug)}
            />
          ),
        )}
      </div>
    </div>
  );
}
