/**
 * Authentication and mentor lookup.
 */
import { Router } from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';
import prisma from '../services/prisma';
import { requireAuth, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { loginRateLimit } from '../middlewares/rateLimit.middleware';
import { JWT_SECRET } from '../config/env';
import { sendError, badRequest } from '../utils/http';
import { Role } from '@prisma/client';
import multer from 'multer';
import { StorageService } from '../services/storage.service';

import { trackUserLogin, recalculateAllQuestsForCube } from '../services/quest.service';

const router = Router();

const avatarUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG, JPEG, and WEBP image uploads are allowed.'));
    }
  },
});

router.post('/auth/login', loginRateLimit, async (req, res) => {
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

    // Update login streak and trigger quest calculations
    await trackUserLogin(user.id);

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
        isFoundingCube: user.cube_profile?.is_founding_cube,
        avatar_url: user.avatar_url || user.cube_profile?.avatar_url || null,
        avatarUrl: user.avatar_url || user.cube_profile?.avatar_url || null,
      }
    });
  } catch (error: any) {
    return sendError(res, error);
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
      isFoundingCube: user.cube_profile?.is_founding_cube,
      avatar_url: user.avatar_url || user.cube_profile?.avatar_url || null,
      avatarUrl: user.avatar_url || user.cube_profile?.avatar_url || null,
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

/**
 * Universal avatar upload for the authenticated user (Admin, Mentor, or Cube).
 */
router.post(
  '/users/me/avatar',
  requireAuth,
  (req, res, next) => {
    avatarUpload.single('avatar')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message || 'Invalid image file.' });
      }
      next();
    });
  },
  async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user!.id;
      let buffer: Buffer;
      let extension = 'png';

      if (req.file) {
        buffer = req.file.buffer;
        extension = req.file.mimetype.split('/')[1] || 'png';
      } else if (req.body.avatar_base64) {
        const matches = req.body.avatar_base64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          throw badRequest('Invalid base64 image data URL format.');
        }
        const mime = matches[1];
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(mime)) {
          throw badRequest('Only PNG, JPEG, and WEBP image uploads are allowed.');
        }
        extension = mime.split('/')[1] || 'png';
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        throw badRequest('Missing avatar image file or base64 data.');
      }

      const { relativeUrl } = await StorageService.saveAvatar(userId, buffer, extension);

      // Update User record
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { avatar_url: relativeUrl },
        include: { cube_profile: true },
      });

      // Synchronize CubeProfile if exists
      if (updatedUser.cube_profile) {
        await prisma.cubeProfile.update({
          where: { id: updatedUser.cube_profile.id },
          data: { avatar_url: relativeUrl },
        });
        recalculateAllQuestsForCube(updatedUser.cube_profile.id).catch(err => {
          console.error('Failed to recalculate quests after avatar upload:', err);
        });
      }

      return res.json({
        success: true,
        avatar_url: relativeUrl,
        avatarUrl: relativeUrl,
      });
    } catch (error: any) {
      return sendError(res, error);
    }
  }
);

/**
 * Remove avatar for current user.
 */
router.delete('/users/me/avatar', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { cube_profile: true },
    });

    if (user?.avatar_url) {
      await StorageService.deleteAvatar(user.avatar_url);
    }

    await prisma.user.update({
      where: { id: userId },
      data: { avatar_url: null },
    });

    if (user?.cube_profile) {
      await prisma.cubeProfile.update({
        where: { id: user.cube_profile.id },
        data: { avatar_url: null },
      });
      recalculateAllQuestsForCube(user.cube_profile.id, { forceRecheck: true }).catch(err => {
        console.error('Failed to recalculate quests after avatar removal:', err);
      });
    }

    return res.json({ success: true, message: 'Avatar removed.' });
  } catch (error: any) {
    return sendError(res, error);
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
    return sendError(res, error);
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
    return sendError(res, error);
  }
});

export default router;
