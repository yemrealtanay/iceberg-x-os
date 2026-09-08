import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  Check, ShieldAlert, Sparkles, Award, Quote, Menu, X, Target, Compass, Lock,
  Terminal, Cpu, Code2, Zap, Layers, Boxes, ChevronRight, ArrowDown,
} from 'lucide-react';
// The WebGL layer drags in three / drei / postprocessing — roughly a megabyte of
// JS that nothing above the fold needs in order to render. Loading it lazily
// keeps the first paint (and phones on a slow connection) fast; each scene fades
// in on its own once the chunk lands.
const SceneBackground = lazy(() =>
  import('./welcome/SceneBackground').then((m) => ({ default: m.SceneBackground })),
);
const HeroScene = lazy(() => import('./welcome/HeroScene').then((m) => ({ default: m.HeroScene })));
const QuestPlatformer = lazy(() =>
  import('./welcome/QuestPlatformer').then((m) => ({ default: m.QuestPlatformer })),
);
const NetworkOrb = lazy(() => import('./welcome/NetworkOrb').then((m) => ({ default: m.NetworkOrb })));
import { TiltCard } from './welcome/TiltCard';
import { InViewMount } from './welcome/InViewMount';
import { useReducedMotion } from './welcome/useReducedMotion';
import { useGlobalScroll } from './welcome/scroll';
import { useScrollAssembly } from './welcome/assembly';
import { useQuality } from './welcome/quality';
import { CursorReticle, WarpOverlay } from './welcome/Hud';

/* ============================================================================
   ICEBERG//OS  —  immersive dark landing.
   A near-black canvas with a live WebGL world behind it, HUD chrome, monospace
   telemetry and neon magenta / cyan accents. Every word of copy and the whole
   colour palette are carried over unchanged from the previous version — only
   the layout, structure and motion are new.
   ========================================================================== */

const NAV_LINKS = [
  { href: '#what', label: 'Programme' },
  { href: '#work', label: 'Missions' },
  { href: '#pipeline', label: 'Pipeline' },
  { href: '#journey', label: 'Journey' },
  { href: '#fellowship', label: 'Fellowship' },
];

/** Monospace section marker: `// 03 ── WORKSTREAMS ●` */
const SectionTag: React.FC<{ index: string; label: string }> = ({ index, label }) => (
  <div
    data-fly="floor"
    className="os-mono flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.34em] text-cyan-300/70"
  >
    <span className="text-[#ff4da6]">{index}</span>
    <span className="h-px w-10 bg-white/15" />
    <span>{label}</span>
    <span className="os-blink h-1.5 w-1.5 rounded-full bg-[#e6007e] shadow-[0_0_10px_#e6007e]" />
  </div>
);

const Section: React.FC<{
  id?: string;
  className?: string;
  children: React.ReactNode;
  wide?: boolean;
}> = ({ id, className = '', children, wide = false }) => (
  <section id={id} className={`os-hairline os-grid-bg relative py-24 sm:py-28 ${className}`}>
    <span className="os-sweep" data-fly="trace" aria-hidden="true" />
    <div className={`os-stage relative z-10 mx-auto px-6 ${wide ? 'max-w-[1320px]' : 'max-w-[1180px]'}`}>
      {children}
    </div>
  </section>
);

export const Welcome: React.FC = () => {
  const { user } = useAuth();

  const reducedMotion = useReducedMotion();
  const quality = useQuality();
  useGlobalScroll();

  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [whyJoin, setWhyJoin] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null);

  useEffect(() => {
    api.get('/testimonials')
      .then((res) => setTestimonials(res))
      .catch((err) => console.error('Failed to load testimonials:', err));
  }, []);

  // Scroll-driven 3D assembly: every [data-fly] element flies in from depth and
  // is bound continuously to the scroll position, so the page builds itself as
  // you descend rather than popping in once. Re-scans when testimonials land.
  useScrollAssembly(!reducedMotion, [testimonials.length]);

  useEffect(() => {
    const loaderTimer = setTimeout(() => setLoading(false), 650);
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? Math.min(100, (y / max) * 100) : 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(loaderTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    setFormError(null);
    try {
      await api.post('/applications', {
        name,
        email,
        university,
        degree,
        year_of_study: yearOfStudy,
        why_join: whyJoin,
        linkedin_url: linkedinUrl || null,
        github_url: githubUrl || null,
      });
      setFormSuccess(true);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const welcomeStyles = `
    /* The base colour lives on the document, not on .os-body: the fixed WebGL
       world is a -z-10 child of .os-body, so an opaque background there would
       paint straight over the grid floor and hide the whole scene. */
    html, body { background: #07060b; overflow-x: clip; }
    .os-body {
      background: transparent;
      color: #e8e6f0;
      font-family: 'Manrope', 'Inter', system-ui, sans-serif;
      overflow-x: clip;
      line-height: 1.7;
    }
    .os-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

    ::selection { background: #e6007e; color: #fff; }

    /* faint blueprint grid that fades in from the top of every section */
    .os-grid-bg::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px);
      background-size: 54px 54px;
      -webkit-mask-image: radial-gradient(120% 70% at 50% 0%, #000 15%, transparent 78%);
      mask-image: radial-gradient(120% 70% at 50% 0%, #000 15%, transparent 78%);
    }

    /* neon hairline on top of a section */
    .os-hairline::after {
      content: "";
      position: absolute;
      top: 0; left: 50%;
      width: min(1180px, 94%);
      height: 1px;
      transform: translateX(-50%);
      background: linear-gradient(90deg, transparent, rgba(230,0,126,0.7), rgba(0,240,255,0.45), transparent);
    }

    .os-panel {
      background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02));
      border: 1px solid rgba(255,255,255,0.09);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    .os-panel-hover {
      transition: border-color .3s ease, box-shadow .3s ease, transform .3s cubic-bezier(0.16,1,0.3,1);
    }
    .os-panel-hover:hover {
      border-color: rgba(230,0,126,0.45);
      box-shadow: 0 24px 70px -30px rgba(230,0,126,0.55), inset 0 0 0 1px rgba(230,0,126,0.12);
    }

    /* corner brackets */
    .os-bracket::before, .os-bracket::after {
      content: "";
      position: absolute;
      width: 14px; height: 14px;
      border: 1px solid rgba(0,240,255,0.55);
      pointer-events: none;
    }
    .os-bracket::before { top: 10px; left: 10px; border-right: 0; border-bottom: 0; }
    .os-bracket::after { bottom: 10px; right: 10px; border-left: 0; border-top: 0; }

    .grad-text {
      background: linear-gradient(115deg, #e6007e 0%, #ff4da6 45%, #00f0ff 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .glow-magenta { box-shadow: 0 0 0 1px rgba(230,0,126,0.3), 0 20px 60px -20px rgba(230,0,126,0.55); }

    /* mouse spotlight on dark cards */
    .os-spotlight { position: relative; overflow: hidden; }
    .os-spotlight::before {
      content: "";
      position: absolute;
      top: var(--mouse-y, -600px);
      left: var(--mouse-x, -600px);
      width: 420px; height: 420px;
      background: radial-gradient(circle, rgba(230,0,126,0.20) 0%, rgba(0,240,255,0.06) 45%, transparent 75%);
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: opacity .35s ease;
      pointer-events: none;
    }
    .os-spotlight:hover::before { opacity: 1; }

    /* top scroll-progress rail */
    .os-progress {
      position: fixed; top: 0; left: 0; height: 2px; z-index: 200;
      background: linear-gradient(90deg, #e6007e, #ff4da6, #00f0ff);
      box-shadow: 0 0 14px rgba(230,0,126,0.7);
      transition: width .1s linear;
    }

    @keyframes osBlink { 0%,100% { opacity: 1; } 50% { opacity: 0.15; } }
    .os-blink { animation: osBlink 1.6s steps(1) infinite; }

    @keyframes scanDrift {
      0% { background-position: 0 0; }
      100% { background-position: 0 -1400px; }
    }
    .os-scanlines::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 60;
      pointer-events: none;
      background: repeating-linear-gradient(0deg, rgba(255,255,255,0.022) 0px, rgba(255,255,255,0.022) 1px, transparent 1px, transparent 4px);
      opacity: 0.45;
      animation: scanDrift 40s linear infinite;
    }

    @keyframes aurora {
      0%,100% { transform: translate3d(-4%, 0, 0) scale(1.05); opacity: .55; }
      50% { transform: translate3d(4%, -3%, 0) scale(1.15); opacity: .8; }
    }
    .os-aurora { animation: aurora 14s ease-in-out infinite; }

    /* ---- 3D scroll assembly ----
       Every [data-fly] element is flown into place by src/pages/welcome/assembly.ts,
       which writes transform and opacity each frame from the scroll position.
       CSS only supplies the pre-JS hidden state and the "still under construction"
       hologram skin, both driven by the --fly-p progress variable (0 → 1). */
    .os-stage { perspective: 1300px; }
    [data-assembly="on"] [data-fly] { opacity: 0; }
    [data-fly] { transform-origin: 50% 60%; }

    /* cyan wireframe shell + scanlines that burn off as the card seats itself */
    [data-fly-frame] { position: relative; }
    [data-fly-frame]::after {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: inherit;
      pointer-events: none;
      z-index: 20;
      opacity: calc(1 - var(--fly-p, 1));
      border: 1px solid rgba(0,240,255,0.75);
      box-shadow: 0 0 26px rgba(0,240,255,0.35), inset 0 0 30px rgba(230,0,126,0.18);
      background-repeat: no-repeat;
      background-image:
        /* corner ticks */
        linear-gradient(#ff4da6, #ff4da6), linear-gradient(#ff4da6, #ff4da6),
        linear-gradient(#ff4da6, #ff4da6), linear-gradient(#ff4da6, #ff4da6),
        /* scanlines + wash */
        repeating-linear-gradient(0deg, rgba(0,240,255,0.10) 0 1px, transparent 1px 6px),
        linear-gradient(180deg, rgba(0,240,255,0.10), rgba(230,0,126,0.06));
      background-size: 18px 1px, 1px 18px, 18px 1px, 1px 18px, 100% 100%, 100% 100%;
      background-position: 8px 8px, 8px 8px, right 8px bottom 8px, right 8px bottom 8px, 0 0, 0 0;
    }

    /* rails and section edges draw themselves out as you arrive */
    .os-rail { transform: scaleX(var(--fly-p, 1)); transform-origin: 0 50%; }
    .os-sweep {
      position: absolute;
      top: 0; left: 50%;
      height: 1px;
      width: min(1180px, 94%);
      pointer-events: none;
      transform: translateX(-50%) scaleX(var(--fly-p, 1));
      background: linear-gradient(90deg, transparent, #e6007e 30%, #00f0ff 70%, transparent);
      box-shadow: 0 0 18px rgba(230,0,126,0.65);
    }

    /* ---- pointer reticle ---- */
    .os-reticle, .os-reticle-dot {
      position: fixed; top: 0; left: 0; z-index: 300;
      pointer-events: none; opacity: 0;
      transition: opacity .3s ease;
    }
    .os-reticle {
      width: 40px; height: 40px; border-radius: 999px;
      border: 1px solid rgba(0,240,255,0.55);
      box-shadow: 0 0 18px rgba(0,240,255,0.25), inset 0 0 12px rgba(230,0,126,0.2);
      transition: opacity .3s ease, width .2s ease, height .2s ease, border-color .2s ease;
    }
    .os-reticle[data-hot="true"] {
      border-color: rgba(230,0,126,0.9);
      box-shadow: 0 0 26px rgba(230,0,126,0.5), inset 0 0 16px rgba(230,0,126,0.3);
    }
    .os-reticle-dot {
      width: 5px; height: 5px; border-radius: 999px;
      background: #ff4da6;
      box-shadow: 0 0 10px #e6007e;
    }
    @media (hover: none), (pointer: coarse) {
      .os-reticle, .os-reticle-dot { display: none; }
    }

    /* ---- hyperspace streaks while scrolling fast ---- */
    .os-warp {
      position: fixed; inset: 0; z-index: 55;
      pointer-events: none; opacity: 0;
      mix-blend-mode: screen;
      background:
        repeating-linear-gradient(0deg,
          rgba(255,255,255,0) 0 14px,
          rgba(255,77,166,0.10) 14px 15px,
          rgba(255,255,255,0) 15px 30px),
        radial-gradient(120% 60% at 50% 50%, transparent 35%, rgba(0,240,255,0.10) 100%);
      transform-origin: 50% 50%;
    }

    /* ---- holographic sweep across panels on hover ----
       Done with a background layer rather than a pseudo-element: ::after carries
       the build skin and ::before belongs to .os-spotlight. ---- */
    .os-panel-hover {
      background-repeat: no-repeat;
      background-image:
        linear-gradient(115deg, transparent 38%, rgba(255,255,255,0.10) 47%, rgba(0,240,255,0.14) 53%, transparent 62%),
        linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.02));
      background-size: 260% 100%, 100% 100%;
      background-position: 170% 0, 0 0;
      transition:
        border-color .3s ease,
        box-shadow .3s ease,
        background-position .9s cubic-bezier(0.16,1,0.3,1),
        transform .3s cubic-bezier(0.16,1,0.3,1);
    }
    .os-panel-hover:hover { background-position: -70% 0, 0 0; }

    /* ---- chromatic glitch on the hero headline ---- */
    @keyframes glitchShift {
      0%, 92%, 100% { clip-path: inset(50% 0 50% 0); transform: translate(0,0); }
      93% { clip-path: inset(12% 0 62% 0); transform: translate(-3px, 1px); }
      95% { clip-path: inset(58% 0 20% 0); transform: translate(3px, -1px); }
      97% { clip-path: inset(32% 0 44% 0); transform: translate(-2px, 0); }
    }
    .os-glitch { position: relative; }
    .os-glitch::before, .os-glitch::after {
      content: attr(data-text);
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .os-glitch::before { color: #00f0ff; animation: glitchShift 7s steps(1) infinite; opacity: .55; }
    .os-glitch::after { color: #e6007e; animation: glitchShift 7s steps(1) infinite reverse; opacity: .5; }

    .tilt-card { transition: transform .25s cubic-bezier(0.16,1,0.3,1); }

    @keyframes floatDrift { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
    .float-drift { animation: floatDrift 7s ease-in-out infinite; }

    /* ---- marquee ---- */
    @keyframes marqueeLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes marqueeRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
    .animate-marquee-left { display: flex; width: max-content; animation: marqueeLeft 48s linear infinite; }
    .animate-marquee-right { display: flex; width: max-content; animation: marqueeRight 48s linear infinite; }
    .animate-marquee-left:hover, .animate-marquee-right:hover { animation-play-state: paused; }
    .marquee-mask {
      position: relative; overflow: hidden;
      -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
      mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    }

    .os-input {
      width: 100%;
      padding: 0.8rem 1rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 0.85rem;
      color: #e8e6f0;
      font-size: 0.9rem;
      font-weight: 500;
      outline: none;
      transition: border-color .2s, box-shadow .2s, background .2s;
    }
    .os-input::placeholder { color: rgba(232,230,240,0.35); }
    .os-input:focus {
      border-color: #e6007e;
      background: rgba(230,0,126,0.06);
      box-shadow: 0 0 0 3px rgba(230,0,126,0.12);
    }
    .os-input:disabled { opacity: 0.55; }

    @media (prefers-reduced-motion: reduce) {
      [data-fly] { opacity: 1 !important; transform: none !important; }
      [data-fly-frame]::after, .os-warp, .os-reticle, .os-reticle-dot { display: none; }
      .os-glitch::before, .os-glitch::after { display: none; }
      .os-panel-hover { transition: none; }
      .float-drift, .os-blink, .os-aurora, .os-scanlines::after,
      .animate-marquee-left, .animate-marquee-right { animation: none; }
    }
  `;

  // ---- data (carried over verbatim) ----
  const bentoWorkStreams = [
    {
      tag: 'FRONTIER AI // LAB',
      title: 'Autonomous AI & Multi-Agent Systems',
      desc: 'Architecting self-evaluating LLM agents, local semantic vector-stores, and tool-augmented reasoning engines for production workflows.',
      icon: Cpu,
      span: 'lg:col-span-2',
      badge: 'High Priority',
      codeSnippet: 'const agent = new FrontierAgent({ domain: "Enterprise AI" });\nawait agent.synthesize(workflowStream);',
    },
    {
      tag: 'SYSTEMS // REALTIME',
      title: 'Autonomous Automation & Cron Daemons',
      desc: 'Replacing brittle human workflows with resilient asynchronous daemons, event-driven workers, and self-healing pipelines.',
      icon: Zap,
      span: 'lg:col-span-1',
      badge: 'Active R&D',
    },
    {
      tag: 'BACKEND // GO & TS',
      title: 'High-Throughput API Integrations',
      desc: 'Designing microsecond-latency microservices, webhook aggregators, and distributed state machines that bridge critical enterprise APIs.',
      icon: Layers,
      span: 'lg:col-span-1',
      badge: 'Infra Core',
    },
    {
      tag: 'PRODUCT // INCUBATION',
      title: 'Prototype to Production Spinoffs',
      desc: 'Transforming experimental algorithmic repositories into tested, scalable, commercial software solutions.',
      icon: Boxes,
      span: 'lg:col-span-1',
      badge: 'Incubation',
    },
    {
      tag: 'INTERFACE // EXPERIMENTAL',
      title: 'Generative UX & Declarative Interfaces',
      desc: 'Refining the exact inflection points where complex AI meets human intuition through declarative UI schema renderers and micro-interactions.',
      icon: Code2,
      span: 'lg:col-span-1',
      badge: 'Frontier UI',
    },
    {
      tag: 'DEVTOOLS // INTERNAL',
      title: 'Internal Tooling & Telemetry Observability',
      desc: 'Constructing CLI compilers, real-time telemetry dashboards, and developer ergonomics powering daily Iceberg operations.',
      icon: Terminal,
      span: 'lg:col-span-2',
      badge: 'Core Tooling',
      codeSnippet: 'git commit -m "feat(telemetry): stream vector latency to HUD"',
    },
  ];

  const missions = [
    {
      title: 'Support Intelligence Platform',
      cat: 'AI / NLP',
      desc: 'Engineering a semantic search and automated resolution pipeline for customer success workloads.',
      nodes: '3 Cubes',
      commit: '48 Commits',
    },
    {
      title: 'OAuth2 / JWT MFA Integration Research',
      cat: 'Security / Go',
      desc: 'Researching multi-factor auth patterns and OAuth2 flows under Golang & PostgreSQL state-stores.',
      nodes: '2 Cubes',
      commit: '31 Commits',
    },
    {
      title: 'AI-Powered Dynamic Form Schema Renderer',
      cat: 'Frontend Eng',
      desc: 'Designing a declarative JSON schema parser that builds production-grade responsive UI forms on the fly.',
      nodes: '4 Cubes',
      commit: '62 Commits',
    },
  ];

  const pipeline = [
    { step: '01', tag: 'PHASE // INCEPTION', title: 'Application & Async Review', desc: 'Apply online, submit your GitHub portfolio, and pass the async engineering evaluation to join.' },
    { step: '02', tag: 'PHASE // SYNDICATE', title: 'Briefing & Teams', desc: 'Get grouped into 1-to-many teams and claim your production R&D mission blueprint.' },
    { step: '03', tag: 'PHASE // BUILD', title: 'Ship Code & Badges', desc: 'Push timeline updates, receive mentor evaluations, and earn verified achievement badges.' },
    { step: '04', tag: 'PHASE // DEMO', title: 'Demo Day Showcases', desc: 'Deliver functional prototype demonstrations directly to the founding engineering team.' },
    { step: '05', tag: 'PHASE // PROGRESS', title: 'Vault & Progression', desc: 'Archive code in the Vault, gain certification, and progress to Senior Cube or spinoff incubation.' },
  ];

  const badges = [
    { title: 'Builder', desc: 'Created a working prototype.' },
    { title: 'Innovator', desc: 'Created an original idea.' },
    { title: 'Collaborator', desc: 'Exceptional teamwork.' },
    { title: 'Pathfinder', desc: 'Solved a difficult challenge.' },
    { title: 'Pioneer', desc: 'Work influenced a real Iceberg product.' },
  ];

  const vaultItems = [
    { num: '01', title: 'Ideas' },
    { num: '02', title: 'Research' },
    { num: '03', title: 'Experiments' },
    { num: '04', title: 'Prototypes' },
    { num: '05', title: 'Discoveries' },
  ];

  const quests = [
    {
      rarity: 'Common Quest', accent: 'magenta' as const, icon: Compass,
      title: 'Consistency Master',
      desc: 'Log in to the fellowship portal daily for 7 consecutive days. Form habits, review scorecards, and stay engaged.',
      target: 'Target: 7 Days', badge: '🏆 GrowthMindset',
    },
    {
      rarity: 'Rare Quest', accent: 'cyan' as const, icon: Target,
      title: 'Reliable Contributor',
      desc: 'Attend at least 90% of meetings and R&D synced sessions you are invited to. Value accountability.',
      target: 'Target: 90% Attend', badge: '🏆 NoGhosting',
    },
    {
      rarity: 'Epic Quest', accent: 'locked' as const, icon: Lock, locked: true,
      title: 'Iceberg Elite Fellow',
      desc: 'Maintain an outstanding feedback score of 4.7+ across 5 completed missions.',
      target: 'Target: 4.7+ Avg', badge: '🏆 Crown',
      note: '* Unlocks only after completing "High Achiever" quest',
    },
  ];

  const journey = [
    {
      code: '01', stage: 'Stage 1: The Start', title: 'Cube', tone: 'base',
      desc: 'Where every journey begins. You enter the program, learn the fundamentals, dive into R&D missions, build research prototypes, and explore modern engineering practices under mentor guidance.',
    },
    {
      code: '02A', stage: 'Stage 2: Advanced Path', title: 'Senior Cube', tone: 'magenta',
      desc: 'Demonstrated competence in technical and research domains. Trusted with larger system architectures, team collaboration leadership, and direct R&D demo delivery.',
    },
    {
      code: '02B', stage: 'Stage 2: Exit Path', title: 'Former Cube', tone: 'muted',
      desc: 'Decided to pause or stop the program. Cubes are welcome to exit gracefully while retaining access to the community and their verified badge achievements.',
    },
    {
      code: '03A', stage: 'Stage 3: Corporate Path', title: 'Iceberger', tone: 'cyan',
      desc: 'Upon graduation, join the full-time team at Iceberg Digital. Transition into consulting, software engineering, or product management roles to continue building the future.',
    },
    {
      code: '03B', stage: 'Stage 3: External Path', title: 'Alumni', tone: 'base',
      desc: 'Leave Iceberg and carry the innovative mindset elsewhere. Alumni move on to top-tier global tech giants, start their own VC-backed companies, or pursue advanced research.',
    },
  ];

  const fellowshipUniversitiesRow1 = [
    { name: 'İzmir Bakırçay Üniversitesi', location: 'İzmir, TR', logo: '/images/universities/bakircay.svg' },
    { name: 'Muğla Sıtkı Koçman Üniversitesi', location: 'Muğla, TR', logo: '/images/universities/msku.svg' },
    { name: 'Ege Üniversitesi', location: 'İzmir, TR', logo: '/images/universities/ege.svg' },
    { name: 'Ulster University', location: 'Northern Ireland, UK', logo: '/images/universities/ulster.png' },
    { name: 'Ankara Üniversitesi', location: 'Ankara, TR', logo: '/images/universities/ankara.png' },
    { name: 'Gazi Üniversitesi', location: 'Ankara, TR', logo: '/images/universities/gazi.png' },
    { name: 'University of Bremen', location: 'Bremen, Germany', logo: '/images/universities/bremen.png' },
    { name: 'Doğuş Üniversitesi', location: 'İstanbul, TR', logo: '/images/universities/dogus.png' },
    { name: 'Fırat Üniversitesi', location: 'Elazığ, TR', logo: '/images/universities/firat.svg' },
  ];

  const fellowshipUniversitiesRow2 = [
    { name: 'Anadolu Üniversitesi', location: 'Eskişehir, TR', logo: '/images/universities/anadolu.svg' },
    { name: 'Yeditepe Üniversitesi', location: 'İstanbul, TR', logo: '/images/universities/yeditepe.png' },
    { name: 'Ankara Yıldırım Beyazıt Üniversitesi', location: 'Ankara, TR', logo: '/images/universities/aybu.svg' },
    { name: 'İstanbul Atlas Üniversitesi', location: 'İstanbul, TR', logo: '/images/universities/atlas.svg' },
    { name: 'İstanbul Arel Üniversitesi', location: 'İstanbul, TR', logo: '/images/universities/arel.svg' },
    { name: 'Kırıkkale Üniversitesi', location: 'Kırıkkale, TR', logo: '/images/universities/kirikkale.svg' },
    { name: 'Kütahya Dumlupınar Üniversitesi', location: 'Kütahya, TR', logo: '/images/universities/dumlupinar.png' },
    { name: 'Bilecik Şeyh Edebali Üniversitesi', location: 'Bilecik, TR', logo: '/images/universities/bilecik.jpg' },
    { name: 'Karamanoğlu Mehmetbey Üniversitesi', location: 'Karaman, TR', logo: '/images/universities/kmu.jpg' },
  ];

  // network SVG fallback coordinates (used only under reduced-motion)
  const cx = 200;
  const cy = 200;
  const R = 140;
  const N = 6;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (Math.PI * 2 / N) * i - Math.PI / 2;
    pts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]);
  }

  const uniChip = (uni: { name: string; location: string; logo: string }, key: string) => (
    <div
      key={key}
      className="group flex shrink-0 select-none items-center gap-3.5 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2.5 transition-all duration-300 hover:border-[#e6007e]/50 hover:bg-white/[0.06]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/90 p-1">
        <img
          src={uni.logo}
          alt={uni.name}
          className="max-h-full max-w-full object-contain grayscale transition-all duration-300 group-hover:grayscale-0"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col text-left">
        <span className="whitespace-nowrap text-xs font-extrabold text-slate-200 transition-colors group-hover:text-[#ff99cc]">
          {uni.name}
        </span>
        <span className="os-mono text-[10px] font-medium uppercase tracking-wider text-slate-500">
          {uni.location}
        </span>
      </div>
    </div>
  );

  const testimonialCard = (t: any, key: string) => (
    <div
      key={key}
      onClick={() => setSelectedTestimonial(t)}
      title="Click to read full testimonial"
      className="group relative mx-3 flex w-[340px] shrink-0 cursor-pointer flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] p-6 transition-all duration-300 hover:border-[#e6007e]/40 hover:bg-white/[0.06] sm:w-[400px]"
    >
      <div className="flex flex-col gap-3">
        <Quote className="h-6 w-6 text-[#e6007e]/40" />
        <p className="relative z-10 line-clamp-4 text-xs font-medium italic leading-relaxed text-slate-300 sm:text-sm">
          "{t.content}"
        </p>
      </div>
      <div className="flex items-center gap-3 border-t border-white/8 pt-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#e6007e]/30 bg-[#e6007e]/10 text-xs font-extrabold text-[#ff99cc]">
          {t.cube?.user?.name ? t.cube.user.name[0] : 'C'}
        </div>
        <div>
          <h4 className="text-[11px] font-extrabold leading-tight text-slate-100">
            {t.cube?.user?.name || 'Anonymous Cube'}
          </h4>
          <p className="os-mono mt-0.5 text-[9px] font-medium uppercase tracking-wider text-slate-500">
            Cube #{t.cube?.cube_number || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="os-body os-scanlines relative min-h-screen"
      data-assembly={reducedMotion ? 'off' : 'on'}
    >
      <style dangerouslySetInnerHTML={{ __html: welcomeStyles }} />
      {!reducedMotion && <CursorReticle />}
      {!reducedMotion && <WarpOverlay />}

      {/* scroll progress rail */}
      <div className="os-progress" style={{ width: `${scrollPct}%` }} />

      {/* LOADER */}
      {loading && (
        <div className="fixed inset-0 z-[999] grid place-items-center bg-[#07060b] transition-all duration-700">
          <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-[16px] bg-gradient-to-tr from-[#e6007e] via-[#ff4da6] to-[#ff99cc] p-0.5 shadow-[0_0_50px_rgba(230,0,126,0.6)]">
            <img src="/images/xicon.jpg" alt="Icon" className="h-full w-full rounded-[14px] object-cover" />
          </div>
        </div>
      )}

      {/* LIVE 3D WORLD */}
      {!reducedMotion && (
        <Suspense fallback={null}>
          <SceneBackground quality={quality} />
        </Suspense>
      )}

      {/* NAV — OS top bar */}
      <nav
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/8 bg-[#07060b]/80 py-3 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent py-5'
        }`}
      >
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-6">
          <a href="#top" className="flex items-center gap-3">
            <img
              src="/images/xicon.jpg"
              alt="Iceberg X"
              className="h-11 w-11 shrink-0 rounded-2xl border border-white/10 object-cover shadow-[0_0_24px_rgba(230,0,126,0.35)]"
            />
            <span className="os-mono hidden text-[11px] font-medium uppercase tracking-[0.3em] text-slate-400 sm:block">
              iceberg&nbsp;x<span className="text-[#e6007e]">//</span>os
            </span>
          </a>

          <div className="os-mono hidden items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 md:flex lg:gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-[#ff4da6]">
                {l.label}
              </a>
            ))}
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <span className="os-blink h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              ONLINE
            </span>
            {user ? (
              <Link
                to="/dashboard"
                className="rounded-full bg-[#e6007e] px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_0_24px_rgba(230,0,126,0.5)] transition-transform hover:-translate-y-0.5"
              >
                Enter Platform
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-100 transition-colors hover:border-[#e6007e]/50"
              >
                Login
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition-colors hover:border-[#e6007e]/50 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="os-panel mx-4 mt-3 overflow-hidden rounded-2xl md:hidden">
            <div className="os-mono flex flex-col p-2 text-[12px] font-semibold uppercase tracking-wider text-slate-300">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-4 py-3 transition-colors hover:bg-white/5 hover:text-[#ff4da6]"
                >
                  {l.label}
                </a>
              ))}
              {user ? (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="mt-2 rounded-xl bg-[#e6007e] px-4 py-3 text-center text-white">
                  Enter Platform
                </Link>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mt-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center text-slate-100">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ======================= 00 · HERO ======================= */}
      <section id="top" className="os-grid-bg relative flex min-h-screen items-center overflow-hidden pb-24 pt-[160px]">
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="os-aurora absolute right-[-10%] top-[-10%] h-[540px] w-[540px] rounded-full bg-[radial-gradient(circle,rgba(230,0,126,0.28),transparent_65%)] blur-2xl" />
          <div className="os-aurora absolute bottom-[-15%] left-[-8%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.18),transparent_65%)] blur-2xl" style={{ animationDelay: '-6s' }} />
        </div>

        <div className="os-stage relative z-10 mx-auto grid w-full max-w-[1320px] grid-cols-1 items-center gap-[60px] px-6 lg:grid-cols-[1.05fr_1fr]">
          <div data-fly="left" className="flex flex-col gap-7">
            <div className="os-mono inline-flex items-center gap-2 self-start rounded-full border border-[#e6007e]/30 bg-[#e6007e]/10 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#ff99cc]">
              <Cpu className="h-3.5 w-3.5 animate-pulse" />
              <span>An Elite Technology Fellowship</span>
            </div>

            <h1
              className={`${reducedMotion ? '' : 'os-glitch'} text-[3rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-[4.4rem]`}
              data-text="Building the Next Generation of Innovators"
            >
              Building the Next Generation of <span className="grad-text">Innovators</span>
            </h1>

            <p className="max-w-[520px] text-lg leading-relaxed text-slate-400">
              Most internships teach you how a company works.{' '}
              <strong className="font-semibold text-slate-100">
                Our platform gives you the opportunity to prove what you're capable of building.
              </strong>
            </p>

            <div className="mt-1 flex flex-wrap gap-4">
              <a
                href="#apply"
                className="glow-magenta flex items-center gap-2 rounded-full bg-[#e6007e] px-7 py-3.5 font-semibold text-white transition-transform hover:-translate-y-1"
              >
                <span>Become a Cube</span>
                <ChevronRight className="h-4 w-4" />
              </a>
              <a
                href="#work"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-3.5 font-semibold text-slate-100 transition-colors hover:border-[#00f0ff]/40"
              >
                Explore Missions
              </a>
            </div>

            {/* telemetry readout */}
            <div className="os-panel os-bracket relative mt-6 grid grid-cols-3 gap-4 rounded-2xl p-5">
              {[
                { v: '100%', l: 'Builders, not observers' },
                { v: '#0XX', l: 'Permanent Cube number' },
                { v: '∞', l: 'Once a Cube, always a Cube' },
              ].map((s) => (
                <div key={s.l} className="flex flex-col gap-1">
                  <div className="grad-text text-2xl font-black">{s.v}</div>
                  <div className="os-mono text-[9px] font-medium uppercase tracking-wider text-slate-500">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3D cube */}
          <div data-fly="right" className="relative flex h-[440px] w-full items-center justify-center sm:h-[540px]">
            <div className="absolute h-[360px] w-[360px] animate-pulse rounded-full bg-gradient-to-tr from-[#e6007e]/25 via-[#00f0ff]/15 to-transparent blur-3xl" />
            {reducedMotion ? (
              <div className="h-[260px] w-[260px] rounded-[2rem] border border-white/20 bg-gradient-to-tr from-[#e6007e] via-[#ff4da6] to-[#ff99cc] shadow-[0_0_80px_rgba(230,0,126,0.45)]" />
            ) : (
              <Suspense fallback={null}>
                <HeroScene reduced={reducedMotion} quality={quality} />
              </Suspense>
            )}

            <div className="os-mono os-panel absolute right-2 top-4 flex items-center gap-2.5 rounded-2xl px-4 py-2 text-slate-100 sm:right-6">
              <span className="os-blink h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="text-[11px] font-bold tracking-tight">72 Active Nodes</span>
            </div>
            <div className="os-panel absolute bottom-4 left-2 flex items-center gap-2.5 rounded-2xl px-4 py-2 text-white sm:left-6">
              <Sparkles className="h-4 w-4 text-[#ff4da6]" />
              <div className="flex flex-col">
                <span className="os-mono text-[9px] font-medium uppercase tracking-widest text-slate-400">Fellowship Standard</span>
                <span className="text-xs font-black text-[#ff99cc]">100% Builders Only</span>
              </div>
            </div>
          </div>
        </div>

        <div className="os-mono absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-slate-600">
          scroll to boot ↓
        </div>
      </section>

      {/* ======================= 01 · NODES ======================= */}
      <section id="universities" className="os-hairline os-grid-bg relative overflow-hidden py-16">
        <div className="os-stage mx-auto mb-8 flex max-w-[1180px] flex-col items-center gap-3 px-6 text-center">
          <SectionTag index="// 01" label="Academic Talent Network" />
          <h2 data-fly="floor" className="text-2xl font-black tracking-tight text-white sm:text-4xl">
            Where Our Cubes Come From
          </h2>
          <p data-fly="floor" className="max-w-xl text-xs font-medium leading-relaxed text-slate-400 sm:text-sm">
            Fellowship builders representing leading computer science, AI, and engineering faculties across national and international universities.
          </p>
        </div>

        <div className="marquee-mask flex flex-col gap-3.5 py-2">
          <div className="animate-marquee-left flex items-center gap-4">
            {[...fellowshipUniversitiesRow1, ...fellowshipUniversitiesRow1].map((uni, idx) => uniChip(uni, `r1-${uni.name}-${idx}`))}
          </div>
          <div className="animate-marquee-right flex items-center gap-4">
            {[...fellowshipUniversitiesRow2, ...fellowshipUniversitiesRow2].map((uni, idx) => uniChip(uni, `r2-${uni.name}-${idx}`))}
          </div>
        </div>
      </section>

      {/* ======================= 02 · DIFF (philosophy) ======================= */}
      <Section id="what">
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <SectionTag index="// 02" label="The Philosophy" />
          <h2 data-fly="floor" className="max-w-[640px] text-3xl font-black leading-tight text-white sm:text-5xl">
            This is <span className="grad-text">not</span> a traditional internship.
          </h2>
          <p data-fly="floor" className="max-w-[620px] font-medium leading-relaxed text-slate-400">
            Real research and development projects. Real commercial challenges. Real mentors. Real outcomes. Here, participants are builders — not observers.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-[1fr_auto_1fr]">
          <div data-fly="left" className="os-panel flex flex-col gap-5 rounded-3xl p-8 sm:p-10">
            <span className="os-mono text-[10px] uppercase tracking-[0.24em] text-slate-500">The Old Way</span>
            <h3 className="text-xl font-extrabold text-slate-200">Traditional Internship</h3>
            <ul className="os-mono mt-2 flex flex-col gap-3 text-sm font-semibold text-slate-400">
              {['Observe', 'Shadow', 'Assist', 'Learn'].map((w) => (
                <li key={w} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 text-[11px] text-slate-600">−</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>

          <div data-fly="deep" className="grid place-items-center">
            <span className="os-mono float-drift flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/5 text-sm font-black text-[#ff4da6] shadow-[0_0_28px_rgba(230,0,126,0.4)]">
              vs
            </span>
          </div>

          <div data-fly="right" className="os-panel os-bracket relative flex flex-col gap-5 overflow-hidden rounded-3xl border-[#e6007e]/25 p-8 shadow-[0_30px_80px_-40px_rgba(230,0,126,0.6)] sm:p-10">
            <div className="pointer-events-none absolute -right-[20%] -top-[40%] h-[120%] w-[60%] bg-[radial-gradient(circle,rgba(230,0,126,0.35),transparent_70%)] blur-2xl" />
            <span className="os-mono relative z-10 text-[10px] uppercase tracking-[0.24em] text-[#ff99cc]">Our Approach</span>
            <h3 className="relative z-10 text-xl font-extrabold text-white">The Fellowship</h3>
            <ul className="os-mono relative z-10 mt-2 flex flex-col gap-3 text-sm font-semibold text-slate-200">
              {['Build', 'Experiment', 'Prototype', 'Innovate'].map((w) => (
                <li key={w} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#e6007e] text-[11px] text-white">+</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ======================= 03 · WORKSTREAMS (bento) ======================= */}
      <Section id="work" wide>
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <SectionTag index="// 03" label="R&D Workstreams & Domains" />
          <h2 data-fly="floor" className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            What will you <span className="grad-text">build</span>?
          </h2>
          <p data-fly="floor" className="max-w-xl font-medium leading-relaxed text-slate-400">
            Real engineering challenges with real production stakes. We don't build slide decks — we ship high-throughput systems, models, and platforms.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 lg:grid-cols-3">
          {bentoWorkStreams.map((stream, idx) => {
            const Icon = stream.icon;
            return (
              <div
                key={idx}
                data-fly={idx % 3 === 0 ? 'left' : idx % 3 === 1 ? 'floor' : 'right'}
                data-fly-delay={((idx % 3) * 0.08).toFixed(2)}
                data-fly-frame
                onMouseMove={handleCardMouseMove}
                className={`os-panel os-panel-hover os-spotlight group flex flex-col justify-between gap-6 rounded-3xl p-7 sm:p-8 ${stream.span}`}
              >
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition-colors group-hover:border-[#e6007e]/50 group-hover:text-[#ff4da6]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="os-mono rounded-full border border-[#00f0ff]/20 bg-[#00f0ff]/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#00f0ff]/80">
                      {stream.badge}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-col gap-2">
                    <span className="os-mono text-[10px] font-medium uppercase tracking-widest text-slate-500">{stream.tag}</span>
                    <h3 className="text-xl font-black leading-snug tracking-tight text-white transition-colors group-hover:text-[#ff99cc] sm:text-2xl">
                      {stream.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium leading-relaxed text-slate-400 sm:text-sm">{stream.desc}</p>
                  </div>
                </div>

                {stream.codeSnippet && (
                  <div className="os-mono relative z-10 overflow-x-auto rounded-2xl border border-white/10 bg-black/50 p-3.5 text-[11px] text-slate-300">
                    <div className="mb-1.5 flex items-center justify-between border-b border-white/5 pb-1 text-[9px] text-slate-500">
                      <span>terminal_preview.sh</span>
                      <span className="text-emerald-400">EXEC</span>
                    </div>
                    <code className="whitespace-pre-wrap text-[#ff99cc]">{stream.codeSnippet}</code>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* live missions */}
        <div className="mt-16 border-t border-white/8 pt-16">
          <div data-fly="floor" className="mx-auto mb-10 flex max-w-[600px] flex-col items-center gap-2 text-center">
            <span className="os-mono flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff4da6]">
              <span className="os-blink h-1.5 w-1.5 rounded-full bg-[#ff4da6]" />
              Live Telemetry Feed
            </span>
            <h3 className="text-2xl font-extrabold text-white">Active Cohort Missions</h3>
            <p className="text-xs font-medium leading-relaxed text-slate-400">
              Here are actual research challenges currently being developed by active Cubes in our fellowship.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {missions.map((proj, idx) => (
              <div
                key={idx}
                data-fly={idx % 3 === 0 ? 'spin-left' : idx % 3 === 1 ? 'deep' : 'spin-right'}
                data-fly-delay={((idx % 3) * 0.09).toFixed(2)}
                data-fly-frame
                className="os-panel os-panel-hover flex flex-col justify-between gap-4 rounded-3xl p-6"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="os-mono rounded-md border border-[#e6007e]/20 bg-[#e6007e]/5 px-2.5 py-0.5 text-[9px] font-bold uppercase text-[#ff99cc]">
                      {proj.cat}
                    </span>
                    <span className="os-mono text-[10px] font-bold text-slate-500">{proj.nodes}</span>
                  </div>
                  <h4 className="mt-1 text-sm font-extrabold leading-snug text-white">{proj.title}</h4>
                  <p className="text-[11px] font-medium leading-relaxed text-slate-400">{proj.desc}</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/8 pt-3">
                  <div className="os-mono flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400">
                    <span className="os-blink h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Production Sprint
                  </div>
                  <span className="os-mono text-[10px] font-bold text-slate-500">{proj.commit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ======================= 04 · LIFECYCLE (pipeline) ======================= */}
      <Section id="pipeline" wide>
        <div className="mb-16 flex flex-col items-center gap-3 text-center">
          <SectionTag index="// 04" label="Lifecycle Telemetry" />
          <h2 data-fly="floor" className="text-3xl font-black tracking-tight text-white sm:text-5xl">The Fellowship Cycle</h2>
          <p data-fly="floor" className="max-w-2xl font-medium leading-relaxed text-slate-400">
            A transparent, high-velocity engineering trajectory — from async code verification to permanent Vault archival.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-[1000px] grid-cols-1 items-stretch gap-4 md:grid-cols-5">
          <div
            data-fly="trace"
            className="os-rail absolute left-[8%] right-[8%] top-1/2 hidden h-[2px] -translate-y-1/2 bg-gradient-to-r from-[#e6007e] via-[#ff4da6] to-[#00f0ff] shadow-[0_0_16px_rgba(230,0,126,0.6)] md:block"
          />
          {pipeline.map((c, idx) => (
            <div
              key={idx}
              data-fly={idx % 2 === 0 ? 'floor' : 'drop'}
              data-fly-delay={(idx * 0.07).toFixed(2)}
              data-fly-frame
              className="os-panel os-panel-hover group relative z-10 flex flex-col justify-between gap-4 rounded-3xl p-5 sm:p-6"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="os-mono flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs font-black text-white transition-colors group-hover:border-[#e6007e]/50 group-hover:text-[#ff4da6]">
                    {c.step}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-white/20 transition-colors group-hover:bg-[#e6007e]" />
                </div>
                <span className="os-mono text-[9px] font-medium uppercase tracking-widest text-slate-500 group-hover:text-[#ff99cc]">
                  {c.tag}
                </span>
                <h4 className="text-sm font-extrabold leading-snug text-white">{c.title}</h4>
              </div>
              <p className="text-xs font-medium leading-relaxed text-slate-400">{c.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ======================= 05 · TRAJECTORY (journey) ======================= */}
      <Section id="journey">
        <div className="mb-16 flex flex-col items-center gap-3 text-center">
          <SectionTag index="// 05" label="Growth & Progression" />
          <h2 data-fly="floor" className="text-3xl font-black tracking-tight text-white sm:text-5xl">The Cube Journey</h2>
          <p data-fly="floor" className="max-w-2xl font-medium leading-relaxed text-slate-400">
            This program is built to support career growth and skill progression. Explore the branching paths of a Cube.
          </p>
        </div>

        <div className="mx-auto grid max-w-[920px] grid-cols-1 gap-5 md:grid-cols-2">
          {journey.map((j, idx) => {
            const toneRing =
              j.tone === 'magenta'
                ? 'border-[#e6007e]/40 shadow-[0_24px_70px_-40px_rgba(230,0,126,0.6)]'
                : j.tone === 'cyan'
                ? 'border-[#00f0ff]/40 shadow-[0_24px_70px_-40px_rgba(0,240,255,0.4)]'
                : 'border-white/9';
            const codeColor =
              j.tone === 'magenta' ? 'text-[#ff4da6]' : j.tone === 'cyan' ? 'text-[#00f0ff]' : j.tone === 'muted' ? 'text-slate-500' : 'text-[#ff99cc]';
            return (
              <React.Fragment key={j.code}>
                {idx === 1 && (
                  <div className="col-span-full -my-2 flex justify-center text-[#e6007e]/50 md:col-span-2">
                    <ArrowDown className="h-7 w-7" />
                  </div>
                )}
                {idx === 3 && (
                  <div className="col-span-full -my-2 flex justify-center text-[#e6007e]/50 md:col-span-2">
                    <ArrowDown className="h-7 w-7" />
                  </div>
                )}
                <div
                  data-fly={idx % 2 === 0 ? 'spin-left' : 'spin-right'}
                  data-fly-frame
                  className={`os-panel os-panel-hover relative overflow-hidden rounded-3xl border p-8 ${toneRing} ${idx === 0 ? 'md:col-span-2' : ''}`}
                >
                  <div className={`os-mono absolute right-6 top-6 select-none text-6xl font-black opacity-10 ${codeColor}`}>{j.code}</div>
                  <span className={`os-mono text-[10px] font-medium uppercase tracking-widest ${codeColor}`}>{j.stage}</span>
                  <h3 className="mt-2 flex items-center gap-1.5 text-xl font-extrabold text-white">
                    {j.title}
                    {j.tone === 'cyan' && <Sparkles className="h-4 w-4 animate-pulse text-[#00f0ff]" />}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-slate-400">{j.desc}</p>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Section>

      {/* ======================= 06 · ACHIEVEMENTS (badges) ======================= */}
      <Section>
        <div className="mb-16 flex flex-col items-center gap-3 text-center">
          <SectionTag index="// 06" label="Recognition & Achievements" />
          <h2 data-fly="floor" className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            Earn your place. Earn your <span className="grad-text">badge</span>.
          </h2>
          <p data-fly="floor" className="max-w-xl font-medium leading-relaxed text-slate-400">
            Achievement is recognised, recorded, and remembered. Every badge marks something you actually did.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {badges.map((badge, idx) => (
            <TiltCard
              key={idx}
              max={12}
              data-fly={idx % 2 === 0 ? 'left' : 'right'}
              data-fly-delay={((idx % 5) * 0.07).toFixed(2)}
              data-fly-frame
              className="os-panel os-panel-hover flex flex-col gap-3 rounded-3xl p-6 text-center"
            >
              <div className="float-drift mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e6007e] via-[#ff4da6] to-[#ff99cc] text-white shadow-[0_0_30px_rgba(230,0,126,0.5)]">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="mt-2 text-[1.05rem] font-extrabold text-white">{badge.title}</h4>
              <p className="os-mono text-[11px] font-medium leading-relaxed text-slate-400">{badge.desc}</p>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* ======================= 07 · QUESTS (scroll platformer) ======================= */}
      {reducedMotion ? (
        <Section id="quests">
          <div className="mb-16 flex flex-col items-center gap-3 text-center">
            <SectionTag index="// 07" label="Interactive Progression" />
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">Gamified Quests &amp; Level-Ups</h2>
            <p className="max-w-2xl font-medium leading-relaxed text-slate-400">
              Embark on structured challenges designed to accelerate your growth. Achieve milestones, track your stats in real-time, and unlock next-tier quests.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {quests.map((q) => {
              const Icon = q.icon;
              return (
                <div key={q.title} className="os-panel flex flex-col justify-between gap-5 rounded-3xl p-7">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between">
                      <span className="os-mono rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#ff99cc]">
                        {q.rarity}
                      </span>
                      {q.locked ? <Lock className="h-5 w-5 text-slate-600" /> : <Icon className="h-5 w-5 text-[#e6007e]/50" />}
                    </div>
                    <h4 className={`mt-3 text-[1.2rem] font-extrabold ${q.locked ? 'text-white/50' : 'text-white'}`}>{q.title}</h4>
                    <p className={`mt-1 text-xs leading-relaxed ${q.locked ? 'text-slate-500' : 'text-slate-400'}`}>{q.desc}</p>
                  </div>
                  <div className="flex flex-col gap-2 border-t border-white/8 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="os-mono text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{q.target}</span>
                      <span className="os-mono rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-black text-[#ff99cc]">{q.badge}</span>
                    </div>
                    {q.note && <p className="os-mono text-[9px] font-bold italic text-[#e6007e]">{q.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      ) : (
        <Suspense fallback={<div className="h-screen" />}>
          <QuestPlatformer />
        </Suspense>
      )}

      {/* ======================= 08 · VAULT ======================= */}
      <Section>
        <div className="mb-16 flex flex-col items-center gap-3 text-center">
          <SectionTag index="// 08" label="The Archive" />
          <h2 data-fly="floor" className="text-3xl font-black tracking-tight text-white sm:text-5xl">The Cube Vault</h2>
          <p data-fly="floor" className="max-w-2xl font-medium leading-relaxed text-slate-400">
            Every project becomes part of the Cube Vault — a permanent archive of everything Cubes create. Some of it may become future Iceberg products.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {vaultItems.map((item, idx) => (
            <TiltCard
              key={idx}
              max={14}
              data-fly={idx % 2 === 0 ? 'floor' : 'deep'}
              data-fly-delay={((idx % 5) * 0.06).toFixed(2)}
              data-fly-frame
              className="os-panel os-panel-hover rounded-3xl p-8"
            >
              <div className="os-mono text-[0.7rem] font-bold tracking-widest text-[#ff99cc]">VAULT · {item.num}</div>
              <h4 className="mt-2 text-[1.1rem] font-bold text-white">{item.title}</h4>
              <p className="os-mono mt-1 text-[11px] text-slate-500">Permanently archived.</p>
            </TiltCard>
          ))}
        </div>
      </Section>

      {/* ======================= 09 · FELLOWSHIP ======================= */}
      <section id="fellowship" className="os-hairline os-grid-bg relative overflow-hidden py-28 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[820px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(230,0,126,0.28),transparent_65%)] blur-3xl" />
        <div className="os-stage relative z-10 mx-auto flex max-w-[1180px] flex-col items-center gap-6 px-6">
          <SectionTag index="// 09" label="The Highest Recognition" />
          <div className="float-drift grid h-[120px] w-[120px] place-items-center rounded-[30px] bg-gradient-to-tr from-[#e6007e] via-[#ff4da6] to-[#ff99cc] text-white shadow-[0_0_80px_rgba(230,0,126,0.65)]">
            <Award className="h-[56px] w-[56px]" />
          </div>
          <h2 data-fly="floor" className="mx-auto max-w-[760px] text-3xl font-black text-white sm:text-6xl">The Iceberg Fellowship</h2>
          <p data-fly="floor" className="mx-auto max-w-[540px] text-lg font-semibold text-slate-400">Reserved for exceptional contributors. Few people achieve it.</p>
          <p data-fly="floor" className="mx-auto -mt-3 max-w-[540px] text-lg font-semibold text-slate-400">Those who do become lifelong members of our community.</p>
          <div data-fly="floor" className="mt-6 flex flex-wrap justify-center gap-3">
            {['Lifelong membership', 'Direct mentorship', 'A permanent seat at the table'].map((p) => (
              <span key={p} className="os-mono rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-slate-200 backdrop-blur-md">
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= 10 · NETWORK ======================= */}
      <Section>
        <div className="mb-16 flex flex-col items-center gap-3 text-center">
          <SectionTag index="// 10" label="The Network" />
          <h2 data-fly="floor" className="text-3xl font-black tracking-tight text-white sm:text-5xl">The Cube Network</h2>
          <p data-fly="floor" className="max-w-2xl font-medium leading-relaxed text-slate-400">
            Once a Cube, always a Cube. The network never closes — it only grows.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-[50px] md:grid-cols-2">
          <div className="flex flex-col gap-3.5">
            {['Current Cubes', 'Former Cubes', 'Mentors', 'Iceberg Team Members', 'Future Employers', 'Future Founders'].map((node, i) => (
              <div
                key={i}
                data-fly="left"
                data-fly-delay={(i * 0.06).toFixed(2)}
                data-fly-frame
                className="os-panel os-panel-hover flex items-center gap-4 rounded-2xl p-5 font-bold text-slate-100 hover:translate-x-2"
              >
                <span className="h-3 w-3 rounded-full bg-gradient-to-tr from-[#e6007e] to-[#ff99cc] shadow-[0_0_10px_rgba(230,0,126,0.6)]" />
                <span>{node}</span>
              </div>
            ))}
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[460px]">
            {reducedMotion ? (
              <svg viewBox="0 0 400 400" className="h-full w-full">
                <defs>
                  <radialGradient id="netgrad">
                    <stop offset="0%" stopColor="#ff4da6" />
                    <stop offset="100%" stopColor="#e6007e" />
                  </radialGradient>
                </defs>
                {pts.map((p, i) => (
                  <React.Fragment key={i}>
                    <line x1={p[0]} y1={p[1]} x2={cx} y2={cy} className="stroke-[#e6007e] stroke-[1.2] opacity-30" />
                    <line x1={p[0]} y1={p[1]} x2={pts[(i + 1) % N][0]} y2={pts[(i + 1) % N][1]} className="stroke-[#e6007e] stroke-[1.2] opacity-30" />
                  </React.Fragment>
                ))}
                <circle cx={cx} cy={cy} r={26} fill="url(#netgrad)" />
                <text x={cx} y={cy + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">X</text>
                {pts.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r={13} className="fill-white stroke-[#e6007e] stroke-[1.6]" />
                ))}
              </svg>
            ) : (
              <InViewMount className="absolute inset-0">
                <Suspense fallback={null}>
                  <NetworkOrb />
                </Suspense>
              </InViewMount>
            )}
          </div>
        </div>
      </Section>

      {/* ======================= SIGNAL · VISION ======================= */}
      <section className="os-hairline os-grid-bg relative overflow-hidden py-32 text-center">
        <div className="os-aurora pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[1000px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(230,0,126,0.3),rgba(0,240,255,0.12),transparent_70%)] blur-3xl" />
        <div className="os-stage relative z-10 mx-auto flex max-w-[900px] flex-col gap-6 px-6">
          <SectionTag index="// signal" label="Broadcast" />
          <h2 data-fly="deep" className="grad-text text-3xl font-black leading-tight sm:text-6xl">
            We're not building interns.
            <br />
            We're building innovators.
          </h2>
          <p data-fly="floor" className="mx-auto mt-2 max-w-[620px] text-lg leading-relaxed text-slate-300">
            Some Cubes will become engineers. Some will become founders. Some will become leaders. Some may eventually join Iceberg Digital.{' '}
            <strong className="font-bold text-white">Every Cube will leave with experience, confidence, skills, and proof that they built something real.</strong>
          </p>
        </div>
      </section>

      {/* ======================= TRANSMISSION · QUOTE ======================= */}
      <Section>
        <div className="mx-auto flex max-w-[880px] flex-col items-center gap-6 text-center">
          <SectionTag index="// transmission" label="Founder" />
          <span className="os-mono select-none text-7xl font-black text-[#e6007e]/25">"</span>
          <blockquote data-fly="floor" className="text-2xl font-bold italic leading-relaxed tracking-tight text-slate-100 sm:text-3xl">
            The agencies that survive the next decade won't be the ones that hired the most people. They'll be the ones that built the smartest system — and freed their people to do the one thing intelligence cannot replace.
          </blockquote>
          <div className="os-mono mt-4 text-sm uppercase tracking-wide text-slate-500">
            <strong className="text-[#ff4da6]">Mark Burgess</strong> · CEO, Iceberg Digital
          </div>
        </div>
      </Section>

      {/* ======================= 11 · TESTIMONIALS ======================= */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="os-hairline os-grid-bg relative overflow-hidden py-28">
          <div className="os-stage mx-auto mb-12 max-w-[1180px] px-6">
            <div data-fly="floor" className="mx-auto flex max-w-[600px] flex-col items-center gap-3 text-center">
              <SectionTag index="// 11" label="Fellowship Success" />
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">What Our Cubes Say</h2>
              <p className="text-sm leading-relaxed text-slate-400">
                Hear from developers who transformed their research prototypes into working systems.
              </p>
            </div>
          </div>

          <div className="marquee-mask flex w-full flex-col gap-6 py-4">
            <div className="animate-marquee-left">
              {[...testimonials, ...testimonials].map((t: any, idx: number) => testimonialCard(t, `${t.id}-r1-${idx}`))}
            </div>
            {testimonials.length > 2 && (
              <div className="animate-marquee-right">
                {[...testimonials.slice(1), ...testimonials, ...testimonials.slice(0, 1)].map((t: any, idx: number) =>
                  testimonialCard(t, `${t.id}-r2-${idx}`),
                )}
              </div>
            )}
          </div>

          {selectedTestimonial && (
            <div
              className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
              onClick={() => setSelectedTestimonial(null)}
            >
              <div
                className="os-panel relative flex w-full max-w-[500px] flex-col gap-6 rounded-3xl p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setSelectedTestimonial(null)}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex flex-col gap-4">
                  <Quote className="h-10 w-10 text-[#e6007e]/40" />
                  <p className="text-sm font-medium italic leading-relaxed text-slate-200 sm:text-base">
                    "{selectedTestimonial.content}"
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-white/8 pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e6007e]/30 bg-[#e6007e]/10 text-sm font-extrabold text-[#ff99cc]">
                    {selectedTestimonial.cube?.user?.name ? selectedTestimonial.cube.user.name[0] : 'C'}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold leading-tight text-white">
                      {selectedTestimonial.cube?.user?.name || 'Anonymous Cube'}
                    </h4>
                    <p className="os-mono mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Cube #{selectedTestimonial.cube?.cube_number || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ======================= EXEC · APPLY ======================= */}
      <Section id="apply">
        <div className="grid grid-cols-1 items-start gap-[60px] md:grid-cols-2">
          <div data-fly="left" className="flex flex-col gap-6">
            <SectionTag index="// exec" label="Applications Open" />
            <h2 className="text-3xl font-black leading-tight text-white sm:text-5xl">
              Ready to become a <span className="grad-text">Cube</span>?
            </h2>
            <p className="text-lg leading-relaxed text-slate-400">
              This isn't a placement. It's the start of something you'll carry for the rest of your career.
            </p>
            <div className="os-panel os-bracket relative flex flex-col gap-2 overflow-hidden rounded-3xl p-6">
              <span className="os-mono mb-2 block text-xs font-bold uppercase tracking-widest text-[#ff99cc]">Active Cohorts</span>
              <p className="text-sm leading-relaxed text-slate-400">
                Although the inaugural Founding Cube cohort is closed, new active cohorts join the portal regularly to collaborate on production systems.
              </p>
            </div>
          </div>

          <div data-fly="right" className="os-panel os-panel-hover w-full rounded-[2rem] p-8 sm:p-10">
            {formSuccess ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-gradient-to-tr from-[#e6007e] via-[#ff4da6] to-[#ff99cc] text-white shadow-[0_0_40px_rgba(230,0,126,0.5)]">
                  <Check className="h-8 w-8 stroke-[2.4]" />
                </div>
                <h3 className="text-2xl font-black text-white">Application received.</h3>
                <p className="mt-2 max-w-[340px] font-medium leading-relaxed text-slate-400">
                  Your application has been logged. We will be in touch regarding upcoming cohort selections — keep building in the meantime!
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                {formError && (
                  <div className="flex items-center gap-2.5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                    <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-name" className="os-mono pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Name</label>
                  <input id="f-name" type="text" required placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} disabled={formSubmitting} className="os-input" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-email" className="os-mono pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <input id="f-email" type="email" required placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={formSubmitting} className="os-input" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="f-uni" className="os-mono pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">School / University</label>
                    <input id="f-uni" type="text" required placeholder="e.g. Stanford University or Science High School" value={university} onChange={(e) => setUniversity(e.target.value)} disabled={formSubmitting} className="os-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="f-deg" className="os-mono pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Major / Grade</label>
                    <input id="f-deg" type="text" required placeholder="e.g. Computer Science or 11th Grade" value={degree} onChange={(e) => setDegree(e.target.value)} disabled={formSubmitting} className="os-input" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-year" className="os-mono pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Year / Grade Level</label>
                  <input id="f-year" type="text" required placeholder="e.g. 11th Grade, Sophomore, Final Year" value={yearOfStudy} onChange={(e) => setYearOfStudy(e.target.value)} disabled={formSubmitting} className="os-input" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-why" className="os-mono pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Why do you want to become a Cube?</label>
                  <textarea id="f-why" required placeholder="Tell us what you'd build given the chance…" value={whyJoin} onChange={(e) => setWhyJoin(e.target.value)} disabled={formSubmitting} rows={4} className="os-input min-h-[110px] resize-y" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="f-li" className="os-mono pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">LinkedIn</label>
                    <input id="f-li" type="url" placeholder="linkedin.com/in/…" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} disabled={formSubmitting} className="os-input" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="f-gh" className="os-mono pl-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">Portfolio / GitHub</label>
                    <input id="f-gh" type="url" placeholder="github.com/…" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} disabled={formSubmitting} className="os-input" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="glow-magenta mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e6007e] py-4 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-[#ff4da6] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-75"
                >
                  {formSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    'Submit Application →'
                  )}
                </button>
                <p className="os-mono mt-2 text-center text-[0.72rem] font-medium text-slate-500">
                  We review every application personally. Fellowship cohort places are limited.
                </p>
              </form>
            )}
          </div>
        </div>
      </Section>

      {/* ======================= FOOTER ======================= */}
      <footer className="os-hairline os-grid-bg relative overflow-hidden border-t border-white/8 py-16 sm:py-20">
        <div className="mx-auto max-w-[1180px] px-6">
          <div className="grid grid-cols-1 items-center gap-8 border-b border-white/10 pb-10 lg:grid-cols-[minmax(0,520px)_minmax(260px,1fr)] lg:gap-12">
            <div className="flex flex-col gap-4">
              <a href="#top" className="w-fit overflow-hidden rounded-[22px] border border-white/10 bg-[#0d0b12]" aria-label="Iceberg X home">
                <img src="/images/iceberg-x-logo-blackbg.png" alt="Iceberg X Logo" className="block h-[130px] w-[min(480px,100%)] object-cover" />
              </a>
              <p className="os-mono text-[11px] font-medium text-slate-500">© {new Date().getFullYear()} Iceberg Digital. All rights reserved.</p>
            </div>
            <div className="os-mono flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider text-slate-400 lg:flex-col lg:gap-4 lg:justify-self-end lg:text-right">
              <a href="#what" className="transition-colors hover:text-[#ff4da6]">The Programme</a>
              <a href="#work" className="transition-colors hover:text-[#ff4da6]">Missions</a>
              <a href="#pipeline" className="transition-colors hover:text-[#ff4da6]">Pipeline</a>
              <a href="#journey" className="transition-colors hover:text-[#ff4da6]">Journey</a>
              <a href="#fellowship" className="transition-colors hover:text-[#ff4da6]">Fellowship</a>
              <a href="#apply" className="transition-colors hover:text-[#ff4da6]">Apply</a>
            </div>
          </div>
          <div className="os-mono mt-8 flex flex-wrap items-center justify-end gap-4 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <span className="text-[#e6007e]">▶</span>
            <span>Building the Next Generation of Innovators</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
