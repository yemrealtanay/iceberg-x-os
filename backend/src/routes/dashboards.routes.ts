/**
 * Role-specific dashboard aggregates.
 */
import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, isAdmin, isMentorOrAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ACTIVE_CUBE_LEVELS, ACTIVE_MISSION_STATUSES } from '../config/constants';
import { sendError } from '../utils/http';

const router = Router();

router.get('/admin/dashboard', requireAuth, isAdmin, async (req, res) => {
  try {
    const totalCubes = await prisma.cubeProfile.count();
    const pendingApplicationsCount = await prisma.cubeApplication.count({ where: { status: 'pending' } });
    // Same definition as GET /cubes?active=true, which previously counted only
    // level "Cube" and disagreed with this dashboard.
    const activeCubes = await prisma.cubeProfile.count({
      where: { current_level: { in: ACTIVE_CUBE_LEVELS } }
    });
    const activeMissions = await prisma.mission.count({
      where: { status: { in: ACTIVE_MISSION_STATUSES } }
    });

    const missionsByStatus = await prisma.mission.groupBy({
      by: ['status'],
      _count: true
    });

    const upcomingDemoDays = await prisma.demoDay.findMany({
      where: { date: { gte: new Date() } },
      take: 3,
      orderBy: { date: 'asc' }
    });

    const recentDemos = await prisma.demoSubmission.findMany({
      take: 5,
      orderBy: { submitted_at: 'desc' },
      include: {
        mission: { select: { title: true } },
        submitted_by: { select: { name: true } }
      }
    });

    const recentBadges = await prisma.cubeBadge.findMany({
      take: 5,
      orderBy: { awarded_at: 'desc' },
      include: {
        cube: { include: { user: { select: { name: true } } } },
        badge: true
      }
    });

    // Cubes recommended for progression
    const recommendedFeedback = await prisma.mentorFeedback.findMany({
      where: {
        recommended_next_step: {
          in: ['Consider_for_Senior_Cube', 'Consider_as_Iceberger', 'Consider_as_Alumni']
        }
      },
      include: {
        cube: { select: { id: true, name: true, cube_profile: { select: { id: true, current_level: true } } } },
        mentor: { select: { name: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 5
    });

    const progressionCubes = recommendedFeedback.map(f => ({
      cubeId: f.cube.cube_profile?.id,
      name: f.cube.name,
      current_level: f.cube.cube_profile?.current_level,
      recommended: f.recommended_next_step,
      by: f.mentor.name
    }));

    // Cubes at inactive risk
    const inactiveRiskFeedback = await prisma.mentorFeedback.findMany({
      where: {
        recommended_next_step: 'Inactive_Risk'
      },
      include: {
        cube: { select: { id: true, name: true, cube_profile: { select: { id: true } } } },
        mentor: { select: { name: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    const inactiveRiskCubes = inactiveRiskFeedback.map(f => ({
      cubeId: f.cube.cube_profile?.id,
      name: f.cube.name,
      by: f.mentor.name
    }));

    return res.json({
      totalCubes,
      activeCubes,
      activeMissions,
      missionsByStatus,
      upcomingDemoDays,
      recentDemos,
      recentBadges,
      progressionCubes,
      inactiveRiskCubes,
      pendingApplicationsCount
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

router.get('/mentor/dashboard', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Cubes assigned to this mentor
    const assignedCubes = await prisma.cubeProfile.findMany({
      where: { assigned_mentor_id: req.user.id },
      include: { user: { select: { name: true, email: true, id: true } } }
    });

    // Missions assigned to this mentor
    const assignedMissions = await prisma.mission.findMany({
      where: { mentor_id: req.user.id },
      include: {
        teams: { include: { members: { include: { cube: { include: { user: { select: { name: true } } } } } } } }
      }
    });

    // Recent updates for missions assigned to this mentor
    const assignedMissionIds = assignedMissions.map(m => m.id);
    const recentUpdates = await prisma.update.findMany({
      where: { mission_id: { in: assignedMissionIds } },
      include: {
        cube: { select: { name: true } },
        mission: { select: { title: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    // Pending demo reviews (Demos submitted for their missions that don't have feedback from them yet)
    const submittedDemos = await prisma.demoSubmission.findMany({
      where: { mission_id: { in: assignedMissionIds } },
      include: {
        mission: true,
        submitted_by: { select: { name: true, id: true } }
      }
    });

    const feedbacksByMe = await prisma.mentorFeedback.findMany({
      where: { mentor_id: req.user.id, mission_id: { in: assignedMissionIds } }
    });

    const feedbackKeys = new Set(feedbacksByMe.map(f => `${f.cube_id}-${f.mission_id}`));
    const pendingReviews = submittedDemos.filter(d => !feedbackKeys.has(`${d.submitted_by_id}-${d.mission_id}`));

    // Cubes needing feedback (Assigned cubes with updates/demos but no feedback in current mission)
    const cubesNeedingFeedback = [];
    for (const cube of assignedCubes) {
      // Find what missions this cube is in
      const memberships = await prisma.missionTeamMember.findMany({
        where: { cube_id: cube.id },
        include: { team: true }
      });
      const cubeMissions = memberships.map(m => m.team.mission_id).filter(Boolean) as string[];

      // Check if they have feedback on these missions from this mentor
      const cubeFeedbacks = await prisma.mentorFeedback.findMany({
        where: {
          cube_id: cube.user_id,
          mission_id: { in: cubeMissions },
          mentor_id: req.user.id
        }
      });
      const reviewedMissionIds = new Set(cubeFeedbacks.map(f => f.mission_id));

      const unreviewedMissionIds = cubeMissions.filter(mId => !reviewedMissionIds.has(mId));
      if (unreviewedMissionIds.length > 0) {
        // Get mission names
        const missionsInfo = await prisma.mission.findMany({
          where: { id: { in: unreviewedMissionIds } },
          select: { id: true, title: true }
        });
        cubesNeedingFeedback.push({
          cubeProfileId: cube.id,
          name: cube.user.name,
          cubeNumber: cube.cube_number,
          missions: missionsInfo
        });
      }
    }

    return res.json({
      assignedCubes,
      assignedMissions,
      pendingReviews,
      recentUpdates,
      cubesNeedingFeedback
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

router.get('/cube/dashboard', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user || req.user.role !== 'CUBE') {
      return res.status(403).json({ error: 'Only Cubes can access this dashboard' });
    }

    const profile = await prisma.cubeProfile.findUnique({
      where: { id: req.user.cubeProfileId },
      include: {
        assigned_mentor: { select: { id: true, name: true, email: true } },
        cube_badges: { include: { badge: true } }
      }
    });

    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    // Current mission & team memberships
    const memberships = await prisma.missionTeamMember.findMany({
      where: { cube_id: profile.id },
      include: {
        team: {
          include: {
            mission: true,
            members: {
              include: {
                cube: { include: { user: { select: { name: true } } } }
              }
            }
          }
        }
      }
    });

    const activeMemberships = memberships.filter(
      m => m.team.mission && !['completed', 'reviewed', 'promoted_to_product_backlog', 'archived', 'cancelled'].includes(m.team.mission.status)
    );
    const activeMission = activeMemberships[0]?.team.mission || null;
    const activeTeam = activeMemberships[0]?.team || null;

    // Upcoming Demo Day
    const upcomingDemoDay = await prisma.demoDay.findFirst({
      where: { date: { gte: new Date() } },
      orderBy: { date: 'asc' }
    });

    // Recent feedback (strip private notes)
    const fb = await prisma.mentorFeedback.findMany({
      where: { cube_id: req.user.id, visible_to_cube: true },
      include: {
        mentor: { select: { name: true } },
        mission: { select: { title: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 3
    });
    const recentFeedback = fb.map(item => {
      const { private_notes, ...rest } = item;
      return rest;
    });

    return res.json({
      profile,
      activeMission,
      activeTeam,
      upcomingDemoDay,
      recentFeedback
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
