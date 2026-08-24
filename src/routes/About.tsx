import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconButton } from "@/components/ui/IconButton";
import { TitleBlock } from "@/components/layout/TitleBlock";
import { Tabs } from "@/components/ui/Tabs";
import {
  BackIcon,
  DownloadIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
} from "@/components/ui/Icon";
import { duration, ease, reveal, spring, stagger } from "@/lib/motion";
import { useLenis } from "@/lib/useLenis";
import { education, experience, profile, socials } from "@/content";

const socialIcon = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  email: MailIcon,
  resume: DownloadIcon,
} as const;

const SECTIONS = ["Experience", "Education"] as const;
type Section = (typeof SECTIONS)[number];

/**
 * The about view. Slides up over the deck rather than replacing it, so closing
 * returns to exactly the card the visitor left: the deck never lost its place.
 */
export function About({ onClose }: { onClose: () => void }) {
  const scroller = useRef<HTMLElement>(null);
  const [section, setSection] = useState<Section>("Experience");
  useLenis(scroller);

  return (
    <motion.section
      ref={scroller}
      className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-ground"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: duration.base, ease: ease.out }}
      aria-label="About"
    >
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-10 sm:py-24">
        {/* The role line lands just after the panel settles, not with it. */}
        <TitleBlock
          title={profile.name}
          subtitle={profile.role}
          transitionKey="about"
          subtitleDelay={0.18}
        />

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <IconButton label="Back" onClick={onClose} active>
            <BackIcon />
          </IconButton>
          {socials.map((social) => {
            const Glyph = socialIcon[social.kind];
            return (
              <IconButton key={social.kind} label={social.label} href={social.href}>
                <Glyph />
              </IconButton>
            );
          })}
        </div>

        <motion.div
          className="mt-20 flex flex-col gap-8"
          variants={stagger(0.08, 0.1)}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={reveal} className="lede">
            <em>Computer Engineering student</em> at the{" "}
            <em>University of British Columbia</em>, with a background in Computer
            Science and Math.
          </motion.p>
          <motion.p variants={reveal} className="lede">
            I build across <em>mechanical</em>, <em>electrical</em>, and{" "}
            <em>software</em> engineering, lately with a focus on <em>AI tools</em> for
            everyday use.
          </motion.p>
          <motion.p variants={reveal} className="lede">
            When I'm not coding, you'll find me <em>skiing</em>, <em>sailing</em>, or{" "}
            <em>rock climbing</em>.
          </motion.p>
        </motion.div>

        <div className="mt-20">
          <Tabs
            tabs={SECTIONS}
            active={section}
            onSelect={setSection}
            layoutId="about-section"
          />

          {/*
            `mode="wait"` would leave the panel empty mid-swap and collapse the
            page height; overlapping the two keeps the scroll position stable.
          */}
          <div className="relative mt-10">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={section}
                role="tabpanel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring.snappy}
                className="flex flex-col gap-10"
              >
                {section === "Experience"
                  ? experience.map((role) => (
                      <Entry
                        key={role.company}
                        heading={role.company}
                        sub={role.role}
                        date={role.date}
                        body={role.description}
                      />
                    ))
                  : education.map((school) => (
                      <Entry
                        key={school.institution}
                        heading={school.institution}
                        sub={school.degree}
                        date={school.date}
                      />
                    ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function Entry({
  heading,
  sub,
  date,
  body,
}: {
  heading: string;
  sub: string;
  date: string;
  body?: string;
}) {
  return (
    <article className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h3 className="text-label font-semibold text-ink">{heading}</h3>
        <p className="font-mono text-[0.8rem] text-muted">{date}</p>
      </div>
      <p className="text-label text-ink/70">{sub}</p>
      {body ? <p className="text-label max-w-prose text-muted">{body}</p> : null}
    </article>
  );
}
