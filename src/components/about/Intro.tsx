import { motion } from "motion/react";
import { reveal, stagger } from "@/lib/motion";

/**
 * The about blurb.
 *
 * Written as markup rather than pulled from `content/` because the emphasis is
 * typographic: `.lede` mutes the paragraph and inks whatever sits in an <em>,
 * which a plain string could not express.
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
        <em>Computer Engineering student</em> at the{" "}
        <em>University of British Columbia</em>, with a background in Computer Science
        and Math.
      </motion.p>
      <motion.p variants={reveal} className="lede text-[1.05rem] leading-relaxed">
        I build across <em>mechanical</em>, <em>electrical</em>, and <em>software</em>{" "}
        engineering, lately with a focus on <em>AI tools</em> for everyday use.
      </motion.p>
      <motion.p variants={reveal} className="lede text-[1.05rem] leading-relaxed">
        When I'm not coding, you'll find me <em>skiing</em>, <em>sailing</em>, or{" "}
        <em>rock climbing</em>.
      </motion.p>
    </motion.div>
  );
}
