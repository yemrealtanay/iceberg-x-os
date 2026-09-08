import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useQuality } from './quality';
import { RoundedBox, Edges, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles as SparkIcon, Compass, Target, Lock } from 'lucide-react';
import { lerp, smooth, mapRange } from './scroll';

/*
 * The Quest section as a scroll-driven platformer.
 *
 * The section is tall; a pinned canvas holds a little glowing Cube that hops
 * from platform to platform as you scroll. Each platform is one quest, and the
 * matching quest card fades in while the Cube is standing on it. The third
 * platform is caged — the Epic quest is locked.
 *
 * All copy is verbatim from the original static section.
 */

type Quest = {
  rarity: string;
  title: string;
  desc: string;
  target: string;
  badge: string;
  accent: 'magenta' | 'cyan' | 'locked';
  icon: React.ComponentType<{ className?: string }>;
  locked?: boolean;
  note?: string;
};

const QUESTS: Quest[] = [
  {
    rarity: 'Common Quest',
    title: 'Consistency Master',
    desc: 'Log in to the fellowship portal daily for 7 consecutive days. Form habits, review scorecards, and stay engaged.',
    target: 'Target: 7 Days',
    badge: '🏆 GrowthMindset',
    accent: 'magenta',
    icon: Compass,
  },
  {
    rarity: 'Rare Quest',
    title: 'Reliable Contributor',
    desc: 'Attend at least 90% of meetings and R&D synced sessions you are invited to. Value accountability.',
    target: 'Target: 90% Attend',
    badge: '🏆 NoGhosting',
    accent: 'cyan',
    icon: Target,
  },
  {
    rarity: 'Epic Quest',
    title: 'Iceberg Elite Fellow',
    desc: 'Maintain an outstanding feedback score of 4.7+ across 5 completed missions.',
    target: 'Target: 4.7+ Avg',
    badge: '🏆 Crown',
    accent: 'locked',
    icon: Lock,
    locked: true,
    note: '* Unlocks only after completing "High Achiever" quest',
  },
];

/** Platform world positions. */
const PLATFORMS: [number, number, number][] = [
  [0, 0, 0],
  [7, 1.4, -1],
  [14, -0.6, -0.5],
];

const ACCENT_HEX: Record<Quest['accent'], string> = {
  magenta: '#e6007e',
  cyan: '#00f0ff',
  locked: '#8b8b93',
};

/** Character position along the hop path for a section progress `p` (0..1). */
function characterAt(p: number) {
  const segs = [
    { from: 0, a: 0, b: 0 }, // idle p0
    { from: 0.1, a: 0, b: 1 }, // hop 0 -> 1
    { from: 0.34, a: 1, b: 1 }, // idle p1
    { from: 0.46, a: 1, b: 2 }, // hop 1 -> 2
    { from: 0.7, a: 2, b: 2 }, // idle p2
  ];
  const ends = [0.1, 0.34, 0.46, 0.7, 1.0001];
  let i = segs.findIndex((_, idx) => p < ends[idx]);
  if (i === -1) i = segs.length - 1;
  const seg = segs[i];
  const t = mapRange(p, seg.from, ends[i], 0, 1);
  const A = PLATFORMS[seg.a];
  const B = PLATFORMS[seg.b];
  const e = smooth(t);
  const x = lerp(A[0], B[0], e);
  const z = lerp(A[2], B[2], e);
  const jumping = seg.a !== seg.b;
  const baseY = lerp(A[1], B[1], e) + 0.9;
  const arc = jumping ? Math.sin(t * Math.PI) * 2.6 : 0;
  // Squash on take-off / landing, stretch at apex.
  const squash = jumping ? 1 + Math.sin(t * Math.PI) * 0.18 - (t < 0.15 || t > 0.85 ? 0.2 : 0) : 1;
  return { x, y: baseY + arc, z, squash, jumping, index: jumping ? -1 : seg.a };
}

function Character({ progress }: { progress: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    const c = characterAt(progress.current);
    g.position.x = lerp(g.position.x, c.x, 0.2);
    g.position.y = lerp(g.position.y, c.y, 0.25);
    g.position.z = lerp(g.position.z, c.z, 0.2);
    g.scale.y = lerp(g.scale.y, c.squash, 0.3);
    g.scale.x = lerp(g.scale.x, 2 - c.squash, 0.3);
    g.rotation.y += dt * (c.jumping ? 4 : 0.8);
    g.rotation.z = lerp(g.rotation.z, c.jumping ? -0.5 : 0, 0.15);
  });

  return (
    <group ref={ref}>
      <RoundedBox args={[0.9, 0.9, 0.9]} radius={0.12} smoothness={3}>
        <meshStandardMaterial
          color="#e6007e"
          emissive="#ff4da6"
          emissiveIntensity={0.8}
          roughness={0.25}
          metalness={0.5}
        />
        <Edges threshold={15} color="#ffd9ec" />
      </RoundedBox>
      <pointLight distance={6} intensity={8} color="#ff4da6" />
      <Sparkles count={14} scale={2} size={2} speed={0.6} color="#ff99cc" />
    </group>
  );
}

function Platform({
  position,
  accent,
  locked,
  active,
}: {
  position: [number, number, number];
  accent: Quest['accent'];
  locked?: boolean;
  active: boolean;
}) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    g.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.12;
    const target = active ? 1.04 : 1;
    g.scale.x = lerp(g.scale.x, target, 0.1);
    g.scale.z = lerp(g.scale.z, target, 0.1);
  });

  const hex = ACCENT_HEX[accent];

  return (
    <group ref={ref} position={position}>
      <RoundedBox args={[3.2, 0.5, 3.2]} radius={0.12} smoothness={3}>
        <meshStandardMaterial
          color={locked ? '#17151b' : '#140b12'}
          emissive={hex}
          emissiveIntensity={active ? 0.35 : 0.12}
          roughness={0.5}
          metalness={0.4}
        />
        <Edges threshold={15} color={hex} />
      </RoundedBox>

      {/* glow ring under the slab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <ringGeometry args={[1.9, 2.3, 40]} />
        <meshBasicMaterial color={hex} transparent opacity={active ? 0.5 : 0.18} side={THREE.DoubleSide} />
      </mesh>

      {locked && (
        <group position={[0, 1.5, 0]}>
          {[-1, -0.34, 0.34, 1].map((x) => (
            <mesh key={x} position={[x, 0, 0]}>
              <boxGeometry args={[0.12, 2.6, 0.12]} />
              <meshStandardMaterial color="#3a3a44" emissive="#00f0ff" emissiveIntensity={0.15} />
            </mesh>
          ))}
          <mesh>
            <torusGeometry args={[0.7, 0.12, 8, 20, Math.PI]} />
            <meshStandardMaterial color="#3a3a44" emissive="#00f0ff" emissiveIntensity={0.15} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function FollowCamera({ progress }: { progress: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  useFrame(() => {
    const c = characterAt(progress.current);
    const zoomOut = mapRange(progress.current, 0.82, 1, 0, 4);
    camera.position.x = lerp(camera.position.x, c.x - 1.5, 0.08);
    camera.position.y = lerp(camera.position.y, c.y + 3.2 + zoomOut, 0.06);
    camera.position.z = lerp(camera.position.z, 9 + zoomOut, 0.06);
    camera.lookAt(c.x + 1.5, c.y - 0.5, c.z);
  });
  return null;
}

function BackdropTorus() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.z += dt * 0.05;
      ref.current.rotation.x += dt * 0.02;
    }
  });
  return (
    <mesh ref={ref} position={[7, 1, -18]} scale={6}>
      <torusGeometry args={[2, 0.5, 10, 30]} />
      <meshBasicMaterial color="#e6007e" wireframe transparent opacity={0.1} />
    </mesh>
  );
}

function Scene({ progress }: { progress: React.MutableRefObject<number> }) {
  const [active, setActive] = useState(0);
  useFrame(() => {
    const c = characterAt(progress.current);
    if (c.index >= 0 && c.index !== active) setActive(c.index);
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 10, 6]} intensity={90} color="#ff99cc" />
      <pointLight position={[16, 4, 6]} intensity={70} color="#00f0ff" />
      <FollowCamera progress={progress} />
      <BackdropTorus />
      <Sparkles count={70} scale={[30, 12, 12]} position={[7, 2, -6]} size={2} speed={0.3} color="#ff4da6" opacity={0.5} />
      {PLATFORMS.map((p, i) => (
        <Platform
          key={i}
          position={p}
          accent={QUESTS[i].accent}
          locked={QUESTS[i].locked}
          active={active === i}
        />
      ))}
      <Character progress={progress} />
    </>
  );
}

export const QuestPlatformer: React.FC = () => {
  const quality = useQuality();
  const sectionRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [uiProgress, setUiProgress] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      progress.current = p;
      setUiProgress((prev) => (Math.abs(prev - p) > 0.002 ? p : prev));
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Which quest card is currently "on stage".
  const stage = uiProgress < 0.34 ? 0 : uiProgress < 0.66 ? 1 : 2;
  const questNo = Math.min(3, stage + 1);

  return (
    <section ref={sectionRef} className="relative bg-[#0a0508] text-white" style={{ height: '360vh' }} id="quests">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* 3D stage */}
        <div className="absolute inset-0">
          <Canvas
            gl={{ antialias: true, alpha: true }}
            dpr={quality.dpr}
            camera={{ position: [0, 4, 9], fov: 55 }}
          >
            <Scene progress={progress} />
          </Canvas>
        </div>

        {/* vignette so text stays legible over the scene */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_120%,rgba(10,5,8,0.95),transparent_60%),radial-gradient(100%_60%_at_50%_-10%,rgba(10,5,8,0.9),transparent_55%)]" />

        {/* Section heading */}
        <div className="absolute top-[112px] sm:top-[120px] left-1/2 -translate-x-1/2 w-full max-w-[680px] px-7 text-center flex flex-col gap-3">
          <span className="text-magenta text-xs uppercase font-extrabold tracking-wider flex items-center justify-center gap-1.5">
            <SparkIcon className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Progression</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black leading-none tracking-tight">Gamified Quests &amp; Level-Ups</h2>
          <p className="text-slate-400 font-medium leading-relaxed text-sm sm:text-base">
            Embark on structured challenges designed to accelerate your growth. Achieve milestones, track your stats in
            real-time, and unlock next-tier quests.
          </p>
        </div>

        {/* Quest HUD — kept clear of the fixed top nav */}
        <div className="absolute top-[112px] sm:top-[120px] right-5 sm:right-7 hidden sm:flex flex-col items-end gap-2 font-mono rounded-2xl bg-black/30 backdrop-blur-md border border-white/10 px-4 py-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-magenta">
            Quest {questNo} / 3
          </span>
          <div className="w-40 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#e6007e] via-[#ff4da6] to-[#00f0ff] transition-[width] duration-150"
              style={{ width: `${Math.round(uiProgress * 100)}%` }}
            />
          </div>
        </div>

        {/* Quest cards — one on stage at a time */}
        <div className="absolute bottom-[7vh] left-1/2 -translate-x-1/2 w-full max-w-[440px] px-6">
          {QUESTS.map((q, i) => {
            const on = stage === i;
            const Icon = q.icon;
            const border =
              q.accent === 'magenta'
                ? 'border-magenta/30'
                : q.accent === 'cyan'
                ? 'border-cyan-500/30'
                : 'border-white/10';
            return (
              <div
                key={q.title}
                className={`absolute left-1/2 -translate-x-1/2 bottom-0 w-[calc(100%-3rem)] rounded-3xl p-6 bg-[#120a10]/85 backdrop-blur-md border ${border} shadow-[0_20px_60px_-15px_rgba(230,0,126,0.4)] transition-all duration-500 ${
                  on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border ${
                        q.accent === 'magenta'
                          ? 'bg-[#1a0f18] text-magenta border-magenta/20'
                          : q.accent === 'cyan'
                          ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/20'
                          : 'bg-slate-900 text-slate-500 border-white/5'
                      }`}
                    >
                      {q.rarity}
                    </span>
                    {q.locked ? (
                      <span className="flex items-center gap-1 bg-magenta/10 text-magenta border border-magenta/20 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
                        <Lock className="w-3 h-3" />
                        <span>Locked Level</span>
                      </span>
                    ) : (
                      <Icon className={`w-5 h-5 ${q.accent === 'magenta' ? 'text-magenta/40' : 'text-cyan-400/40'}`} />
                    )}
                  </div>
                  <h4 className={`font-extrabold text-[1.2rem] mt-2 ${q.locked ? 'text-white/50' : ''}`}>{q.title}</h4>
                  <p className={`text-xs leading-relaxed mt-1 ${q.locked ? 'text-slate-500' : 'text-slate-400'}`}>{q.desc}</p>
                </div>
                <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">{q.target}</span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                      q.accent === 'magenta'
                        ? 'text-magenta bg-magenta/5 border-magenta/10'
                        : q.accent === 'cyan'
                        ? 'text-cyan-400 bg-cyan-400/5 border-cyan-400/10'
                        : 'text-white/40 bg-white/5 border-white/10'
                    }`}
                  >
                    {q.badge}
                  </span>
                </div>
                {q.note && <p className="text-[9px] font-bold text-magenta mt-3 italic">{q.note}</p>}
              </div>
            );
          })}
        </div>

        {/* scroll hint */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 transition-opacity duration-500 ${
            uiProgress > 0.05 ? 'opacity-0' : 'opacity-100'
          }`}
        >
          scroll to play ↓
        </div>
      </div>
    </section>
  );
};
