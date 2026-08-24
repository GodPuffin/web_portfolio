import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { Deck } from "@/components/deck/Deck";
import { Dots } from "@/components/deck/Dots";
import { ExpandedCard } from "@/components/deck/ExpandedCard";
import { ActionBar } from "@/components/layout/ActionBar";
import { TitleBlock } from "@/components/layout/TitleBlock";
import { IconButton } from "@/components/ui/IconButton";
import {
  CollapseIcon,
  DevpostIcon,
  ExternalIcon,
  GithubIcon,
} from "@/components/ui/Icon";
import { About } from "@/routes/About";
import { useDeck } from "@/lib/useDeck";
import { spring } from "@/lib/motion";
import { profile, projects, projectBySlug } from "@/content";
import type { LinkKind } from "@/content";

const linkIcon: Record<LinkKind, typeof GithubIcon> = {
  github: GithubIcon,
  devpost: DevpostIcon,
  website: ExternalIcon,
};

const linkLabel: Record<LinkKind, string> = {
  github: "View source on GitHub",
  devpost: "View on Devpost",
  website: "Visit the site",
};

/**
 * One persistent shell for the whole site.
 *
 * Routes drive *state*, not subtree swaps: the deck stays mounted across every
 * view so shared-element transitions have something to morph from. Unmounting
 * on navigation is precisely what makes most sites feel like documents rather
 * than apps.
 */
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const openSlug = location.pathname.startsWith("/work/")
    ? location.pathname.slice("/work/".length)
    : null;
  const openProject = openSlug ? projectBySlug(openSlug) : undefined;
  const isAbout = location.pathname === "/about";
  const isExpanded = Boolean(openProject);

  const [contactOpen, setContactOpen] = useState(false);
  const { index, go } = useDeck({
    count: projects.length,
    locked: isExpanded || isAbout,
  });

  const close = useCallback(() => navigate("/"), [navigate]);

  // Escape backs out of whatever is open, innermost first.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (contactOpen) setContactOpen(false);
      else if (isExpanded || isAbout) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, contactOpen, isAbout, isExpanded]);

  const active = projects[index]!;

  return (
    <LayoutGroup>
      <main className="fixed inset-0 overflow-hidden bg-ground">
        {/*
          About covers the shell completely, so the shell must leave the
          accessibility tree with it: otherwise its heading and controls stay
          focusable behind the panel and the page exposes two <h1>s at once.
        */}
        <div
          className="shell px-6 py-12 sm:px-10 lg:px-0 lg:pl-[17%]"
          inert={isAbout}
        >
          {/* ---- identity ---- */}
          <div className="shell-title z-20 lg:pr-10">
            <TitleBlock
              title={openProject?.title ?? profile.name}
              subtitle={openProject?.kind}
              transitionKey={openSlug ?? "home"}
            />
            <AnimatePresence initial={false}>
              {openProject ? (
                <motion.p
                  key={openProject.slug}
                  className="lede mt-8 hidden max-w-md lg:block"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={spring.snappy}
                >
                  {openProject.description}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          {/* ---- deck ---- */}
          <div className="shell-deck">
            <Deck
              projects={projects}
              index={index}
              expanded={isExpanded}
              hiddenSlug={openSlug}
              onOpen={(slug) => navigate(`/work/${slug}`)}
            />
          </div>

          {/* ---- controls ---- */}
          <div className="shell-actions z-20 mt-8 lg:mt-12 lg:pr-10">
            <AnimatePresence mode="wait" initial={false}>
              {openProject ? (
                <motion.div
                  key="project-actions"
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={spring.snappy}
                >
                  <IconButton label="Back to projects" onClick={close} active>
                    <CollapseIcon />
                  </IconButton>
                  {openProject.links.map((link) => {
                    const Glyph = linkIcon[link.kind];
                    return (
                      <IconButton
                        key={link.href}
                        label={`${openProject.title}: ${linkLabel[link.kind]}`}
                        href={link.href}
                      >
                        <Glyph />
                      </IconButton>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="home-actions"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={spring.snappy}
                >
                  <ActionBar
                    contactOpen={contactOpen}
                    onToggleContact={() => setContactOpen((v) => !v)}
                    onAbout={() => navigate("/about")}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ---- expanded card overlay ---- */}
        <AnimatePresence>
          {openProject ? (
            <div
              key="expanded"
              className="pointer-events-none fixed inset-0 z-40 grid place-items-center px-4 lg:grid-cols-[1fr_minmax(0,52%)] lg:place-items-stretch lg:px-0"
            >
              <div className="hidden lg:block" />
              <div className="pointer-events-auto h-[68vh] w-full lg:my-4 lg:mr-4 lg:h-auto">
                <ExpandedCard project={openProject} onClose={close} />
              </div>
            </div>
          ) : null}
        </AnimatePresence>

        {/* ---- about panel ---- */}
        <AnimatePresence>{isAbout ? <About onClose={close} /> : null}</AnimatePresence>

        {!isExpanded && !isAbout ? (
          <Dots count={projects.length} index={index} onSelect={go} />
        ) : null}

        <span className="sr-only" aria-live="polite">
          {isExpanded
            ? openProject!.title
            : `${active.title}, project ${index + 1} of ${projects.length}`}
        </span>
      </main>
    </LayoutGroup>
  );
}
