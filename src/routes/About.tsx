import { useRef } from "react";
import { motion } from "motion/react";
import { IconButton } from "@/components/ui/IconButton";
import {
  ChevronLeftIcon,
  DownloadIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
} from "@/components/ui/Icon";
import { duration, ease, reveal, stagger } from "@/lib/motion";
import { useLenis } from "@/lib/useLenis";
import { education, experience, profile, socials } from "@/content";

const socialIcon = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  email: MailIcon,
  resume: DownloadIcon,
} as const;

/**
 * The about view. Slides up over the deck rather than replacing it, so closing
 * returns to exactly the card the visitor left — the deck never lost its place.
 */
export function About({ onClose }: { onClose: () => void }) {
  const scroller = useRef<HTMLElement>(null);
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
      <div className="mx-auto w-full max-w-3xl px-6 sm:px-10 py-16 sm:py-24">
        <h1 className="text-title font-semibold text-ink">
          {profile.name}
          <span className="block text-muted font-semibold">{profile.role}</span>
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <IconButton label="Back" onClick={onClose} active>
            <ChevronLeftIcon />
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
          variants={stagger(0.08)}
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
            <em>software</em> engineering — lately with a focus on <em>AI tools</em>{" "}
            for everyday use.
          </motion.p>
          <motion.p variants={reveal} className="lede">
            When I'm not coding, you'll find me <em>skiing</em>, <em>sailing</em>, or{" "}
            <em>rock climbing</em>.
          </motion.p>
        </motion.div>

        <Section title="Experience">
          {experience.map((role) => (
            <article key={role.company} className="flex flex-col gap-4">
              <h3 className="text-label font-semibold text-ink">{role.company}</h3>
              {role.positions.map((position) => (
                <div key={`${position.title}-${position.date}`} className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <p className="text-label text-ink">{position.title}</p>
                    <p className="font-mono text-[0.8rem] text-muted">{position.date}</p>
                  </div>
                  <p className="text-label text-muted max-w-prose">
                    {position.description}
                  </p>
                </div>
              ))}
            </article>
          ))}
        </Section>

        <Section title="Education">
          {education.map((school) => (
            <article
              key={school.institution}
              className="flex flex-wrap items-baseline justify-between gap-x-4"
            >
              <div>
                <h3 className="text-label font-semibold text-ink">
                  {school.institution}
                </h3>
                <p className="text-label text-muted">{school.degree}</p>
              </div>
              <p className="font-mono text-[0.8rem] text-muted">{school.date}</p>
            </article>
          ))}
        </Section>
      </div>
    </motion.section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      className="mt-20 flex flex-col gap-8"
      variants={stagger(0.06)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.h2
        variants={reveal}
        className="font-mono text-[0.75rem] uppercase tracking-[0.16em] text-muted"
      >
        {title}
      </motion.h2>
      <motion.div variants={reveal} className="flex flex-col gap-10">
        {children}
      </motion.div>
    </motion.section>
  );
}
