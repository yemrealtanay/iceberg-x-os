/**
 * Cube progress updates.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { sendError } from '../utils/http';
import { UpdateType } from '@prisma/client';

const router = Router();

// Submit an update (Cube only)
router.post('/updates', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { mission_id, type, content, blockers } = req.body;

    if (!mission_id || !type || !content) {
      return res.status(400).json({ error: 'Missing required parameters (mission_id, type, content)' });
    }

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    if (req.user.role === 'CUBE') {
      const profile = await prisma.cubeProfile.findUnique({
        where: { user_id: req.user.id }
      });
      if (!profile) {
        return res.status(403).json({ error: 'Cube profile not found' });
      }

      const isAssigned = await prisma.missionTeamMember.findFirst({
        where: {
          cube_id: profile.id,
          team: {
            mission_id: mission_id
          }
        }
      });

      if (!isAssigned) {
        return res.status(403).json({ error: 'You are not assigned to this mission.' });
      }
    }

    const newUpdate = await prisma.update.create({
      data: {
        cube_id: req.user.id,
        mission_id,
        type: type as UpdateType,
        content,
        blockers,
      }
    });

    return res.status(201).json(newUpdate);
  } catch (error: any) {
    return sendError(res, error);
  }
});

router.delete('/updates/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.update.delete({ where: { id } });
    return res.json({ success: true, message: 'Update deleted successfully' });
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
