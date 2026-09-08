import prisma from '../services/prisma';
import { BadgeRarity } from '@prisma/client';
import { assignQuestToCubes } from '../services/quest.service';

async function main() {
  console.log('--- Seeding Mission Update Badges & Quests ---');

  // 1. Define Badges
  const badgesData = [
    {
      name: 'First Pulse',
      description: 'Awarded for posting your very first mission update and establishing signal.',
      rarity: BadgeRarity.Common,
      icon: 'activity',
    },
    {
      name: 'Daily Broadcaster',
      description: 'Awarded for relentless daily presence: 30 consecutive days of mission updates.',
      rarity: BadgeRarity.Rare,
      icon: 'zap',
    },
    {
      name: 'Beacon of Iceberg',
      description: 'Awarded for legendary commitment: 90 consecutive days of continuous mission updates.',
      rarity: BadgeRarity.Epic,
      icon: 'flame',
    },
    {
      name: 'Weekly Cadence',
      description: 'Awarded for maintaining an unbroken 8-week streak of weekly mission updates.',
      rarity: BadgeRarity.Rare,
      icon: 'calendar-check',
    },
    {
      name: 'Iron Cadence',
      description: 'Awarded for extraordinary long-term discipline: 30 consecutive weeks of mission updates.',
      rarity: BadgeRarity.Epic,
      icon: 'infinity',
    },
  ];

  const badgeMap = new Map<string, string>();

  for (const b of badgesData) {
    let badge = await prisma.badge.findUnique({ where: { name: b.name } });
    if (!badge) {
      console.log(`Creating badge: "${b.name}" (${b.rarity})...`);
      badge = await prisma.badge.create({ data: b });
    } else {
      console.log(`Badge already exists: "${b.name}". Updating...`);
      badge = await prisma.badge.update({
        where: { id: badge.id },
        data: { description: b.description, rarity: b.rarity, icon: b.icon },
      });
    }
    badgeMap.set(b.name, badge.id);
  }

  // 2. Define Quests
  const questsData = [
    {
      title: 'First Pulse',
      description: 'Post your first mission update to keep your team and mentors aligned.',
      difficulty: BadgeRarity.Common,
      criteria_type: 'mission_updates_count',
      criteria_value: 1,
      badgeName: 'First Pulse',
      prereqTitle: null,
    },
    {
      title: 'Daily Signal (30 Days)',
      description: 'Broadcast a mission update every single day for 30 consecutive days.',
      difficulty: BadgeRarity.Rare,
      criteria_type: 'daily_update_streak',
      criteria_value: 30,
      badgeName: 'Daily Broadcaster',
      prereqTitle: null,
    },
    {
      title: 'Unbroken Signal (90 Days)',
      description: 'Achieve a legendary streak: post a mission update every single day for 90 consecutive days.',
      difficulty: BadgeRarity.Epic,
      criteria_type: 'daily_update_streak',
      criteria_value: 90,
      badgeName: 'Beacon of Iceberg',
      prereqTitle: 'Daily Signal (30 Days)',
    },
    {
      title: 'Weekly Momentum (8 Weeks)',
      description: 'Post at least one mission update every week for 8 consecutive weeks.',
      difficulty: BadgeRarity.Rare,
      criteria_type: 'weekly_update_streak',
      criteria_value: 8,
      badgeName: 'Weekly Cadence',
      prereqTitle: null,
    },
    {
      title: 'Iron Rhythm (30 Weeks)',
      description: 'Sustain a relentless 30-week unbroken streak of weekly mission progress updates.',
      difficulty: BadgeRarity.Epic,
      criteria_type: 'weekly_update_streak',
      criteria_value: 30,
      badgeName: 'Iron Cadence',
      prereqTitle: 'Weekly Momentum (8 Weeks)',
    },
  ];

  const questMap = new Map<string, string>();

  for (const q of questsData) {
    const badgeId = badgeMap.get(q.badgeName);
    if (!badgeId) continue;

    let quest = await prisma.quest.findFirst({ where: { title: q.title } });
    if (!quest) {
      console.log(`Creating quest: "${q.title}"...`);
      quest = await prisma.quest.create({
        data: {
          title: q.title,
          description: q.description,
          difficulty: q.difficulty,
          criteria_type: q.criteria_type,
          criteria_value: q.criteria_value,
          rewards: {
            connect: [{ id: badgeId }],
          },
        },
      });
    } else {
      console.log(`Quest already exists: "${q.title}". Ensuring badge link...`);
      quest = await prisma.quest.update({
        where: { id: quest.id },
        data: {
          description: q.description,
          difficulty: q.difficulty,
          criteria_type: q.criteria_type,
          criteria_value: q.criteria_value,
          rewards: {
            set: [{ id: badgeId }],
          },
        },
      });
    }
    questMap.set(q.title, quest.id);
  }

  // 3. Link Dependencies
  for (const q of questsData) {
    if (q.prereqTitle) {
      const questId = questMap.get(q.title);
      const prereqId = questMap.get(q.prereqTitle);
      if (questId && prereqId) {
        console.log(`Setting dependency for "${q.title}" -> "${q.prereqTitle}"`);
        await prisma.quest.update({
          where: { id: questId },
          data: { dependency_quest_id: prereqId },
        });
      }
    }
  }

  // 4. Assign base quests (those without dependencies) to all Cubes and evaluate
  const allCubes = await prisma.cubeProfile.findMany({ select: { id: true } });
  const cubeIds = allCubes.map((c) => c.id);
  console.log(`Found ${cubeIds.length} CubeProfile(s). Assigning base update quests...`);

  // Quests without dependencies can be assigned immediately
  for (const q of questsData) {
    if (!q.prereqTitle) {
      const questId = questMap.get(q.title);
      if (questId) {
        const assignResult = await assignQuestToCubes(questId, cubeIds);
        console.log(
          `Quest "${q.title}": ${assignResult.newlyAssigned} newly assigned, ${assignResult.completedImmediately} completed immediately.`
        );
      }
    }
  }

  console.log('--- Done Seeding Mission Update Quests ---');
}

main()
  .catch((e) => {
    console.error('Error seeding update quests:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
