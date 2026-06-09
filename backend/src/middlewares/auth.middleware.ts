import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import prisma from '../services/prisma';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'ADMIN' | 'MENTOR' | 'CUBE';
    cubeProfileId?: string; // If role is CUBE
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_iceberg_x';

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token is required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'ADMIN' | 'MENTOR' | 'CUBE' };

    // Find user in database to ensure they still exist and check CubeProfile
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { cube_profile: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User does not exist' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      cubeProfileId: user.cube_profile?.id
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}

export function requireRole(allowedRoles: ('ADMIN' | 'MENTOR' | 'CUBE')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden: Insufficient permissions' });
    }

    next();
  };
}

export const isAdmin = requireRole(['ADMIN']);
export const isMentor = requireRole(['MENTOR']);
export const isCube = requireRole(['CUBE']);
export const isMentorOrAdmin = requireRole(['ADMIN', 'MENTOR']);
