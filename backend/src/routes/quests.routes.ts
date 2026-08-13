/**
 * Quests and gamification endpoints.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isAdmin, isMentorOrAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { badRequest, conflict, notFound, sendError, forbidden } from '../utils/http';
import { assignQuestToCubes, verifyQuestProgress } from '../services/quest.service';
import { BadgeRarity } from '@prisma/client';
import { IN_PROGRAMME_CUBE_LEVELS } from '../config/constants';

const router = Router();

// Create Quest (Admin only)
router.post('/admin/quests', requireAuth, isAdmin, async (req, res) => {
  try {
    const { title, description, difficulty, criteria_type, criteria_value, is_timed, expires_at, reward_badge_ids, dependency_quest_id } = req.body;

    if (!title || !description || !criteria_type || criteria_value === undefined) {
      throw badRequest('Missing required quest fields: title, description, criteria_type, and criteria_value are required.');
    }

    const trimmedTitle = String(title).trim();
    const existing = await prisma.quest.findFirst({ where: { title: trimmedTitle } });
    if (existing) {
      throw conflict(`A quest with the title "${trimmedTitle}" already exists.`);
    }

    // Validate criteria_type
    const validCriteriaTypes = ['missions_completed', 'average_score', 'login_streak', 'meeting_attendance', 'custom', 'profile_completion', 'write_testimonial'];
    if (!validCriteriaTypes.includes(criteria_type)) {
      throw badRequest(`Criteria type must be one of: ${validCriteriaTypes.join(', ')}.`);
    }

    // Validate difficulty
    const rarity = difficulty ? (difficulty as BadgeRarity) : BadgeRarity.Common;
    if (!Object.values(BadgeRarity).includes(rarity)) {
      throw badRequest(`Difficulty/Rarity must be one of: ${Object.values(BadgeRarity).join(', ')}.`);
    }

    const badgeIds: string[] = Array.isArray(reward_badge_ids) ? reward_badge_ids : [];

    const quest = await prisma.quest.create({
      data: {
        title: trimmedTitle,
        description: String(description).trim(),
        difficulty: rarity,
        criteria_type,
        criteria_value: Number(criteria_value),
        is_timed: is_timed === true,
        expires_at: expires_at ? new Date(expires_at) : null,
        dependency_quest_id: dependency_quest_id || null,
        rewards: {
          connect: badgeIds.map(id => ({ id }))
        }
      },
      include: { rewards: true }
    });

    return res.status(201).json(quest);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// List Quests (Cube list progress, Admin/Mentor list definitions)
router.get('/quests', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) throw forbidden('Unauthorized');

    if (req.user.role === 'CUBE') {
      const cubeProfileId = req.user.cubeProfileId;
      if (!cubeProfileId) {
        return res.json([]);
      }

      // Fetch assigned quests with progress
      const cubeQuests = await prisma.cubeQuest.findMany({
        where: { cube_id: cubeProfileId },
        include: {
          quest: {
            include: { rewards: true }
          }
        },
        orderBy: { assigned_at: 'desc' }
      });

      return res.json(cubeQuests);
    } 
    else {
      // Admins/Mentors view all quest definitions
      const quests = await prisma.quest.findMany({
        include: {
          rewards: true,
          cube_quests: {
            include: {
              cube: { include: { user: { select: { name: true } } } }
            }
          }
        },
        orderBy: { created_at: 'desc' }
      });

      return res.json(quests);
    }
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Assign Quest to Cubes (Admin only)
router.post('/admin/quests/assign', requireAuth, isAdmin, async (req, res) => {
  try {
    const { questId, target, cubeProfileIds } = req.body;

    if (!questId) {
      throw badRequest('questId is required.');
    }

    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) throw notFound('Quest not found');

    let idsToAssign: string[] = [];

    if (target === 'all') {
      const cubes = await prisma.cubeProfile.findMany({
        where: { current_level: { in: IN_PROGRAMME_CUBE_LEVELS } },
        select: { id: true }
      });
      idsToAssign = cubes.map(c => c.id);
    } else if (Array.isArray(cubeProfileIds)) {
      idsToAssign = cubeProfileIds;
    } else {
      throw badRequest('Specify target as "all" or supply an array of cubeProfileIds.');
    }

    if (idsToAssign.length === 0) {
      return res.json({ success: true, message: 'No active Cubes found to assign.' });
    }

    await assignQuestToCubes(questId, idsToAssign);

    return res.json({ success: true, message: `Quest successfully assigned to ${idsToAssign.length} Cube(s).` });
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Force calculation of progress for all incomplete quest trackers (Admin/Mentor only)
router.post('/admin/quests/:id/verify', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const quest = await prisma.quest.findUnique({ where: { id } });
    if (!quest) throw notFound('Quest not found');

    const cubeQuests = await prisma.cubeQuest.findMany({
      where: { quest_id: id, is_completed: false },
      select: { cube_id: true }
    });

    let completedCount = 0;
    for (const cq of cubeQuests) {
      const result = await verifyQuestProgress(cq.cube_id, id);
      if (result.is_completed) completedCount++;
    }

    return res.json({
      success: true,
      evaluated: cubeQuests.length,
      newlyCompleted: completedCount,
      message: `Verified progress for ${cubeQuests.length} assigned Cube(s). ${completedCount} completed.`
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Update manual progress for "custom" criteria type quests (Admin/Mentor only)
router.post('/admin/quests/custom-progress', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { cubeProfileId, questId, value } = req.body;

    if (!cubeProfileId || !questId || value === undefined) {
      throw badRequest('Missing parameters: cubeProfileId, questId, and value are required.');
    }

    const cubeQuest = await prisma.cubeQuest.findUnique({
      where: { cube_id_quest_id: { cube_id: cubeProfileId, quest_id: questId } },
      include: { quest: true }
    });

    if (!cubeQuest) {
      throw notFound('Quest assignment not found for this Cube.');
    }

    if (cubeQuest.quest.criteria_type !== 'custom') {
      throw badRequest('Manual progress can only be updated for quests with "custom" criteria.');
    }

    // Update current value
    await prisma.cubeQuest.update({
      where: { cube_id_quest_id: { cube_id: cubeProfileId, quest_id: questId } },
      data: { current_value: Number(value) }
    });

    // Run verification immediately
    const updated = await verifyQuestProgress(cubeProfileId, questId);

    return res.json({
      success: true,
      current_value: updated.current_value,
      is_completed: updated.is_completed,
      message: updated.is_completed 
        ? 'Progress updated. Quest is now completed!' 
        : 'Progress updated successfully.'
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
