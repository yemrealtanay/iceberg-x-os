import React, { useEffect, useRef, useState } from 'react';

type RevealProps = {
  children: React.ReactNode;
  /** animation flavour */
  variant?: 'up' | 'scale' | 'blur' | 'left' | 'right';
  /** stagger delay in ms */
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  /** re-trigger every time it enters the viewport instead of once */
  repeat?: boolean;
};

/**
 * Scroll-reveal wrapper. Elements start shifted / faded and settle into place
 * the first time they enter the viewport. Honors `prefers-reduced-motion`
 * (renders fully visible, no transition).
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  as = 'div',
  repeat = false,
}) => {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            if (!repeat) io.unobserve(e.target);
          } else if (repeat) {
            setShown(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [repeat]);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      data-reveal={variant}
      data-shown={shown ? 'true' : 'false'}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
};
