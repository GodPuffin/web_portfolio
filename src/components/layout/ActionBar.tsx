import { AnimatePresence, motion } from "motion/react";
import { IconButton } from "@/components/ui/IconButton";
import { spring } from "@/lib/motion";
import { socials } from "@/content";
import {
  BackIcon,
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
  isAbout: boolean;
  contactOpen: boolean;
  onToggleContact: () => void;
  onToggleAbout: () => void;
};

/**
 * Contextual control row.
 *
 * The leading button is one element across every state: it holds its position
 * and morphs between "about" and "back" rather than being swapped out, so the
 * row reads as reconfiguring itself instead of re-rendering. On the about view
 * the contact toggle gives way to the full social set; elsewhere that set
 * unfurls from the toggle on demand.
 */
export function ActionBar({ isAbout, contactOpen, onToggleContact, onToggleAbout }: Props) {
  const showSocials = isAbout || contactOpen;

  return (
    /*
      `relative` is load bearing. popLayout takes an exiting child out of flow
      by absolutely positioning it, which resolves against the nearest
      positioned ancestor: with none, the leaving buttons were placed hundreds
      of pixels away and flew back across the screen as they faded.
    */
    <motion.div
      layout
      transition={spring.smooth}
      className="relative flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 lg:justify-start"
    >
      <motion.div layout transition={spring.smooth}>
        <IconButton
          label={isAbout ? "Back to projects" : "About Marcus"}
          onClick={onToggleAbout}
          active={isAbout}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isAbout ? "back" : "person"}
              className="grid place-items-center"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={spring.bouncy}
            >
              {isAbout ? <BackIcon /> : <PersonIcon />}
            </motion.span>
          </AnimatePresence>
        </IconButton>
      </motion.div>

      {/* The contact toggle only exists off the about view, where it is redundant. */}
      <AnimatePresence mode="popLayout">
        {isAbout ? null : (
          <motion.div
            key="contact-toggle"
            layout
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={spring.snappy}
          >
            <IconButton
              label={contactOpen ? "Close contact links" : "Contact"}
              onClick={onToggleContact}
              active={contactOpen}
            >
              {contactOpen ? <CloseIcon /> : <ChatIcon />}
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        {showSocials
          ? socials.map((social, i) => {
              const Glyph = socialIcon[social.kind];
              return (
                <motion.div
                  key={social.kind}
                  layout
                  initial={{ opacity: 0, scale: 0.7, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.7, x: -10 }}
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
