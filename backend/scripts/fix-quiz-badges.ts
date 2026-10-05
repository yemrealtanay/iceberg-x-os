/**
 * One-off: align quiz-awarded badges with the score tiers.
 *
 *   npx ts-node scripts/fix-quiz-badges.ts          # dry-run (writes nothing)
 *   npx ts-node scripts/fix-quiz-badges.ts --apply  # applies the changes
 *
 * Per Cube: best completed-attempt score -> expected tier badge.
 * Only the Cube's quiz CubeBadge row (mission_id null, reason mentions
 * "Web Fundamentals Quiz") is touched. Nothing is ever deleted; attempts,
 * mission badges and the badge catalogue are left alone.
 */
import 'dotenv/config';
import prisma from '../src/services/prisma';
import { getQuizTierForScore, QUIZ_BADGE_TIERS } from '../src/services/quiz.service';

const APPLY = process.argv.includes('--apply');

async function main() {
  const badges = await prisma.badge.findMany({
    where: { OR: QUIZ_BADGE_TIERS.map((t) => ({ name: { equals: t.name, mode: 'insensitive' as const } })) }
  });
  const badgeByTier = new Map(
    QUIZ_BADGE_TIERS.map((t) => [t.name, badges.find((b) => b.name.toLowerCase() === t.name.toLowerCase())])
  );
  const missing = QUIZ_BADGE_TIERS.filter((t) => !badgeByTier.get(t.name));
  if (missing.length) {
    console.error('Badges not found in DB, aborting:', missing.map((t) => t.name).join(', '));
    process.exit(1);
  }

  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } });
  if (!admin) throw new Error('No ADMIN user found for awarded_by_id');

  const cubes = await prisma.cubeProfile.findMany({
    where: { quiz_attempts: { some: { status: 'completed' } } },
    select: {
      id: true,
      user: { select: { id: true, name: true } },
      quiz_attempts: { where: { status: 'completed' }, select: { score: true } },
      cube_badges: {
        where: { mission_id: null, reason: { contains: 'Web Fundamentals Quiz' } },
        include: { badge: true },
        orderBy: { awarded_at: 'desc' }
      }
    }
  });

  let ok = 0, create = 0, update = 0, review = 0;

  for (const cube of cubes) {
    const best = Math.max(...cube.quiz_attempts.map((a) => a.score));
    const tier = getQuizTierForScore(best);
    const expected = badgeByTier.get(tier.name)!;
    const name = cube.user?.name || cube.id;
    const [current, ...extra] = cube.cube_badges;

    if (current && current.badge_id === expected.id && extra.length === 0) {
      ok++;
      continue;
    }

    if (!current) {
      create++;
      console.log(`CREATE  ${name}: best ${best} -> "${expected.name}" (no quiz badge held)`);
      if (APPLY) {
        await prisma.cubeBadge.create({
          data: {
            cube_id: cube.id,
            badge_id: expected.id,
            awarded_by_id: admin.id,
            reason: `Earned ${expected.rarity} badge in Web Fundamentals Quiz with score ${best}/100 (backfill)`
          }
        });
      }
      continue;
    }

    if (current.badge_id !== expected.id) {
      update++;
      console.log(`UPDATE  ${name}: best ${best}, "${current.badge.name}" -> "${expected.name}"`);
      if (APPLY) {
        await prisma.cubeBadge.update({
          where: { id: current.id },
          data: {
            badge_id: expected.id,
            reason: `Corrected to ${expected.rarity} in Web Fundamentals Quiz with score ${best}/100 (was ${current.badge.name})`
          }
        });
      }
    }

    if (extra.length) {
      review++;
      console.log(
        `REVIEW  ${name}: ${extra.length} extra quiz badge row(s) left untouched: ` +
          extra.map((e) => `"${e.badge.name}"`).join(', ')
      );
    }
  }

  console.log(
    `\n${APPLY ? 'APPLIED' : 'DRY-RUN'}: ${cubes.length} cubes | already correct ${ok} | create ${create} | update ${update} | manual review ${review}`
  );
  if (!APPLY) console.log('Nothing written. Re-run with --apply to commit.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
