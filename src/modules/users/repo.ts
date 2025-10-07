import { prisma } from "@/core/db";

export const UsersRepo = {
  upsertByWallet: (walletAddress: string, username?: string) =>
    prisma.user.upsert({
      where: { walletAddress },
      update: { username },
      create: { walletAddress, username },
    }),
  byWallet: (walletAddress: string) =>
    prisma.user.findUnique({ where: { walletAddress } }),
  stats: async (userId: number) => {
    const attempts = await prisma.userChallenge.count({
      where: { userId, status: { in: ["APPROVED", "CLAIMED"] } },
    });
    const last5 = await prisma.userChallenge.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
    return { attempts, last5 };
  },
};
