import { CubeLevel } from '@prisma/client';
import prisma from './prisma';
import {
  IN_PROGRAMME_CUBE_LEVELS,
  CERTIFICATE_TYPES_BY_LEVEL,
  CertificateType,
  OFFBOARDING_TARGET_LEVELS
} from '../config/constants';
import { badRequest } from '../utils/http';

const humanize = (level: string) => level.replace(/_/g, ' ');

/**
 * Rejects the operation if any of the given Cubes has left the programme.
 *
 * Enforced here rather than only in the pickers: the UI filters can go stale,
 * and a Cube can be offboarded after a team or meeting was already drafted.
 */
export async function assertCubesAreActive(
  cubeProfileIds: string[],
  action: string
): Promise<void> {
  const ids = [...new Set(cubeProfileIds.filter(Boolean))];
  if (ids.length === 0) return;

  const profiles = await prisma.cubeProfile.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      current_level: true,
      cube_number: true,
      user: { select: { name: true } }
    }
  });

  const missing = ids.filter(id => !profiles.some(p => p.id === id));
  if (missing.length > 0) {
    throw badRequest(`${missing.length} selected Cube(s) no longer exist.`);
  }

  const exited = profiles.filter(p => !IN_PROGRAMME_CUBE_LEVELS.includes(p.current_level));
  if (exited.length > 0) {
    const names = exited
      .map(p => `${p.user.name} (#${p.cube_number}, ${humanize(p.current_level)})`)
      .join(', ');
    throw badRequest(
      `${exited.length === 1 ? 'This Cube has' : 'These Cubes have'} left the programme and cannot ${action}: ${names}.`,
      { exitedCubeIds: exited.map(p => p.id) }
    );
  }
}

/** True when the Cube is still in the programme. */
export async function isCubeActive(cubeProfileId?: string | null): Promise<boolean> {
  if (!cubeProfileId) return false;
  const profile = await prisma.cubeProfile.findUnique({
    where: { id: cubeProfileId },
    select: { current_level: true }
  });
  return !!profile && IN_PROGRAMME_CUBE_LEVELS.includes(profile.current_level);
}

/** Validates the level a Cube is being moved to when they leave. */
export function assertOffboardingTargetLevel(value: any): CubeLevel {
  if (!value) return CubeLevel.Alumni;
  if (!OFFBOARDING_TARGET_LEVELS.includes(value as CubeLevel)) {
    throw badRequest(
      `A Cube can only be offboarded to: ${OFFBOARDING_TARGET_LEVELS.map(humanize).join(' or ')}.`
    );
  }
  return value as CubeLevel;
}

/**
 * A Former Cube did not finish the programme, so a certificate of success would
 * be untrue. Alumni may receive either certificate.
 */
export function assertCertificateTypeForLevel(type: any, level: CubeLevel): CertificateType {
  const allowed = CERTIFICATE_TYPES_BY_LEVEL[level] || [];
  if (!allowed.includes(type)) {
    throw badRequest(
      `A Cube leaving as "${humanize(level)}" can only receive a certificate of ` +
      `${allowed.join(' or ')}. ` +
      (level === CubeLevel.Former_Cube
        ? 'A Former Cube stopped partway through, so a certificate of success cannot be issued.'
        : '')
    );
  }
  return type as CertificateType;
}
