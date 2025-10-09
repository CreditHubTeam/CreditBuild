import { prisma } from "@/core/db";
import { UsersRepo } from "@/modules/users/repo";

export const EducationService = {
  // List tất cả education content
  list: () => {
    return prisma.education.findMany({ orderBy: { id: "asc" } });
  },

  // Get education content by ID
  get: (id: string) => {
    return prisma.education.findUnique({
      where: { id: Number(id) },
    });
  },

  // Mark education content as completed
  completeEducation: async (walletAddress: string, educationId: number) => {
    const user = await UsersRepo.byWallet(walletAddress);
    if (!user) throw new Error("User not found");

    const education = await prisma.education.findUnique({
      where: { id: educationId },
    });
    if (!education) throw new Error("Education content not found");

    // Check đã complete chưa
    const existing = await prisma.userEducation.findUnique({
      where: {
        userId_educationId: {
          userId: user.id,
          educationId: education.id,
        },
      },
    });

    if (existing) {
      return { alreadyCompleted: true, points: 0 };
    }

    // Tạo record completion
    await prisma.userEducation.create({
      data: {
        userId: user.id,
        educationId: education.id,
        completedAt: new Date(),
      },
    });

    // Add points cho user
    const pointsToAdd = education.points || 0;
    const newPoints = Number(user.total_points) + pointsToAdd;
    await UsersRepo.update(user.id, {
      total_points: BigInt(newPoints),
    });

    return {
      success: true,
      pointsEarned: pointsToAdd,
      newTotalPoints: newPoints,
    };
  },

  // Lấy education progress của user
  getUserProgress: async (userId: number) => {
    return prisma.userEducation.findMany({
      where: { userId },
      include: { education: true },
    });
  },
};
