/**
 * Mentor feedback scorecards.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isAdmin, isMentorOrAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { MIN_SCORE, MAX_SCORE } from '../config/constants';
import { badRequest, forbidden, sendError, parseScore } from '../utils/http';
import { createSingleNotification } from '../services/notification.service';
import { RecommendedNextStep } from '@prisma/client';

const router = Router();

// Add Mentor Feedback / Review (Mentor or Admin)
router.post('/feedback', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      cube_id, // User ID of Cube
      mission_id,
      technical_ability_score,
      research_ability_score,
      demo_output_score,
      ownership_score,
      communication_score,
      leadership_score,
      product_thinking_score,
      reliability_score,
      self_reflection_score,
      strengths,
      areas_to_improve,
      private_notes,
      visible_to_cube,
      recommended_next_step
    } = req.body;

    if (!cube_id || !recommended_next_step || !strengths || !areas_to_improve) {
      throw badRequest('Missing feedback fields');
    }

    // The radar chart renders score / 5, so anything outside 1..5 (or NaN from
    // an empty field) corrupted the chart. Validate before writing.
    const rawScores: Record<string, any> = {
      technical_ability_score,
      research_ability_score,
      demo_output_score,
      ownership_score,
      communication_score,
      leadership_score,
      product_thinking_score,
      reliability_score,
      self_reflection_score
    };

    const scores: Record<string, number> = {};
    const invalidScores: string[] = [];
    for (const [key, value] of Object.entries(rawScores)) {
      const parsed = parseScore(value);
      if (parsed === null) {
        invalidScores.push(key);
      } else {
        scores[key] = parsed;
      }
    }

    if (invalidScores.length > 0) {
      throw badRequest(
        `Scores must be whole numbers between ${MIN_SCORE} and ${MAX_SCORE}.`,
        { invalidScores }
      );
    }

    if (!req.user) throw forbidden('Unauthorized');

    const targetMissionId = mission_id ? String(mission_id) : null;
    let feedback;

    const feedbackData = {
      ...(scores as any),
      strengths,
      areas_to_improve,
      private_notes,
      visible_to_cube: !!visible_to_cube,
      recommended_next_step: recommended_next_step as RecommendedNextStep
    };

    if (!targetMissionId) {
      // Postgres treats NULLs as distinct, so the composite unique constraint
      // does not cover general (mission-less) feedback; look it up explicitly.
      const existing = await prisma.mentorFeedback.findFirst({
        where: {
          cube_id,
          mission_id: null,
          mentor_id: req.user.id
        }
      });

      if (existing) {
        feedback = await prisma.mentorFeedback.update({
          where: { id: existing.id },
          data: feedbackData
        });
      } else {
        feedback = await prisma.mentorFeedback.create({
          data: {
            cube_id,
            mission_id: null,
            mentor_id: req.user.id,
            ...feedbackData
          }
        });
      }
    } else {
      // Upsert feedback for mission-based feedback
      feedback = await prisma.mentorFeedback.upsert({
        where: {
          cube_id_mission_id_mentor_id: {
            cube_id,
            mission_id: targetMissionId,
            mentor_id: req.user.id
          }
        },
        update: feedbackData,
        create: {
          cube_id,
          mission_id: targetMissionId,
          mentor_id: req.user.id,
          ...feedbackData
        }
      });
    }

    await createSingleNotification(cube_id, "A mentor graded your scorecard.");

    return res.status(201).json(feedback);
  } catch (error: any) {
    return sendError(res, error);
  }
});

router.delete('/feedback/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.mentorFeedback.delete({ where: { id } });
    return res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
