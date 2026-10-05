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
async function getOrCreateCubeProfileId(req: AuthenticatedRequest): Promise<string> {
  if (req.user?.cubeProfileId) {
    return req.user.cubeProfileId;
  }

  if (!req.user) throw forbidden('Authentication required.');

  // For Admin or Mentor testing, find if they have a profile or create a test profile
  const profile = await prisma.cubeProfile.findUnique({
    where: { user_id: req.user.id }
  });

  if (profile) {
    req.user.cubeProfileId = profile.id;
    return profile.id;
  }

  if (req.user.role === 'ADMIN' || req.user.role === 'MENTOR') {
    // Automatically create a tester cube profile for admin/mentor testing
    const testProfile = await prisma.cubeProfile.create({
      data: {
        user_id: req.user.id,
        cube_number: `T-${req.user.role.substring(0, 3)}`,
        cohort: 'Staff Testing',
        university: 'Iceberg Staff',
        department: 'Operations',
        skills: ['Web Architecture'],
        interests: ['Education'],
        is_founding_cube: false
      }
    });
    req.user.cubeProfileId = testProfile.id;
    return testProfile.id;
  }

  throw forbidden('Only registered Cubes can participate in the Quiz.');
}

/**
 * GET /quiz/status
 * Check current Cube's daily limit, active in-progress attempt, and highest score.
 */
router.get('/quiz/status', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const cubeProfileId = await getOrCreateCubeProfileId(req);
    const status = await QuizService.getCubeQuizStatus(cubeProfileId);
    return res.json(status);
  } catch (error) {
    return sendError(res, error);
  }
});

/**
 * POST /quiz/start
 * Start a new quiz attempt or resume active one.
 */
router.post('/quiz/start', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const cubeProfileId = await getOrCreateCubeProfileId(req);
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
    const cubeProfileId = await getOrCreateCubeProfileId(req);
    const { attemptId, questionIndex } = req.body;

    if (!attemptId || questionIndex === undefined) {
      throw badRequest('Missing attemptId or questionIndex');
    }

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
    const cubeProfileId = await getOrCreateCubeProfileId(req);
    const { attemptId, answers, matchingAnswers } = req.body;

    if (!attemptId) {
      throw badRequest('Missing attemptId');
    }

    if (!Array.isArray(answers) || !Array.isArray(matchingAnswers)) {
      throw badRequest('Answers and matchingAnswers must be arrays.');
    }

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
    const cubeProfileId = await getOrCreateCubeProfileId(req);
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
      where: { status: 'completed' },
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
