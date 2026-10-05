import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { badRequest, forbidden, sendError } from '../utils/http';
import { QuizService } from '../services/quiz.service';
import prisma from '../services/prisma';

const router = Router();

/**
 * Helper to ensure the authenticated user has a CubeProfile.
 * If user is ADMIN or MENTOR without CubeProfile, auto-links or informs them.
 */
/**
 * Helper to ensure the authenticated user has a CubeProfile.
 * The quiz and badge awarding system is exclusively for Cubes.
 */
async function getCubeProfileId(req: AuthenticatedRequest): Promise<string> {
  if (req.user?.cubeProfileId) {
    return req.user.cubeProfileId;
  }

  if (!req.user) throw forbidden('Authentication required.');

  if (req.user.role !== 'CUBE') {
    throw forbidden('The certification quiz is exclusively for Cubes.');
  }

  const profile = await prisma.cubeProfile.findUnique({
    where: { user_id: req.user.id }
  });

  if (!profile) {
    throw forbidden('Cube profile not found.');
  }

  req.user.cubeProfileId = profile.id;
  return profile.id;
}

/**
 * GET /quiz/status
 * Check current Cube's daily limit, active in-progress attempt, and highest score.
 * If user is Admin/Mentor, returns staff test status without requiring CubeProfile.
 */
router.get('/quiz/status', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (req.user?.role !== 'CUBE') {
      const status = QuizService.getStaffStatus(req.user!.id);
      return res.json(status);
    }

    const cubeProfileId = await getCubeProfileId(req);
    const status = await QuizService.getCubeQuizStatus(cubeProfileId);
    return res.json(status);
  } catch (error) {
    return sendError(res, error);
  }
});

/**
 * POST /quiz/start
 * Start a new quiz attempt or resume active one.
 * If staff, runs in sandbox test mode without writing to CubeProfile.
 */
router.post('/quiz/start', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (req.user?.role !== 'CUBE') {
      const session = QuizService.startStaffTestQuiz(req.user!.id);
      return res.json(session);
    }

    const cubeProfileId = await getCubeProfileId(req);
    const session = await QuizService.startOrResumeQuiz(cubeProfileId);
    return res.json(session);
  } catch (error) {
    return sendError(res, error);
  }
});

/**
 * POST /quiz/hint
 * Request a hint for questionIndex in an in-progress attempt.
 */
router.post('/quiz/hint', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { attemptId, questionIndex } = req.body;

    if (!attemptId || questionIndex === undefined) {
      throw badRequest('Missing attemptId or questionIndex');
    }

    if (String(attemptId).startsWith('staff-') || req.user?.role !== 'CUBE') {
      const hintData = QuizService.requestStaffHint(attemptId, req.user!.id, Number(questionIndex));
      return res.json(hintData);
    }

    const cubeProfileId = await getCubeProfileId(req);
    const hintData = await QuizService.requestHint(attemptId, cubeProfileId, Number(questionIndex));
    return res.json(hintData);
  } catch (error) {
    return sendError(res, error);
  }
});

/**
 * POST /quiz/submit
 * Submit answers, evaluate score, apply penalties, and award/upgrade badges.
 */
router.post('/quiz/submit', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { attemptId, answers, matchingAnswers } = req.body;

    if (!attemptId) {
      throw badRequest('Missing attemptId');
    }

    if (!Array.isArray(answers) || !Array.isArray(matchingAnswers)) {
      throw badRequest('Answers and matchingAnswers must be arrays.');
    }

    if (String(attemptId).startsWith('staff-') || req.user?.role !== 'CUBE') {
      const result = await QuizService.submitStaffTestQuiz(attemptId, req.user!.id, answers, matchingAnswers);
      return res.json(result);
    }

    const cubeProfileId = await getCubeProfileId(req);
    const result = await QuizService.submitQuiz(attemptId, cubeProfileId, answers, matchingAnswers);
    return res.json(result);
  } catch (error) {
    return sendError(res, error);
  }
});

/**
 * GET /quiz/my-results
 * Get all completed attempts for the current Cube.
 */
router.get('/quiz/my-results', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (req.user?.role !== 'CUBE') {
      return res.json([]);
    }

    const cubeProfileId = await getCubeProfileId(req);
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        cube_id: cubeProfileId,
        status: { in: ['completed', 'timed_out'] }
      },
      include: {
        badge_awarded: {
          select: { id: true, name: true, rarity: true, icon: true }
        }
      },
      orderBy: { completed_at: 'desc' }
    });

    return res.json(attempts);
  } catch (error) {
    return sendError(res, error);
  }
});

/**
 * GET /quiz/leaderboard
 * Top Cubes by score on Web Fundamentals Quiz.
 */
router.get('/quiz/leaderboard', requireAuth, async (_req, res) => {
  try {
    const topAttempts = await prisma.quizAttempt.findMany({
      where: {
        status: 'completed',
        cube: {
          user: {
            role: 'CUBE'
          }
        }
      },
      orderBy: [{ score: 'desc' }, { duration_seconds: 'asc' }],
      take: 20,
      include: {
        cube: {
          include: {
            user: {
              select: { id: true, name: true, avatar_url: true }
            }
          }
        },
        badge_awarded: {
          select: { id: true, name: true, rarity: true, icon: true }
        }
      }
    });

    // Deduplicate so each Cube is listed only once with their best score
    const seenCubes = new Set<string>();
    const leaderboard: any[] = [];

    for (const a of topAttempts) {
      if (!seenCubes.has(a.cube_id)) {
        seenCubes.add(a.cube_id);
        leaderboard.push({
          cubeId: a.cube_id,
          cubeNumber: a.cube.cube_number,
          userName: a.cube.user?.name || 'Unknown Cube',
          avatarUrl: a.cube.user?.avatar_url,
          score: a.score,
          durationSeconds: a.duration_seconds,
          completedAt: a.completed_at,
          badge: a.badge_awarded
        });
      }
    }

    return res.json(leaderboard);
  } catch (error) {
    return sendError(res, error);
  }
});

export default router;
