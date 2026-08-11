/**
 * Demo days and presentations.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isMentorOrAdmin } from '../middlewares/auth.middleware';
import { sendError } from '../utils/http';
import { createBulkNotification } from '../services/notification.service';

const router = Router();

// List demo days
router.get('/demodays', requireAuth, async (req, res) => {
  try {
    const days = await prisma.demoDay.findMany({
      include: {
        presentations: {
          include: {
            mission: true,
            team: true,
            presenter: { select: { name: true, cube_profile: { select: { id: true } } } },
            demo_submission: true
          }
        }
      },
      orderBy: { date: 'asc' }
    });
    return res.json(days);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Create Demo Day
router.post('/demodays', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { title, date, description, notify } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and Date are required' });
    }

    const day = await prisma.demoDay.create({
      data: {
        title,
        date: new Date(date),
        description
      }
    });

    if (notify) {
      await createBulkNotification(`A new demo day has been scheduled: ${title}`);
    }

    return res.status(201).json(day);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Add Presentation
router.post('/demodays/:id/presentations', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params; // demoDayId
    const { mission_id, team_id, presenter_id, demo_submission_id, decision, mentor_summary } = req.body;

    if (!mission_id || !presenter_id) {
      return res.status(400).json({ error: 'mission_id and presenter_id are required' });
    }

    const pres = await prisma.demoDayPresentation.create({
      data: {
        demo_day_id: id,
        mission_id,
        team_id: team_id || null,
        presenter_id,
        demo_submission_id: demo_submission_id || null,
        decision,
        mentor_summary
      }
    });

    return res.status(201).json(pres);
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
