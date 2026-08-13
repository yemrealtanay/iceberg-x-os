/**
 * Cube testimonials and moderation.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isMentorOrAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { sendError } from '../utils/http';
import { recalculateAllQuestsForCube } from '../services/quest.service';

const router = Router();

// Create testimonial (Cubes only)
router.post('/testimonials', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || req.user.role !== 'CUBE') {
      return res.status(403).json({ error: 'Only Cubes can write testimonials' });
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Testimonial content is required' });
    }

    const trimmed = content.trim();
    if (trimmed.length > 300) {
      return res.status(400).json({ error: 'Testimonial content cannot exceed 300 characters' });
    }

    const profile = await prisma.cubeProfile.findUnique({
      where: { user_id: req.user.id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Cube profile not found' });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        cube_id: profile.id,
        content: content.trim(),
        is_approved: false
      }
    });

    // Trigger quest re-evaluations for testimonial writing
    await recalculateAllQuestsForCube(profile.id);

    return res.status(201).json(testimonial);
  } catch (error: any) {
    return sendError(res, error);
  }
});

/**
 * List approved testimonials. Public — no auth.
 *
 * `select` (not `include`) on `cube` is deliberate: an `include` here fetches
 * every scalar on CubeProfile — phone_number, github/gitlab/linkedin, slack
 * handle, skills, interests, mentor assignment — and ships it to anyone with
 * no login at all. Only the name and Cube number belong on a public page.
 */
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { is_approved: true },
      select: {
        id: true, // needed only as a React key; not personal data
        content: true,
        cube: {
          select: {
            cube_number: true,
            user: { select: { name: true } }
          }
        }
      },
      // Sorting by created_at doesn't require selecting it back
      orderBy: { created_at: 'desc' }
    });
    return res.json(testimonials);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// List all testimonials for moderation (Admin/Mentor only)
router.get('/admin/testimonials', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      select: {
        id: true,
        content: true,
        is_approved: true,
        created_at: true,
        cube: {
          // Staff already sees every one of these fields via /cubes, so a
          // wider select here is not a leak — kept to just what the
          // moderation view renders.
          select: {
            id: true,
            cube_number: true,
            cohort: true,
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    return res.json(testimonials);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Approve a testimonial (Admin/Mentor only)
router.put('/testimonials/:id/approve', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: { is_approved: true }
    });

    return res.json({ success: true, testimonial });
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Delete a testimonial (Admin/Mentor only)
router.delete('/testimonials/:id', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.testimonial.delete({
      where: { id }
    });

    return res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
