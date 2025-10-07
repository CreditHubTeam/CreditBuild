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
  createAttempt: (data: any) => prisma.userChallenge.create({ data }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAttempt: (id: number, data: any) =>
    prisma.userChallenge.update({ where: { id }, data }),
};
