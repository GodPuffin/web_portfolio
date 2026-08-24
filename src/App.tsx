import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useLocation, useNavigate } from "react-router";
import { AboutPanel } from "@/components/about/AboutPanel";
import { Intro } from "@/components/about/Intro";
import { Deck } from "@/components/deck/Deck";
import { Dots } from "@/components/deck/Dots";
import { ExpandedCard } from "@/components/deck/ExpandedCard";
import { ActionBar } from "@/components/layout/ActionBar";
import { TitleBlock } from "@/components/layout/TitleBlock";
import { IconButton } from "@/components/ui/IconButton";
import { CollapseIcon, DevpostIcon, ExternalIcon, GithubIcon } from "@/components/ui/Icon";
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
 * Every view is the same three regions reconfiguring: an identity column, a
 * stage on the right, and a control row. Routes drive state rather than
 * swapping subtrees, so nothing unmounts on navigation and shared-element
 * transitions always have something to morph between. Unmounting on navigation
 * is precisely what makes most sites feel like documents rather than apps.
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

  // Leaving the about view retires the contact row it had absorbed.
  useEffect(() => {
    if (isAbout) setContactOpen(false);
  }, [isAbout]);

  const active = projects[index]!;

  return (
    <LayoutGroup>
      <main className="bg-ground fixed inset-0 overflow-hidden">
        <div className="shell px-6 py-12 sm:px-10 lg:px-0 lg:pl-[17%]">
          {/* ---- identity ---- */}
          <div className="shell-title z-20 lg:pr-10">
            <TitleBlock
              title={openProject?.title ?? profile.name}
              subtitle={openProject?.kind ?? (isAbout ? profile.role : undefined)}
              transitionKey={openSlug ?? "home"}
            />

            {/*
              Height is animated, not just opacity. The identity column is
              centred in its row, so a block that holds its full height through
              its exit and then unmounts drops the column by its whole height in
              one frame, snapping the name upward. Collapsing the height is what
              keeps the name travelling smoothly on the way out.

              The top margin lives on the inner element: margins sit outside the
              animated box and would snap on their own.
            */}
            <AnimatePresence initial={false} mode="wait">
              {openProject || isAbout ? (
                <motion.div
                  key={openProject ? openProject.slug : "about-intro"}
                  className="hidden overflow-hidden lg:block"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={spring.smooth}
                >
                  <div className="max-w-md pt-8">
                    {openProject ? (
                      <p className="lede">{openProject.description}</p>
                    ) : (
                      <Intro />
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* ---- stage: the deck, or the about panel in its place ---- */}
          <div className="shell-deck">
            {/*
              Both stages occupy the same grid cell so they can crossfade in
              place. Sequencing them instead would leave the stage empty for a
              beat in the middle of the transition.
            */}
            <AnimatePresence initial={false}>
              {isAbout ? (
                <AboutPanel key="about" />
              ) : (
                <motion.div
                  key="deck"
                  className="grid h-full w-full place-items-center [grid-area:1/1]"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={spring.smooth}
                >
                  <Deck
                    projects={projects}
                    index={index}
                    expanded={isExpanded}
                    hiddenSlug={openSlug}
                    onOpen={(slug) => navigate(`/work/${slug}`)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ---- controls ---- */}
          <div className="shell-actions z-20 mt-8 lg:mt-12 lg:pr-10">
            <AnimatePresence mode="wait" initial={false}>
              {openProject ? (
                <motion.div
                  key="project-actions"
                  className="flex items-center gap-1.5 sm:gap-2"
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
                  key="shell-actions"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={spring.snappy}
                >
                  <ActionBar
                    isAbout={isAbout}
                    contactOpen={contactOpen}
                    onToggleContact={() => setContactOpen((v) => !v)}
                    onToggleAbout={() => navigate(isAbout ? "/" : "/about")}
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

        <AnimatePresence>
          {!isExpanded && !isAbout ? (
            <Dots count={projects.length} index={index} onSelect={go} />
          ) : null}
        </AnimatePresence>

        <span className="sr-only" aria-live="polite">
          {isExpanded
            ? openProject!.title
            : isAbout
              ? "About"
              : `${active.title}, project ${index + 1} of ${projects.length}`}
        </span>
      </main>
    </LayoutGroup>
  );
}
