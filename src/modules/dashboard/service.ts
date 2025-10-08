import { prisma } from "@/core/db";

export const DashboardService = {
  overview: async (walletAddress: string) => {
    const user = await prisma.user.findUnique({ where: { walletAddress } });
    if (!user) return null;

    const completed = await prisma.userChallenge.count({
      where: { userId: user.id, status: { in: ["APPROVED", "CLAIMED"] } },
    });
    const lastTxs = await prisma.userChallenge.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    const topUsers = await prisma.user.findMany({
      orderBy: { totalPoints: "desc" },
      take: 10,
      select: { walletAddress: true, totalPoints: true, creditScore: true },
    });

    return {
      profile: {
        walletAddress: user.walletAddress,
        creditScore: user.creditScore,
        totalPoints: user.totalPoints,
      },
      completed,
      recentAttempts: lastTxs,
      leaderboard: topUsers,
    };
  },
};
