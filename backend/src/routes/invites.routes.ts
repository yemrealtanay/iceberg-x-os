/**
 * One-time invitation links.
 */
import { Router } from 'express';
import * as bcrypt from 'bcryptjs';
import prisma from '../services/prisma';
import { requireAuth, isAdmin, AuthenticatedRequest } from '../middlewares/auth.middleware';
import { badRequest, conflict, notFound, sendError } from '../utils/http';
import { rateLimit } from '../middlewares/rateLimit.middleware';
import { findUsableInvite, INVITE_TTL_HOURS, issueInvite } from '../services/invite.service';

const router = Router();

/** Invite tokens are guessing targets, so the public endpoints are throttled. */
const inviteLookupRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many invite attempts. Please try again in a few minutes.'
});

/**
 * Public: inspect an invite without consuming it, so the accept page can greet
 * the person by name. Reveals nothing beyond the name and masked email.
 */
router.get('/invites/:token', inviteLookupRateLimit, async (req, res) => {
  try {
    const invite = await findUsableInvite(req.params.token);
    if (!invite) {
      throw notFound('This invitation link is invalid, already used, or expired.');
    }

    const [local, domain] = invite.user.email.split('@');
    const maskedEmail = `${local.slice(0, 2)}${'•'.repeat(Math.max(local.length - 2, 1))}@${domain}`;

    return res.json({
      name: invite.user.name,
      maskedEmail,
      role: invite.user.role,
      cubeNumber: invite.user.cube_profile?.cube_number || null,
      expiresAt: invite.expires_at
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

/**
 * Public: accept an invite by setting a password. Consumes the invite so the
 * link cannot be reused.
 */
router.post('/invites/:token/accept', inviteLookupRateLimit, async (req, res) => {
  try {
    const { password } = req.body;

    if (typeof password !== 'string' || password.length < 8) {
      throw badRequest('Password must be at least 8 characters long.');
    }

    const invite = await findUsableInvite(req.params.token);
    if (!invite) {
      throw notFound('This invitation link is invalid, already used, or expired.');
    }

    // Hash outside the transaction: bcrypt is slow and would hold a connection
    const password_hash = await bcrypt.hash(password, 10);

    await prisma.$transaction(async (tx) => {
      // Re-check inside the transaction so a double submit cannot set the
      // password twice
      const fresh = await tx.userInvite.findUnique({
        where: { id: invite.id },
        select: { accepted_at: true }
      });
      if (!fresh || fresh.accepted_at) {
        throw conflict('This invitation has already been used.');
      }

      await tx.user.update({
        where: { id: invite.user_id },
        data: { password_hash }
      });

      await tx.userInvite.update({
        where: { id: invite.id },
        data: { accepted_at: new Date() }
      });
    });

    return res.json({
      success: true,
      email: invite.user.email,
      message: 'Password set. You can now sign in.'
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

/**
 * Admin: (re)issue an invite for an existing user, e.g. when the first link
 * expired. Does not alter the account's current password — an existing user can
 * keep signing in until they actually accept the new invite.
 */
router.post('/admin/users/:id/invite', requireAuth, isAdmin, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    if (!req.user) throw badRequest('Unauthorized');

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true }
    });
    if (!user) throw notFound('User not found');

    const invite = await prisma.$transaction(tx => issueInvite(tx, user.id, req.user!.id));

    return res.status(201).json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
      inviteUrl: invite.url,
      expiresAt: invite.expiresAt,
      expiresInHours: INVITE_TTL_HOURS,
      message: 'Send this single-use link to the user. It is shown only once.'
    });
  } catch (error: any) {
    return sendError(res, error);
  }
});

export default router;
