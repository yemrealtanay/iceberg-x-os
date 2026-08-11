import crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import prisma from './prisma';
import { APP_URL } from '../config/env';

/** How long an invite link stays usable. */
export const INVITE_TTL_HOURS = 72;

/**
 * Replaces the shared DEFAULT_CUBE_PASSWORD onboarding.
 *
 * A new account is created with an unusable random password, and the person is
 * sent a one-time link on which they choose their own password. Only the SHA-256
 * of the token is stored, so the database never holds anything replayable.
 *
 * Accounts created before this existed are untouched: their password_hash stays
 * valid and they keep signing in normally.
 */

export function generateInviteToken() {
  const token = crypto.randomBytes(32).toString('base64url');
  return { token, tokenHash: hashInviteToken(token) };
}

export function hashInviteToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function inviteUrl(token: string) {
  return `${APP_URL}/invite/${token}`;
}

/**
 * A password hash that no input can ever match, used while the account waits
 * for its invite to be accepted. Never a known constant.
 */
export async function unusablePasswordHash() {
  return bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10);
}

/**
 * Issues an invite for a user, superseding any previous unaccepted one.
 * Returns the raw token — the only time it exists in plaintext.
 */
export async function issueInvite(tx: any, userId: string, createdById: string) {
  const { token, tokenHash } = generateInviteToken();
  const expiresAt = new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000);

  // Retire outstanding invites so only the newest link works
  await tx.userInvite.deleteMany({
    where: { user_id: userId, accepted_at: null }
  });

  await tx.userInvite.create({
    data: {
      user_id: userId,
      token_hash: tokenHash,
      expires_at: expiresAt,
      created_by_id: createdById
    }
  });

  return { token, url: inviteUrl(token), expiresAt };
}

/** Looks up a usable invite by raw token, or null when invalid/expired/used. */
export async function findUsableInvite(token: string) {
  if (!token) return null;

  const invite = await prisma.userInvite.findUnique({
    where: { token_hash: hashInviteToken(token) },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          cube_profile: { select: { cube_number: true } }
        }
      }
    }
  });

  if (!invite) return null;
  if (invite.accepted_at) return null;
  if (invite.expires_at.getTime() < Date.now()) return null;

  return invite;
}
