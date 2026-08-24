import type { Experience } from "./types";

export const experience: Experience[] = [
  {
    company: "Fundica",
    logo: "/Fundica-Logo.svg",
    darkLogo: "/Fundica-Logo-Dark.svg",
    positions: [
      {
        title: "Intern Software Developer",
        date: "April 2025 - June 2025",
        description:
          "Full stack work on Fundica's core service & development of testing & AI crawling tools.",
        skills: ["PHP", "SQL", "JavaScript", "Python", "Machine Learning", "Web Scraping"],
      },
      {
        title: "Intern Software Developer",
        date: "June 2024 - August 2024",
        description:
          "Full stack work on Fundica's core service & development of an internal AI data entry tool.",
        skills: ["PHP", "SQL", "JavaScript", "TypeScript", "AI"],
      },
    ],
  },
  {
    company: "Lac Marois Country Club",
    logo: "/LMCC-Logo.png",
    darkLogo: "/LMCC-Logo-Dark.png",
    positions: [
      {
        title: "Camp Director",
        date: "Summer 2025",
        description:
          "Responsible for planning and running all camp activities, ensuring safety of campers, and providing a fun and engaging experience.",
        skills: ["Leadership", "Teaching", "Project Management"],
      },
      {
        title: "Head of Sailing",
        date: "Summer 2023",
        description:
          "Responsible for planning and running sailing events, training new sailors, and maintaining boats.",
        skills: ["Leadership", "Teaching"],
      },
      {
        title: "Camp Instructor",
        date: "Summer 2022, 2021",
        description: "Teaching sailing, swimming, canoeing, and more to kids.",
        skills: ["Teaching"],
      },
    ],
  },
  {
    company: "296 - The Northern Knights",
    logo: "/296-Logo.png",
    darkLogo: "/296-Logo-Dark.png",
    positions: [
      {
        title: "Mentor",
        date: "2022 - Present",
        description:
          "Serving as technical mentor to help FIRST robotics team with everything from software design to on-field coaching.",
        skills: ["Java", "Robotics", "Teaching", "Computer Vision", "CAD", "Electronics"],
      },
    ],
  },
];
