import prisma from './prisma';
import { BadgeRarity, MissionStatus } from '@prisma/client';

/**
 * Fallback minimum sample size for "rate" criteria (average_score,
 * meeting_attendance) when a quest does not specify `min_sample_size`.
 *
 * A rate computed from one data point is meaningless — a Cube's very first
 * meeting is trivially 100% attendance, and a single scorecard trivially
 * "is" the average. Higher-rarity rewards should demand more evidence, not
 * less, so the default scales with difficulty.
 */
const DEFAULT_MIN_SAMPLE_SIZE: Record<BadgeRarity, number> = {
  [BadgeRarity.Common]: 3,
  [BadgeRarity.Rare]: 5,
  [BadgeRarity.Epic]: 10
};

function resolveMinSampleSize(quest: { min_sample_size: number | null; difficulty: BadgeRarity }): number {
  if (quest.min_sample_size !== null && quest.min_sample_size !== undefined) {
    return Math.max(1, quest.min_sample_size);
  }
  return DEFAULT_MIN_SAMPLE_SIZE[quest.difficulty] ?? DEFAULT_MIN_SAMPLE_SIZE[BadgeRarity.Common];
}

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
      // Enforce a minimum number of completed missions before an average score
      // can satisfy the quest — otherwise one great scorecard on one project
      // "is" a 4.7 average and instantly earns an Epic badge. The minimum
      // scales with the quest's own difficulty (see resolveMinSampleSize),
      // not a value hardcoded to today's specific quest thresholds.
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

      const minMissionsRequired = resolveMinSampleSize(quest);

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

    // A rate needs a real sample: with no floor, a Cube's first-ever logged
    // meeting (attended = true) is 1/1 = 100% and completes the quest on the
    // spot. The minimum scales with quest difficulty (see resolveMinSampleSize).
    const minMeetingsRequired = resolveMinSampleSize(quest);

    if (attendances.length >= minMeetingsRequired) {
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
      let completedParts = 0;
      if (profile.github_url) completedParts++;
      if (profile.linkedin_url) completedParts++;
      if ((profile.skills || []).length >= 3) completedParts++;

      // Two quest authoring styles exist in the wild and both have to keep
      // working:
      //
      //  - "N of 3 parts" (criteria_value is 1, 2, or 3): current_value is the
      //    raw part count, compared directly.
      //  - "percentage" (criteria_value is e.g. 100, meaning "100% done"):
      //    current_value is completedParts scaled to that same 0..100-ish
      //    range, so 3/3 parts reaches exactly criteria_value.
      //
      // A quest with criteria_value = 100 already existed in production under
      // the old formula (Math.round((completedParts/3)*criteria_value)) before
      // this file simplified profile_completion to a flat part count. That
      // change silently broke it — current_value topped out at 3, so
      // `3 >= 100` was never true again and nobody could complete it from
      // that point on, even with every part filled in. Detecting the style
      // from criteria_value's magnitude keeps both working without an admin
      // having to edit the quest (there is no edit endpoint).
      newValue = quest.criteria_value > 3
        ? Math.round((completedParts / 3) * quest.criteria_value)
        : completedParts;
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
 * Re-evaluates quests for several Cubes at once. Best-effort: one Cube's
 * failure does not stop the others, and the caller's own action (completing a
 * mission, logging a scorecard, closing a meeting) must never fail because a
 * quest recalculation had a problem.
 */
export async function recalculateQuestsForCubes(cubeProfileIds: string[]): Promise<void> {
  const uniqueIds = [...new Set(cubeProfileIds.filter(Boolean))];
  for (const id of uniqueIds) {
    try {
      await recalculateAllQuestsForCube(id);
    } catch (err) {
      console.error(`Failed to recalculate quests for cube ${id}:`, err);
    }
  }
}

/**
 * Re-evaluates quests for every Cube on a mission's team.
 *
 * Used wherever a mission's status changes (it may now satisfy
 * "missions_completed") so the quest completes the moment the mentor actually
 * completes the mission — not later, coincidentally, when the Cube happens to
 * log in, write a testimonial, or edit their profile (the only things that
 * used to trigger a recheck).
 */
export async function recalculateQuestsForMissionTeams(missionId: string): Promise<void> {
  const teams = await prisma.missionTeam.findMany({
    where: { mission_id: missionId },
    select: { members: { select: { cube_id: true } } }
  });
  const cubeIds = teams.flatMap(t => t.members.map(m => m.cube_id));
  await recalculateQuestsForCubes(cubeIds);
}

export interface AssignQuestResult {
  /** Cubes that had no CubeQuest row yet and were assigned just now. */
  newlyAssigned: number;
  /** Cubes that already had this quest — left untouched, not re-evaluated. */
  alreadyAssigned: number;
  /**
   * Of the newly assigned, how many already satisfied the criteria at the
   * moment of assignment (e.g. their profile was already complete) and were
   * completed — badge included — without them doing anything further.
   */
  completedImmediately: number;
  /**
   * Cubes whose initial evaluation threw. Previously this was swallowed with
   * only a console.error, so an admin who assigned a quest to 24 Cubes had no
   * way to know if 3 of them silently failed to evaluate — the response
   * always just said "assigned to 24 Cube(s)".
   */
  failed: { cubeProfileId: string; error: string }[];
}

/**
 * Assigns a quest to a list of Cube profile IDs, skipping anyone already
 * assigned, and immediately evaluates progress for everyone newly assigned —
 * so a Cube whose profile (or mission history, or scorecards) already
 * satisfies the quest completes it on the spot. There is no separate "verify"
 * step to remember to run afterwards for that case.
 */
export async function assignQuestToCubes(questId: string, cubeProfileIds: string[]): Promise<AssignQuestResult> {
  const result: AssignQuestResult = {
    newlyAssigned: 0,
    alreadyAssigned: 0,
    completedImmediately: 0,
    failed: []
  };

  for (const id of cubeProfileIds) {
    // Avoid double assignments
    const existing = await prisma.cubeQuest.findUnique({
      where: { cube_id_quest_id: { cube_id: id, quest_id: questId } }
    });

    if (existing) {
      result.alreadyAssigned++;
      continue;
    }

    await prisma.cubeQuest.create({
      data: {
        cube_id: id,
        quest_id: questId
      }
    });
    result.newlyAssigned++;

    // Calculate initial progress
    try {
      const evaluated = await verifyQuestProgress(id, questId);
      if (evaluated?.is_completed) result.completedImmediately++;
    } catch (err) {
      console.error(`Failed initial quest eval for ${id}:`, err);
      result.failed.push({ cubeProfileId: id, error: err instanceof Error ? err.message : String(err) });
    }
  }

  return result;
}
