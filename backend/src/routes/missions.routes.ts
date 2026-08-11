/**
 * Missions, reflections and lifecycle transitions.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isAdmin, isMentorOrAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { TERMINAL_MISSION_STATUSES } from '../config/constants';
import { badRequest, conflict, notFound, sendError } from '../utils/http';
import { createBulkNotification } from '../services/notification.service';
import { syncTeamMembers, detachTeamsFromMission } from '../services/team.service';
import { assertCubesAreActive } from '../services/cubeStatus.service';
import {
  allowedNextStatuses,
  assertInitialStatus,
  assertTransition
} from '../services/missionStatus.service';
import { MissionStatus, DifficultyLevel, MissionDecision } from '@prisma/client';

const router = Router();

// List missions
router.get('/missions', requireAuth, async (req, res) => {
  try {
    const { status, difficulty_level, mentor_id } = req.query;

    const filters: any = {};
    if (status) filters.status = status as MissionStatus;
    if (difficulty_level) filters.difficulty_level = difficulty_level as DifficultyLevel;
    if (mentor_id) filters.mentor_id = mentor_id as string;

    // Apply unassigned privacy filter for Cubes
    const userRole = (req as AuthenticatedRequest).user?.role;
    if (userRole === 'CUBE') {
      filters.OR = [
        { mentor_id: { not: null } },
        { teams: { some: {} } }
      ];
    }

    const missions = await prisma.mission.findMany({
      where: filters,
      include: {
        mentor: { select: { id: true, name: true } },
        created_by: { select: { id: true, name: true } },
        teams: {
          include: {
            members: {
              include: {
                cube: {
                  // The mission cards show initials only, so no avatar is sent
                  select: {
                    id: true,
                    user: { select: { name: true } }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return res.json(missions);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Create mission (Admin or Mentor)
router.post('/missions', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      description,
      context,
      problem_statement,
      expected_output,
      difficulty_level,
      status,
      category,
      mentor_id,
      slack_channel_url,
      repository_url,
      demo_url,
      notify
    } = req.body;

    if (!title || !description || !context || !problem_statement || !expected_output || !difficulty_level) {
      return res.status(400).json({ error: 'Missing required mission parameters' });
    }

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const newMission = await prisma.mission.create({
      data: {
        title,
        description,
        context,
        problem_statement,
        expected_output,
        difficulty_level: difficulty_level as DifficultyLevel,
        status: assertInitialStatus(status),
        category: category || 'General',
        created_by_id: req.user.id,
        mentor_id: mentor_id || null,
        slack_channel_url,
        repository_url,
        demo_url,
      }
    });

    if (notify) {
      await createBulkNotification(`A new mission has been added: ${title}`);
    }

    return res.status(201).json(newMission);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Get mission detail
router.get('/missions/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        mentor: { select: { id: true, name: true, email: true } },
        created_by: { select: { id: true, name: true } },
        teams: {
          include: {
            members: {
              include: {
                cube: {
                  include: { user: { select: { id: true, name: true, email: true } } }
                }
              }
            }
          }
        },
        updates: {
          include: {
            cube: { select: { name: true } }
          },
          orderBy: { created_at: 'desc' }
        },
        demo_submissions: {
          include: {
            submitted_by: { select: { name: true } },
            team: { select: { name: true } }
          },
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Check unassigned privacy filter for Cubes
    if (req.user?.role === 'CUBE') {
      const hasTeams = mission.teams.length > 0;
      if (!mission.mentor_id && !hasTeams) {
        return res.status(403).json({ error: 'Access denied. This mission is unassigned and private.' });
      }
    }

    // Get feedback related to this mission. CRITICAL check.
    let mentorFeedback = [];
    if (req.user?.role === 'ADMIN' || req.user?.role === 'MENTOR') {
      mentorFeedback = await prisma.mentorFeedback.findMany({
        where: { mission_id: id },
        include: {
          cube: { select: { name: true, id: true } },
          mentor: { select: { name: true } }
        },
        orderBy: { created_at: 'desc' }
      });
    } else {
      // Cube can only see feedback on this mission if it concerns them and is visible
      const fb = await prisma.mentorFeedback.findMany({
        where: {
          mission_id: id,
          cube_id: req.user?.id,
          visible_to_cube: true
        },
        include: {
          cube: { select: { name: true, id: true } },
          mentor: { select: { name: true } }
        },
        orderBy: { created_at: 'desc' }
      });
      mentorFeedback = fb.map(item => {
        const { private_notes, ...rest } = item;
        return rest;
      });
    }

    return res.json({
      mission,
      mentorFeedback,
      // Lets the UI offer only legal next statuses instead of the full enum
      allowedNextStatuses: allowedNextStatuses(mission.status)
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Edit mission
router.put('/missions/:id', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      context,
      problem_statement,
      expected_output,
      difficulty_level,
      status,
      category,
      mentor_id,
      slack_channel_url,
      repository_url,
      demo_url,
      decision,
      force
    } = req.body;

    const existing = await prisma.mission.findUnique({
      where: { id },
      select: { status: true }
    });
    if (!existing) throw notFound('Mission not found');

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (context) updateData.context = context;
    if (problem_statement) updateData.problem_statement = problem_statement;
    if (expected_output) updateData.expected_output = expected_output;
    if (difficulty_level) updateData.difficulty_level = difficulty_level as DifficultyLevel;
    if (status) {
      updateData.status = assertTransition(existing.status, status, {
        role: req.user?.role,
        force: !!force
      });
    }
    if (category) updateData.category = category;
    if (mentor_id !== undefined) updateData.mentor_id = mentor_id || null;
    if (slack_channel_url !== undefined) updateData.slack_channel_url = slack_channel_url;
    if (repository_url !== undefined) updateData.repository_url = repository_url;
    if (demo_url !== undefined) updateData.demo_url = demo_url;
    if (decision !== undefined) updateData.decision = decision ? (decision as MissionDecision) : null;

    const updated = await prisma.mission.update({
      where: { id },
      data: updateData
    });

    return res.json({ ...updated, allowedNextStatuses: allowedNextStatuses(updated.status) });
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Admin-only decision route
router.post('/missions/:id/decision', requireAuth, isAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { decision, force } = req.body; // MissionDecision

    if (!decision) {
      return res.status(400).json({ error: 'Decision parameter is required' });
    }

    const existing = await prisma.mission.findUnique({
      where: { id },
      select: { status: true }
    });
    if (!existing) throw notFound('Mission not found');

    // "Archive" also closes the mission, so it goes through the lifecycle check
    const nextStatus = decision === 'Archive'
      ? assertTransition(existing.status, MissionStatus.archived, {
          role: req.user?.role,
          force: !!force
        })
      : undefined;

    const updated = await prisma.mission.update({
      where: { id },
      data: {
        decision: decision as MissionDecision,
        status: nextStatus
      }
    });

    return res.json(updated);
  } catch (error: any) {
    return sendError(res, error);
  }
});

/**
 * Deleting a mission cascades into every Update, DemoSubmission,
 * MentorFeedback and DemoDayPresentation attached to it. That used to happen
 * silently. The dependent records are now counted first and the caller has to
 * opt in with ?force=true before any of that history is destroyed.
 */
router.delete('/missions/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const mission = await prisma.mission.findUnique({
      where: { id },
      select: { id: true, title: true }
    });
    if (!mission) throw notFound('Mission not found');

    const [updates, demoSubmissions, mentorFeedback, presentations] = await Promise.all([
      prisma.update.count({ where: { mission_id: id } }),
      prisma.demoSubmission.count({ where: { mission_id: id } }),
      prisma.mentorFeedback.count({ where: { mission_id: id } }),
      prisma.demoDayPresentation.count({ where: { mission_id: id } })
    ]);

    const dependents = { updates, demoSubmissions, mentorFeedback, presentations };
    const totalDependents = updates + demoSubmissions + mentorFeedback + presentations;
    const force = req.query.force === 'true';

    if (totalDependents > 0 && !force) {
      throw conflict(
        `"${mission.title}" has ${totalDependents} linked record(s) that would be permanently deleted ` +
        `(${updates} update(s), ${demoSubmissions} demo submission(s), ${mentorFeedback} feedback entr(ies), ` +
        `${presentations} demo day presentation(s)). Re-send with ?force=true to confirm.`,
        dependents
      );
    }

    // Detach teams so the roster and its reflections survive the deletion
    const detachedTeams = await prisma.$transaction(async (tx) => {
      const detached = await detachTeamsFromMission(tx, id);
      await tx.mission.delete({ where: { id } });
      return detached;
    });

    return res.json({
      success: true,
      message: 'Mission deleted successfully',
      deletedDependents: dependents,
      detachedTeams
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

router.post('/missions/:missionId/reflections', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { missionId } = req.params;
    const { what_gained, what_learned, what_could_be_better } = req.body;

    if (!req.user || req.user.role !== 'CUBE' || !req.user.cubeProfileId) {
      return res.status(403).json({ error: 'Only Cubes can submit individual reflections' });
    }

    if (!what_gained || !what_learned || !what_could_be_better) {
      return res.status(400).json({ error: 'All reflection fields are required' });
    }

    // Find the MissionTeamMember record
    const memberRecord = await prisma.missionTeamMember.findFirst({
      where: {
        cube_id: req.user.cubeProfileId,
        team: { mission_id: missionId }
      }
    });

    if (!memberRecord) {
      return res.status(404).json({ error: 'You are not assigned as a team member on this mission' });
    }

    // Update reflections
    const updatedMember = await prisma.missionTeamMember.update({
      where: { id: memberRecord.id },
      data: {
        what_gained,
        what_learned,
        what_could_be_better,
        is_submitted: true,
        submitted_at: new Date()
      }
    });

    // Check if all team members have submitted reflections for this mission
    const allTeamMembers = await prisma.missionTeamMember.findMany({
      where: { team: { mission_id: missionId } }
    });

    const allSubmitted = allTeamMembers.every(m => m.is_submitted);

    // Automatic side effect, not a user action: advance to pending_approval only
    // when the lifecycle permits it, and never fail the Cube's submission if it
    // does not (e.g. the mission was archived while reflections were open).
    let missionStatusUpdated = false;
    if (allSubmitted && allTeamMembers.length > 0) {
      const mission = await prisma.mission.findUnique({
        where: { id: missionId },
        select: { status: true }
      });

      if (mission && allowedNextStatuses(mission.status).includes(MissionStatus.pending_approval)) {
        await prisma.mission.update({
          where: { id: missionId },
          data: { status: MissionStatus.pending_approval }
        });
        missionStatusUpdated = true;
      }
    }

    return res.json({
      success: true,
      member: updatedMember,
      allSubmitted,
      missionStatusUpdated
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

router.post('/missions/:missionId/approve', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { missionId } = req.params;
    const { force } = req.body || {};

    const mission = await prisma.mission.findUnique({
      where: { id: missionId }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    const nextStatus = assertTransition(mission.status, MissionStatus.completed, {
      role: req.user?.role,
      force: !!force
    });

    const updatedMission = await prisma.mission.update({
      where: { id: missionId },
      data: { status: nextStatus }
    });

    return res.json({
      success: true,
      mission: updatedMission
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Resolve Mission lifecycle endpoint
router.post('/missions/:id/resolve', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const { action, targetStatus, newMemberIds, force } = req.body;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: { teams: true }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    const transitionOptions = { role: req.user?.role, force: !!force };

    if (action === 'complete_archive') {
      // 1. Mark mission as completed
      const nextStatus = assertTransition(mission.status, MissionStatus.completed, transitionOptions);
      await prisma.mission.update({
        where: { id },
        data: { status: nextStatus }
      });
      return res.json({ success: true, message: 'Mission completed and archived successfully.' });
    }

    if (action === 'fail_reassign') {
      const nextStatus = assertTransition(mission.status, MissionStatus.selected, transitionOptions);

      // Detach the teams instead of deleting them. Deleting cascaded into
      // MissionTeamMember and destroyed every Cube's reflections.
      const detachedTeams = await prisma.$transaction(async (tx) => {
        const detached = await detachTeamsFromMission(tx, id);
        await tx.mission.update({
          where: { id },
          data: { status: nextStatus }
        });
        return detached;
      });

      return res.json({
        success: true,
        message: 'Mission reset. Previous teams were detached and their reflections preserved.',
        detachedTeams
      });
    }

    if (action === 'continue_phase') {
      const memberIds: string[] = Array.isArray(newMemberIds) ? newMemberIds : [];
      await assertCubesAreActive(memberIds, 'continue on this mission');
      const nextStatus = targetStatus
        ? assertTransition(mission.status, targetStatus, transitionOptions)
        : null;

      const summary = await prisma.$transaction(async (tx) => {
        if (nextStatus) {
          await tx.mission.update({
            where: { id },
            data: { status: nextStatus }
          });
        }

        // Reconcile the roster instead of wiping and recreating it, so members
        // who stay on the mission keep their reflections and is_submitted flag.
        if (Array.isArray(newMemberIds) && mission.teams.length > 0) {
          return syncTeamMembers(
            tx,
            mission.teams[0].id,
            memberIds.map(cubeProfileId => ({ cubeProfileId }))
          );
        }
        return null;
      });

      return res.json({
        success: true,
        message: 'Mission transitioned to next phase.',
        memberChanges: summary
      });
    }

    throw badRequest('Invalid action parameter');
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
