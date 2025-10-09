/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/core/db";

export const DashboardService = {
  overview: async (walletAddress: string) => {
    const user = await prisma.user.findUnique({ where: { wallet_address: walletAddress } });
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
      orderBy: { total_points: "desc" },
      take: 10,
      select: { wallet_address: true, total_points: true, credit_score: true },
    });

    return {
      profile: {
        wallet_address: user.wallet_address,
        credit_score: user.credit_score,
        total_points: user.total_points.toString(),
      },
      completed,
      recentAttempts: lastTxs,
      leaderboard: topUsers.map((u: any) => ({
        wallet_address: u.wallet_address,
        total_points: u.total_points.toString(),
        credit_score: u.credit_score,
      })),
    };
  },
};
