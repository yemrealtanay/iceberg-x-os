/**
 * Badges and awards.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isAdmin, isMentorOrAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { badRequest, conflict, forbidden, sendError } from '../utils/http';

const router = Router();

// Get badges
router.get('/badges', requireAuth, async (req, res) => {
  try {
    const badges = await prisma.badge.findMany({
      include: {
        cube_badges: {
          include: {
            cube: { include: { user: { select: { name: true } } } }
          }
        }
      }
    });
    return res.json(badges);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Create Badge (Admin only)
router.post('/badges', requireAuth, isAdmin, async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name || !description || !icon) {
      return res.status(400).json({ error: 'Missing name, description, or icon' });
    }

    const badge = await prisma.badge.create({
      data: { name, description, icon }
    });

    return res.status(201).json(badge);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Award Badge (Admin or Mentor depending on admin configuration, let's allow both in code)
router.post('/badges/award', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { cubeProfileId, badgeId, missionId, reason } = req.body;
    if (!cubeProfileId || !badgeId || !reason) {
      throw badRequest('Missing cubeProfileId, badgeId, or reason');
    }

    if (!req.user) throw forbidden('Unauthorized');

    // Enforced in the application layer rather than as a database constraint,
    // so existing duplicate awards are left untouched.
    const alreadyAwarded = await prisma.cubeBadge.findFirst({
      where: {
        cube_id: cubeProfileId,
        badge_id: badgeId,
        mission_id: missionId || null
      },
      include: { badge: { select: { name: true } } }
    });

    if (alreadyAwarded) {
      throw conflict(
        `This Cube already holds the "${alreadyAwarded.badge.name}" badge` +
        `${missionId ? ' for this mission' : ''}.`
      );
    }

    const award = await prisma.cubeBadge.create({
      data: {
        cube_id: cubeProfileId,
        badge_id: badgeId,
        mission_id: missionId || null,
        awarded_by_id: req.user.id,
        reason
      }
    });

    return res.status(201).json(award);
  } catch (error: any) {
    return sendError(res, error);
  }
});

router.delete('/badges/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.badge.delete({ where: { id } });
    return res.json({ success: true, message: 'Badge deleted successfully' });
  } catch (error: any) {
    return sendError(res, error);
  }
});

router.delete('/badges/award/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cubeBadge.delete({ where: { id } });
    return res.json({ success: true, message: 'Badge award revoked successfully' });
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
