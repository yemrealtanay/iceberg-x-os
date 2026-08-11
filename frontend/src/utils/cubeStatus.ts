/**
 * Cube lifecycle, mirroring backend/src/config/constants.ts.
 *
 *   Cube        — doing the programme
 *   Senior_Cube — doing the programme, promoted
 *   Iceberger   — hired into the main development team; out of the programme
 *   Former_Cube — stopped or paused partway; did NOT graduate
 *   Alumni      — graduated out of the programme
 *
 * Two separate questions, which the UI used to conflate:
 *
 *   1. Are they doing the programme? Only they appear in mission, meeting,
 *      scorecard and broadcast pickers.
 *   2. Should they show in the directory? Nearly everyone should — Icebergers
 *      most of all. Only Alumni are hidden behind a filter.
 *
 * The backend enforces all of this; these constants exist so the UI does not
 * offer choices that would only be rejected.
 */

export type CubeLevelName =
  | 'Cube'
  | 'Senior_Cube'
  | 'Iceberger'
  | 'Former_Cube'
  | 'Alumni';

export const IN_PROGRAMME_CUBE_LEVELS: CubeLevelName[] = ['Cube', 'Senior_Cube'];

export const EXITED_CUBE_LEVELS: CubeLevelName[] = ['Iceberger', 'Former_Cube', 'Alumni'];

export const isInProgramme = (level?: string | null): boolean =>
  !!level && IN_PROGRAMME_CUBE_LEVELS.includes(level as CubeLevelName);

export const hasLeftProgramme = (level?: string | null): boolean =>
  !!level && EXITED_CUBE_LEVELS.includes(level as CubeLevelName);

/** Levels a Cube can be offboarded to. */
export const OFFBOARDING_TARGET_LEVELS: CubeLevelName[] = ['Former_Cube', 'Alumni'];

export type CertificateType = 'participation' | 'success';

/**
 * A Former Cube stopped partway, so they can only receive a certificate of
 * participation. Alumni completed the programme and may receive either.
 */
export const CERTIFICATE_TYPES_BY_LEVEL: Record<string, CertificateType[]> = {
  Former_Cube: ['participation'],
  Alumni: ['participation', 'success']
};

export const certificateTypesFor = (level: string): CertificateType[] =>
  CERTIFICATE_TYPES_BY_LEVEL[level] || [];

export interface LevelMeta {
  label: string;
  /** Short explanation shown next to the badge. */
  hint: string;
  /** Badge classes — complete literal Tailwind strings. */
  badge: string;
}

export const LEVEL_META: Record<string, LevelMeta> = {
  Cube: {
    label: 'Cube',
    hint: 'In the programme',
    badge: 'bg-magenta/5 border-magenta/10 text-magenta'
  },
  Senior_Cube: {
    label: 'Senior Cube',
    hint: 'In the programme',
    badge: 'bg-magenta/10 border-magenta/20 text-magenta'
  },
  Iceberger: {
    label: 'Iceberger',
    hint: 'Hired into the main team',
    badge: 'bg-cyan-500/15 border-cyan-500/20 text-cyan-300'
  },
  Former_Cube: {
    label: 'Former Cube',
    hint: 'Left the programme early',
    badge: 'bg-slate-100 border-slate-200 text-slate-500'
  },
  Alumni: {
    label: 'Alumni',
    hint: 'Graduated',
    badge: 'bg-amber-100 border-amber-200 text-amber-800'
  }
};

export const getLevelMeta = (level?: string | null): LevelMeta =>
  (level && LEVEL_META[level]) || {
    label: (level || 'Unknown').replace(/_/g, ' '),
    hint: '',
    badge: 'bg-gray-100 border-gray-200 text-gray-500'
  };
