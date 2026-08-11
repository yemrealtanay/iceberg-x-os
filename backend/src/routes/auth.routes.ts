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
import { sendError } from '../utils/http';
import { Role } from '@prisma/client';

const router = Router();

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
      isFoundingCube: user.cube_profile?.is_founding_cube
    });
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
