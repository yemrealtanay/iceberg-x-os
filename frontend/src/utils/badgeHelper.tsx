import React from 'react';
import {
  Hammer,
  Lightbulb,
  Users,
  Compass,
  Flag,
  Search,
  ShieldAlert,
  Eye,
  Layers,
  AlertTriangle,
  Play,
  CheckCircle,
  Tv,
  Sparkles,
  Monitor,
  MessageSquare,
  Radio,
  UserCheck,
  Bell,
  ThumbsUp,
  HelpCircle,
  Shield,
  RefreshCw,
  TrendingUp,
  Award,
  Calendar,
  Zap,
  Heart,
  Star,
  Award as FallbackIcon
} from 'lucide-react';

export interface BadgeConfig {
  icon: React.ComponentType<any>;
  gradient: string;
  glow: string;
  category: string;
  textColor: string;
  badgeBg: string;
  borderColor: string;
}

export const getBadgeConfig = (iconName: string, badgeName: string = ''): BadgeConfig => {
  const name = (badgeName || iconName).toLowerCase().replace(/[\s,']/g, '');

  // Category 1: Builder / Execution (Green)
  if (
    ['builder', 'innovator', 'collaborator', 'pathfinder', 'pioneer'].includes(name) ||
    ['Builder', 'Innovator', 'Collaborator', 'Pathfinder', 'Pioneer'].includes(iconName)
  ) {
    let icon = Hammer;
    if (name.includes('innovator')) icon = Lightbulb;
    else if (name.includes('collaborator')) icon = Users;
    else if (name.includes('pathfinder')) icon = Compass;
    else if (name.includes('pioneer')) icon = Flag;

    return {
      icon,
      gradient: 'from-emerald-400 to-green-500',
      glow: 'shadow-[0_8px_20px_rgba(16,185,129,0.18)] group-hover:shadow-[0_12px_28px_rgba(16,185,129,0.32)]',
      category: 'Execution',
      textColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 border border-emerald-150',
      borderColor: 'border-emerald-100 hover:border-emerald-300'
    };
  }

  // Category 2: Research / Analysis (Purple)
  if (
    ['researcher', 'deepdiver', 'techscout', 'claritymaker', 'riskspotter'].includes(name) ||
    ['Researcher', 'DeepDiver', 'TechScout', 'ClarityMaker', 'RiskSpotter'].includes(iconName)
  ) {
    let icon = Search;
    if (name.includes('deepdiver')) icon = ShieldAlert;
    else if (name.includes('techscout')) icon = Eye;
    else if (name.includes('claritymaker')) icon = Layers;
    else if (name.includes('riskspotter')) icon = AlertTriangle;

    return {
      icon,
      gradient: 'from-violet-400 to-purple-500',
      glow: 'shadow-[0_8px_20px_rgba(139,92,246,0.18)] group-hover:shadow-[0_12px_28px_rgba(139,92,246,0.32)]',
      category: 'Research',
      textColor: 'text-purple-700',
      badgeBg: 'bg-purple-50 border border-purple-150',
      borderColor: 'border-purple-100 hover:border-purple-300'
    };
  }

  // Category 3: Prototype / Finishing (Cyan)
  if (
    ['demomaker', 'pocfinisher', 'showdonttell', 'prototypepolisher', 'fromideatoscreen'].includes(name) ||
    ['DemoMaker', 'POCFinisher', 'ShowDontTell', 'PrototypePolisher', 'FromIdeaToScreen'].includes(iconName)
  ) {
    let icon = Play;
    if (name.includes('pocfinisher')) icon = CheckCircle;
    else if (name.includes('showdonttell')) icon = Tv;
    else if (name.includes('prototypepolisher')) icon = Sparkles;
    else if (name.includes('fromideatoscreen')) icon = Monitor;

    return {
      icon,
      gradient: 'from-cyan-400 to-teal-500',
      glow: 'shadow-[0_8px_20px_rgba(6,182,212,0.18)] group-hover:shadow-[0_12px_28px_rgba(6,182,212,0.32)]',
      category: 'Prototype',
      textColor: 'text-cyan-700',
      badgeBg: 'bg-cyan-50 border border-cyan-150',
      borderColor: 'border-cyan-100 hover:border-cyan-300'
    };
  }

  // Category 4: Communication / Visibility (Rose)
  if (
    ['clearcommunicator', 'dailysignal', 'noghosting', 'earlywarner', 'feedbackreceiver'].includes(name) ||
    ['ClearCommunicator', 'DailySignal', 'NoGhosting', 'EarlyWarner', 'FeedbackReceiver'].includes(iconName)
  ) {
    let icon = MessageSquare;
    if (name.includes('dailysignal')) icon = Radio;
    else if (name.includes('noghosting')) icon = UserCheck;
    else if (name.includes('earlywarner')) icon = Bell;
    else if (name.includes('feedbackreceiver')) icon = ThumbsUp;

    return {
      icon,
      gradient: 'from-rose-400 to-pink-500',
      glow: 'shadow-[0_8px_20px_rgba(244,63,94,0.18)] group-hover:shadow-[0_12px_28px_rgba(244,63,94,0.32)]',
      category: 'Relations',
      textColor: 'text-rose-700',
      badgeBg: 'bg-rose-50 border border-rose-150',
      borderColor: 'border-rose-100 hover:border-rose-300'
    };
  }

  // Category 5: Growth / Self-Awareness (Orange)
  if (
    ['selfawarecube', 'noexcuses', 'betternexttime', 'growthmindset', 'ownyourwork'].includes(name) ||
    ['SelfAwareCube', 'NoExcuses', 'BetterNextTime', 'GrowthMindset', 'OwnYourWork'].includes(iconName)
  ) {
    let icon = HelpCircle;
    if (name.includes('noexcuses')) icon = Shield;
    else if (name.includes('betternexttime')) icon = RefreshCw;
    else if (name.includes('growthmindset')) icon = TrendingUp;
    else if (name.includes('ownyourwork')) icon = Award;

    return {
      icon,
      gradient: 'from-orange-400 to-red-500',
      glow: 'shadow-[0_8px_20px_rgba(249,115,22,0.18)] group-hover:shadow-[0_12px_28px_rgba(249,115,22,0.32)]',
      category: 'Growth',
      textColor: 'text-orange-700',
      badgeBg: 'bg-orange-50 border border-orange-150',
      borderColor: 'border-orange-100 hover:border-orange-300'
    };
  }

  // Category 6: Leadership (Gold/Amber)
  if (
    ['missionlead', 'teamorganizer', 'initiativetaker', 'mentormindset', 'futurelead'].includes(name) ||
    ['MissionLead', 'TeamOrganizer', 'InitiativeTaker', 'MentorMindset', 'FutureLead'].includes(iconName)
  ) {
    let icon = Award;
    if (name.includes('teamorganizer')) icon = Calendar;
    else if (name.includes('initiativetaker')) icon = Zap;
    else if (name.includes('mentormindset')) icon = Heart;
    else if (name.includes('futurelead')) icon = Star;

    return {
      icon,
      gradient: 'from-amber-400 to-yellow-500',
      glow: 'shadow-[0_8px_20px_rgba(245,158,11,0.18)] group-hover:shadow-[0_12px_28px_rgba(245,158,11,0.32)]',
      category: 'Leadership',
      textColor: 'text-amber-700',
      badgeBg: 'bg-amber-50 border border-amber-150',
      borderColor: 'border-amber-100 hover:border-amber-300'
    };
  }

  // Default Fallback
  return {
    icon: FallbackIcon,
    gradient: 'from-gray-400 to-slate-500',
    glow: 'shadow-[0_8px_20px_rgba(100,116,139,0.15)]',
    category: 'General',
    textColor: 'text-gray-700',
    badgeBg: 'bg-gray-50 border border-gray-150',
    borderColor: 'border-gray-100 hover:border-gray-300'
  };
};
