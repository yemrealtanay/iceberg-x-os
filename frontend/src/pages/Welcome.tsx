import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Check, ShieldAlert, Sparkles, Award, ArrowDown, Users, HelpCircle, Archive, Globe, Quote } from 'lucide-react';

export const Welcome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

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

  useEffect(() => {
    // Loader timeout
    const loaderTimer = setTimeout(() => setLoading(false), 650);

    // Scroll listener
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setScrolled(window.scrollY > 30);
    };
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
    .welcome-body {
      background: #f6f6f8;
      color: #111111;
      font-family: 'Inter', system-ui, sans-serif;
      overflow-x: hidden;
      line-height: 1.7;
    }
    .hero-bg {
      background:
        radial-gradient(1100px 600px at 78% 8%, rgba(255, 77, 166, 0.13), transparent 60%),
        radial-gradient(900px 500px at 8% 90%, rgba(224, 242, 254, 0.7), transparent 55%),
        #f6f6f8;
    }
    .welcome-grad-text {
      background: linear-gradient(120deg, #e6007e 0%, #ff4da6 50%, #ff99cc 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .floaty-cube-1 {
      top: 6%; left: 4%;
      animation: floatyAnim 7s cubic-bezier(.22,1,.36,1) infinite;
    }
    .floaty-cube-2 {
      top: 34%; right: 0;
      transform: scale(1.08);
      animation: floatyAnim2 8.5s cubic-bezier(.22,1,.36,1) infinite .6s;
      z-index: 3;
    }
    .floaty-cube-3 {
      bottom: 2%; left: 16%;
      animation: floatyAnim 7.8s cubic-bezier(.22,1,.36,1) infinite 1.2s;
    }
    @keyframes floatyAnim {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-22px); }
    }
    @keyframes floatyAnim2 {
      0%, 100% { transform: translateY(0) scale(1.08); }
      50% { transform: translateY(-26px) scale(1.08); }
    }
    .gold-card-bg {
      background: linear-gradient(165deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
      border: 1px solid rgba(201, 162, 39, 0.4);
      position: relative;
    }
    .gold-card-bg::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 1.5rem;
      padding: 1px;
      background: linear-gradient(135deg, #f3d27a, transparent 40%, transparent 60%, #c9a227);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      opacity: .7;
    }
    .gold-text {
      background: linear-gradient(120deg, #f3d27a, #c9a227);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .vault-sec-bg {
      background: linear-gradient(180deg, #0c0c0e, #161618);
    }
    .vault-sec-bg::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
      background-size: 46px 46px;
      mask: radial-gradient(circle at 50% 40%, #000, transparent 75%);
    }
    .crest-spin {
      animation: floatyAnim 6s cubic-bezier(.22,1,.36,1) infinite;
    }
    .scarcity-box {
      background: linear-gradient(165deg, #1a0010, #111);
    }
    .form-success-icon {
      background: linear-gradient(120deg, #e6007e 0%, #ff4da6 50%, #ff99cc 100%);
    }
    .brand-logo-crop {
      width: min(480px, 100%);
      height: clamp(130px, 14vw, 180px);
      overflow: hidden;
      border-radius: 22px;
      background: #171719;
    }
    .brand-logo-crop img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
    }
  `;

  // Static items for grid builds
  const workCategories = [
    { type: 'ai', title: 'AI Research', desc: 'Explore and apply frontier intelligence to real problems.' },
    { type: 'auto', title: 'Automation Experiments', desc: 'Replace manual workflows with systems that never sleep.' },
    { type: 'api', title: 'API Integrations', desc: 'Connect the disconnected. Make tools talk to each other.' },
    { type: 'prod', title: 'Product Concepts', desc: 'Shape ideas that could become real Iceberg products.' },
    { type: 'ux', title: 'UX Improvements', desc: 'Refine the moments where intelligence meets people.' },
    { type: 'tools', title: 'Internal Tools', desc: 'Build the systems the Iceberg team uses every day.' },
    { type: 'proto', title: 'Prototype Development', desc: 'Turn a thought into something that actually runs.' },
    { type: 'future', title: 'Future Technologies', desc: 'Work on the things that don\'t exist yet.' },
  ];

  const journeySteps = [
    { title: 'Cube', desc: 'Where every journey begins.' },
    { title: 'Senior Cube', desc: 'Trusted with bigger problems.' },
    { title: 'Lead Cube', desc: 'Leads projects and other Cubes.' },
    { title: 'Cube Mentor', desc: 'Guides the next generation.' },
    { title: 'Iceberg Fellow', desc: 'The highest recognition there is.', peak: true },
  ];

  const badges = [
    { icon: 'build', title: 'Builder', desc: 'Created a working prototype.' },
    { icon: 'inno', title: 'Innovator', desc: 'Created an original idea.' },
    { icon: 'collab', title: 'Collaborator', desc: 'Exceptional teamwork.' },
    { icon: 'path', title: 'Pathfinder', desc: 'Solved a difficult challenge.' },
    { icon: 'pioneer', title: 'Pioneer', desc: 'Work influenced a real Iceberg product.' },
  ];

  const vaultItems = [
    { num: '01', title: 'Ideas' },
    { num: '02', title: 'Research' },
    { num: '03', title: 'Experiments' },
    { num: '04', title: 'Prototypes' },
    { num: '05', title: 'Discoveries' },
  ];

  const hofCategories = [
    { icon: 'f', title: 'Founding Cubes', desc: 'The first cohort — forever first.' },
    { icon: 'p', title: 'Pioneer Award Winners', desc: 'Cubes whose work shaped real products.' },
    { icon: 'm', title: 'Cube Mentors', desc: 'Those who guide the next generation.' },
    { icon: 'fel', title: 'Iceberg Fellows', desc: 'The highest honour on the Wall.' },
  ];

  // Dynamic network SVG render coordinate calculations
  const cx = 200;
  const cy = 200;
  const R = 140;
  const N = 6;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const a = (Math.PI * 2 / N) * i - Math.PI / 2;
    pts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]);
  }

  return (
    <div className="welcome-body relative min-h-screen text-slate-900 bg-[#f6f6f8] selection:bg-[#e6007e] selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: welcomeStyles }} />

      {/* LOADER */}
      {loading && (
        <div id="loader" className="fixed inset-0 z-[999] bg-[#111111] grid place-items-center transition-all duration-700">
          <div className="w-[60px] h-[60px] rounded-[16px] bg-gradient-to-tr from-[#e6007e] via-[#ff4da6] to-[#ff99cc] animate-pulse shadow-[0_0_50px_rgba(230,0,126,0.6)] flex items-center justify-center p-0.5 overflow-hidden">
            <img src="/images/xicon.jpg" alt="Icon" className="w-full h-full object-cover rounded-[14px]" />
          </div>
        </div>
      )}

      {/* NAV */}
      <nav id="nav" className={`fixed top-0 left-0 right-0 z-[100] py-4 transition-all duration-500 ${scrolled ? 'bg-[#f6f6f8]/85 backdrop-blur-md border-b border-black/5 shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-[1200px] mx-auto px-7 flex items-center justify-between gap-8">
          <a href="#top" className="flex items-center hover:opacity-90 transition-opacity">
            <img src="/images/xicon.jpg" alt="Iceberg X" className="w-9 h-9 rounded-xl object-cover shadow-md border border-gray-100 shrink-0" />
          </a>
          <div className="hidden md:flex gap-6 lg:gap-8 items-center text-[0.82rem] lg:text-[0.88rem] font-bold text-slate-800 whitespace-nowrap">
            <a href="#what" className="hover:text-[#e6007e] transition-colors leading-none">The Programme</a>
            <a href="#cube" className="hover:text-[#e6007e] transition-colors leading-none">The Cube</a>
            <a href="#journey" className="hover:text-[#e6007e] transition-colors leading-none">Journey</a>
            <a href="#fellowship" className="hover:text-[#e6007e] transition-colors leading-none">Fellowship</a>
            
            {user ? (
              <Link to="/dashboard" className="px-5 py-2.5 rounded-full bg-[#e6007e] text-white font-bold text-[0.84rem] shadow-[0_12px_30px_-8px_rgba(230,0,126,0.5)] hover:translate-y-[-3px] hover:shadow-[0_20px_44px_-10px_rgba(230,0,126,0.65)] transition-all leading-none">
                Enter Platform
              </Link>
            ) : (
              <Link to="/login" className="px-5 py-2.5 rounded-full bg-white text-slate-900 border border-black/5 font-bold text-[0.84rem] shadow-sm hover:translate-y-[-3px] hover:shadow-lg transition-all leading-none">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 1. HERO */}
      <section className="hero-bg min-h-screen flex items-center pt-[140px] pb-[80px] overflow-hidden" id="top">
        <div className="max-w-[1200px] mx-auto px-7 grid grid-cols-1 lg:grid-cols-2 gap-[60px] items-center w-full">
          <div className="flex flex-col gap-6">
            <span className="text-[#e6007e] text-[0.72rem] font-bold uppercase tracking-[0.18em]">An Elite Technology Fellowship</span>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight">
              Building the Next Generation of <span className="welcome-grad-text">Innovators</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-[520px]">
              Most internships teach you how a company works. <strong className="font-semibold text-slate-900">Our platform gives you the opportunity to prove what you're capable of building.</strong>
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#apply" className="px-7 py-3.5 rounded-full bg-[#e6007e] text-white font-semibold shadow-md shadow-magenta/30 hover:translate-y-[-3px] hover:shadow-lg transition-all">
                Become a Cube →
              </a>
              <a href="#what" className="px-7 py-3.5 rounded-full bg-white text-slate-800 border border-black/5 font-semibold hover:translate-y-[-3px] hover:shadow-md transition-all">
                Learn More
              </a>
            </div>
            
            {/* Meta */}
            <div className="grid grid-cols-3 gap-6 mt-8 border-t border-black/5 pt-8">
              <div>
                <div className="text-2xl font-black text-slate-900">100%</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">Builders, not observers</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">#0XX</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">Permanent Cube number</div>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900">∞</div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-0.5">Once a Cube, always a Cube</div>
              </div>
            </div>
          </div>

          {/* Floating cards visualizer */}
          <div className="relative h-[380px] sm:h-[460px] w-full hidden sm:block">
            <div className="cube-glow"></div>
            <div className="float-cube floaty-cube-1 absolute bg-white border border-black/5 rounded-3xl p-6 shadow-xl w-[210px]" style={{ transform: `translateY(${scrollY * 0.02 * -0.5}px)` }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[0.68rem] text-slate-400 uppercase tracking-widest font-bold">Active Cube</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#e6007e] shadow-md shadow-magenta/40"></span>
              </div>
              <div className="text-3xl font-extrabold">#<span className="text-[#e6007e]">001</span></div>
              <div className="text-xs font-semibold text-slate-500 mt-2">Founding Cube · AI Research</div>
            </div>

            <div className="float-cube floaty-cube-2 absolute bg-white border border-black/5 rounded-3xl p-6 shadow-xl w-[210px]" style={{ transform: `translateY(${scrollY * 0.04 * -0.5}px)` }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[0.68rem] text-slate-400 uppercase tracking-widest font-bold">Active Cube</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#e6007e] shadow-md shadow-magenta/40"></span>
              </div>
              <div className="text-3xl font-extrabold">#<span className="text-[#e6007e]">014</span></div>
              <div className="text-xs font-semibold text-slate-500 mt-2">Prototype Development</div>
            </div>

            <div className="float-cube floaty-cube-3 absolute bg-white border border-black/5 rounded-3xl p-6 shadow-xl w-[210px]" style={{ transform: `translateY(${scrollY * 0.06 * -0.5}px)` }}>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[0.68rem] text-slate-400 uppercase tracking-widest font-bold">Active Cube</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#e6007e] shadow-md shadow-magenta/40"></span>
              </div>
              <div className="text-3xl font-extrabold">#<span className="text-[#e6007e]">072</span></div>
              <div className="text-xs font-semibold text-slate-500 mt-2">Automation Experiments</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PHILOSOPHY */}
      <section className="py-24 bg-white border-t border-black/5" id="what">
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="max-w-[680px] mx-auto text-center mb-16 flex flex-col gap-3">
            <span className="text-[#e6007e] text-xs uppercase font-extrabold tracking-wider">The Philosophy</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-none">This is not a traditional internship.</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Real research and development projects. Real commercial challenges. Real mentors. Real outcomes. Here, participants are builders — not observers.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {/* Traditional Intern */}
            <div className="bg-[#f6f6f8]/50 border border-black/5 rounded-[2rem] p-8 sm:p-10 flex flex-col gap-6">
              <span className="text-xs uppercase tracking-wider font-extrabold text-slate-400">The Old Way</span>
              <h3 className="text-xl font-extrabold text-slate-900">Traditional Internship</h3>
              <ul className="flex flex-col gap-4 text-slate-700 font-semibold mt-2">
                <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-black/5 flex items-center justify-center text-[10px] text-slate-400">○</span> Observe</li>
                <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-black/5 flex items-center justify-center text-[10px] text-slate-400">○</span> Shadow</li>
                <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-black/5 flex items-center justify-center text-[10px] text-slate-400">○</span> Assist</li>
                <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-black/5 flex items-center justify-center text-[10px] text-slate-400">○</span> Learn</li>
              </ul>
            </div>

            {/* VS */}
            <div className="grid place-items-center text-center font-black text-xl text-[#e6007e] py-4 md:py-0">
              <span className="w-[54px] h-[54px] rounded-full bg-white border border-black/5 flex items-center justify-center shadow-sm">vs</span>
            </div>

            {/* The Program */}
            <div className="scarcity-box rounded-[2rem] p-8 sm:p-10 flex flex-col gap-6 text-white shadow-2xl shadow-magenta/20 relative overflow-hidden">
              <div className="absolute top-[-40%] right-[-20%] w-[60%] h-[120%] bg-radial-gradient from-magenta/35 to-transparent blur-xl"></div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-magenta-3 relative z-10">Our Approach</span>
              <h3 className="text-xl font-extrabold relative z-10">The Fellowship</h3>
              <ul className="flex flex-col gap-4 text-white/90 font-semibold mt-2 relative z-10">
                <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-[#e6007e] flex items-center justify-center text-[10px] text-white">→</span> Build</li>
                <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-[#e6007e] flex items-center justify-center text-[10px] text-white">→</span> Experiment</li>
                <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-[#e6007e] flex items-center justify-center text-[10px] text-white">→</span> Prototype</li>
                <li className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-[#e6007e] flex items-center justify-center text-[10px] text-white">→</span> Innovate</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE IDENTITY / CUBE WALL */}
      <section className="py-24 bg-[#f6f6f8]" id="cube">
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="max-w-[680px] mx-auto text-center mb-16 flex flex-col gap-3">
            <span className="text-[#e6007e] text-xs uppercase font-extrabold tracking-wider">The Identity</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-none">Every participant becomes an Ice Cube.</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Cube numbers are permanent. They are never reused. Every Cube becomes part of our history. <strong className="font-semibold text-slate-900">Once a Cube, always a Cube.</strong></p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3">
            {Array.from({ length: 24 }).map((_, idx) => {
              const num = idx + 1;
              const isFounding = num <= 3;
              const cubeNumStr = String(num).padStart(3, '0');
              return (
                <div 
                  key={idx}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border border-black/5 hover:translate-y-[-6px] hover:scale-105 hover:bg-gradient-to-tr hover:from-[#e6007e] hover:to-[#ff99cc] hover:text-white hover:shadow-lg hover:shadow-magenta/40 group ${isFounding ? 'border-[#f3d27a] bg-[#fffdf5]' : 'bg-white'}`}
                >
                  <span className={`text-[9px] font-bold group-hover:text-white/85 ${isFounding ? 'text-[#c9a227]' : 'text-slate-400'}`}>CUBE</span>
                  <span className={`text-[1.15rem] font-black tracking-tight ${isFounding ? 'text-[#c9a227] group-hover:text-white' : 'text-slate-950 group-hover:text-white'}`}>#{cubeNumStr}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. FOUNDING CUBES */}
      <section className="py-24 bg-gradient-to-b from-[#0f0c05] to-[#1a1305] text-white">
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="max-w-[680px] mx-auto text-center mb-16 flex flex-col gap-3">
            <span className="text-[#f3d27a] text-xs uppercase font-extrabold tracking-wider">The First Cohort</span>
            <h2 className="text-3xl sm:text-5xl font-black leading-none">The Founding Cubes</h2>
            <p className="text-white/60 font-medium leading-relaxed">The first cohort will become the Founding Cubes. Their numbers will forever represent the beginning of this portal. This status can never be earned again.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="gold-card-bg rounded-[2rem] p-8 sm:p-10 flex flex-col gap-4 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-[#c9a227]/25 transition-all">
                <div className="text-[0.7rem] text-[#f3d27a] font-bold uppercase tracking-widest flex items-center gap-2">◆ Founding Cube</div>
                <div className="text-4xl font-extrabold gold-text">#00{num}</div>
                <div className="text-sm text-white/55 font-medium">
                  {num === 1 ? 'The very first. Where it all begins.' : num === 2 ? 'A permanent place in our history.' : 'A status that can never be earned again.'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHAT WILL YOU WORK ON */}
      <section className="py-24 bg-white border-b border-black/5">
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="max-w-[680px] mx-auto text-center mb-16 flex flex-col gap-3">
            <span className="text-[#e6007e] text-xs uppercase font-extrabold tracking-wider">The Work</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-none">What will you work on?</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Real projects with real stakes — the kind that shape products, not slide decks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workCategories.map((cat, idx) => (
              <div key={idx} className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm hover:translate-y-[-8px] hover:shadow-lg transition-all flex flex-col gap-4">
                <div className="w-[50px] h-[50px] rounded-xl bg-gradient-to-br from-[#e6007e]/10 to-[#e0f2fe]/70 flex items-center justify-center text-[#e6007e]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-[1.12rem]">{cat.title}</h4>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CUBE JOURNEY */}
      <section className="py-24 bg-[#f6f6f8]" id="journey">
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="max-w-[680px] mx-auto text-center mb-16 flex flex-col gap-3">
            <span className="text-[#e6007e] text-xs uppercase font-extrabold tracking-wider">Growth & Leadership</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-none">The Cube Journey</h2>
            <p className="text-slate-500 font-medium leading-relaxed">This program is built to create growth and leadership opportunities — not a fixed-term placement.</p>
          </div>

          <div className="max-w-[560px] mx-auto flex flex-col gap-4">
            {journeySteps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className={`flex items-center gap-6 border border-black/5 rounded-3xl p-6 shadow-sm hover:translate-x-2 hover:shadow-lg transition-all ${step.peak ? 'bg-gradient-to-tr from-[#e6007e] to-[#ff99cc] text-white' : 'bg-white'}`}>
                  <div className={`w-[46px] h-[46px] rounded-xl font-extrabold flex items-center justify-center ${step.peak ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'}`}>{idx + 1}</div>
                  <div>
                    <h4 className={`font-black text-[1.15rem] ${step.peak ? 'text-white' : 'text-slate-900'}`}>{step.title}</h4>
                    <p className={`text-xs ${step.peak ? 'text-white/80' : 'text-slate-500'}`}>{step.desc}</p>
                  </div>
                </div>
                {idx < journeySteps.length - 1 && (
                  <div className="flex items-center justify-center py-1 text-[#e6007e] opacity-40">
                    <ArrowDown className="w-5 h-5" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RECOGNITION & ACHIEVEMENTS */}
      <section className="py-24 bg-white border-b border-black/5">
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="max-w-[680px] mx-auto text-center mb-16 flex flex-col gap-3">
            <span className="text-[#e6007e] text-xs uppercase font-extrabold tracking-wider">Recognition & Achievements</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-none">Earn your place. Earn your badge.</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Achievement is recognised, recorded, and remembered. Every badge marks something you actually did.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {badges.map((badge, idx) => (
              <div key={idx} className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm hover:translate-y-[-8px] hover:shadow-lg transition-all text-center flex flex-col gap-3">
                <div className="w-[66px] h-[66px] mx-auto rounded-full bg-gradient-to-br from-[#e6007e] via-[#ff4da6] to-[#ff99cc] flex items-center justify-center text-white shadow-md shadow-magenta/30">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-[1.05rem] text-slate-950 mt-2">{badge.title}</h4>
                <p className="text-slate-500 text-[11px] font-semibold leading-relaxed">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. THE CUBE VAULT */}
      <section className="py-24 vault-sec-bg text-white relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-7 relative z-10">
          <div className="max-w-[680px] mx-auto text-center mb-16 flex flex-col gap-3">
            <span className="text-[#ff99cc] text-xs uppercase font-extrabold tracking-wider">The Archive</span>
            <h2 className="text-3xl sm:text-5xl font-black leading-none">The Cube Vault</h2>
            <p className="text-white/60 font-medium leading-relaxed">Every project becomes part of the Cube Vault — a permanent archive of everything Cubes create. Some of it may become future Iceberg products.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {vaultItems.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:translate-y-[-8px] hover:border-magenta hover:bg-[#e6007e]/10 transition-all">
                <div className="text-[0.7rem] text-[#ff99cc] font-bold tracking-widest">VAULT · {item.num}</div>
                <h4 className="text-[1.1rem] font-bold mt-2 text-white">{item.title}</h4>
                <p className="text-[11px] text-white/50 mt-1">Permanently archived.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. THE CUBE WALL / HALL OF FAME */}
      <section className="py-24 bg-[#f6f6f8]">
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="max-w-[680px] mx-auto text-center mb-16 flex flex-col gap-3">
            <span className="text-[#e6007e] text-xs uppercase font-extrabold tracking-wider">Hall of Fame</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-none">The Cube Wall</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Every Cube receives a permanent place on the Cube Wall. A living record of the people who built this platform.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hofCategories.map((item, idx) => (
              <div key={idx} className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm hover:translate-y-[-8px] hover:shadow-lg transition-all flex flex-col gap-4">
                <div className="w-[44px] h-[44px] rounded-xl bg-slate-100 flex items-center justify-center text-[#e6007e]">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-[1.08rem] text-slate-900">{item.title}</h4>
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. THE ICEBERG FELLOWSHIP */}
      <section className="py-24 bg-gradient-to-b from-[#120009] to-[#0a0006] text-white text-center relative overflow-hidden" id="fellowship">
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-radial from-[#e6007e]/30 to-transparent blur-3xl"></div>
        <div className="max-w-[1200px] mx-auto px-7 relative z-10 flex flex-col gap-6">
          <div className="crest-spin w-[120px] h-[120px] mx-auto rounded-[30px] bg-gradient-to-tr from-[#e6007e] via-[#ff4da6] to-[#ff99cc] grid place-items-center text-white shadow-[0_0_80px_rgba(230,0,126,0.6)]">
            <Award className="w-[56px] h-[56px]" />
          </div>
          <span className="text-[#ff99cc] text-xs uppercase font-extrabold tracking-widest mt-4">The Highest Recognition</span>
          <h2 className="text-3xl sm:text-6xl font-black max-w-[760px] mx-auto">The Iceberg Fellowship</h2>
          <p className="text-white/60 font-semibold text-lg max-w-[540px] mx-auto">Reserved for exceptional contributors. Few people achieve it.</p>
          <p className="text-white/60 font-semibold text-lg max-w-[540px] mx-auto -mt-3">Those who do become lifelong members of our community.</p>
          
          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            <span className="text-xs px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/90">Lifelong membership</span>
            <span className="text-xs px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/90">Direct mentorship</span>
            <span className="text-xs px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/90">A permanent seat at the table</span>
          </div>
        </div>
      </section>

      {/* 11. THE CUBE NETWORK */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="max-w-[680px] mx-auto text-center mb-16 flex flex-col gap-3">
            <span className="text-[#e6007e] text-xs uppercase font-extrabold tracking-wider">The Network</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-none">The Cube Network</h2>
            <p className="text-slate-500 font-medium leading-relaxed">Once a Cube, always a Cube. The network never closes — it only grows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[50px] items-center">
            <div className="flex flex-col gap-4">
              {['Current Cubes', 'Former Cubes', 'Mentors', 'Iceberg Team Members', 'Future Employers', 'Future Founders'].map((node, i) => (
                <div key={i} className="flex items-center gap-4 bg-white border border-black/5 rounded-3xl p-5 shadow-sm hover:translate-x-2 hover:shadow-lg transition-all font-bold text-slate-800">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-tr from-[#e6007e] to-[#ff99cc] shadow-md shadow-magenta/40"></span>
                  <span>{node}</span>
                </div>
              ))}
            </div>

            {/* SVG Network Visualizer */}
            <div className="aspect-square max-w-[460px] mx-auto w-full relative">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <defs>
                  <radialGradient id="netgrad">
                    <stop offset="0%" stopColor="#ff4da6" />
                    <stop offset="100%" stopColor="#e6007e" />
                  </radialGradient>
                </defs>
                {pts.map((p, i) => (
                  <React.Fragment key={i}>
                    <line x1={p[0]} y1={p[1]} x2={cx} y2={cy} className="stroke-[#e6007e] stroke-[1.2] opacity-25" />
                    <line x1={p[0]} y1={p[1]} x2={pts[(i + 1) % N][0]} y2={pts[(i + 1) % N][1]} className="stroke-[#e6007e] stroke-[1.2] opacity-25" />
                  </React.Fragment>
                ))}
                <circle cx={cx} cy={cy} r={26} fill="url(#netgrad)" />
                <text x={cx} y={cy + 5} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="700">X</text>
                {pts.map((p, i) => (
                  <circle 
                    key={i} 
                    cx={p[0]} 
                    cy={p[1]} 
                    r={13} 
                    className="fill-white stroke-[#e6007e] stroke-[1.6]" 
                    style={{ animation: `floatyAnim ${5 + i * 0.4}s ease-in-out ${i * 0.3}s infinite` }}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 12. VISION / BRAND */}
      <section className="py-24 bg-gradient-to-tr from-[#e6007e] via-[#ff4da6] to-[#ff99cc] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-white/25 to-transparent blur-lg"></div>
        <div className="max-w-[900px] mx-auto px-7 relative z-10 flex flex-col gap-6">
          <h2 className="text-3xl sm:text-6xl font-black leading-tight">We're not building interns.<br />We're building innovators.</h2>
          <p className="text-white/92 max-w-[620px] mx-auto text-lg leading-relaxed mt-4">
            Some Cubes will become engineers. Some will become founders. Some will become leaders. Some may eventually join Iceberg Digital. <strong className="font-bold text-white">Every Cube will leave with experience, confidence, skills, and proof that they built something real.</strong>
          </p>
        </div>
      </section>

      {/* FOUNDER QUOTE */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="max-w-[880px] mx-auto text-center flex flex-col gap-6">
            <span className="text-[#e6007e] text-7xl font-extrabold opacity-20 block h-10 select-none">"</span>
            <blockquote className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-relaxed italic">
              The agencies that survive the next decade won't be the ones that hired the most people. They'll be the ones that built the smartest system — and freed their people to do the one thing intelligence cannot replace.
            </blockquote>
            <div className="text-slate-500 font-semibold mt-4 text-sm uppercase tracking-wide">
              <strong className="text-[#e6007e]">Mark Burgess</strong> · CEO, Iceberg Digital
            </div>
          </div>
        </div>
      </section>

      {/* 13. APPLICATION CTA */}
      <section className="py-24 bg-gradient-to-b from-white to-[#f6f6f8]" id="apply">
        <div className="max-w-[1200px] mx-auto px-7 grid grid-cols-1 md:grid-cols-2 gap-[60px] items-start">
          <div className="flex flex-col gap-6">
            <span className="text-[#e6007e] text-xs uppercase font-extrabold tracking-wider">Applications Open</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-none">Ready to become a Cube?</h2>
            <p className="text-slate-500 text-lg leading-relaxed">This isn't a placement. It's the start of something you'll carry for the rest of your career.</p>
            
            <div className="scarcity-box rounded-3xl p-8 text-white mt-4 shadow-xl shadow-magenta/30">
              <span className="text-xs uppercase font-bold text-magenta-3 tracking-widest block mb-2">Founding Cohort</span>
              <p className="text-sm text-white/80 leading-relaxed">The first cohort will become the Founding Cubes. Those places will only exist once — and can never be earned again.</p>
            </div>
          </div>

          <div className="w-full bg-white border border-black/5 rounded-[2rem] p-8 sm:p-10 shadow-xl">
            {formSuccess ? (
              <div className="text-center py-10 flex flex-col items-center gap-4">
                <div className="w-[70px] h-[70px] rounded-full form-success-icon flex items-center justify-center text-white shadow-lg shadow-magenta/40">
                  <Check className="w-8 h-8 stroke-[2.4]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Application received.</h3>
                <p className="text-slate-500 font-semibold max-w-[340px] leading-relaxed mt-2">
                  You're in the running for a Founding Cube number. We'll be in touch — keep building in the meantime.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                {formError && (
                  <div className="flex items-center gap-2.5 bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-2xl text-sm font-semibold">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-name" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Name</label>
                  <input 
                    id="f-name" 
                    type="text" 
                    required 
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={formSubmitting}
                    className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-[#f6f6f8] focus:border-[#e6007e] focus:bg-white focus:shadow-md focus:shadow-magenta/5 outline-none font-semibold text-sm transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-email" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Email Address</label>
                  <input 
                    id="f-email" 
                    type="email" 
                    required 
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={formSubmitting}
                    className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-[#f6f6f8] focus:border-[#e6007e] focus:bg-white focus:shadow-md focus:shadow-magenta/5 outline-none font-semibold text-sm transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="f-uni" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">University</label>
                    <input 
                      id="f-uni" 
                      type="text" 
                      required 
                      placeholder="e.g. UCL"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      disabled={formSubmitting}
                      className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-[#f6f6f8] focus:border-[#e6007e] focus:bg-white focus:shadow-md focus:shadow-magenta/5 outline-none font-semibold text-sm transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="f-deg" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Degree</label>
                    <input 
                      id="f-deg" 
                      type="text" 
                      required 
                      placeholder="e.g. Computer Science"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      disabled={formSubmitting}
                      className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-[#f6f6f8] focus:border-[#e6007e] focus:bg-white focus:shadow-md focus:shadow-magenta/5 outline-none font-semibold text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-year" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Year of Study</label>
                  <select 
                    id="f-year" 
                    required 
                    value={yearOfStudy}
                    onChange={(e) => setYearOfStudy(e.target.value)}
                    disabled={formSubmitting}
                    className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-[#f6f6f8] focus:border-[#e6007e] focus:bg-white focus:shadow-md focus:shadow-magenta/5 outline-none font-semibold text-sm transition-all"
                  >
                    <option value="">Select year…</option>
                    <option value="First Year">First Year</option>
                    <option value="Second Year">Second Year</option>
                    <option value="Penultimate Year">Penultimate Year</option>
                    <option value="Final Year">Final Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="f-why" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Why do you want to become a Cube?</label>
                  <textarea 
                    id="f-why" 
                    required 
                    placeholder="Tell us what you'd build given the chance…"
                    value={whyJoin}
                    onChange={(e) => setWhyJoin(e.target.value)}
                    disabled={formSubmitting}
                    rows={4}
                    className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-[#f6f6f8] focus:border-[#e6007e] focus:bg-white focus:shadow-md focus:shadow-magenta/5 outline-none font-semibold text-sm transition-all resize-y min-h-[110px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="f-li" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">LinkedIn</label>
                    <input 
                      id="f-li" 
                      type="url" 
                      placeholder="linkedin.com/in/…"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      disabled={formSubmitting}
                      className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-[#f6f6f8] focus:border-[#e6007e] focus:bg-white focus:shadow-md focus:shadow-magenta/5 outline-none font-semibold text-sm transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="f-gh" className="text-xs font-bold text-slate-600 uppercase tracking-wider pl-1">Portfolio / GitHub</label>
                    <input 
                      id="f-gh" 
                      type="url" 
                      placeholder="github.com/…"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      disabled={formSubmitting}
                      className="w-full px-4 py-3 border border-black/10 rounded-2xl bg-[#f6f6f8] focus:border-[#e6007e] focus:bg-white focus:shadow-md focus:shadow-magenta/5 outline-none font-semibold text-sm transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={formSubmitting}
                  className="w-full py-4 bg-[#e6007e] text-white font-bold text-sm tracking-wide rounded-2xl hover:bg-[#ff4da6] active:scale-[0.98] transition-all shadow-md shadow-magenta/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {formSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    'Submit Application →'
                  )}
                </button>
                <p className="text-slate-400 text-[0.78rem] text-center mt-2 font-semibold">
                  We review every application personally. Founding Cube places are limited.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#111111] text-white/60 py-16 sm:py-20 border-t border-white/5 overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-7">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,520px)_minmax(260px,1fr)] items-center gap-8 lg:gap-12 pb-10 border-b border-white/10">
            <div className="flex flex-col gap-4">
              <a href="#top" className="brand-logo-crop hover:opacity-95 transition-opacity" aria-label="Iceberg X home">
                <img src="/images/iceberg-x-logo-blackbg.png" alt="Iceberg X Logo" />
              </a>
              <p className="text-[11px] text-white/45 font-semibold">© {new Date().getFullYear()} Iceberg Digital. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap lg:flex-col gap-4 lg:gap-5 text-sm font-bold text-white/60 lg:justify-self-end lg:text-right">
              <a href="#what" className="hover:text-white transition-colors">The Programme</a>
              <a href="#cube" className="hover:text-white transition-colors">The Cube</a>
              <a href="#journey" className="hover:text-white transition-colors">Journey</a>
              <a href="#fellowship" className="hover:text-white transition-colors">Fellowship</a>
              <a href="#apply" className="hover:text-white transition-colors">Apply</a>
            </div>
          </div>
          <div className="flex flex-wrap justify-end items-center text-xs mt-8 gap-4 text-white/50">
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-white/70">
              <span className="text-[#e6007e]">▶</span>
              <span>Building the Next Generation of Innovators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
