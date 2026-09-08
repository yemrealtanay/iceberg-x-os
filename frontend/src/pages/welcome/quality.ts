import { useEffect, useState } from 'react';

export type Quality = {
  /** phone-sized viewport */
  mobile: boolean;
  /** device pixel ratio ceiling for the WebGL canvases */
  dpr: [number, number];
  /** particle / shard budget multiplier */
  density: number;
  /** post-processing bloom is expensive on mobile GPUs */
  bloom: boolean;
};

function measure(): Quality {
  if (typeof window === 'undefined') {
    return { mobile: false, dpr: [1, 1.75], density: 1, bloom: true };
  }
  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency ?? 8;
  const mobile = w < 768;
  const weak = mobile || cores <= 4;
  return {
    mobile,
    dpr: weak ? [1, 1.35] : [1, 1.75],
    density: mobile ? 0.4 : weak ? 0.7 : 1,
    bloom: !weak,
  };
}

/**
 * One place that decides how heavy the 3D layer is allowed to be. Phones get
 * fewer particles, a lower pixel ratio and no bloom pass so the scroll stays at
 * 60fps; desktops get the full show.
 */
export function useQuality(): Quality {
  const [q, setQ] = useState<Quality>(measure);
  useEffect(() => {
    let t = 0;
    const onResize = () => {
      clearTimeout(t);
      t = window.setTimeout(() => setQ(measure()), 200);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', onResize);
    };
  }, []);
  return q;
}
