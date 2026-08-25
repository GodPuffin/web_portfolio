import { accentFor, type Accent } from "./palette";
import type { Project } from "./types";

/**
 * Card art.
 *
 * The cover is derived from the project's leading technology rather than
 * assigned by hand, so the deck carries the same accent vocabulary as the
 * badges and every project is coloured by what it is actually built from.
 *
 * Both stops are mixed against ink so the darker end always wins where the
 * caption sits; that keeps white legible on a yellow cover as readily as on a
 * blue one, which a raw two-stop ramp of the accent would not.
 */
export type Cover = {
  from: string;
  to: string;
  /** Which ink the caption and any chrome should use. */
  scheme: "light" | "dark";
};

const ramp = (accent: Accent): Cover => ({
  from: `color-mix(in oklab, var(--color-${accent}) 72%, #12131a)`,
  to: `color-mix(in oklab, var(--color-${accent}) 26%, #0b0c10)`,
  scheme: "dark",
});

export const coverFor = (project: Project): Cover => ramp(accentFor(project.tech[0] ?? ""));
