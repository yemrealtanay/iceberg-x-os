import { useEffect } from 'react';

/**
 * A single shared, mutable scroll snapshot.
 *
 * The 3D scenes read this every animation frame via `useFrame`. Keeping it in a
 * plain object (instead of React state) means scrolling never triggers a React
 * re-render — the WebGL loop just samples the latest numbers.
 */
export const scrollState = {
  /** window.scrollY in px */
  y: 0,
  /** 0..1 progress over the whole document */
  progress: 0,
  /** viewport height in px */
  vh: typeof window !== 'undefined' ? window.innerHeight : 800,
  /** pointer position, -1..1 on each axis, smoothed by the scenes themselves */
  px: 0,
  py: 0,
  /** smoothed absolute scroll speed in px/frame — drives the warp/streak boost */
  speed: 0,
  /** signed scroll direction, -1 up .. 1 down */
  dir: 0,
};

/**
 * Wire up global scroll / resize / pointer listeners for the lifetime of the
 * Welcome page. Safe to call from more than one place.
 */
export function useGlobalScroll() {
  useEffect(() => {
    let lastY = window.scrollY;
    const update = () => {
      const dy = window.scrollY - lastY;
      lastY = window.scrollY;
      scrollState.speed = lerp(scrollState.speed, Math.min(60, Math.abs(dy)), 0.35);
      if (dy !== 0) scrollState.dir = dy > 0 ? 1 : -1;
      scrollState.y = window.scrollY;
      scrollState.vh = window.innerHeight;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollState.progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    const onPointer = (e: PointerEvent) => {
      scrollState.px = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.py = (e.clientY / window.innerHeight) * 2 - 1;
    };

    update();
    // Bleed the speed back to zero when scrolling stops (no scroll events fire).
    const decay = window.setInterval(() => {
      scrollState.speed = lerp(scrollState.speed, 0, 0.25);
    }, 60);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('pointermove', onPointer, { passive: true });

    return () => {
      clearInterval(decay);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('pointermove', onPointer);
    };
  }, []);
}

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Remap `v` from [inMin,inMax] to [outMin,outMax], clamped. */
export function mapRange(
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) {
  const t = Math.min(1, Math.max(0, (v - inMin) / (inMax - inMin)));
  return outMin + (outMax - outMin) * t;
}

/** Smoothstep easing on a 0..1 value. */
export const smooth = (t: number) => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};
