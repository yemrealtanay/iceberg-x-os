import React, { useEffect, useRef, useState } from 'react';

/**
 * Mounts its children only while the placeholder is near the viewport, and
 * unmounts them once it scrolls well away. Used to keep the heavier WebGL
 * centrepieces (network constellation, journey path) from all running at once.
 */
export const InViewMount: React.FC<{
  children: React.ReactNode;
  className?: string;
  /** how far outside the viewport to start mounting */
  margin?: string;
}> = ({ children, className = '', margin = '600px' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: `${margin} 0px ${margin} 0px` },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return (
    <div ref={ref} className={className}>
      {inView ? children : null}
    </div>
  );
};
