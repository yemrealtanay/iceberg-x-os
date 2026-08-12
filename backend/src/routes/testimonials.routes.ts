/**
 * Cube testimonials and moderation.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isMentorOrAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { sendError } from '../utils/http';

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

    return res.status(201).json(testimonial);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// List approved testimonials (Public)
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { is_approved: true },
      include: {
        cube: {
          include: {
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

// List all testimonials for moderation (Admin/Mentor only)
router.get('/admin/testimonials', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      include: {
        cube: {
          include: {
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
