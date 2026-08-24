import { useCallback, useEffect, useRef, useState } from "react";

type Options = {
  count: number;
  /** Input is ignored while a card is expanded — the deck is "behind" it. */
  locked?: boolean;
};

/**
 * Discrete pagination state for the card deck.
 *
 * Wheel deltas are accumulated against a threshold rather than mapped
 * continuously to position: the deck snaps card-to-card, so a single trackpad
 * flick should advance exactly one card no matter how much momentum it carries.
 * `cooldown` swallows the long tail of that momentum.
 */
export function useDeck({ count, locked = false }: Options) {
  const [index, setIndex] = useState(0);
  const accum = useRef(0);
  const cooling = useRef(false);

  // The deck wraps, so there is always a card above and below the active one.
  const go = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  const step = useCallback(
    (direction: 1 | -1) => {
      if (cooling.current) return;
      cooling.current = true;
      accum.current = 0;
      go(index + direction);
      window.setTimeout(() => {
        cooling.current = false;
      }, 420);
    },
    [go, index],
  );

  useEffect(() => {
    if (locked) return;

    const THRESHOLD = 40;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (cooling.current) return;

      accum.current += event.deltaY;
      if (Math.abs(accum.current) < THRESHOLD) return;
      step(accum.current > 0 ? 1 : -1);
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        step(-1);
      }
    };

    let touchStart = 0;
    const onTouchStart = (event: TouchEvent) => {
      touchStart = event.touches[0]!.clientY;
    };
    const onTouchMove = (event: TouchEvent) => {
      const delta = touchStart - event.touches[0]!.clientY;
      if (Math.abs(delta) < 50) return;
      step(delta > 0 ? 1 : -1);
      touchStart = event.touches[0]!.clientY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [locked, step]);

  return { index, go, next, prev };
}
