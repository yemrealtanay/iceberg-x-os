/**
 * Mission teams and rosters.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isMentorOrAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { badRequest, sendError } from '../utils/http';
import { syncTeamMembers, detachTeamsFromMission, normalizeMembers } from '../services/team.service';
import { assertCubesAreActive } from '../services/cubeStatus.service';
import { recalculateQuestsForCubes } from '../services/quest.service';

const router = Router();

// Create team (generic)
router.post('/teams', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { name, mission_id } = req.body;
    if (!name) throw badRequest('Team name is required');

    const members = normalizeMembers(req.body.members);
    await assertCubesAreActive(members.map(m => m.cubeProfileId), 'be added to a team');

    const result = await prisma.$transaction(async (tx) => {
      const detachedTeams = mission_id
        ? await detachTeamsFromMission(tx, mission_id)
        : [];

      const team = await tx.missionTeam.create({
        data: {
          name,
          mission_id: mission_id || null
        }
      });

      await syncTeamMembers(tx, team.id, members);

      return { team, detachedTeams };
    });

    // A newly rostered Cube may now satisfy "missions_assigned".
    recalculateQuestsForCubes(members.map(m => m.cubeProfileId)).catch(err =>
      console.error(`Quest recalculation failed for team ${result.team.id}:`, err)
    );

    return res.status(201).json({ ...result.team, detachedTeams: result.detachedTeams });
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Create team (legacy/mission-specific)
router.post('/missions/:id/teams', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params; // Mission ID
    const { name } = req.body;

    if (!name) throw badRequest('Team name is required');

    const members = normalizeMembers(req.body.members);
    await assertCubesAreActive(members.map(m => m.cubeProfileId), 'be added to a team');
    const missionId = id && id !== 'none' ? id : null;

    const result = await prisma.$transaction(async (tx) => {
      const detachedTeams = missionId
        ? await detachTeamsFromMission(tx, missionId)
        : [];

      const team = await tx.missionTeam.create({
        data: {
          name,
          mission_id: missionId
        }
      });

      await syncTeamMembers(tx, team.id, members);

      return { team, detachedTeams };
    });

    recalculateQuestsForCubes(members.map(m => m.cubeProfileId)).catch(err =>
      console.error(`Quest recalculation failed for team ${result.team.id}:`, err)
    );

    return res.status(201).json({ ...result.team, detachedTeams: result.detachedTeams });
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Get all Teams
router.get('/teams', requireAuth, async (req, res) => {
  try {
    const teams = await prisma.missionTeam.findMany({
      include: {
        mission: true,
        members: {
          include: {
            cube: {
              include: { user: { select: { id: true, name: true, email: true } } }
            }
          }
        }
      }
    });
    return res.json(teams);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Update team (including mission and members)
router.put('/teams/:id', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params; // Team ID
    const { name, mission_id } = req.body;
    const hasMembers = Array.isArray(req.body.members);
    const members = normalizeMembers(req.body.members);
    await assertCubesAreActive(members.map(m => m.cubeProfileId), 'be added to a team');

    const detachedTeams = await prisma.$transaction(async (tx) => {
      // 1. Update basic fields
      const dataToUpdate: any = {};
      if (name !== undefined) dataToUpdate.name = name;

      let detached: any[] = [];
      if (mission_id !== undefined) {
        dataToUpdate.mission_id = mission_id || null;
        if (mission_id) {
          detached = await detachTeamsFromMission(tx, mission_id, id);
        }
      }

      await tx.missionTeam.update({
        where: { id },
        data: dataToUpdate
      });

      // 2. Reconcile members without destroying reflections
      if (hasMembers) {
        await syncTeamMembers(tx, id, members);
      }

      return detached;
    });

    if (hasMembers) {
      recalculateQuestsForCubes(members.map(m => m.cubeProfileId)).catch(err =>
        console.error(`Quest recalculation failed for team ${id}:`, err)
      );
    }

    const updatedTeam = await prisma.missionTeam.findUnique({
      where: { id },
      include: {
        mission: true,
        members: {
          include: {
            cube: { include: { user: { select: { id: true, name: true } } } }
          }
        }
      }
    });

    return res.json({ ...updatedTeam, detachedTeams });
  } catch (error: any) {
    return sendError(res, error);
  }
});

router.delete('/teams/:id', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete team members first
    await prisma.missionTeamMember.deleteMany({
      where: { team_id: id }
    });
    
    // Delete the team itself
    await prisma.missionTeam.delete({
      where: { id }
    });
    
    return res.json({ success: true, message: 'Team dissolved and deleted successfully.' });
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
