import type { SocialLink } from "./types";

export const profile = {
  name: "Marcus Lee",
  firstName: "Marcus",
  role: "Computer Engineering Student",
  location: "Montreal, Canada",
  site: "https://www.marcus-lee.net",
  email: "fromportfolio@puffin.mozmail.com",
  /** Short line for hero / meta description. */
  tagline:
    "Computer Engineering student building across mechanical, electrical, and software, lately AI tools for everyday use.",
  /** Longer intro, ported from the previous site's welcome section. */
  intro: [
    "I'm a Computer Engineering student at the University of British Columbia, with a background in Computer Science and Math.",
    "I'm skilled at creating innovative solutions across mechanical, electrical, and software engineering, with a recent focus on developing AI tools for everyday use.",
    "When I'm not coding, you can find me skiing, sailing, or rock climbing.",
  ],
  interests: ["Skiing", "Sailing", "Rock climbing"],
} as const;

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/GodPuffin/", kind: "github" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/marcus-m-lee/", kind: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/marcus.lee._/", kind: "instagram" },
  { label: "Email", href: "mailto:fromportfolio@puffin.mozmail.com", kind: "email" },
  { label: "Resume", href: "/resume.pdf", kind: "resume" },
];
