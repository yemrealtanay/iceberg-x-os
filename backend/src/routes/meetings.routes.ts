/**
 * Meetings and attendance.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isMentorOrAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { forbidden, notFound, sendError } from '../utils/http';
import { createBulkNotification } from '../services/notification.service';
import { assertCubesAreActive } from '../services/cubeStatus.service';

const router = Router();

/**
 * A Cube may only see a meeting they were invited to or attended. Meetings with
 * an empty invite list are treated as programme-wide and stay visible to all,
 * which is how `invited_cube_ids` has always been interpreted in the UI.
 */
function cubeVisibilityFilter(cubeProfileId?: string) {
  return {
    OR: [
      { invited_cube_ids: { isEmpty: true } },
      { invited_cube_ids: { has: cubeProfileId || '' } },
      { attendance: { some: { cube_id: cubeProfileId || '' } } }
    ]
  };
}

/**
 * Strips other Cubes' attendance rows (and therefore their absence excuses),
 * keeping only the requester's own record plus the aggregate counts the UI
 * needs for its "n / m attended" summary.
 */
function redactAttendanceForCube(meeting: any, cubeProfileId?: string) {
  const all = meeting.attendance || [];
  return {
    ...meeting,
    attendance: all.filter((a: any) => a.cube_id === cubeProfileId),
    attendance_summary: {
      total: all.length,
      attended: all.filter((a: any) => a.attended).length
    }
  };
}

// List meetings visible to the requester
router.get('/meetings', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'MENTOR';

    const meetings = await prisma.meeting.findMany({
      where: isStaff ? {} : cubeVisibilityFilter(req.user?.cubeProfileId),
      include: {
        attendance: {
          include: {
            cube: {
              include: {
                user: { select: { name: true } }
              }
            }
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    if (isStaff) return res.json(meetings);

    return res.json(meetings.map(m => redactAttendanceForCube(m, req.user?.cubeProfileId)));
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Get single meeting detail
router.get('/meetings/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const meeting = await prisma.meeting.findUnique({
      where: { id },
      include: {
        attendance: {
          include: {
            cube: {
              include: {
                user: { select: { id: true, name: true, email: true } }
              }
            }
          }
        }
      }
    });

    if (!meeting) {
      throw notFound('Meeting not found');
    }

    const isStaff = req.user?.role === 'ADMIN' || req.user?.role === 'MENTOR';
    if (isStaff) return res.json(meeting);

    const cubeProfileId = req.user?.cubeProfileId;
    const invited = meeting.invited_cube_ids || [];
    const canSee =
      invited.length === 0 ||
      (cubeProfileId ? invited.includes(cubeProfileId) : false) ||
      meeting.attendance.some(a => a.cube_id === cubeProfileId);

    if (!canSee) {
      throw forbidden('You were not invited to this meeting.');
    }

    return res.json(redactAttendanceForCube(meeting, cubeProfileId));
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Create meeting (Admin/Mentor only)
router.post('/meetings', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { title, description, date, notify, invited_cube_ids } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'title and date are required' });
    }

    if (Array.isArray(invited_cube_ids)) {
      await assertCubesAreActive(invited_cube_ids, 'be invited to a meeting');
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        date: new Date(date),
        invited_cube_ids: Array.isArray(invited_cube_ids) ? invited_cube_ids : []
      }
    });

    if (notify) {
      await createBulkNotification(`A new meeting has been scheduled: ${title}`);
    }

    return res.status(201).json(meeting);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Edit meeting (Admin/Mentor only)
router.put('/meetings/:id', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, invited_cube_ids } = req.body;

    if (Array.isArray(invited_cube_ids)) {
      await assertCubesAreActive(invited_cube_ids, 'be invited to a meeting');
    }

    const meeting = await prisma.meeting.update({
      where: { id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined,
        invited_cube_ids: Array.isArray(invited_cube_ids) ? invited_cube_ids : undefined
      }
    });
    return res.json(meeting);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Complete meeting and log attendance (Admin/Mentor only)
router.post('/meetings/:id/complete', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { decisions, summary, attendance } = req.body; // attendance: Array of { cube_id: string, attended: boolean, excuse?: string }

    if (!Array.isArray(attendance)) {
      return res.status(400).json({ error: 'attendance must be an array' });
    }

    // Wrap in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update meeting details
      const updatedMeeting = await tx.meeting.update({
        where: { id },
        data: {
          is_completed: true,
          decisions,
          summary
        }
      });

      // 2. Upsert attendance records
      for (const att of attendance) {
        await tx.meetingAttendance.upsert({
          where: {
            meeting_id_cube_id: {
              meeting_id: id,
              cube_id: att.cube_id
            }
          },
          update: {
            attended: att.attended,
            excuse: att.excuse || null
          },
          create: {
            meeting_id: id,
            cube_id: att.cube_id,
            attended: att.attended,
            excuse: att.excuse || null
          }
        });
      }

      return updatedMeeting;
    });

    return res.json(result);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Delete meeting (Admin/Mentor only)
router.delete('/meetings/:id', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.meeting.delete({
      where: { id }
    });
    return res.json({ message: 'Meeting deleted successfully' });
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
