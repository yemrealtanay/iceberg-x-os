import { TeamMemberRole } from '@prisma/client';

export interface IncomingMember {
  cubeProfileId: string;
  role?: string;
}

/** Drops entries without a Cube id and collapses duplicates. */
export function normalizeMembers(members: any): IncomingMember[] {
  if (!Array.isArray(members)) return [];
  const seen = new Set<string>();
  const result: IncomingMember[] = [];
  for (const m of members) {
    const cubeProfileId = m?.cubeProfileId;
    if (!cubeProfileId || seen.has(cubeProfileId)) continue;
    seen.add(cubeProfileId);
    result.push({ cubeProfileId, role: m?.role });
  }
  return result;
}

/**
 * Applies a member list to a team without destroying existing records.
 *
 * The original implementation deleted every MissionTeamMember row and recreated
 * them, which wiped each Cube's reflections (what_gained / what_learned /
 * what_could_be_better) and their is_submitted flag whenever a mentor edited
 * the roster. Members that stay on the team are left untouched; only their
 * role is updated.
 */
export async function syncTeamMembers(tx: any, teamId: string, members: IncomingMember[]) {
  const existing = await tx.missionTeamMember.findMany({
    where: { team_id: teamId },
    select: { id: true, cube_id: true, role: true }
  });

  const incomingIds = new Set(members.map(m => m.cubeProfileId));
  const existingByCubeId = new Map(existing.map((e: any) => [e.cube_id, e]));

  // Remove only the members that are no longer on the roster
  const removedIds = existing
    .filter((e: any) => !incomingIds.has(e.cube_id))
    .map((e: any) => e.id);
  if (removedIds.length > 0) {
    await tx.missionTeamMember.deleteMany({ where: { id: { in: removedIds } } });
  }

  for (const member of members) {
    const role = (member.role as TeamMemberRole) || TeamMemberRole.Contributor;
    const current: any = existingByCubeId.get(member.cubeProfileId);

    if (current) {
      // Keep reflections and submission state; only correct the role if changed
      if (current.role !== role) {
        await tx.missionTeamMember.update({ where: { id: current.id }, data: { role } });
      }
    } else {
      await tx.missionTeamMember.create({
        data: { team_id: teamId, cube_id: member.cubeProfileId, role }
      });
    }
  }

  return { removed: removedIds.length, kept: existing.length - removedIds.length };
}

/**
 * A mission holds at most one team. Reassigning the mission detaches the
 * previous team instead of deleting it, and the detached teams are reported
 * back to the caller rather than disappearing silently.
 */
export async function detachTeamsFromMission(tx: any, missionId: string, exceptTeamId?: string) {
  const where: any = { mission_id: missionId };
  if (exceptTeamId) where.id = { not: exceptTeamId };

  const detached = await tx.missionTeam.findMany({
    where,
    select: { id: true, name: true }
  });

  if (detached.length > 0) {
    await tx.missionTeam.updateMany({ where, data: { mission_id: null } });
  }

  return detached;
}
