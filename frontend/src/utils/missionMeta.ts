/**
 * Shared presentation metadata for missions.
 *
 * Every Tailwind class below is written as a complete literal string. Tailwind
 * scans source files for literal class names, so anything assembled at runtime
 * (`bg-${color}-500`) is never generated. Shades must also exist on the default
 * scale (50, 100, 200 … 900) — off-scale values silently produce no CSS at all,
 * which is how dozens of dead colour classes accumulated here before.
 */

/** Turns a Prisma enum value into readable text: `building_demo` → `building demo`. */
export const formatEnum = (value?: string | null): string =>
  (value || '').replace(/_/g, ' ');

export interface DifficultyMeta {
  /** Compact level chip label, e.g. "L3". */
  short: string;
  /** Human-readable level name, e.g. "Working PoC". */
  label: string;
  /** Card top accent bar. */
  accent: string;
  /** Level chip background + text. */
  chip: string;
}

export const DIFFICULTY_META: Record<string, DifficultyMeta> = {
  Level_1_Research_Only: {
    short: 'L1',
    label: 'Research Only',
    accent: 'bg-slate-400',
    chip: 'bg-slate-100 text-slate-600'
  },
  Level_2_Research_Mock: {
    short: 'L2',
    label: 'Research + Mock',
    accent: 'bg-sky-400',
    chip: 'bg-sky-50 text-sky-700'
  },
  Level_3_Working_POC: {
    short: 'L3',
    label: 'Working PoC',
    accent: 'bg-blue-500',
    chip: 'bg-blue-50 text-blue-700'
  },
  Level_4_Integration_Candidate: {
    short: 'L4',
    label: 'Integration Candidate',
    accent: 'bg-amber-500',
    chip: 'bg-amber-50 text-amber-700'
  },
  Level_5_Main_Team_Assist: {
    short: 'L5',
    label: 'Main Team Assist',
    accent: 'bg-magenta',
    chip: 'bg-magenta/10 text-magenta'
  }
};

const FALLBACK_DIFFICULTY: DifficultyMeta = {
  short: '—',
  label: 'Unspecified',
  accent: 'bg-gray-300',
  chip: 'bg-gray-100 text-gray-500'
};

export const getDifficultyMeta = (value?: string | null): DifficultyMeta =>
  (value && DIFFICULTY_META[value]) || FALLBACK_DIFFICULTY;

export interface StatusMeta {
  label: string;
  /** Status pill background + text. */
  pill: string;
  /** Leading dot colour inside the pill. */
  dot: string;
}

export const STATUS_META: Record<string, StatusMeta> = {
  idea_pool: {
    label: 'Idea Pool',
    pill: 'bg-gray-100 text-gray-500',
    dot: 'bg-gray-400'
  },
  selected: {
    label: 'Selected',
    pill: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500'
  },
  researching: {
    label: 'Researching',
    pill: 'bg-indigo-50 text-indigo-700',
    dot: 'bg-indigo-500'
  },
  building_demo: {
    label: 'Building Demo',
    pill: 'bg-violet-50 text-violet-700',
    dot: 'bg-violet-500'
  },
  preparing_handover: {
    label: 'Preparing Handover',
    pill: 'bg-amber-50 text-amber-700',
    dot: 'bg-amber-500'
  },
  demo_ready: {
    label: 'Demo Ready',
    pill: 'bg-magenta/10 text-magenta',
    dot: 'bg-magenta'
  },
  pending_approval: {
    label: 'Pending Approval',
    pill: 'bg-orange-50 text-orange-700',
    dot: 'bg-orange-500'
  },
  completed: {
    label: 'Completed',
    pill: 'bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500'
  },
  reviewed: {
    label: 'Reviewed',
    pill: 'bg-teal-50 text-teal-700',
    dot: 'bg-teal-500'
  },
  promoted_to_product_backlog: {
    label: 'Promoted to Backlog',
    pill: 'bg-blue-50 text-blue-700',
    dot: 'bg-blue-500'
  },
  archived: {
    label: 'Archived',
    pill: 'bg-gray-100 text-gray-500',
    dot: 'bg-gray-400'
  },
  cancelled: {
    label: 'Cancelled',
    pill: 'bg-red-50 text-red-600',
    dot: 'bg-red-500'
  }
};

const FALLBACK_STATUS: StatusMeta = {
  label: 'Unknown',
  pill: 'bg-gray-100 text-gray-500',
  dot: 'bg-gray-400'
};

export const getStatusMeta = (value?: string | null): StatusMeta => {
  if (value && STATUS_META[value]) return STATUS_META[value];
  if (!value) return FALLBACK_STATUS;
  return { ...FALLBACK_STATUS, label: formatEnum(value) };
};

/** Statuses that mean a mission is closed. Mirrors the backend constant. */
export const TERMINAL_MISSION_STATUSES = [
  'completed',
  'reviewed',
  'promoted_to_product_backlog',
  'archived',
  'cancelled'
];

/** Avatar palette. Full literal classes so Tailwind emits them. */
const AVATAR_COLORS = [
  'bg-blue-500',
  'bg-magenta',
  'bg-emerald-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-slate-600',
  'bg-sky-500',
  'bg-rose-500'
];

/** Stable colour for a Cube, derived from its id so it never flickers. */
export const avatarColor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

/** Up to two uppercase initials. Handles Turkish characters correctly. */
export const getInitials = (name?: string | null): string => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] || '' : '';
  return (first + last).toLocaleUpperCase('tr-TR');
};

/**
 * Flattens markdown to plain text for card excerpts.
 *
 * Mission descriptions are markdown. Rendering them inside a `line-clamp`
 * container let block elements (headings, lists, code fences) escape the clamp,
 * which is why the cards had wildly different heights.
 */
export const stripMarkdown = (text?: string | null): string => {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, ' ')       // fenced code blocks
    .replace(/`([^`]*)`/g, '$1')            // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')  // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')// links → link text
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')     // headings
    .replace(/^\s{0,3}>\s?/gm, '')          // block quotes
    .replace(/^\s*[-*+]\s+/gm, '')          // bullets
    .replace(/^\s*\d+\.\s+/gm, '')          // ordered list markers
    .replace(/^\s*([-*_]\s*){3,}$/gm, ' ')  // horizontal rules
    .replace(/(\*\*|__|\*|_|~~)/g, '')      // emphasis
    .replace(/\s+/g, ' ')
    .trim();
};
