import { CubeLevel, MissionStatus } from '@prisma/client';

/**
 * Single definition of "active Cube". Previously /admin/dashboard and
 * /cubes?active=true used different level sets and reported different counts.
 */
export const ACTIVE_CUBE_LEVELS: CubeLevel[] = [
  CubeLevel.Cube,
  CubeLevel.Senior_Cube,
  CubeLevel.Iceberger
];

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
