import { prisma } from "@/core/db";

export const AchievementsService = {
  // Check và award achievements cho user
  checkAndAward: async (userId: number) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const achievements = await prisma.achievement.findMany();

    for (const achievement of achievements) {
      // Check xem user đã có achievement chưa
      const hasAchievement = await prisma.userAchievement.findUnique({
        where: {
          userId_achievementId: {
            userId,
            achievementId: achievement.id,
          },
        },
      });

      if (hasAchievement) continue;

      // Check achievement conditions
      const conditions = achievement.conditions as {
        minChallenges?: number;
        minStreak?: number;
        minCreditScore?: number;
        minPoints?: number;
        challengeCategory?: string;
      };
      let qualifies = false;

      // Check different types of conditions
      if (
        conditions.minChallenges &&
        user.total_challenges >= conditions.minChallenges
      ) {
        // If specific category required, check that too
        if (conditions.challengeCategory) {
          const categoryCount = await prisma.userChallenge.count({
            where: {
              userId,
              status: { in: ["APPROVED", "CLAIMED"] },
              challenge: {
                category: conditions.challengeCategory,
              },
            },
          });
          qualifies = categoryCount >= conditions.minChallenges;
        } else {
          qualifies = true;
        }
      }

      if (conditions.minStreak && user.streak_days >= conditions.minStreak) {
        qualifies = true;
      }

      if (
        conditions.minCreditScore &&
        user.credit_score >= conditions.minCreditScore
      ) {
        qualifies = true;
      }

      if (
        conditions.minPoints &&
        Number(user.total_points) >= conditions.minPoints
      ) {
        qualifies = true;
      }

      // Award achievement nếu đủ điều kiện
      if (qualifies) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
          },
        });

        console.log(
          `🏆 User ${userId} earned achievement: ${achievement.name}`
        );
      }
    }
  },

  // Lấy tất cả achievements của user
  getUserAchievements: async (userId: number) => {
    return prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });
  },
};
