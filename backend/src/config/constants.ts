import { CubeLevel, MissionStatus } from '@prisma/client';

/**
 * Cube lifecycle.
 *
 *   Cube        — doing the programme
 *   Senior_Cube — doing the programme, promoted
 *   Iceberger   — hired into the main development team; out of the programme
 *   Former_Cube — stopped or paused partway; did NOT graduate
 *   Alumni      — graduated out of the programme
 *
 * Two independent questions, which used to be conflated:
 *
 *   1. Is this person doing the programme? Only they get missions, meeting
 *      invites and scorecards. Icebergers are on the main team now, so they are
 *      exempt just as Former Cubes and Alumni are.
 *   2. Should they show in the directory? Almost everyone should — Icebergers
 *      especially, as an example of where the programme leads. Only Alumni are
 *      hidden by default, behind a filter.
 */
export const IN_PROGRAMME_CUBE_LEVELS: CubeLevel[] = [
  CubeLevel.Cube,
  CubeLevel.Senior_Cube
];

/** Levels that mean the person is no longer doing the programme. */
export const EXITED_CUBE_LEVELS: CubeLevel[] = [
  CubeLevel.Iceberger,
  CubeLevel.Former_Cube,
  CubeLevel.Alumni
];

/** Hidden from the directory unless explicitly filtered for. */
export const DIRECTORY_HIDDEN_LEVELS: CubeLevel[] = [CubeLevel.Alumni];

export const isInProgramme = (level: CubeLevel) => IN_PROGRAMME_CUBE_LEVELS.includes(level);

/** Levels a Cube can be moved to when they leave. */
export const OFFBOARDING_TARGET_LEVELS: CubeLevel[] = [
  CubeLevel.Former_Cube,
  CubeLevel.Alumni
];

export type CertificateType = 'participation' | 'success';

/**
 * Which certificate each exit level may receive.
 *
 * A Former Cube left partway through, so they can only be given a certificate
 * of participation — never one of success. Alumni completed the programme and
 * may receive either.
 */
export const CERTIFICATE_TYPES_BY_LEVEL: Record<string, CertificateType[]> = {
  [CubeLevel.Former_Cube]: ['participation'],
  [CubeLevel.Alumni]: ['participation', 'success']
};

/** Mission statuses that mean the mission is no longer in flight. */
export const TERMINAL_MISSION_STATUSES: MissionStatus[] = [
  MissionStatus.completed,
  MissionStatus.reviewed,
  MissionStatus.promoted_to_product_backlog,
  MissionStatus.archived,
  MissionStatus.cancelled
];

/** Mission statuses counted as "active" on the admin dashboard. */
export const ACTIVE_MISSION_STATUSES: MissionStatus[] = [
  MissionStatus.selected,
  MissionStatus.researching,
  MissionStatus.building_demo,
  MissionStatus.preparing_handover,
  MissionStatus.demo_ready
];

/** Mentor feedback scorecard range. The radar chart renders score / 5. */
export const MIN_SCORE = 1;
export const MAX_SCORE = 5;

/** Cube numbers are zero-padded to this width ("001", "042"). */
export const CUBE_NUMBER_WIDTH = 3;
