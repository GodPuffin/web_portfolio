import type { Experience } from "./types";

/** Most recent first. Earlier roles at the same company are not listed. */
export const experience: Experience[] = [
  {
    company: "Fundica",
    role: "Intern Software Developer",
    date: "April 2025 - June 2025",
    description:
      "Full stack work on Fundica's core service & development of testing & AI crawling tools.",
    skills: ["PHP", "SQL", "JavaScript", "Python", "Machine Learning", "Web Scraping"],
    logo: "/Fundica-Logo.svg",
    darkLogo: "/Fundica-Logo-Dark.svg",
  },
  {
    company: "Lac Marois Country Club",
    role: "Camp Director",
    date: "Summer 2025",
    description:
      "Responsible for planning and running all camp activities, ensuring safety of campers, and providing a fun and engaging experience.",
    skills: ["Leadership", "Teaching", "Project Management"],
    logo: "/LMCC-Logo.png",
    darkLogo: "/LMCC-Logo-Dark.png",
  },
  {
    company: "296 - The Northern Knights",
    role: "Mentor",
    date: "2022 - Present",
    description:
      "Serving as technical mentor to help FIRST robotics team with everything from software design to on-field coaching.",
    skills: ["Java", "Robotics", "Teaching", "Computer Vision", "CAD", "Electronics"],
    logo: "/296-Logo.png",
    darkLogo: "/296-Logo-Dark.png",
  },
];
