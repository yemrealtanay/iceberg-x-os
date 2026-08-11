import prisma from './prisma';
import { Role } from '@prisma/client';

/**
 * Notification writes are best-effort: a failure here must never fail the
 * action that triggered it (grading, scheduling, profile updates).
 */

export async function createBulkNotification(message: string) {
  try {
    const cubes = await prisma.user.findMany({
      where: { role: Role.CUBE },
      select: { id: true }
    });
    if (cubes.length > 0) {
      await prisma.notification.createMany({
        data: cubes.map(c => ({
          user_id: c.id,
          message
        }))
      });
    }
  } catch (err) {
    console.error('Failed to create bulk notification:', err);
  }
}

export async function createSingleNotification(userId: string, message: string) {
  try {
    await prisma.notification.create({
      data: {
        user_id: userId,
        message
      }
    });
  } catch (err) {
    console.error('Failed to create single notification:', err);
  }
}
