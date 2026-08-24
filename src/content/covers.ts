/**
 * Card art. The reference uses real product shots; until those exist for each
 * project, each card gets a restrained two-stop gradient keyed to the project's
 * primary discipline, plus a light/dark hint so the caption picks a legible ink.
 *
 * Drop a real screenshot at `public/projects/<slug>.png` and it takes over
 * automatically: see `DeckCard`.
 */
export type Cover = {
  from: string;
  to: string;
  /** Caption + chrome colour scheme sitting on top of the gradient. */
  scheme: "light" | "dark";
};

const covers: Record<string, Cover> = {
  txt2cad: { from: "#3b3f5c", to: "#12141f", scheme: "dark" },
  "northern-knights-2024": { from: "#7a2d2d", to: "#1a0e0e", scheme: "dark" },
  argus: { from: "#1f4f4a", to: "#0b1a19", scheme: "dark" },
  "pharmahacks-2024": { from: "#e8e4dc", to: "#c9c2b6", scheme: "light" },
  "made-by-kate": { from: "#f0dfe4", to: "#d3aab6", scheme: "light" },
  "fpv-drones": { from: "#2b2f36", to: "#0d0f12", scheme: "dark" },
  "family-plan-manager": { from: "#e6e9ec", to: "#bfc6cd", scheme: "light" },
};

const fallback: Cover = { from: "#e9e8e5", to: "#cfcdc9", scheme: "light" };

export const coverFor = (slug: string): Cover => covers[slug] ?? fallback;
