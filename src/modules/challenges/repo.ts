import { prisma } from "@/core/db";

export const ChallengesRepo = {
  list: () => prisma.challenge.findMany({ orderBy: { createdAt: "desc" } }),
  byId: (id: number) => prisma.challenge.findUnique({ where: { id } }),
  weeklyCount: (userId: number, challengeId: number) =>
    prisma.userChallenge.count({
      where: {
        userId,
        challengeId,
        createdAt: { gte: new Date(Date.now() - 7 * 86400 * 1000) },
      },
    }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // createAttempt: (data: any) => prisma.userChallenge.create({ data }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAttempt: (id: number, data: any) =>
    prisma.userChallenge.update({ where: { id }, data }),

  // ======= SIMPLE FUNC =======
  // Lấy 4 challenges ngẫu nhiên cho ngày hôm nay
  getDailyChallenges: async (count: number = 4) => {
    const allChallenges = await prisma.challenge.findMany();
    // Shuffle và lấy N challenges
    const shuffled = allChallenges.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  // Check xem user đã làm challenge trong ngày chưa
  hasCompletedToday: async (userId: number, challengeId: number) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const count = await prisma.userChallenge.count({
      where: {
        userId,
        challengeId,
        status: { in: ["APPROVED", "CLAIMED"] },
        createdAt: { gte: startOfDay },
      },
    });
    return count > 0;
  },

  // Đếm số challenges đã hoàn thành trong ngày
  getDailyCompletedCount: async (userId: number) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    return prisma.userChallenge.count({
      where: {
        userId,
        status: { in: ["APPROVED", "CLAIMED"] },
        createdAt: { gte: startOfDay },
      },
    });
  },
  // Tạo challenge attempt => luôn auto approved (demo mode)
  createAttempt: (data: {
    userId: number;
    challengeId: number;
    amount?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    proof?: any;
    status?: "PENDING" | "APPROVED" | "REJECTED" | "CLAIMED";
  }) =>
    prisma.userChallenge.create({
      data: {
        userId: data.userId,
        challengeId: data.challengeId,
        amount: data.amount === undefined ? undefined : String(data.amount),
        proof: data.proof,
        status: data.status || "APPROVED", // Demo mode: auto approve
      },
    }),
};
