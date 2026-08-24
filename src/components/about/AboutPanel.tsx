import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Tabs } from "@/components/ui/Tabs";
import { Intro } from "./Intro";
import { duration, ease, spring } from "@/lib/motion";
import { useLenis } from "@/lib/useLenis";
import { education, experience } from "@/content";

const SECTIONS = ["Experience", "Education"] as const;
type Section = (typeof SECTIONS)[number];

type Entry = {
  key: string;
  logo: string;
  heading: string;
  sub: string;
  date: string;
  body?: string;
};

const toEntries = (section: Section): Entry[] =>
  section === "Experience"
    ? experience.map((role) => ({
        key: role.company,
        logo: role.logo,
        heading: role.company,
        sub: role.role,
        date: role.date,
        body: role.description,
      }))
    : education.map((school) => ({
        key: school.institution,
        logo: school.logo,
        heading: school.institution,
        sub: school.degree,
        date: school.date,
      }));

/**
 * Takes the deck's place on the about view.
 *
 * Entries scroll inside the panel rather than the page, so the shell around
 * them stays fixed and the view keeps behaving like a screen rather than a
 * document. Sized by its content up to the available height, so a short list
 * sits centred in the stage instead of hugging the top of it.
 */
export function AboutPanel() {
  const [section, setSection] = useState<Section>("Experience");
  const scroller = useRef<HTMLDivElement>(null);
  const entries = toEntries(section);
  useLenis(scroller);

  return (
    <motion.div
      className="flex h-full min-h-0 w-full flex-col gap-5 text-left [grid-area:1/1] lg:py-16"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: duration.base, ease: ease.out }}
    >
      <div className="flex shrink-0 justify-center lg:justify-start">
        <Tabs tabs={SECTIONS} active={section} onSelect={setSection} layoutId="about-section" />
      </div>

      <div className="relative min-h-0 flex-1">
        <div
          ref={scroller}
          className="flex h-full flex-col overflow-y-auto overscroll-contain pr-1"
        >
          {/* On desktop the blurb lives in the identity column; here it leads the panel. */}
          <Intro className="mb-8 lg:hidden" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.ol
              key={section}
              role="tabpanel"
              /*
               * Auto block margins centre a short list but collapse to zero
               * once it overflows, so nothing is ever clipped out of reach the
               * way `justify-content: center` would clip it.
               */
              className="my-auto flex flex-col gap-3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.07 } },
                exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
              }}
            >
              {entries.map((entry) => (
                <EntryCard key={entry.key} entry={entry} />
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>

        {/* Signals that the list continues past the fold. */}
        <div className="from-ground pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t to-transparent" />
      </div>
    </motion.div>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 22, rotateX: -12 },
        visible: { opacity: 1, y: 0, rotateX: 0, transition: spring.smooth },
        exit: { opacity: 0, y: -14, transition: { duration: 0.16 } },
      }}
      whileHover={{ y: -3 }}
      transition={spring.snappy}
      className="bg-surface shadow-control flex gap-4 rounded-[1.25rem] p-5"
    >
      {/*
        Wordmarks and square badges both land here, so the tile is a landscape
        box and the logo is contained rather than filled.
      */}
      <span className="bg-ground grid h-12 w-16 shrink-0 place-items-center overflow-hidden rounded-xl p-2">
        <img
          src={entry.logo}
          alt=""
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </span>

      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h3 className="text-label text-ink font-semibold">{entry.heading}</h3>
          <p className="text-muted font-mono text-[0.72rem]">{entry.date}</p>
        </div>
        <p className="text-label text-ink/70">{entry.sub}</p>
        {entry.body ? (
          <p className="text-muted mt-1 text-[0.85rem] leading-relaxed">{entry.body}</p>
        ) : null}
      </div>
    </motion.li>
  );
}
