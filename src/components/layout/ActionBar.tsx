import { AnimatePresence, motion } from "motion/react";
import { IconButton } from "@/components/ui/IconButton";
import { spring } from "@/lib/motion";
import { socials } from "@/content";
import {
  ChatIcon,
  CloseIcon,
  DownloadIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  PersonIcon,
} from "@/components/ui/Icon";

const socialIcon = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  email: MailIcon,
  resume: DownloadIcon,
} as const;

type Props = {
  contactOpen: boolean;
  onToggleContact: () => void;
  onAbout: () => void;
};

/**
 * Contextual control row. The contact button morphs in place into a black
 * close circle and the social buttons unfurl to its right; `layout` on every
 * child is what makes the existing buttons slide aside rather than jump.
 */
export function ActionBar({ contactOpen, onToggleContact, onAbout }: Props) {
  return (
    <motion.div layout transition={spring.smooth} className="flex items-center gap-3">
      <motion.div layout transition={spring.smooth}>
        <IconButton label="About Marcus" onClick={onAbout}>
          <PersonIcon />
        </IconButton>
      </motion.div>

      <motion.div layout transition={spring.smooth}>
        <IconButton
          label={contactOpen ? "Close contact links" : "Contact"}
          onClick={onToggleContact}
          active={contactOpen}
        >
          {contactOpen ? <CloseIcon /> : <ChatIcon />}
        </IconButton>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {contactOpen
          ? socials.map((social, i) => {
              const Glyph = socialIcon[social.kind];
              return (
                <motion.div
                  key={social.kind}
                  layout
                  initial={{ opacity: 0, scale: 0.6, x: -12 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.6, x: -12 }}
                  transition={{ ...spring.bouncy, delay: i * 0.035 }}
                >
                  <IconButton label={social.label} href={social.href}>
                    <Glyph />
                  </IconButton>
                </motion.div>
              );
            })
          : null}
      </AnimatePresence>
    </motion.div>
  );
}
