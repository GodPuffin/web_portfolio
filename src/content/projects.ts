import type { Project } from "./types";

/**
 * Slugs are part of the URL contract (/work/:slug) and feed the shared-element
 * transition between the index card and the detail view — keep them stable.
 */
export const projects: Project[] = [
  {
    slug: "txt2cad",
    title: "Txt2Cad",
    kind: "AI CAD Tool",
    description:
      "Create 3D models through a conversation with an AI capable of progressively refining your design.",
    tech: ["Python", "TypeScript", "AI", "CAD"],
    links: [{ kind: "devpost", href: "https://devpost.com/software/txt2cad" }],
  },
  {
    slug: "northern-knights-2024",
    title: "Northern Knights 2024",
    kind: "Competition Robot",
    description:
      "296's 2024 robot, Bilbo. Featuring a Swerve Drivetrain, Vision Processing, and effective autonomous navigation.",
    tech: ["Java", "Robotics", "CAD", "Computer Vision"],
    links: [{ kind: "github", href: "https://github.com/FRC296/FRC-2024" }],
  },
  {
    slug: "argus",
    title: "Argus",
    kind: "AI Surveillance",
    description:
      "AI-powered surveillance system for monitoring live feeds from various sources autonomously.",
    tech: ["TypeScript", "AI", "Computer Vision", "Web Development"],
    links: [
      { kind: "github", href: "https://github.com/GodPuffin/Argus" },
      { kind: "devpost", href: "https://devpost.com/software/argus-w6i0pv" },
    ],
  },
  {
    slug: "pharmahacks-2024",
    title: "Pharmahacks 2024",
    kind: "Neural Decoding",
    description:
      "Developed a neural decoding model to predict mouse positions from brain activity data, using advanced data processing techniques.",
    tech: ["Jupyter", "Machine Learning", "Data Science"],
    links: [{ kind: "github", href: "https://github.com/GodPuffin/Pharmahacks2024" }],
  },
  {
    slug: "made-by-kate",
    title: "Made by Kate",
    kind: "Ecommerce Site",
    description:
      "Built a complete ecommerce website for a friend's hobby business using Next.js and Stripe.",
    tech: ["TypeScript", "SQL", "Web Development"],
    links: [
      { kind: "website", href: "https://madebykate.ca" },
      { kind: "github", href: "https://github.com/GodPuffin/made-by-kate" },
    ],
  },
  {
    slug: "fpv-drones",
    title: "FPV Drones",
    kind: "Hardware Build",
    description:
      "Built and flew custom FPV drones as a hobby. Designed, 3D printed, assembled, and CNC cut custom parts for the drones.",
    tech: ["Robotics", "3D Printing", "Electronics", "Firmware"],
    links: [],
  },
  {
    slug: "family-plan-manager",
    title: "Family Plan Manager",
    kind: "Web App",
    description:
      "A basic web application for managing shared family plans and subscriptions with friends.",
    tech: ["Go", "HTMX", "SQLite"],
    links: [
      { kind: "github", href: "https://github.com/GodPuffin/FamilyPlan" },
      { kind: "website", href: "https://familyplanmanager.xyz" },
    ],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
