import { useEffect } from 'react';

/*
 * Scroll-driven 3D assembly.
 *
 * Every element tagged `data-fly` is treated as a panel flying in from deep
 * space. Its transform is bound *continuously* to the scroll position rather
 * than fired once by an IntersectionObserver, so the page literally builds
 * itself as you descend: cards rise off the 3D floor, swing in from the left
 * and right and lock into place exactly when they reach the settle line.
 *
 * Everything runs in a single rAF loop with reads batched before writes, and
 * only elements near the viewport are touched.
 */

export type FlyVariant =
  | 'left'
  | 'right'
  | 'deep'
  | 'floor'
  | 'up'
  | 'spin-left'
  | 'spin-right'
  | 'drop'
  /** no movement at all — only exposes --fly-p so CSS can draw itself in */
  | 'trace';

type Entry = {
  el: HTMLElement;
  variant: FlyVariant;
  /** 0..0.6 — fraction of the travel window this element waits before moving */
  delay: number;
  /** travel-distance multiplier */
  power: number;
  /** cached so we can skip redundant style writes */
  last: number;
  settled: boolean;
};

/** expo-out — fast arrival, long soft landing */
const ease = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/** Per-variant start pose. Values are at progress 0; everything lerps to rest. */
function pose(variant: FlyVariant, span: number, power: number) {
  const s = span * power;
  switch (variant) {
    case 'left':
      return { x: -s, y: s * 0.14, z: -680 * power, rx: 4, ry: 36, rz: -5, sc: 0.82 };
    case 'right':
      return { x: s, y: s * 0.14, z: -680 * power, rx: 4, ry: -36, rz: 5, sc: 0.82 };
    case 'spin-left':
      return { x: -s * 1.15, y: 0, z: -900 * power, rx: 0, ry: 52, rz: -16, sc: 0.7 };
    case 'spin-right':
      return { x: s * 1.15, y: 0, z: -900 * power, rx: 0, ry: -52, rz: 16, sc: 0.7 };
    case 'deep':
      return { x: 0, y: 0, z: -1250 * power, rx: 16, ry: 0, rz: 0, sc: 0.66 };
    case 'drop':
      return { x: 0, y: -180 * power, z: -520 * power, rx: 34, ry: 0, rz: 0, sc: 0.86 };
    case 'up':
      return { x: 0, y: 120 * power, z: -420 * power, rx: -26, ry: 0, rz: 0, sc: 0.9 };
    case 'trace':
      return { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, sc: 1 };
    case 'floor':
    default:
      // rising off the 3D ground plane, laid almost flat at the start
      return { x: 0, y: 260 * power, z: -560 * power, rx: -68, ry: 0, rz: 0, sc: 0.88 };
  }
}

export function useScrollAssembly(enabled: boolean, deps: unknown[] = []) {
  useEffect(() => {
    if (!enabled) {
      document
        .querySelectorAll<HTMLElement>('[data-fly]')
        .forEach((el) => {
          el.style.transform = '';
          el.style.opacity = '';
          el.style.setProperty('--fly-p', '1');
        });
      return;
    }

    const bail = () =>
      document
        .querySelectorAll('[data-assembly="on"]')
        .forEach((el) => el.setAttribute('data-assembly', 'off'));

    const entries = new Map<HTMLElement, Entry>();
    const active = new Set<Entry>();
    const started = performance.now();

    const register = (el: HTMLElement) => {
      if (entries.has(el)) return;
      const entry: Entry = {
        el,
        variant: (el.dataset.fly || 'floor') as FlyVariant,
        delay: Math.min(0.6, parseFloat(el.dataset.flyDelay || '0') || 0),
        power: parseFloat(el.dataset.flyPower || '1') || 1,
        last: -1,
        settled: false,
      };
      entries.set(el, entry);
      el.style.willChange = 'transform, opacity';
      el.style.setProperty('--fly-p', '0');
      el.style.opacity = '0';
      io.observe(el);
    };

    // Only elements anywhere near the viewport get per-frame work.
    const io = new IntersectionObserver(
      (obs) => {
        for (const o of obs) {
          const entry = entries.get(o.target as HTMLElement);
          if (!entry) continue;
          if (o.isIntersecting) active.add(entry);
          else active.delete(entry);
        }
      },
      { rootMargin: '120% 0px 120% 0px' },
    );

    const scan = () => {
      try {
        document.querySelectorAll<HTMLElement>('[data-fly]').forEach(register);
      } catch {
        bail();
      }
    };
    scan();

    // Testimonials and other async content arrive later.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!active.size) return;
      try {
        tick();
      } catch {
        cancelAnimationFrame(raf);
        bail();
      }
    };

    const tick = () => {

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      // Phones get a gentler flight path: shorter travel, softer rotation and a
      // shallower z push, so the assembly reads well on a small screen and
      // never costs a frame.
      const narrow = vw < 768;
      const span = narrow ? vw * 0.42 : Math.min(vw * 0.6, 700);
      const damp = narrow ? 0.5 : 1;
      // Travel window: an element starts moving as its top crosses the fold and
      // is fully seated by the time it reaches ~58% of the viewport.
      const from = vh * 1.04;
      const to = vh * 0.58;
      // On first paint, above-the-fold content plays a short boot-in instead of
      // sitting there already assembled.
      const intro = clamp01((performance.now() - started - 120) / 900);

      const list = Array.from(active);
      const progress: number[] = new Array(list.length);

      // --- read pass ---
      for (let i = 0; i < list.length; i++) {
        const r = list[i].el.getBoundingClientRect();
        const raw = clamp01((from - r.top) / Math.max(1, from - to));
        const d = list[i].delay;
        progress[i] = Math.min(clamp01((raw - d) / (1 - d)), intro);
      }

      // --- write pass ---
      for (let i = 0; i < list.length; i++) {
        const e = list[i];
        const p = progress[i];
        if (Math.abs(p - e.last) < 0.0015) continue;
        e.last = p;
        const t = ease(p);
        const el = e.el;
        el.style.setProperty('--fly-p', t.toFixed(3));

        if (t >= 0.999) {
          // Fully seated: drop the transform so text renders pin-sharp.
          if (!e.settled) {
            e.settled = true;
            el.style.transform = '';
            // Kept explicit rather than cleared: the pre-JS rule
            // `[data-assembly="on"] [data-fly] { opacity: 0 }` would otherwise
            // take the element straight back out of view.
            el.style.opacity = '1';
            el.style.willChange = 'auto';
          }
          continue;
        }
        e.settled = false;
        el.style.willChange = 'transform, opacity';

        if (e.variant === 'trace') {
          // Transform is left alone so the element's own CSS can key off --fly-p.
          el.style.opacity = String(clamp01(t * 1.6));
          continue;
        }

        const q = pose(e.variant, span, e.power);
        const inv = 1 - t;
        const zi = inv * damp;
        const ri = inv * damp;
        el.style.opacity = String(clamp01(t * 1.6));
        // The perspective is baked into the element's own transform: relying on
        // an ancestor `perspective` only works for its *direct* children, and
        // every card here is nested a few levels deep inside its grid.
        el.style.transform =
          `perspective(${narrow ? 900 : 1400}px) translate3d(${(q.x * inv).toFixed(1)}px, ${(q.y * inv).toFixed(1)}px, ${(q.z * zi).toFixed(1)}px) ` +
          `rotateX(${(q.rx * ri).toFixed(2)}deg) rotateY(${(q.ry * ri).toFixed(2)}deg) rotateZ(${(q.rz * ri).toFixed(2)}deg) ` +
          `scale(${(q.sc + (1 - q.sc) * t).toFixed(4)})`;
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      entries.forEach((e) => {
        e.el.style.transform = '';
        e.el.style.opacity = '1';
        e.el.style.willChange = '';
        e.el.style.removeProperty('--fly-p');
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);
}
