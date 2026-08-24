/** One company, showing only the most recent role held there. */
export type Experience = {
  company: string;
  role: string;
  date: string;
  description: string;
  skills: string[];
  logo: string;
  darkLogo: string;
};

export type Education = {
  institution: string;
  degree: string;
  date: string;
  logo: string;
  darkLogo: string;
};

export type LinkKind = "github" | "devpost" | "website";

export type ProjectLink = {
  kind: LinkKind;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  /** Short category shown as the subtitle in the expanded view. */
  kind: string;
  description: string;
  tech: string[];
  links: ProjectLink[];
};

export type SocialLink = {
  label: string;
  href: string;
  kind: "github" | "linkedin" | "instagram" | "email" | "resume";
};
