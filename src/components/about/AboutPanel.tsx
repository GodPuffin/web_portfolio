import { useRef } from "react";
import { motion } from "motion/react";
import { Intro } from "./Intro";
import { duration, ease, spring } from "@/lib/motion";
import { useLenis } from "@/lib/useLenis";
import { education, experience } from "@/content";

type Row = { key: string; name: string; role: string; date: string; body?: string };

const roles: Row[] = experience.map((r) => ({
  key: r.company,
  name: r.company,
  role: r.role,
  date: r.date,
  body: r.description,
}));

const schools: Row[] = education.map((s) => ({
  key: s.institution,
  name: s.institution,
  role: s.degree,
  date: s.date,
}));

/**
 * The about stage.
 *
 * Deliberately narrow. The wide cards this replaces forced the identity column
 * down to a third of the viewport, which is what broke the role line across two
 * lines and wrapped the social row onto a second one; the width had to come
 * back from somewhere.
 *
 * Both groups are shown at once rather than behind a selector. There are only
 * six entries in total, so choosing between them cost a control and bought
 * nothing.
 */
export function AboutPanel() {
  const scroller = useRef<HTMLDivElement>(null);
  useLenis(scroller);

  return (
    <motion.div
      className="flex h-full min-h-0 w-full flex-col text-left [grid-area:1/1] lg:py-16"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: duration.base, ease: ease.out }}
    >
      <div className="relative min-h-0 flex-1">
        <div
          ref={scroller}
          className="flex h-full flex-col overflow-y-auto overscroll-contain"
        >
          <motion.div
            className="my-auto flex w-full max-w-[26rem] flex-col gap-12"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          >
            {/* On desktop the blurb sits in the identity column; here it leads. */}
            <Intro className="lg:hidden" />
            <Group label="Experience" rows={roles} />
            <Group label="Education" rows={schools} />
          </motion.div>
        </div>

        {/* Signals that the list continues past the fold. */}
        <div className="from-ground pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t to-transparent" />
      </div>
    </motion.div>
  );
}

function Group({ label, rows }: { label: string; rows: Row[] }) {
  return (
    <section className="flex flex-col gap-1">
      <motion.h2
        variants={rowVariants}
        className="text-muted mb-3 font-mono text-[0.7rem] tracking-[0.18em] uppercase"
      >
        {label}
      </motion.h2>
      {rows.map((row) => (
        <motion.article
          key={row.key}
          variants={rowVariants}
          className="border-hairline flex flex-col gap-0.5 border-t py-4 first:border-t-0 first:pt-0"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-label text-ink font-semibold">{row.name}</h3>
            <p className="text-muted shrink-0 font-mono text-[0.7rem]">{row.date}</p>
          </div>
          <p className="text-label text-ink/65">{row.role}</p>
          {row.body ? (
            <p className="text-muted mt-1 text-[0.8rem] leading-relaxed">{row.body}</p>
          ) : null}
        </motion.article>
      ))}
    </section>
  );
}

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: spring.smooth },
};
