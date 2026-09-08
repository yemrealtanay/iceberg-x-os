import React, { useEffect, useRef } from 'react';
import { scrollState } from './scroll';

/**
 * A targeting reticle that trails the pointer: an outer ring that lags behind a
 * small hard dot, plus crosshair ticks. Pointer devices only — it is hidden on
 * touch, where there is no cursor to decorate.
 */
export const CursorReticle: React.FC = () => {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        ring.current?.style.setProperty('opacity', '1');
        dot.current?.style.setProperty('opacity', '1');
      }
      // Grow the ring over anything clickable.
      const hot = (e.target as HTMLElement)?.closest?.('a, button, input, textarea, [role="button"]');
      ring.current?.setAttribute('data-hot', hot ? 'true' : 'false');
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 20}px, ${ry - 20}px, 0)`;
      if (dot.current) dot.current.style.transform = `translate3d(${x - 2.5}px, ${y - 2.5}px, 0)`;
    };
    raf = requestAnimationFrame(frame);

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <>
      <div ref={ring} className="os-reticle" aria-hidden="true" />
      <div ref={dot} className="os-reticle-dot" aria-hidden="true" />
    </>
  );
};

/**
 * Horizontal light streaks that bloom across the viewport the faster you
 * scroll, so hammering the wheel feels like punching into hyperspace.
 */
export const WarpOverlay: React.FC = () => {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let shown = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const target = Math.min(1, Math.max(0, (scrollState.speed - 9) / 34));
      shown += (target - shown) * 0.1;
      const node = el.current;
      if (!node) return;
      node.style.opacity = shown.toFixed(3);
      node.style.transform = `scaleY(${(1 + shown * 0.5).toFixed(3)})`;
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <div ref={el} className="os-warp" aria-hidden="true" />;
};
