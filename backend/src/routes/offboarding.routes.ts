/**
 * Offboarding, certificates and public verification.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isMentorOrAdmin } from '../middlewares/auth.middleware';
import { badRequest, conflict, notFound, sendError } from '../utils/http';
import { CubeLevel } from '@prisma/client';

const router = Router();

// Get Cube stats for offboarding preview
router.get('/offboarding/stats/:cubeId', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { cubeId } = req.params;
    const profile = await prisma.cubeProfile.findUnique({
      where: { id: cubeId },
      include: {
        user: true,
        team_memberships: {
          include: {
            team: {
              include: {
                mission: true
              }
            }
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Cube profile not found' });
    }

    const completedMissionsCount = profile.team_memberships.filter((m: any) => 
      m.is_submitted && 
      m.team.mission &&
      (m.team.mission.status === 'completed' || m.team.mission.status === 'reviewed')
    ).length;

    const badgesCount = await prisma.cubeBadge.count({
      where: { cube_id: cubeId }
    });

    // Denominator is every completed meeting the Cube was invited to, not just
    // the ones that happen to have an attendance row. A meeting closed without
    // a record for this Cube used to be invisible and inflate the rate.
    const invitedMeetings = await prisma.meeting.findMany({
      where: { is_completed: true, invited_cube_ids: { has: cubeId } },
      select: { id: true }
    });

    const attendance = await prisma.meetingAttendance.findMany({
      where: { cube_id: cubeId },
      select: { meeting_id: true, attended: true }
    });

    const meetingIds = new Set<string>([
      ...invitedMeetings.map(m => m.id),
      ...attendance.map(a => a.meeting_id)
    ]);
    const attendedMeetingIds = new Set(
      attendance.filter(a => a.attended).map(a => a.meeting_id)
    );

    const totalMeetings = meetingIds.size;
    const attendedMeetings = attendedMeetingIds.size;
    // null means "no meeting history yet" — the UI must not show it as 100%
    const attendanceRate = totalMeetings > 0
      ? Math.round((attendedMeetings / totalMeetings) * 100)
      : null;

    return res.json({
      completedMissions: completedMissionsCount,
      badgesEarned: badgesCount,
      attendanceRate,
      totalMeetings,
      attendedMeetings
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Get offboarded alumni list
router.get('/offboarding/alumni', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const alumni = await prisma.cubeProfile.findMany({
      where: { current_level: CubeLevel.Alumni },
      include: {
        user: { select: { id: true, name: true, email: true } },
        offboarding_record: true
      },
      orderBy: { cube_number: 'asc' }
    });
    return res.json(alumni);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Perform offboarding
router.post('/offboarding', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { cubeProfileId, type, mentorName, emailTextTr, emailTextEn, targetLevel } = req.body;
    if (!cubeProfileId || !type || !mentorName || !emailTextTr || !emailTextEn) {
      throw badRequest('cubeProfileId, type, mentorName, emailTextTr, and emailTextEn are required');
    }

    const profile = await prisma.cubeProfile.findUnique({
      where: { id: cubeProfileId },
      include: { offboarding_record: true }
    });

    if (!profile) {
      throw notFound('Cube profile not found');
    }

    if (profile.offboarding_record) {
      throw conflict(
        `This Cube already has certificate ${profile.offboarding_record.certificate_no}. ` +
        `Revert the existing offboarding first.`
      );
    }

    // Validate targetLevel or fallback to Alumni
    let levelToSet: CubeLevel = CubeLevel.Alumni;
    if (targetLevel) {
      if (Object.values(CubeLevel).includes(targetLevel as any)) {
        levelToSet = targetLevel as CubeLevel;
      } else {
        throw badRequest(`Invalid targetLevel. Must be one of: ${Object.values(CubeLevel).join(', ')}`);
      }
    }

    // Certificate No: ICE-YYYY-0000XX. Existing certificates keep this exact
    // format; a re-issue in the same year gets an -R2/-R3 suffix instead of
    // hitting the unique constraint and returning a raw 500.
    const currentYear = new Date().getFullYear();
    const cubeNumStr = profile.cube_number.padStart(6, '0');
    const baseCertificateNo = `ICE-${currentYear}-${cubeNumStr}`;

    let certificateNo = baseCertificateNo;
    for (let attempt = 2; attempt <= 50; attempt++) {
      const clash = await prisma.offboardingRecord.findUnique({
        where: { certificate_no: certificateNo },
        select: { id: true }
      });
      if (!clash) break;
      certificateNo = `${baseCertificateNo}-R${attempt}`;
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update Cube Level to selected target level
      await tx.cubeProfile.update({
        where: { id: cubeProfileId },
        data: { current_level: levelToSet }
      });

      // Create OffboardingRecord
      const record = await tx.offboardingRecord.create({
        data: {
          cube_id: cubeProfileId,
          certificate_no: certificateNo,
          type,
          mentor_name: mentorName,
          email_text_tr: emailTextTr,
          email_text_en: emailTextEn
        }
      });

      return record;
    });

    return res.status(201).json(result);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Revert offboarding for a Cube
router.post('/offboarding/revert', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { cubeProfileId, targetLevel } = req.body;
    if (!cubeProfileId || !targetLevel) {
      return res.status(400).json({ error: 'cubeProfileId and targetLevel are required' });
    }

    if (!Object.values(CubeLevel).includes(targetLevel as any)) {
      return res.status(400).json({ error: `Invalid targetLevel. Must be one of: ${Object.values(CubeLevel).join(', ')}` });
    }

    const profile = await prisma.cubeProfile.findUnique({
      where: { id: cubeProfileId },
      include: { offboarding_record: true }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Cube profile not found' });
    }

    if (!profile.offboarding_record) {
      return res.status(400).json({ error: 'This Cube is not currently offboarded' });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete OffboardingRecord
      await tx.offboardingRecord.delete({
        where: { cube_id: cubeProfileId }
      });

      // 2. Revert level back to selected targetLevel
      await tx.cubeProfile.update({
        where: { id: cubeProfileId },
        data: { current_level: targetLevel as CubeLevel }
      });
    });

    return res.status(200).json({ message: 'Offboarding successfully reverted' });
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Public verify certificate endpoint
router.get('/offboarding/verify/:certNo', async (req, res) => {
  try {
    const { certNo } = req.params;
    const record = await prisma.offboardingRecord.findUnique({
      where: { certificate_no: certNo },
      include: {
        cube: {
          include: {
            user: { select: { name: true } }
          }
        }
      }
    });

    if (!record) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    return res.json({
      certificate_no: record.certificate_no,
      type: record.type,
      cube_name: record.cube.user.name,
      cube_number: record.cube.cube_number,
      mentor_name: record.mentor_name,
      issue_date: record.issue_date,
      cohort: record.cube.cohort
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
