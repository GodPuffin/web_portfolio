import { useEffect, type RefObject } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Smooth scrolling for one scroll container.
 *
 * Scoped to an element rather than the document because the deck owns wheel
 * input on the home view: a document-level Lenis would fight it. Only the
 * about panel actually scrolls, so only the about panel gets this.
 */
export const useLenis = (ref: RefObject<HTMLElement | null>) => {
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrapper = ref.current;
    // Hijacking scroll is exactly what `prefers-reduced-motion` asks us not to do.
    if (!wrapper || reduced) return;

    const lenis = new Lenis({
      wrapper,
      content: wrapper.firstElementChild as HTMLElement,
      duration: 1.05,
      // Exponential falloff: quick to respond, long tail: trackpad momentum
      // rather than a slow uniform lerp.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Touch devices already have native momentum; overriding it feels worse.
      syncTouch: false,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced, ref]);
};
