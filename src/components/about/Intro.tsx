import { motion } from "motion/react";
import { reveal, stagger } from "@/lib/motion";
import { accentInk, type Accent } from "@/content/palette";

/** Emphasis takes the accent the previous site gave that phrase. */
function Em({ accent, children }: { accent: Accent; children: React.ReactNode }) {
  return <em style={{ color: accentInk(accent) }}>{children}</em>;
}

/**
 * The about blurb.
 *
 * Written as markup rather than pulled from `content/` because the emphasis is
 * typographic: `.lede` mutes the paragraph and lifts whatever sits in an <em>,
 * which a plain string could not express. Each phrase keeps the accent it
 * carried on the previous site, in the variant measured to read on the ground.
 */
export function Intro({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`flex flex-col gap-5 ${className}`}
      variants={stagger(0.07, 0.12)}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.p variants={reveal} className="lede text-[1.05rem] leading-relaxed">
        <Em accent="grape">Computer Engineering student</Em> at the{" "}
        <Em accent="blue">University of British Columbia</Em>, with a background in{" "}
        <Em accent="green">Computer Science</Em> and <Em accent="orange">Math</Em>.
      </motion.p>
      <motion.p variants={reveal} className="lede text-[1.05rem] leading-relaxed">
        I build across <Em accent="red">mechanical</Em>,{" "}
        <Em accent="violet">electrical</Em>, and <Em accent="cyan">software</Em>{" "}
        engineering, lately with a focus on <Em accent="pink">AI tools</Em> for
        everyday use.
      </motion.p>
      <motion.p variants={reveal} className="lede text-[1.05rem] leading-relaxed">
        When I'm not coding, you'll find me <Em accent="teal">skiing</Em>,{" "}
        <Em accent="indigo">sailing</Em>, or <Em accent="brown">rock climbing</Em>.
      </motion.p>
    </motion.div>
  );
}
