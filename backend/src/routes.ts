import { Router, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import prisma from './services/prisma';
import { requireAuth, isAdmin, isMentor, isMentorOrAdmin, AuthenticatedRequest } from './middlewares/auth.middleware';
import {
  generateMissionSummary,
  generateCubeProgressSummary,
  generateDemoReflectionHelper,
  generateMentorFeedbackDraft
} from './services/ai.service';
import { Role, CubeLevel, MissionStatus, DifficultyLevel, MissionDecision, TeamMemberRole, UpdateType, RecommendedNextStep } from '@prisma/client';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_iceberg_x';

// ==========================================
// AUTH ROUTES
// ==========================================

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { cube_profile: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        cubeProfileId: user.cube_profile?.id,
        cubeNumber: user.cube_profile?.cube_number,
        isFoundingCube: user.cube_profile?.is_founding_cube
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/auth/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { cube_profile: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      cubeProfileId: user.cube_profile?.id,
      cubeNumber: user.cube_profile?.cube_number,
      isFoundingCube: user.cube_profile?.is_founding_cube
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/auth/change-password', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'New password must be different from the current password' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentPasswordMatches = await bcrypt.compare(currentPassword, user.password_hash);
    if (!currentPasswordMatches) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password_hash }
    });

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get list of all Admins and Mentors
router.get('/mentors', requireAuth, async (req, res) => {
  try {
    const mentors = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.ADMIN, Role.MENTOR]
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    return res.json(mentors);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CUBES ROUTES
// ==========================================

// Get list of all Cubes (Directory)
router.get('/cubes', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const cubes = await prisma.cubeProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        assigned_mentor: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        cube_number: 'asc'
      }
    });

    return res.json(cubes);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin-only creation of Cubes
router.post('/cubes/create', requireAuth, isAdmin, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      cube_number,
      cohort,
      university,
      department,
      github_url,
      gitlab_url,
      linkedin_url,
      slack_handle,
      phone_number,
      skills,
      interests,
      assigned_mentor_id,
      internship_status
    } = req.body;

    if (!name || !email || !password || !cube_number || !cohort) {
      return res.status(400).json({ error: 'Missing required fields (name, email, password, cube_number, cohort)' });
    }

    // Check if user or profile already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const existingProfile = await prisma.cubeProfile.findUnique({ where: { cube_number } });
    if (existingProfile) {
      return res.status(400).json({ error: 'Cube number already assigned' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password_hash,
          role: Role.CUBE,
        }
      });

      const profile = await tx.cubeProfile.create({
        data: {
          user_id: user.id,
          cube_number,
          cohort,
          university: university || '',
          department: department || '',
          github_url,
          gitlab_url,
          linkedin_url,
          slack_handle,
          phone_number,
          skills: skills || [],
          interests: interests || [],
          current_level: CubeLevel.Cube,
          assigned_mentor_id: assigned_mentor_id || null,
          internship_status: internship_status || null,
        }
      });

      return { user, profile };
    });

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Update Cube status/progression level (Admin-only)
router.post('/cubes/:id/progression', requireAuth, isAdmin, async (req, res) => {
  try {
    const { current_level, assigned_mentor_id } = req.body;
    const { id } = req.params; // CubeProfile ID

    const updateData: any = {};
    if (current_level) {
      const allowedLevels: CubeLevel[] = [
        CubeLevel.Cube,
        CubeLevel.Senior_Cube,
        CubeLevel.Former_Cube,
        CubeLevel.Iceberger,
        CubeLevel.Alumni
      ];
      if (!allowedLevels.includes(current_level as CubeLevel)) {
        return res.status(400).json({ error: 'Invalid progression level.' });
      }
      updateData.current_level = current_level as CubeLevel;
    }
    if (assigned_mentor_id !== undefined) updateData.assigned_mentor_id = assigned_mentor_id || null;

    const updatedProfile = await prisma.cubeProfile.update({
      where: { id },
      data: updateData,
      include: { user: true }
    });

    return res.json(updatedProfile);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Update profile fields (Cubes can edit own, Admin/Mentor can edit all)
router.put('/cubes/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params; // CubeProfile ID
    const {
      university,
      department,
      github_url,
      gitlab_url,
      linkedin_url,
      slack_handle,
      phone_number,
      skills,
      interests,
      name, // Allow changing name on User table
      internship_status
    } = req.body;

    const profile = await prisma.cubeProfile.findUnique({
      where: { id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Authorize edit
    if (req.user?.role === 'CUBE' && req.user.cubeProfileId !== id) {
      return res.status(403).json({ error: 'Cannot edit another Cube profile' });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const p = await tx.cubeProfile.update({
        where: { id },
        data: {
          university,
          department,
          github_url,
          gitlab_url,
          linkedin_url,
          slack_handle,
          phone_number,
          skills: skills ? skills : undefined,
          interests: interests ? interests : undefined,
          internship_status: internship_status !== undefined ? internship_status : undefined
        }
      });

      if (name) {
        await tx.user.update({
          where: { id: profile.user_id },
          data: { name }
        });
      }

      return p;
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get detailed Cube Profile Page
router.get('/cubes/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params; // CubeProfile ID

    const profile = await prisma.cubeProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        assigned_mentor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        cube_badges: {
          include: {
            badge: true,
            mission: true,
            awarded_by: {
              select: { name: true }
            }
          }
        },
        team_memberships: {
          include: {
            team: {
              include: {
                mission: true
              }
            }
          }
        },
        meeting_attendance: {
          include: {
            meeting: true
          },
          orderBy: {
            created_at: 'desc'
          }
        }
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Cube profile not found' });
    }

    // Get updates
    const updates = await prisma.update.findMany({
      where: { cube_id: profile.user_id },
      include: {
        mission: {
          select: { title: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Get demo submissions by this user
    const demoSubmissions = await prisma.demoSubmission.findMany({
      where: { submitted_by_id: profile.user_id },
      include: {
        mission: {
          select: { title: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Get mentor feedback. CRITICAL SECURITY check
    // Cubes cannot see private notes, and only see visible feedback for themselves.
    let mentorFeedback: any[] = [];
    const isMentorOrAdminUser = req.user?.role === 'ADMIN' || req.user?.role === 'MENTOR';
    const isOwnProfile = req.user?.cubeProfileId === id;

    if (isMentorOrAdminUser) {
      mentorFeedback = await prisma.mentorFeedback.findMany({
        where: { cube_id: profile.user_id },
        include: {
          mission: { select: { title: true } },
          mentor: { select: { name: true } }
        },
        orderBy: { created_at: 'desc' }
      });
    } else if (isOwnProfile) {
      const fb = await prisma.mentorFeedback.findMany({
        where: {
          cube_id: profile.user_id,
          visible_to_cube: true
        },
        include: {
          mission: { select: { title: true } },
          mentor: { select: { name: true } }
        },
        orderBy: { created_at: 'desc' }
      });
      // Strip private notes
      mentorFeedback = fb.map(item => {
        const { private_notes, ...rest } = item;
        return rest;
      });
    }

    return res.json({
      profile,
      updates,
      demoSubmissions,
      mentorFeedback
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// MISSIONS ROUTES
// ==========================================

// List missions
router.get('/missions', requireAuth, async (req, res) => {
  try {
    const { status, difficulty_level, mentor_id } = req.query;

    const filters: any = {};
    if (status) filters.status = status as MissionStatus;
    if (difficulty_level) filters.difficulty_level = difficulty_level as DifficultyLevel;
    if (mentor_id) filters.mentor_id = mentor_id as string;

    // Apply unassigned privacy filter for Cubes
    const userRole = (req as AuthenticatedRequest).user?.role;
    if (userRole === 'CUBE') {
      filters.OR = [
        { mentor_id: { not: null } },
        { teams: { some: {} } }
      ];
    }

    const missions = await prisma.mission.findMany({
      where: filters,
      include: {
        mentor: { select: { id: true, name: true } },
        created_by: { select: { id: true, name: true } },
        teams: {
          include: {
            members: {
              include: {
                cube: {
                  include: { user: { select: { name: true } } }
                }
              }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return res.json(missions);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create mission (Admin or Mentor)
router.post('/missions', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      description,
      context,
      problem_statement,
      expected_output,
      difficulty_level,
      status,
      category,
      mentor_id,
      slack_channel_url,
      repository_url,
      demo_url
    } = req.body;

    if (!title || !description || !context || !problem_statement || !expected_output || !difficulty_level) {
      return res.status(400).json({ error: 'Missing required mission parameters' });
    }

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const newMission = await prisma.mission.create({
      data: {
        title,
        description,
        context,
        problem_statement,
        expected_output,
        difficulty_level: difficulty_level as DifficultyLevel,
        status: (status as MissionStatus) || MissionStatus.idea_pool,
        category: category || 'General',
        created_by_id: req.user.id,
        mentor_id: mentor_id || null,
        slack_channel_url,
        repository_url,
        demo_url,
      }
    });

    return res.status(201).json(newMission);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get mission detail
router.get('/missions/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    const mission = await prisma.mission.findUnique({
      where: { id },
      include: {
        mentor: { select: { id: true, name: true, email: true } },
        created_by: { select: { id: true, name: true } },
        teams: {
          include: {
            members: {
              include: {
                cube: {
                  include: { user: { select: { id: true, name: true, email: true } } }
                }
              }
            }
          }
        },
        updates: {
          include: {
            cube: { select: { name: true } }
          },
          orderBy: { created_at: 'desc' }
        },
        demo_submissions: {
          include: {
            submitted_by: { select: { name: true } },
            team: { select: { name: true } }
          },
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    // Check unassigned privacy filter for Cubes
    if (req.user?.role === 'CUBE') {
      const hasTeams = mission.teams.length > 0;
      if (!mission.mentor_id && !hasTeams) {
        return res.status(403).json({ error: 'Access denied. This mission is unassigned and private.' });
      }
    }

    // Get feedback related to this mission. CRITICAL check.
    let mentorFeedback = [];
    if (req.user?.role === 'ADMIN' || req.user?.role === 'MENTOR') {
      mentorFeedback = await prisma.mentorFeedback.findMany({
        where: { mission_id: id },
        include: {
          cube: { select: { name: true, id: true } },
          mentor: { select: { name: true } }
        },
        orderBy: { created_at: 'desc' }
      });
    } else {
      // Cube can only see feedback on this mission if it concerns them and is visible
      const fb = await prisma.mentorFeedback.findMany({
        where: {
          mission_id: id,
          cube_id: req.user?.id,
          visible_to_cube: true
        },
        include: {
          cube: { select: { name: true, id: true } },
          mentor: { select: { name: true } }
        },
        orderBy: { created_at: 'desc' }
      });
      mentorFeedback = fb.map(item => {
        const { private_notes, ...rest } = item;
        return rest;
      });
    }

    return res.json({ mission, mentorFeedback });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Edit mission
router.put('/missions/:id', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      context,
      problem_statement,
      expected_output,
      difficulty_level,
      status,
      category,
      mentor_id,
      slack_channel_url,
      repository_url,
      demo_url,
      decision
    } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (context) updateData.context = context;
    if (problem_statement) updateData.problem_statement = problem_statement;
    if (expected_output) updateData.expected_output = expected_output;
    if (difficulty_level) updateData.difficulty_level = difficulty_level as DifficultyLevel;
    if (status) updateData.status = status as MissionStatus;
    if (category) updateData.category = category;
    if (mentor_id !== undefined) updateData.mentor_id = mentor_id || null;
    if (slack_channel_url !== undefined) updateData.slack_channel_url = slack_channel_url;
    if (repository_url !== undefined) updateData.repository_url = repository_url;
    if (demo_url !== undefined) updateData.demo_url = demo_url;
    if (decision !== undefined) updateData.decision = decision ? (decision as MissionDecision) : null;

    const updated = await prisma.mission.update({
      where: { id },
      data: updateData
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin-only decision route
router.post('/missions/:id/decision', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { decision } = req.body; // MissionDecision

    if (!decision) {
      return res.status(400).json({ error: 'Decision parameter is required' });
    }

    const updated = await prisma.mission.update({
      where: { id },
      data: {
        decision: decision as MissionDecision,
        // If reviewing, promote or archive may change status
        status: decision === 'Archive' ? MissionStatus.archived : undefined
      }
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// TEAMS ROUTES
// ==========================================

// Create team
router.post('/missions/:id/teams', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params; // Mission ID
    const { name, members } = req.body; // members: array of { cubeProfileId, role }

    if (!name) return res.status(400).json({ error: 'Team name is required' });

    const result = await prisma.$transaction(async (tx) => {
      const team = await tx.missionTeam.create({
        data: {
          mission_id: id,
          name
        }
      });

      if (members && Array.isArray(members)) {
        for (const m of members) {
          await tx.missionTeamMember.create({
            data: {
              team_id: team.id,
              cube_id: m.cubeProfileId,
              role: (m.role as TeamMemberRole) || TeamMemberRole.Contributor
            }
          });
        }
      }

      return team;
    });

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get all Teams
router.get('/teams', requireAuth, async (req, res) => {
  try {
    const teams = await prisma.missionTeam.findMany({
      include: {
        mission: true,
        members: {
          include: {
            cube: {
              include: { user: { select: { id: true, name: true, email: true } } }
            }
          }
        }
      }
    });
    return res.json(teams);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Update team members
router.put('/teams/:id', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params; // Team ID
    const { members } = req.body; // array of { cubeProfileId, role }

    if (!members || !Array.isArray(members)) {
      return res.status(400).json({ error: 'members array is required' });
    }

    await prisma.$transaction(async (tx) => {
      // Delete existing memberships
      await tx.missionTeamMember.deleteMany({ where: { team_id: id } });

      // Create new ones
      for (const m of members) {
        await tx.missionTeamMember.create({
          data: {
            team_id: id,
            cube_id: m.cubeProfileId,
            role: (m.role as TeamMemberRole) || TeamMemberRole.Contributor
          }
        });
      }
    });

    const updatedTeam = await prisma.missionTeam.findUnique({
      where: { id },
      include: { members: true }
    });

    return res.json(updatedTeam);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// UPDATES ROUTES
// ==========================================

// Submit an update (Cube only)
router.post('/updates', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { mission_id, type, content, blockers } = req.body;

    if (!mission_id || !type || !content) {
      return res.status(400).json({ error: 'Missing required parameters (mission_id, type, content)' });
    }

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

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
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// DEMO SUBMISSIONS ROUTES
// ==========================================

// List all demo submissions
router.get('/demos', requireAuth, async (req, res) => {
  try {
    const submissions = await prisma.demoSubmission.findMany({
      include: {
        mission: true,
        team: true,
        submitted_by: { select: { name: true, id: true } }
      },
      orderBy: { submitted_at: 'desc' }
    });
    return res.json(submissions);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Submit a Demo (Cube only)
router.post('/demos', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      mission_id,
      team_id,
      title,
      summary,
      what_we_built,
      what_we_learned,
      what_worked_well,
      what_could_we_have_done_better,
      recommendation,
      repository_url,
      pull_request_url,
      demo_url,
      document_url,
      video_url
    } = req.body;

    if (!mission_id || !title || !summary || !what_we_built || !what_we_learned || !what_worked_well || !what_could_we_have_done_better) {
      return res.status(400).json({ error: 'Missing required fields. What could we have done better? is mandatory.' });
    }

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const submission = await prisma.demoSubmission.create({
      data: {
        mission_id,
        team_id: team_id || null,
        submitted_by_id: req.user.id,
        title,
        summary,
        what_we_built,
        what_we_learned,
        what_worked_well,
        what_could_we_have_done_better,
        recommendation,
        repository_url,
        pull_request_url,
        demo_url,
        document_url,
        video_url
      }
    });

    // Automatically progress mission status if it was in building_demo
    await prisma.mission.updateMany({
      where: { id: mission_id, status: MissionStatus.building_demo },
      data: { status: MissionStatus.demo_ready }
    });

    return res.status(201).json(submission);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// MENTOR FEEDBACK ROUTES
// ==========================================

// Add Mentor Feedback / Review (Mentor or Admin)
router.post('/feedback', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      cube_id, // User ID of Cube
      mission_id,
      technical_ability_score,
      research_ability_score,
      demo_output_score,
      ownership_score,
      communication_score,
      leadership_score,
      product_thinking_score,
      reliability_score,
      self_reflection_score,
      strengths,
      areas_to_improve,
      private_notes,
      visible_to_cube,
      recommended_next_step
    } = req.body;

    if (
      !cube_id || !mission_id || !recommended_next_step ||
      technical_ability_score === undefined ||
      research_ability_score === undefined ||
      demo_output_score === undefined ||
      ownership_score === undefined ||
      communication_score === undefined ||
      leadership_score === undefined ||
      product_thinking_score === undefined ||
      reliability_score === undefined ||
      self_reflection_score === undefined ||
      !strengths || !areas_to_improve
    ) {
      return res.status(400).json({ error: 'Missing feedback fields or scores' });
    }

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    // Upsert feedback
    const feedback = await prisma.mentorFeedback.upsert({
      where: {
        cube_id_mission_id_mentor_id: {
          cube_id,
          mission_id,
          mentor_id: req.user.id
        }
      },
      update: {
        technical_ability_score: Number(technical_ability_score),
        research_ability_score: Number(research_ability_score),
        demo_output_score: Number(demo_output_score),
        ownership_score: Number(ownership_score),
        communication_score: Number(communication_score),
        leadership_score: Number(leadership_score),
        product_thinking_score: Number(product_thinking_score),
        reliability_score: Number(reliability_score),
        self_reflection_score: Number(self_reflection_score),
        strengths,
        areas_to_improve,
        private_notes,
        visible_to_cube: !!visible_to_cube,
        recommended_next_step: recommended_next_step as RecommendedNextStep
      },
      create: {
        cube_id,
        mission_id,
        mentor_id: req.user.id,
        technical_ability_score: Number(technical_ability_score),
        research_ability_score: Number(research_ability_score),
        demo_output_score: Number(demo_output_score),
        ownership_score: Number(ownership_score),
        communication_score: Number(communication_score),
        leadership_score: Number(leadership_score),
        product_thinking_score: Number(product_thinking_score),
        reliability_score: Number(reliability_score),
        self_reflection_score: Number(self_reflection_score),
        strengths,
        areas_to_improve,
        private_notes,
        visible_to_cube: !!visible_to_cube,
        recommended_next_step: recommended_next_step as RecommendedNextStep
      }
    });

    return res.status(201).json(feedback);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// BADGES ROUTES
// ==========================================

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
    return res.status(500).json({ error: error.message });
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
    return res.status(500).json({ error: error.message });
  }
});

// Award Badge (Admin or Mentor depending on admin configuration, let's allow both in code)
router.post('/badges/award', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { cubeProfileId, badgeId, missionId, reason } = req.body;
    if (!cubeProfileId || !badgeId || !reason) {
      return res.status(400).json({ error: 'Missing cubeProfileId, badgeId, or reason' });
    }

    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

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
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// DEMO DAYS ROUTES
// ==========================================

// List demo days
router.get('/demodays', requireAuth, async (req, res) => {
  try {
    const days = await prisma.demoDay.findMany({
      include: {
        presentations: {
          include: {
            mission: true,
            team: true,
            presenter: { select: { name: true } },
            demo_submission: true
          }
        }
      },
      orderBy: { date: 'asc' }
    });
    return res.json(days);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create Demo Day
router.post('/demodays', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { title, date, description } = req.body;
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
    return res.status(201).json(day);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
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
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// MEETINGS ROUTES
// ==========================================

// List all meetings
router.get('/meetings', requireAuth, async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({
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
    return res.json(meetings);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Get single meeting detail
router.get('/meetings/:id', requireAuth, async (req, res) => {
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
      return res.status(404).json({ error: 'Meeting not found' });
    }
    return res.json(meeting);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Create meeting (Admin/Mentor only)
router.post('/meetings', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { title, description, date } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'title and date are required' });
    }

    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        date: new Date(date)
      }
    });
    return res.status(201).json(meeting);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Edit meeting (Admin/Mentor only)
router.put('/meetings/:id', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date } = req.body;

    const meeting = await prisma.meeting.update({
      where: { id },
      data: {
        title,
        description,
        date: date ? new Date(date) : undefined
      }
    });
    return res.json(meeting);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
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
    return res.status(500).json({ error: error.message });
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
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// MISSION APPLICATION ROUTES
// ==========================================
// AI HELPER ROUTES
// ==========================================

// Mission summary generator
router.get('/ai/mission-summary/:missionId', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { missionId } = req.params;
    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        updates: { select: { content: true } },
        demo_submissions: { select: { title: true, summary: true, what_we_built: true, what_we_learned: true } },
        mentor_feedbacks: { select: { strengths: true, areas_to_improve: true } }
      }
    });

    if (!mission) return res.status(404).json({ error: 'Mission not found' });

    const updatesText = mission.updates.map(u => u.content);
    const lastDemo = mission.demo_submissions[0] || null;
    const feedbackText = mission.mentor_feedbacks.map(f => `${f.strengths}. ${f.areas_to_improve}`);

    const summary = await generateMissionSummary(
      mission.title,
      mission.description,
      updatesText,
      lastDemo,
      feedbackText
    );

    return res.json({ summary });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Cube progress summary generator
router.get('/ai/cube-summary/:cubeId', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { cubeId } = req.params; // CubeProfile ID
    const profile = await prisma.cubeProfile.findUnique({
      where: { id: cubeId },
      include: {
        user: { select: { name: true, id: true } },
        cube_badges: { include: { badge: true } }
      }
    });

    if (!profile) return res.status(404).json({ error: 'Cube profile not found' });

    // Fetch details
    const updates = await prisma.update.findMany({ where: { cube_id: profile.user_id } });
    const demos = await prisma.demoSubmission.findMany({ where: { submitted_by_id: profile.user_id } });
    const feedback = await prisma.mentorFeedback.findMany({ where: { cube_id: profile.user_id } });

    // Check if user has no activity data at all
    if (updates.length === 0 && demos.length === 0 && feedback.length === 0 && profile.cube_badges.length === 0) {
      return res.json({
        summary: JSON.stringify({
          noData: true,
          message: "No activity data recorded yet. Please submit updates, demo day projects, or receive evaluations before an AI progress summary can be generated."
        })
      });
    }

    const updatesText = updates.map(u => u.content);
    const demosText = demos.map(d => d.summary);
    const badgeNames = profile.cube_badges.map(b => b.badge.name);
    const scores = feedback.map(f => ({
      technical: f.technical_ability_score,
      research: f.research_ability_score,
      ownership: f.ownership_score,
      communication: f.communication_score
    }));
    const mentorComments = feedback.map(f => `${f.strengths}. ${f.areas_to_improve}`);

    const progressSummary = await generateCubeProgressSummary(
      profile.user.name,
      profile.cube_number,
      profile,
      updatesText,
      demosText,
      scores,
      badgeNames,
      mentorComments
    );

    return res.json({ summary: progressSummary });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Demo Day reflection helper
router.post('/ai/demo-reflection', requireAuth, async (req, res) => {
  try {
    const { title, summary, what_we_built, what_we_learned, what_worked_well, what_could_we_have_done_better } = req.body;
    if (!title || !what_could_we_have_done_better) {
      return res.status(400).json({ error: 'Demo title and what we could have done better are required' });
    }

    const reflection = await generateDemoReflectionHelper(
      title,
      summary || '',
      what_we_built || '',
      what_we_learned || '',
      what_worked_well || '',
      what_could_we_have_done_better
    );

    return res.json({ reflection });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Mentor feedback draft helper
router.post('/ai/feedback-draft', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { scores, notes, cube_id } = req.body; // scores: { technical, research, ... }, notes: string
    if (!scores || !cube_id) {
      return res.status(400).json({ error: 'Scores and cube_id are required' });
    }

    // Get updates for this Cube
    const updates = await prisma.update.findMany({
      where: { cube_id },
      take: 5,
      orderBy: { created_at: 'desc' }
    });
    const updatesText = updates.map(u => u.content);

    const draft = await generateMentorFeedbackDraft(
      scores,
      notes || '',
      updatesText
    );

    return res.json({ draft });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ADMIN DASHBOARD ANALYTICS ROUTE
// ==========================================

router.get('/admin/dashboard', requireAuth, isAdmin, async (req, res) => {
  try {
    const totalCubes = await prisma.cubeProfile.count();
    const pendingApplicationsCount = await prisma.cubeApplication.count({ where: { status: 'pending' } });
    const activeCubes = await prisma.cubeProfile.count({
      where: {
        current_level: {
          in: ['Cube', 'Senior_Cube', 'Iceberger']
        }
      }
    });
    const activeMissions = await prisma.mission.count({
      where: {
        status: {
          in: ['selected', 'researching', 'building_demo', 'preparing_handover', 'demo_ready']
        }
      }
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
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// MENTOR DASHBOARD ANALYTICS ROUTE
// ==========================================

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
      const cubeMissions = memberships.map(m => m.team.mission_id);

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
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CUBE DASHBOARD ANALYTICS ROUTE
// ==========================================

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
      m => m.team.mission.status !== 'reviewed' && m.team.mission.status !== 'archived'
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
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ADMIN USER MANAGEMENT ROUTES
// ==========================================

router.get('/admin/users', requireAuth, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { cube_profile: true },
      orderBy: { name: 'asc' }
    });
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/admin/users/create', requireAuth, isAdmin, async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      cube_number,
      cohort,
      university,
      department,
      github_url,
      gitlab_url,
      linkedin_url,
      slack_handle,
      phone_number,
      skills,
      interests,
      assigned_mentor_id
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields (name, email, password, role)' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    if (role === Role.CUBE) {
      if (!cube_number || !cohort) {
        return res.status(400).json({ error: 'Missing required fields for Cube (cube_number, cohort)' });
      }
      const existingProfile = await prisma.cubeProfile.findUnique({ where: { cube_number } });
      if (existingProfile) {
        return res.status(400).json({ error: 'Cube number already assigned' });
      }

      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name,
            email,
            password_hash,
            role: Role.CUBE
          }
        });

        const profile = await tx.cubeProfile.create({
          data: {
            user_id: user.id,
            cube_number,
            cohort,
            university: university || '',
            department: department || '',
            github_url,
            gitlab_url,
            linkedin_url,
            slack_handle,
            phone_number,
            skills: skills || [],
            interests: interests || [],
            current_level: CubeLevel.Cube,
            assigned_mentor_id: assigned_mentor_id || null
          }
        });

        return { user, profile };
      });

      return res.status(201).json(result);
    } else {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password_hash,
          role: role as Role
        }
      });
      return res.status(201).json({ user });
    }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/admin/users/:id', requireAuth, isAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.params.id;
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const adminId = req.user.id;

    if (userId === adminId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      include: { cube_profile: true }
    });

    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    await prisma.$transaction(async (tx) => {
      // 1. Delete updates
      await tx.update.deleteMany({ where: { cube_id: userId } });

      // 2. Delete demo submissions
      await tx.demoSubmission.deleteMany({ where: { submitted_by_id: userId } });

      // 3. Delete feedbacks given or received
      await tx.mentorFeedback.deleteMany({
        where: { OR: [{ cube_id: userId }, { mentor_id: userId }] }
      });

      // 4. Delete presentations
      await tx.demoDayPresentation.deleteMany({
        where: { presenter_id: userId }
      });

      // 5. Delete badges & team memberships
      if (userToDelete.cube_profile) {
        await tx.cubeBadge.deleteMany({ where: { cube_id: userToDelete.cube_profile.id } });
        await tx.missionTeamMember.deleteMany({ where: { cube_id: userToDelete.cube_profile.id } });
      }
      await tx.cubeBadge.deleteMany({ where: { awarded_by_id: userId } });

      // 6. Re-assign created missions to the deleting admin
      await tx.mission.updateMany({
        where: { created_by_id: userId },
        data: { created_by_id: adminId }
      });

      // 7. Clear mentor assignments for cubes
      await tx.cubeProfile.updateMany({
        where: { assigned_mentor_id: userId },
        data: { assigned_mentor_id: null }
      });

      // 8. Delete CubeProfile if exists
      if (userToDelete.cube_profile) {
        await tx.cubeProfile.delete({ where: { id: userToDelete.cube_profile.id } });
      }

      // 9. Delete the User
      await tx.user.delete({ where: { id: userId } });
    });

    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ADMIN DATA DELETION ROUTES
// ==========================================

router.delete('/missions/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.mission.delete({ where: { id } });
    return res.json({ success: true, message: 'Mission deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/badges/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.badge.delete({ where: { id } });
    return res.json({ success: true, message: 'Badge deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/feedback/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.mentorFeedback.delete({ where: { id } });
    return res.json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/updates/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.update.delete({ where: { id } });
    return res.json({ success: true, message: 'Update deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/demos/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.demoSubmission.delete({ where: { id } });
    return res.json({ success: true, message: 'Demo submission deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/badges/award/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cubeBadge.delete({ where: { id } });
    return res.json({ success: true, message: 'Badge award revoked successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// REFLECTIONS & APPROVAL ROUTES
// ==========================================

router.post('/missions/:missionId/reflections', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { missionId } = req.params;
    const { what_gained, what_learned, what_could_be_better } = req.body;

    if (!req.user || req.user.role !== 'CUBE' || !req.user.cubeProfileId) {
      return res.status(403).json({ error: 'Only Cubes can submit individual reflections' });
    }

    if (!what_gained || !what_learned || !what_could_be_better) {
      return res.status(400).json({ error: 'All reflection fields are required' });
    }

    // Find the MissionTeamMember record
    const memberRecord = await prisma.missionTeamMember.findFirst({
      where: {
        cube_id: req.user.cubeProfileId,
        team: { mission_id: missionId }
      }
    });

    if (!memberRecord) {
      return res.status(404).json({ error: 'You are not assigned as a team member on this mission' });
    }

    // Update reflections
    const updatedMember = await prisma.missionTeamMember.update({
      where: { id: memberRecord.id },
      data: {
        what_gained,
        what_learned,
        what_could_be_better,
        is_submitted: true,
        submitted_at: new Date()
      }
    });

    // Check if all team members have submitted reflections for this mission
    const allTeamMembers = await prisma.missionTeamMember.findMany({
      where: { team: { mission_id: missionId } }
    });

    const allSubmitted = allTeamMembers.every(m => m.is_submitted);

    let missionStatusUpdated = false;
    if (allSubmitted && allTeamMembers.length > 0) {
      await prisma.mission.update({
        where: { id: missionId },
        data: { status: MissionStatus.pending_approval }
      });
      missionStatusUpdated = true;
    }

    return res.json({
      success: true,
      member: updatedMember,
      allSubmitted,
      missionStatusUpdated
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/missions/:missionId/approve', requireAuth, isMentorOrAdmin, async (req, res) => {
  try {
    const { missionId } = req.params;

    const mission = await prisma.mission.findUnique({
      where: { id: missionId }
    });

    if (!mission) {
      return res.status(404).json({ error: 'Mission not found' });
    }

    const updatedMission = await prisma.mission.update({
      where: { id: missionId },
      data: { status: MissionStatus.completed }
    });

    return res.json({
      success: true,
      mission: updatedMission
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CUBE APPLICATIONS & RECRUITMENT ROUTES
// ==========================================

// Public Route: Submit an application
router.post('/applications', async (req, res) => {
  try {
    const { name, email, university, degree, year_of_study, why_join, linkedin_url, github_url } = req.body;

    if (!name || !email || !university || !degree || !year_of_study || !why_join) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'A user with this email address already exists.' });
    }

    const existingApp = await prisma.cubeApplication.findFirst({
      where: { email, status: 'pending' }
    });
    if (existingApp) {
      return res.status(400).json({ error: 'A pending application with this email address already exists.' });
    }

    const application = await prisma.cubeApplication.create({
      data: {
        name,
        email,
        university,
        degree,
        year_of_study,
        why_join,
        linkedin_url,
        github_url
      }
    });

    return res.status(201).json({ success: true, application });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin Route: List all applications
router.get('/admin/applications', requireAuth, isAdmin, async (req, res) => {
  try {
    const applications = await prisma.cubeApplication.findMany({
      orderBy: { created_at: 'desc' }
    });
    return res.json(applications);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin Route: Approve/Reject an application
router.patch('/admin/applications/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cohort } = req.body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await prisma.cubeApplication.findUnique({
      where: { id }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.status !== 'pending') {
      return res.status(400).json({ error: 'Application has already been processed' });
    }

    if (status === 'rejected') {
      const updated = await prisma.cubeApplication.update({
        where: { id },
        data: { status: 'rejected' }
      });
      return res.json({ success: true, application: updated });
    }

    if (!cohort) {
      return res.status(400).json({ error: 'Cohort is required for approval' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: application.email } });
    if (existingUser) {
      const updated = await prisma.cubeApplication.update({
        where: { id },
        data: { status: 'approved' }
      });
      return res.json({ success: true, application: updated, message: 'User already exists, application marked as approved' });
    }

    // Determine the next cube number
    const lastProfile = await prisma.cubeProfile.findFirst({
      orderBy: { cube_number: 'desc' }
    });
    let nextNum = 1;
    if (lastProfile) {
      const parsed = parseInt(lastProfile.cube_number, 10);
      if (!isNaN(parsed)) {
        nextNum = parsed + 1;
      }
    }
    const nextCubeNumber = String(nextNum).padStart(3, '0');

    const defaultCubePassword = process.env.DEFAULT_CUBE_PASSWORD;
    if (!defaultCubePassword) {
      return res.status(500).json({ error: 'DEFAULT_CUBE_PASSWORD is not configured' });
    }

    const result = await prisma.$transaction(async (tx) => {
      const passwordHash = await bcrypt.hash(defaultCubePassword, 10);

      const user = await tx.user.create({
        data: {
          name: application.name,
          email: application.email,
          password_hash: passwordHash,
          role: Role.CUBE
        }
      });

      const profile = await tx.cubeProfile.create({
        data: {
          user_id: user.id,
          cube_number: nextCubeNumber,
          cohort,
          university: application.university,
          department: application.degree,
          github_url: application.github_url || null,
          linkedin_url: application.linkedin_url || null,
          skills: [],
          interests: [],
          current_level: CubeLevel.Cube
        }
      });

      const updated = await tx.cubeApplication.update({
        where: { id },
        data: { status: 'approved' }
      });

      return { user, profile, application: updated };
    });

    return res.json({ success: true, ...result });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Admin Route: Delete application
router.delete('/admin/applications/:id', requireAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cubeApplication.delete({
      where: { id }
    });
    return res.json({ success: true, message: 'Application deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
