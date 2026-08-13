import prisma from './prisma';
import { BadgeRarity, MissionStatus } from '@prisma/client';

/**
 * Tracks and updates a user's login streak.
 * Run this on every successful login.
 */
export async function trackUserLogin(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, last_login_at: true, login_streak: true, role: true, cube_profile: { select: { id: true } } }
  });

  if (!user) return;

  const now = new Date();
  let nextStreak = user.login_streak;

  if (!user.last_login_at) {
    nextStreak = 1;
  } else {
    // Normalize dates to midnight to check calendar days difference
    const lastLoginDate = new Date(user.last_login_at);
    lastLoginDate.setHours(0, 0, 0, 0);
    
    const todayDate = new Date(now);
    todayDate.setHours(0, 0, 0, 0);

    const diffTime = todayDate.getTime() - lastLoginDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive login day
      nextStreak += 1;
    } else if (diffDays > 1) {
      // Streak broken
      nextStreak = 1;
    }
    // If diffDays === 0, they already logged in today, keep the same streak
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      last_login_at: now,
      login_streak: nextStreak
    }
  });

  // If this user is a Cube, update their login streak quests
  if (user.role === 'CUBE' && user.cube_profile) {
    const cubeProfileId = user.cube_profile.id;
    // Find all quests for this cube that track login streak
    const cubeQuests = await prisma.cubeQuest.findMany({
      where: {
        cube_id: cubeProfileId,
        is_completed: false,
        quest: { criteria_type: 'login_streak' }
      },
      select: { quest_id: true }
    });

    for (const cq of cubeQuests) {
      await verifyQuestProgress(cubeProfileId, cq.quest_id);
    }
  }
}

/**
 * Re-evaluates a Cube's progress on a single Quest.
 * If target criteria is met, completes the quest and awards the badge(s).
 */
export async function verifyQuestProgress(cubeProfileId: string, questId: string): Promise<any> {
  const cubeQuest = await prisma.cubeQuest.findUnique({
    where: { cube_id_quest_id: { cube_id: cubeProfileId, quest_id: questId } },
    include: {
      quest: {
        include: { rewards: true }
      }
    }
  });

  if (!cubeQuest || cubeQuest.is_completed) return cubeQuest;

  const { quest } = cubeQuest;
  let newValue = cubeQuest.current_value;

  // 1. Calculate new progress based on criteria type
  if (quest.criteria_type === 'missions_completed') {
    newValue = await prisma.mission.count({
      where: {
        status: { in: [MissionStatus.completed, MissionStatus.reviewed, MissionStatus.promoted_to_product_backlog] },
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
    const profile = await prisma.cubeProfile.findUnique({
      where: { id: cubeProfileId },
      select: { user_id: true }
    });

    if (profile) {
      // Enforce minimum completed missions before average score can satisfy the quest
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
          where: { cube_id: profile.user_id }
        });

        if (feedbacks.length > 0) {
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

          let sum = 0;
          let count = 0;

          for (const fb of feedbacks) {
            for (const key of scoreKeys) {
              const val = (fb as any)[key];
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
  } 
  else if (quest.criteria_type === 'login_streak') {
    const profile = await prisma.cubeProfile.findUnique({
      where: { id: cubeProfileId },
      include: { user: { select: { login_streak: true } } }
    });
    newValue = profile?.user?.login_streak || 0;
  } 
  else if (quest.criteria_type === 'meeting_attendance') {
    const attendances = await prisma.meetingAttendance.findMany({
      where: { cube_id: cubeProfileId }
    });
    
    if (attendances.length > 0) {
      const attended = attendances.filter(a => a.attended).length;
      newValue = parseFloat(((attended / attendances.length) * 100).toFixed(1));
    } else {
      newValue = 0;
    }
  }
  else if (quest.criteria_type === 'profile_completion') {
    const profile = await prisma.cubeProfile.findUnique({
      where: { id: cubeProfileId },
      select: { github_url: true, linkedin_url: true, skills: true }
    });
    if (profile) {
      const hasGithub = !!profile.github_url;
      const hasLinkedin = !!profile.linkedin_url;
      const hasSkills = (profile.skills || []).length >= 3;
      
      newValue = (hasGithub && hasLinkedin && hasSkills) ? 1 : 0;
    } else {
      newValue = 0;
    }
  }
  else if (quest.criteria_type === 'write_testimonial') {
    const count = await prisma.testimonial.count({
      where: { cube_id: cubeProfileId }
    });
    newValue = count;
  }

  // 2. Check if quest criteria are met
  const isNowCompleted = newValue >= quest.criteria_value;

  // 3. Perform database updates
  const updatedCubeQuest = await prisma.$transaction(async (tx) => {
    const updated = await tx.cubeQuest.update({
      where: { cube_id_quest_id: { cube_id: cubeProfileId, quest_id: questId } },
      data: {
        current_value: newValue,
        is_completed: isNowCompleted,
        completed_at: isNowCompleted ? new Date() : null
      }
    });

    if (isNowCompleted) {
      // Get a valid system user to award the badge
      const systemAdmin = await tx.user.findFirst({
        where: { role: 'ADMIN' },
        select: { id: true }
      });
      const awardedById = systemAdmin?.id || 'system';

      // Award each reward badge that is not already awarded
      for (const badge of quest.rewards) {
        const alreadyAwarded = await tx.cubeBadge.findFirst({
          where: { cube_id: cubeProfileId, badge_id: badge.id }
        });

        if (!alreadyAwarded) {
          await tx.cubeBadge.create({
            data: {
              cube_id: cubeProfileId,
              badge_id: badge.id,
              reason: `Completed Quest: ${quest.title}`,
              awarded_by_id: awardedById
            }
          });

          // Create notification for the user
          const profile = await tx.cubeProfile.findUnique({
            where: { id: cubeProfileId },
            select: { user_id: true }
          });

          if (profile) {
            await tx.notification.create({
              data: {
                user_id: profile.user_id,
                message: `🎉 Congratulations! You completed the quest "${quest.title}" and earned the "${badge.name}" badge!`
              }
            });
          }
        }
      }
    }

    return updated;
  });

  // 4. Auto-unlock dependent quests (runs after transaction commits successfully)
  if (isNowCompleted) {
    try {
      const dependentQuests = await prisma.quest.findMany({
        where: { dependency_quest_id: questId }
      });

      for (const dq of dependentQuests) {
        const alreadyAssigned = await prisma.cubeQuest.findUnique({
          where: { cube_id_quest_id: { cube_id: cubeProfileId, quest_id: dq.id } }
        });

        if (!alreadyAssigned) {
          await prisma.cubeQuest.create({
            data: {
              cube_id: cubeProfileId,
              quest_id: dq.id,
              current_value: 0
            }
          });

          // Recursively verify progress on the newly unlocked quest
          await verifyQuestProgress(cubeProfileId, dq.id);
        }
      }
    } catch (unlockError) {
      console.error(`Failed to auto-unlock dependent quests for parent ${questId}:`, unlockError);
    }
  }

  return updatedCubeQuest;
}

/**
 * Re-evaluates all active (incomplete) quests assigned to a Cube.
 */
export async function recalculateAllQuestsForCube(cubeProfileId: string): Promise<void> {
  const activeQuests = await prisma.cubeQuest.findMany({
    where: { cube_id: cubeProfileId, is_completed: false },
    select: { quest_id: true }
  });

  for (const aq of activeQuests) {
    try {
      await verifyQuestProgress(cubeProfileId, aq.quest_id);
    } catch (err) {
      console.error(`Failed to verify quest ${aq.quest_id} for cube ${cubeProfileId}:`, err);
    }
  }
}

/**
 * Assigns a quest to a list of Cube profile IDs.
 * Immediately computes initial progress.
 */
export async function assignQuestToCubes(questId: string, cubeProfileIds: string[]): Promise<void> {
  for (const id of cubeProfileIds) {
    // Avoid double assignments
    const existing = await prisma.cubeQuest.findUnique({
      where: { cube_id_quest_id: { cube_id: id, quest_id: questId } }
    });

    if (!existing) {
      await prisma.cubeQuest.create({
        data: {
          cube_id: id,
          quest_id: questId
        }
      });
      
      // Calculate initial progress
      try {
        await verifyQuestProgress(id, questId);
      } catch (err) {
        console.error(`Failed initial quest eval for ${id}:`, err);
      }
    }
  }
}
