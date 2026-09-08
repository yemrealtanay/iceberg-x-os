import React, { useRef } from 'react';

type TiltCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** max tilt in degrees */
  max?: number;
  /** also expose --mouse-x / --mouse-y for a spotlight ::before */
  spotlight?: boolean;
  children: React.ReactNode;
};

/**
 * Pointer-reactive 3D tilt. Pure CSS transforms (no WebGL) so it is cheap to
 * use on whole grids. Disables itself under `prefers-reduced-motion` and on
 * touch (no hover).
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  max = 8,
  spotlight = true,
  children,
  className = '',
  style,
  ...rest
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  const reduced =
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(hover: hover)').matches);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = -((y - rect.height / 2) / (rect.height / 2)) * max;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * max;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      if (spotlight) {
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
      }
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt-card ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
};
