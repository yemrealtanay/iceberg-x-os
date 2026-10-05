import React from 'react';
import { Trophy, Award, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { BadgeDisc, BadgeSparks } from './BadgeMedal';

export interface QuizScoreBadgeProps {
  score: number;
  badgeName?: string | null;
  rarity?: 'Common' | 'Rare' | 'Epic' | string | null;
  completedAt?: string | Date | null;
  variant?: 'pill' | 'card' | 'spotlight';
  className?: string;
}

export const QuizScoreBadge: React.FC<QuizScoreBadgeProps> = ({
  score,
  badgeName,
  rarity: initialRarity,
  completedAt,
  variant = 'card',
  className = ''
}) => {
  // Infer rarity tier from score if not provided
  let tier: 'Epic' | 'Rare' | 'Common' | 'Basic' = 'Basic';
  if (score >= 90 || initialRarity === 'Epic') {
    tier = 'Epic';
  } else if (score >= 75 || initialRarity === 'Rare') {
    tier = 'Rare';
  } else if (score >= 50 || initialRarity === 'Common') {
    tier = 'Common';
  }

  const title =
    badgeName ||
    (tier === 'Epic'
      ? 'Web Architect'
      : tier === 'Rare'
      ? 'Web Practitioner'
      : tier === 'Common'
      ? 'Web Fundamentals'
      : 'Web Explorer');

  // 1. COMPACT PILL VARIANT (For Directory Cards)
  if (variant === 'pill') {
    if (tier === 'Epic') {
      return (
        <div
          title={`Web Fundamentals Score: ${score}/100 (${title} - Epic Tier)`}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide text-white bg-gradient-to-r from-magenta via-purple-600 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(230,0,126,0.4)] ${className}`}
        >
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950/90 text-white">
            <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
            <span className="font-mono text-cyan-300">{score}/100</span>
            <span className="text-[10px] text-magenta font-extrabold uppercase">EPIC</span>
          </span>
        </div>
      );
    }

    if (tier === 'Rare') {
      return (
        <div
          title={`Web Fundamentals Score: ${score}/100 (${title} - Rare Tier)`}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-600 p-[1.5px] shadow-[0_0_12px_rgba(14,165,233,0.35)] ${className}`}
        >
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-sky-200">
            <Zap className="w-3 h-3 text-cyan-400" />
            <span className="font-mono text-cyan-300">{score}/100</span>
            <span className="text-[10px] text-sky-400 font-extrabold uppercase">RARE</span>
          </span>
        </div>
      );
    }

    if (tier === 'Common') {
      return (
        <div
          title={`Web Fundamentals Score: ${score}/100 (${title} - Common Tier)`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-700 ${className}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span className="font-mono font-extrabold">{score}/100</span>
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Web Fund</span>
        </div>
      );
    }

    return (
      <div
        title={`Web Fundamentals Score: ${score}/100`}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 border border-gray-200 text-gray-500 ${className}`}
      >
        <span className="font-mono">{score}/100</span>
      </div>
    );
  }

  // 2. SPOTLIGHT VARIANT (Large Hero Card for Profiles)
  if (variant === 'spotlight') {
    if (tier === 'Epic') {
      return (
        <div className={`relative overflow-hidden rounded-3xl badge-frame-epic shadow-2xl ${className}`}>
          <span className="badge-sheen" />
          <BadgeSparks />
          <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-magenta via-purple-600 to-cyan-400 p-[2px] shadow-[0_0_30px_rgba(230,0,126,0.6)] shrink-0">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="badge-pill-epic text-[10px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full text-white">
                    EPIC MASTERY
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">100-POINT CERTIFICATION</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
                  Demonstrated top-tier architectural mastery of web protocols, performance, and backend systems.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 pl-4 border-l border-white/10">
              <div className="font-mono text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-magenta to-pink-300">
                {score}<span className="text-xl sm:text-2xl text-slate-400 font-normal">/100</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                EXAM SCORE
              </span>
              {completedAt && (
                <span className="text-[10px] font-mono text-slate-400 mt-1">
                  Certified: {new Date(completedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (tier === 'Rare') {
      return (
        <div
          className={`relative overflow-hidden rounded-3xl p-[2px] bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-600 shadow-xl ${className}`}
        >
          <div className="relative rounded-[22px] bg-slate-950 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-600 p-[2px] shadow-[0_0_20px_rgba(14,165,233,0.5)] shrink-0">
                <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center">
                  <Award className="w-8 h-8 text-cyan-300" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="bg-sky-500/20 border border-sky-400/40 text-[10px] font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full text-sky-300">
                    RARE PRACTITIONER
                  </span>
                  <span className="text-xs font-mono text-slate-400">WEB FUNDAMENTALS</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">{title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
                  Demonstrated deep technical fluency across client-server architecture, security, and databases.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 pl-4 border-l border-slate-800">
              <div className="font-mono text-4xl sm:text-5xl font-black text-cyan-400">
                {score}<span className="text-xl sm:text-2xl text-slate-500 font-normal">/100</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-1">
                EXAM SCORE
              </span>
              {completedAt && (
                <span className="text-[10px] font-mono text-slate-400 mt-1">
                  Certified: {new Date(completedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${className}`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-magenta" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-slate-100 border border-slate-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-slate-600">
                COMMON CERTIFIED
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Successfully completed the Web Fundamentals Crash Course and Quiz.</p>
          </div>
        </div>

        <div className="flex flex-col items-end shrink-0 pl-4 border-l border-gray-100">
          <div className="font-mono text-3xl font-extrabold text-gray-900">
            {score}<span className="text-lg text-gray-400 font-normal">/100</span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mt-0.5">
            EXAM SCORE
          </span>
        </div>
      </div>
    );
  }

  // 3. STANDARD CARD VARIANT (For Badges Grid)
  if (tier === 'Epic') {
    return (
      <div className={`group relative badge-frame-epic rounded-2xl shadow-xl transition-transform hover:-translate-y-1 ${className}`}>
        <span className="badge-sheen" />
        <BadgeSparks />
        <div className="relative z-10 p-5 rounded-2xl bg-slate-950/90 text-white flex flex-col justify-between h-full gap-4">
          <div className="flex items-start justify-between gap-3">
            <BadgeDisc icon="TechScout" rarity="Epic" size="md" />
            <span className="badge-pill-epic text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full text-white">
              EPIC {score}/100
            </span>
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-cyan-300">
              {title}
            </h4>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              Certified with {score}/100 mastery score in Web Fundamentals.
            </p>
          </div>
          {completedAt && (
            <div className="pt-2 border-t border-white/10 text-[10px] font-mono text-cyan-300/80">
              {new Date(completedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (tier === 'Rare') {
    return (
      <div className={`p-[1.5px] rounded-2xl bg-gradient-to-br from-sky-400 via-cyan-400 to-blue-600 shadow-md transition-transform hover:-translate-y-0.5 ${className}`}>
        <div className="p-5 rounded-[calc(1rem-1.5px)] bg-slate-900 text-white flex flex-col justify-between h-full gap-4">
          <div className="flex items-start justify-between gap-3">
            <BadgeDisc icon="TechScout" rarity="Rare" size="md" />
            <span className="bg-sky-500/20 text-sky-300 border border-sky-400/40 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
              RARE {score}/100
            </span>
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">{title}</h4>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
              Certified with {score}/100 in Web Fundamentals.
            </p>
          </div>
          {completedAt && (
            <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
              {new Date(completedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-subtle flex flex-col justify-between h-full gap-4 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <BadgeDisc icon="TechScout" rarity="Common" size="md" />
        <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-mono">
          {score}/100
        </span>
      </div>
      <div>
        <h4 className="font-bold text-sm text-gray-900">{title}</h4>
        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
          Certified with {score}/100 in Web Fundamentals.
        </p>
      </div>
      {completedAt && (
        <div className="pt-2 border-t border-gray-100 text-[10px] font-mono text-gray-400">
          {new Date(completedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
};
