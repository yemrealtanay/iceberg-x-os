/**
 * Cube profiles, avatars and private notes.
 */
import { Router } from 'express';
import * as bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import prisma from '../services/prisma';
import { requireAuth, isAdmin, isMentorOrAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { IN_PROGRAMME_CUBE_LEVELS, DIRECTORY_HIDDEN_LEVELS } from '../config/constants';
import { badRequest, conflict, sendError, parseCubeNumber } from '../utils/http';
import { createSingleNotification } from '../services/notification.service';
import { Role, CubeLevel } from '@prisma/client';
import { recalculateAllQuestsForCube } from '../services/quest.service';

const router = Router();

// Get list of all Cubes (Directory)
router.get('/cubes', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { active, level, includeAlumni } = req.query;
    const whereClause: any = {};

    if (active === 'true') {
      // Pickers for missions, meetings, scorecards and broadcasts: only people
      // actually doing the programme. Icebergers are on the main team now and
      // Former Cubes / Alumni have left, so none of them belong here.
      whereClause.current_level = { in: IN_PROGRAMME_CUBE_LEVELS };
    } else if (level) {
      whereClause.current_level = level as CubeLevel;
    } else if (includeAlumni !== 'true') {
      // Directory default: everyone except Alumni, who are shown on request.
      // Icebergers stay visible — they are the example of where this leads.
      whereClause.current_level = { notIn: DIRECTORY_HIDDEN_LEVELS };
    }

    // Phone numbers are staff-only; the directory does not display them.
    const canSeeContactDetails = req.user?.role === 'ADMIN' || req.user?.role === 'MENTOR';

    const cubes = await prisma.cubeProfile.findMany({
      where: whereClause,
      select: {
        id: true,
        user_id: true,
        cube_number: true,
        cohort: true,
        university: true,
        department: true,
        github_url: true,
        gitlab_url: true,
        linkedin_url: true,
        slack_handle: true,
        phone_number: canSeeContactDetails,
        skills: true,
        interests: true,
        current_level: true,
        internship_status: true,
        is_founding_cube: true,
        avatar_url: true,
        assigned_mentor_id: true,
        created_at: true,
        updated_at: true,
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
        },
        team_memberships: {
          include: {
            team: {
              include: {
                mission: true
              }
            }
          }
        }
      },
      orderBy: {
        cube_number: 'asc'
      }
    });

    return res.json(cubes);
  } catch (error: any) {
    return sendError(res, error);
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
    return sendError(res, error);
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

    await createSingleNotification(updatedProfile.user_id, "A mentor updated your profile status.");

    return res.json(updatedProfile);
  } catch (error: any) {
    return sendError(res, error);
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
      internship_status,
      cube_number,
      email
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
      // 1. Only allow ADMIN to update cube_number and email
      if (req.user?.role === 'ADMIN') {
        if (cube_number !== undefined) {
          // Normalize to the zero-padded form; an unpadded "7" would otherwise
          // break the ordering used to pick the next available number.
          const parsedNum = parseCubeNumber(cube_number);
          if (cube_number !== '' && cube_number !== null && !parsedNum) {
            throw badRequest('Cube number must be numeric (e.g. 007)');
          }
          if (parsedNum) {
            // Verify if cube_number is unique
            const existingNumber = await tx.cubeProfile.findFirst({
              where: {
                cube_number: parsedNum,
                NOT: { id }
              }
            });
            if (existingNumber) {
              throw conflict(`Cube number #${parsedNum} is already in use`);
            }
            await tx.cubeProfile.update({
              where: { id },
              data: { cube_number: parsedNum }
            });
          }
        }

        if (email !== undefined) {
          const parsedEmail = email.trim().toLowerCase();
          if (parsedEmail) {
            // Verify if email is unique
            const existingEmail = await tx.user.findFirst({
              where: {
                email: parsedEmail,
                NOT: { id: profile.user_id }
              }
            });
            if (existingEmail) {
              throw conflict(`Email ${parsedEmail} is already in use`);
            }
            await tx.user.update({
              where: { id: profile.user_id },
              data: { email: parsedEmail }
            });
          }
        }
      }

      // 2. Update CubeProfile
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

    if (req.user?.role === 'ADMIN' || req.user?.role === 'MENTOR') {
      await createSingleNotification(profile.user_id, "A mentor updated your profile status.");
    }

    // Recalculate quests (for profile completion checks)
    await recalculateAllQuestsForCube(id);

    return res.json(updated);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// Avatar upload endpoint
router.post('/cubes/:id/avatar', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params; // CubeProfile ID
    const { avatar_base64 } = req.body;

    if (!avatar_base64) {
      return res.status(400).json({ error: 'Missing avatar image base64 data' });
    }

    const profile = await prisma.cubeProfile.findUnique({
      where: { id }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Authorize: Only own profile or Admin/Mentor
    if (req.user?.role === 'CUBE' && req.user.cubeProfileId !== id) {
      return res.status(403).json({ error: 'Cannot update avatar for another Cube' });
    }

    // Validate and parse base64
    const matches = avatar_base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 image data URL format' });
    }

    const imageType = matches[1];
    const base64Data = matches[2];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

    if (!allowedTypes.includes(imageType)) {
      return res.status(400).json({ error: 'Only PNG, JPEG, and WEBP image uploads are allowed' });
    }

    // Convert to binary buffer
    const buffer = Buffer.from(base64Data, 'base64');

    // Resolve directory and create it if not exists
    const uploadsDir = path.resolve(__dirname, '../uploads/avatars');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Define file name and path
    const extension = imageType.split('/')[1];
    const filename = `${id}.${extension}`;
    const filePath = path.join(uploadsDir, filename);

    // Save image
    fs.writeFileSync(filePath, buffer);

    const avatarUrl = `/uploads/avatars/${filename}`;

    // Update database
    const updatedProfile = await prisma.cubeProfile.update({
      where: { id },
      data: { avatar_url: avatarUrl }
    });

    return res.json({ avatar_url: updatedProfile.avatar_url });
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    return sendError(res, error);
  }
});

// GET private notes for a Cube (Mentor/Admin only)
router.get('/cubes/:id/notes', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params; // CubeProfile ID
    const notes = await prisma.privateNote.findMany({
      where: { cube_id: id },
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    return res.json(notes);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// POST a new private note for a Cube (Mentor/Admin only)
router.post('/cubes/:id/notes', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params; // CubeProfile ID
    const { subject, note, score } = req.body;

    if (!subject || !note) {
      return res.status(400).json({ error: 'subject and note are required' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const createdNote = await prisma.privateNote.create({
      data: {
        cube_id: id,
        created_by_id: req.user.id,
        subject: subject.trim(),
        note: note.trim(),
        score: score !== undefined && score !== null && score !== "" ? parseInt(score) : null
      },
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });
    const profile = await prisma.cubeProfile.findUnique({
      where: { id },
      select: { user_id: true }
    });
    if (profile) {
      await createSingleNotification(profile.user_id, "A mentor recorded a new evaluation score.");
    }

    return res.status(201).json(createdNote);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// PUT (update) an existing private note (restricted to creator or Admin)
router.put('/cubes/:id/notes/:noteId', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id, noteId } = req.params;
    const { subject, note, score } = req.body;

    if (!subject || !note) {
      return res.status(400).json({ error: 'subject and note are required' });
    }

    const existingNote = await prisma.privateNote.findUnique({
      where: { id: noteId }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Authorize: Only creator or Admin can edit
    if (req.user.role !== 'ADMIN' && existingNote.created_by_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to edit this note' });
    }

    const updatedNote = await prisma.privateNote.update({
      where: { id: noteId },
      data: {
        subject: subject.trim(),
        note: note.trim(),
        score: score !== undefined && score !== null && score !== "" ? parseInt(score) : null
      },
      include: {
        created_by: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });
    const profile = await prisma.cubeProfile.findUnique({
      where: { id },
      select: { user_id: true }
    });
    if (profile) {
      await createSingleNotification(profile.user_id, "A mentor recorded a new evaluation score.");
    }

    return res.json(updatedNote);
  } catch (error: any) {
    return sendError(res, error);
  }
});

// DELETE a private note (restricted to creator or Admin)
router.delete('/cubes/:id/notes/:noteId', requireAuth, isMentorOrAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { noteId } = req.params;

    const existingNote = await prisma.privateNote.findUnique({
      where: { id: noteId }
    });

    if (!existingNote) {
      return res.status(404).json({ error: 'Note not found' });
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Authorize: Only creator or Admin can delete
    if (req.user.role !== 'ADMIN' && existingNote.created_by_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not authorized to delete this note' });
    }

    await prisma.privateNote.delete({
      where: { id: noteId }
    });

    return res.json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    return sendError(res, error);
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
        },
        offboarding_record: true,
        cube_quests: {
          include: {
            quest: {
              include: {
                rewards: true
              }
            }
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
    return sendError(res, error);
  }
});

export default router;
