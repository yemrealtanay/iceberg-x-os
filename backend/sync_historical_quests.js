const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const questTemplates = [
  {
    title: 'First Milestone',
    description: 'Complete your very first mission team assignment to kick off your Cube journey.',
    difficulty: 'Common',
    criteria_type: 'missions_assigned',
    criteria_value: 1,
    badgeName: 'Builder',
    badgeIcon: 'hammer',
    badgeRarity: 'Common'
  },
  {
    title: 'Consistency Master',
    description: 'Login to the portal daily for 7 consecutive days to keep tabs on updates.',
    difficulty: 'Common',
    criteria_type: 'login_streak',
    criteria_value: 7,
    badgeName: 'GrowthMindset',
    badgeIcon: 'trending-up',
    badgeRarity: 'Common'
  },
  {
    title: 'Reliable Contributor',
    description: 'Attend at least 90% of meetings you are invited to.',
    difficulty: 'Rare',
    criteria_type: 'meeting_attendance',
    criteria_value: 90,
    badgeName: 'NoGhosting',
    badgeIcon: 'user-check',
    badgeRarity: 'Rare'
  },
  {
    title: 'High Achiever',
    description: 'Achieve an average score of 4.2 or above across all your feedback scorecards.',
    difficulty: 'Rare',
    criteria_type: 'average_score',
    criteria_value: 4.2,
    badgeName: 'OwnYourWork',
    badgeIcon: 'award',
    badgeRarity: 'Rare'
  },
  {
    title: 'R&D Heavyweight',
    description: 'Build and deliver 3 working POCs or integration candidates.',
    difficulty: 'Epic',
    criteria_type: 'missions_completed',
    criteria_value: 3,
    badgeName: 'DemoMaker',
    badgeIcon: 'play',
    badgeRarity: 'Rare'
  },
  {
    title: 'Iceberg Elite Fellow',
    description: 'Maintain an outstanding feedback score of 4.7+ across multiple completed missions.',
    difficulty: 'Epic',
    criteria_type: 'average_score',
    criteria_value: 4.7,
    badgeName: 'Crown',
    badgeIcon: 'crown',
    badgeRarity: 'Epic'
  }
];

const scoreKeys = [
  'technical_ability_score',
  'research_ability_score',
  'demo_output_score',
  'ownership_score',
  'communication_score',
  'leadership_score',
  'product_thinking_score',
  'reliability_score',
  'self_reflection_score'
];

async function syncAll() {
  console.log('Seeding quests and badges safely...');
  
  // 1. Get existing cubes
  const cubes = await prisma.cubeProfile.findMany({ select: { id: true, user_id: true } });
  console.log(`Found ${cubes.length} CubeProfile(s) in database.`);

  // 2. Upsert badges and quests
  for (const t of questTemplates) {
    let badge = await prisma.badge.findUnique({ where: { name: t.badgeName } });
    if (!badge) {
      console.log(`Creating Badge: ${t.badgeName}`);
      badge = await prisma.badge.create({
        data: {
          name: t.badgeName,
          description: `Awarded for completing quest: ${t.title}`,
          icon: t.badgeIcon,
          rarity: t.badgeRarity
        }
      });
    }

    let quest = await prisma.quest.findFirst({ where: { title: t.title } });
    if (!quest) {
      console.log(`Creating Quest: ${t.title}`);
      quest = await prisma.quest.create({
        data: {
          title: t.title,
          description: t.description,
          difficulty: t.difficulty,
          criteria_type: t.criteria_type,
          criteria_value: t.criteria_value,
          rewards: { connect: [{ id: badge.id }] }
        }
      });
    } else {
      // Sync criteria_type and criteria_value if they changed
      if (quest.criteria_type !== t.criteria_type || quest.criteria_value !== t.criteria_value) {
        console.log(`Updating Quest "${t.title}" criteria to ${t.criteria_type} = ${t.criteria_value}`);
        quest = await prisma.quest.update({
          where: { id: quest.id },
          data: {
            criteria_type: t.criteria_type,
            criteria_value: t.criteria_value
          }
        });
      }
    }

    // Ensure all Cubes are assigned to this quest
    for (const c of cubes) {
      const existing = await prisma.cubeQuest.findUnique({
        where: { cube_id_quest_id: { cube_id: c.id, quest_id: quest.id } }
      });
      if (!existing) {
        await prisma.cubeQuest.create({
          data: { cube_id: c.id, quest_id: quest.id, current_value: 0 }
        });
      }
    }
  }

  // 3. Configure default dependency links
  const highAchiever = await prisma.quest.findFirst({ where: { title: 'High Achiever' } });
  const eliteFellow = await prisma.quest.findFirst({ where: { title: 'Iceberg Elite Fellow' } });
  if (highAchiever && eliteFellow) {
    await prisma.quest.update({
      where: { id: eliteFellow.id },
      data: { dependency_quest_id: highAchiever.id }
    });
    console.log('Established dependency link: Iceberg Elite Fellow depends on High Achiever.');
  }

  // 4. Fetch all trackers and recalculate progress values based on historical records
  console.log('Calculating historical quest progress for all Cube trackers...');
  const trackers = await prisma.cubeQuest.findMany({
    include: {
      quest: { include: { rewards: true } },
      cube: { include: { user: true } }
    }
  });

  const systemAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true }
  });
  const awardedById = systemAdmin?.id || 'system';

  let completedCount = 0;
  let updatedCount = 0;

  for (const tracker of trackers) {
    const cubeProfileId = tracker.cube_id;
    const quest = tracker.quest;
    let newValue = tracker.current_value;

    if (quest.criteria_type === 'missions_completed') {
      newValue = await prisma.mission.count({
        where: {
          status: { in: ['completed', 'reviewed', 'promoted_to_product_backlog'] },
          teams: {
            some: {
              members: {
                some: { cube_id: cubeProfileId }
              }
            }
          }
        }
      });
    } 
    else if (quest.criteria_type === 'missions_assigned') {
      newValue = await prisma.missionTeamMember.count({
        where: { cube_id: cubeProfileId }
      });
    }
    else if (quest.criteria_type === 'average_score') {
      const completedMissionsCount = await prisma.mission.count({
        where: {
          status: { in: ['completed', 'reviewed', 'promoted_to_product_backlog'] },
          teams: {
            some: {
              members: {
                some: { cube_id: cubeProfileId }
              }
            }
          }
        }
      });

      let minMissionsRequired = 1;
      if (quest.criteria_value >= 4.7) {
        minMissionsRequired = 5;
      } else if (quest.criteria_value >= 4.2) {
        minMissionsRequired = 2;
      }

      if (completedMissionsCount < minMissionsRequired) {
        newValue = 0;
      } else {
        const feedbacks = await prisma.mentorFeedback.findMany({
          where: { cube_id: tracker.cube.user_id }
        });

        if (feedbacks.length > 0) {
          let sum = 0;
          let count = 0;

          for (const fb of feedbacks) {
            for (const key of scoreKeys) {
              const val = fb[key];
              if (val !== undefined && val !== null) {
                sum += val;
                count++;
              }
            }
          }
          newValue = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
        } else {
          newValue = 0;
        }
      }
    } 
    else if (quest.criteria_type === 'login_streak') {
      newValue = tracker.cube.user.login_streak || 0;
    } 
    else if (quest.criteria_type === 'meeting_attendance') {
      const attendances = await prisma.meetingAttendance.findMany({
        where: { cube_id: cubeProfileId }
      });
      
      if (attendances.length > 0) {
        const attended = attendances.filter(a => a.attended).length;
        newValue = parseFloat(((attended / attendances.length) * 100).toFixed(1));
      }
    }
    else if (quest.criteria_type === 'profile_completion') {
      const hasGithub = !!tracker.cube.github_url;
      const hasLinkedin = !!tracker.cube.linkedin_url;
      const hasSkills = (tracker.cube.skills || []).length >= 3;
      const isComplete = hasGithub && hasLinkedin && hasSkills;

      if (quest.criteria_value > 1) {
        let completedParts = 0;
        if (hasGithub) completedParts++;
        if (hasLinkedin) completedParts++;
        if (hasSkills) completedParts++;
        newValue = Math.round((completedParts / 3) * quest.criteria_value);
      } else {
        newValue = isComplete ? 1 : 0;
      }
    }
    else if (quest.criteria_type === 'write_testimonial') {
      newValue = await prisma.testimonial.count({
        where: { cube_id: cubeProfileId }
      });
    }

    const isNowCompleted = newValue >= quest.criteria_value;

    if (newValue !== tracker.current_value || isNowCompleted !== tracker.is_completed) {
      await prisma.cubeQuest.update({
        where: { id: tracker.id },
        data: {
          current_value: newValue,
          is_completed: isNowCompleted,
          completed_at: isNowCompleted ? (tracker.completed_at || new Date()) : null
        }
      });
      updatedCount++;
    }

    if (isNowCompleted) {
      for (const badge of quest.rewards) {
        const alreadyAwarded = await prisma.cubeBadge.findFirst({
          where: { cube_id: cubeProfileId, badge_id: badge.id }
        });

        if (!alreadyAwarded) {
          await prisma.cubeBadge.create({
            data: {
              cube_id: cubeProfileId,
              badge_id: badge.id,
              reason: `Completed Quest: ${quest.title} (Retroactive Sync)`,
              awarded_by_id: awardedById
            }
          });

          await prisma.notification.create({
            data: {
              user_id: tracker.cube.user_id,
              message: `🎉 Retroactive Award! You completed the quest "${quest.title}" and earned the "${badge.name}" badge!`
            }
          });
          completedCount++;
        }
      }
    }
  }

  console.log(`Sync complete. Updated: ${updatedCount} trackers. Completed & Awarded: ${completedCount} new badges.`);
}

syncAll()
  .catch(err => {
    console.error('Backfill failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
