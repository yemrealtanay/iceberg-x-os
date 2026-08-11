import { MissionStatus } from '@prisma/client';
import { badRequest } from '../utils/http';

/**
 * Mission lifecycle.
 *
 * Status used to be written from five independent places with no rules at all,
 * so a mission could jump from `idea_pool` straight to `reviewed`, or be pulled
 * back out of `archived` by a stray edit. This table is the single source of
 * truth for which moves are legal.
 *
 * It only guards writes — no existing mission row is inspected or migrated, so
 * missions already sitting in an unusual state keep that state until someone
 * deliberately moves them.
 */
export const ALLOWED_TRANSITIONS: Record<MissionStatus, MissionStatus[]> = {
  // Intake
  [MissionStatus.idea_pool]: [
    MissionStatus.selected,
    MissionStatus.researching,
    MissionStatus.archived,
    MissionStatus.cancelled
  ],
  [MissionStatus.selected]: [
    MissionStatus.idea_pool,
    MissionStatus.researching,
    MissionStatus.building_demo,
    MissionStatus.archived,
    MissionStatus.cancelled
  ],

  // Active delivery — phases may move forward or back, and a failed mission
  // can always be reset to `selected` for reassignment.
  [MissionStatus.researching]: [
    MissionStatus.selected,
    MissionStatus.building_demo,
    MissionStatus.preparing_handover,
    MissionStatus.demo_ready,
    MissionStatus.archived,
    MissionStatus.cancelled
  ],
  [MissionStatus.building_demo]: [
    MissionStatus.selected,
    MissionStatus.researching,
    MissionStatus.preparing_handover,
    MissionStatus.demo_ready,
    MissionStatus.archived,
    MissionStatus.cancelled
  ],
  [MissionStatus.preparing_handover]: [
    MissionStatus.selected,
    MissionStatus.researching,
    MissionStatus.building_demo,
    MissionStatus.demo_ready,
    MissionStatus.archived,
    MissionStatus.cancelled
  ],
  [MissionStatus.demo_ready]: [
    MissionStatus.selected,
    MissionStatus.researching,
    MissionStatus.building_demo,
    MissionStatus.preparing_handover,
    MissionStatus.pending_approval,
    MissionStatus.completed,
    MissionStatus.archived,
    MissionStatus.cancelled
  ],

  // Awaiting mentor sign-off: approve, send back to a phase, or reset
  [MissionStatus.pending_approval]: [
    MissionStatus.selected,
    MissionStatus.researching,
    MissionStatus.building_demo,
    MissionStatus.preparing_handover,
    MissionStatus.demo_ready,
    MissionStatus.completed,
    MissionStatus.archived,
    MissionStatus.cancelled
  ],

  // Closed out
  [MissionStatus.completed]: [
    MissionStatus.reviewed,
    MissionStatus.promoted_to_product_backlog,
    MissionStatus.archived
  ],
  [MissionStatus.reviewed]: [
    MissionStatus.promoted_to_product_backlog,
    MissionStatus.archived
  ],
  [MissionStatus.promoted_to_product_backlog]: [
    MissionStatus.archived
  ],

  // Terminal. Reopening is an admin correction, not a normal workflow step.
  [MissionStatus.archived]: [],
  [MissionStatus.cancelled]: []
};

/** Statuses a mission may be created in. */
export const INITIAL_STATUSES: MissionStatus[] = [
  MissionStatus.idea_pool,
  MissionStatus.selected,
  MissionStatus.researching
];

export function isMissionStatus(value: any): value is MissionStatus {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(ALLOWED_TRANSITIONS, value);
}

/** Statuses reachable from `current`, for populating a UI dropdown. */
export function allowedNextStatuses(current: MissionStatus): MissionStatus[] {
  return ALLOWED_TRANSITIONS[current] || [];
}

const humanize = (s: string) => s.replace(/_/g, ' ');

export interface TransitionOptions {
  /** Role of the requester. Only ADMIN may use `force`. */
  role?: 'ADMIN' | 'MENTOR' | 'CUBE';
  /** Admin escape hatch for correcting a mission that is in the wrong state. */
  force?: boolean;
}

/**
 * Throws unless the transition is legal. A no-op (same status) always passes.
 * Returns the validated target status.
 */
export function assertTransition(
  from: MissionStatus,
  to: any,
  options: TransitionOptions = {}
): MissionStatus {
  if (!isMissionStatus(to)) {
    throw badRequest(`Unknown mission status "${to}".`);
  }

  if (from === to) return to;

  if (options.force) {
    if (options.role !== 'ADMIN') {
      throw badRequest('Only an admin may force a mission status change.');
    }
    return to;
  }

  const allowed = allowedNextStatuses(from);
  if (!allowed.includes(to)) {
    const targets = allowed.length
      ? allowed.map(humanize).join(', ')
      : 'none — this mission is closed';
    throw badRequest(
      `A mission in "${humanize(from)}" cannot move to "${humanize(to)}". Allowed next: ${targets}.` +
      (allowed.length ? '' : ' An admin can reopen it with force.')
    );
  }

  return to;
}

export function assertInitialStatus(value: any): MissionStatus {
  if (value === undefined || value === null || value === '') return MissionStatus.idea_pool;
  if (!isMissionStatus(value)) {
    throw badRequest(`Unknown mission status "${value}".`);
  }
  if (!INITIAL_STATUSES.includes(value)) {
    throw badRequest(
      `A new mission must start in one of: ${INITIAL_STATUSES.map(humanize).join(', ')}.`
    );
  }
  return value;
}
