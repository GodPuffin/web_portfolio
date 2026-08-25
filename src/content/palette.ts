/**
 * Accent assignment, ported from the previous site's `badge_color`.
 *
 * Every accent ships as a pair: the base tone for fills and marks, and an
 * `-ink` variant dark enough to read as type on the ground. Reach for the
 * variant through these helpers rather than naming the custom property inline,
 * so a missing accent falls back to slate instead of an invalid `var()`.
 */
export type Accent =
  | "blue" | "cyan" | "grape" | "green" | "indigo" | "lime"
  | "orange" | "pink" | "red" | "teal" | "violet" | "yellow"
  | "brown" | "slate";

const BY_TECH: Record<string, Accent> = {
  python: "blue",
  jupyter: "blue",
  typescript: "cyan",
  javascript: "cyan",
  java: "green",
  leadership: "grape",
  ai: "grape",
  "machine learning": "grape",
  robotics: "red",
  engineering: "red",
  cad: "indigo",
  "3d printing": "indigo",
  php: "indigo",
  "computer vision": "teal",
  "data science": "teal",
  "data analysis": "teal",
  "web scraping": "pink",
  "web development": "pink",
  htmx: "pink",
  electronics: "yellow",
  firmware: "yellow",
  sql: "orange",
  postgres: "orange",
  sqlite: "orange",
  "project management": "orange",
  go: "violet",
  teaching: "lime",
};

export const accentFor = (tech: string): Accent =>
  BY_TECH[tech.toLowerCase()] ?? "slate";

/** Base tone: fills, marks, anything that is not type. */
export const accentVar = (accent: Accent) => `var(--color-${accent})`;

/** Contrast-checked variant for type on the ground. */
export const accentInk = (accent: Accent) => `var(--color-${accent}-ink)`;
