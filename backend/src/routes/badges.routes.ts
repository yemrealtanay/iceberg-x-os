/**
 * Badges and awards.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isAdmin, isMentorOrAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { badRequest, conflict, forbidden, notFound, sendError } from '../utils/http';
import { BadgeRarity } from '@prisma/client';

const router = Router();

/** Rarity decides the frame a badge is presented with. */
function parseRarity(value: any, fallback: BadgeRarity = BadgeRarity.Common): BadgeRarity {
  if (value === undefined || value === null || value === '') return fallback;
  if (!Object.values(BadgeRarity).includes(value)) {
    throw badRequest(`Rarity must be one of: ${Object.values(BadgeRarity).join(', ')}.`);
  }
  return value as BadgeRarity;
}

/** Icon keys come from the frontend catalogue; keep them short and printable. */
function parseIcon(value: any): string {
  const icon = typeof value === 'string' ? value.trim() : '';
  if (!icon) throw badRequest('An icon is required.');
  if (icon.length > 64) throw badRequest('Icon key is too long.');
  return icon;
}

function parseAccent(value: any): string | null {
  if (value === undefined || value === null || value === '') return null;
  const accent = String(value).trim();
  if (accent.length > 32) throw badRequest('Accent key is too long.');
  return accent;
}

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
      },
      // Rarest first, so the showcase leads with the hardest to earn
      orderBy: [{ rarity: 'desc' }, { name: 'asc' }]
    });
    return res.json(badges);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Create Badge (Admin only)
router.post('/badges', requireAuth, isAdmin, async (req, res) => {
  try {
    const { name, description, icon, rarity, accent } = req.body;
    if (!name || !description) {
      throw badRequest('Missing name or description');
    }

    const trimmedName = String(name).trim();
    const existing = await prisma.badge.findUnique({ where: { name: trimmedName } });
    if (existing) {
      throw conflict(`A badge named "${trimmedName}" already exists.`);
    }

    const badge = await prisma.badge.create({
      data: {
        name: trimmedName,
        description: String(description).trim(),
        icon: parseIcon(icon),
        rarity: parseRarity(rarity),
        accent: parseAccent(accent)
      }
    });

    return res.status(201).json(badge);
  } catch (error: any) {
    return sendError(res, error);
  }
});

/**
 * Edit a badge definition (Admin only).
 *
 * Only the definition changes — every CubeBadge award already handed out keeps
 * pointing at this badge and is untouched, so redesigning a badge silently
 * restyles the awards rather than revoking them.
 */
router.put('/badges/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, rarity, accent } = req.body;

    const existing = await prisma.badge.findUnique({ where: { id } });
    if (!existing) throw notFound('Badge not found');

    const data: any = {};

    if (name !== undefined) {
      const trimmedName = String(name).trim();
      if (!trimmedName) throw badRequest('Badge name cannot be empty.');
      if (trimmedName !== existing.name) {
        const clash = await prisma.badge.findUnique({ where: { name: trimmedName } });
        if (clash) throw conflict(`A badge named "${trimmedName}" already exists.`);
      }
      data.name = trimmedName;
    }

    if (description !== undefined) {
      const trimmed = String(description).trim();
      if (!trimmed) throw badRequest('Badge description cannot be empty.');
      data.description = trimmed;
    }

    if (icon !== undefined) data.icon = parseIcon(icon);
    if (rarity !== undefined) data.rarity = parseRarity(rarity, existing.rarity);
    if (accent !== undefined) data.accent = parseAccent(accent);

    const badge = await prisma.badge.update({ where: { id }, data });
    return res.json(badge);
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

/**
 * Deleting a badge definition cascades into every award of it. Editing the
 * badge is almost always what is wanted instead, so the awards are counted
 * first and destroying them has to be confirmed with ?force=true.
 */
router.delete('/badges/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const badge = await prisma.badge.findUnique({
      where: { id },
      select: { id: true, name: true }
    });
    if (!badge) throw notFound('Badge not found');

    const awardCount = await prisma.cubeBadge.count({ where: { badge_id: id } });

    if (awardCount > 0 && req.query.force !== 'true') {
      throw conflict(
        `"${badge.name}" has been awarded to ${awardCount} Cube(s). Deleting it removes ` +
        `those awards from their profiles permanently. Edit the badge instead, or ` +
        `re-send with ?force=true to confirm.`,
        { awardCount }
      );
    }

    await prisma.badge.delete({ where: { id } });
    return res.json({ success: true, message: 'Badge deleted successfully', revokedAwards: awardCount });
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
