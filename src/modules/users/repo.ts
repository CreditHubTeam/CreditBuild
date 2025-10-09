import { prisma } from "@/core/db";

export const UsersRepo = {
  // ✅ Create/Update user by wallet  
  upsertByWallet: (walletAddress: string, username?: string) =>
    prisma.user.upsert({
      where: { wallet_address: walletAddress },
      update: { 
        username,
        last_activity: new Date()
      },
      create: { 
        wallet_address: walletAddress, 
        username: username || `user_${walletAddress.slice(2, 8)}`,
        registered_at: new Date(),
        last_activity: new Date()
      },
    }),

  // ✅ Find user by wallet address  
  byWallet: (walletAddress: string) =>
    prisma.user.findUnique({ 
      where: { wallet_address: walletAddress },
      include: {
        attempts: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            challenge: {
              select: {
                id: true,
                name: true,
                type: true,
                points: true,
                icon: true
              }
            }
          }
        },
        achievements: {
          include: {
            achievement: true
          }
        },
        pointLedgers: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    }),

  byId: (id: number) =>
    prisma.user.findUnique({
      where: { id },
      include: {
        attempts: true,
        achievements: true,
        pointLedgers: true,
      },
    }),

  exists: async (walletAddress: string): Promise<boolean> => {
    const user = await prisma.user.findUnique({
      where: { wallet_address: walletAddress },
      select: { id: true },
    });
    return !!user;
  },

  stats: async (userId: number) => {
    const [
      totalAttempts,
      completedChallenges,
      pendingChallenges,
      totalPoints,
      last5Attempts,
      achievementCount,
      currentStreak,
    ] = await Promise.all([
      // Total attempts
      prisma.userChallenge.count({
        where: { userId },
      }),

      // Completed challenges
      prisma.userChallenge.count({
        where: {
          userId,
          status: { in: ["APPROVED", "CLAIMED"] },
        },
      }),

      // Pending challenges  
      prisma.userChallenge.count({
        where: {
          userId,
          status: "PENDING",
        },
      }),

      // Total points from point ledger
      prisma.pointLedger.aggregate({
        where: { userId },
        _sum: { delta: true },
      }),

      // Last 5 attempts with challenge info
      prisma.userChallenge.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          challenge: {
            select: {
              id: true,
              name: true,
              type: true,
              category: true,
              points: true,
              icon: true,
            },
          },
        },
      }),

      // Achievement count
      prisma.userAchievement.count({
        where: { userId },
      }),

      // Get user for current streak
      prisma.user.findUnique({
        where: { id: userId },
        select: { streak_days: true },
      }),
    ]);

    return {
      totalAttempts,
      completedChallenges,
      pendingChallenges,
      totalPoints: totalPoints._sum.delta || BigInt(0),
      last5Attempts,
      achievementCount,
      currentStreak: currentStreak?.streak_days || 0,
    };
  },

  update: (
    id: number,
    data: {
      total_points?: bigint;
      credit_score?: number;
      total_challenges?: number;
      streak_days?: number;
      username?: string;
      social_points?: bigint;
      financial_points?: bigint;
      education_points?: bigint;
      tier_level?: string;
      reputation_score?: number;
    }
  ) =>
    prisma.user.update({
      where: { id },
      data: {
        ...data,
        last_activity: new Date(),
      },
    }),
};
