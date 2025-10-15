import { prisma } from "@/core/db";
import { Prisma, UserAchievement } from "@prisma/client";

// Repository for UserAchievement model (now with UUID)
export class userAchievementRepository {
  // ...implement methods here

  // xem tất cả user achievements
  async getAll(): Promise<UserAchievement[]> {
    return await prisma.userAchievement.findMany();
  }
  
  // xem tat ca userachievements theo userid (UUID now)
  async getAllByUserId(userId: string): Promise<UserAchievement[]> {
    return await prisma.userAchievement.findMany({
      where: { user_id: userId }
    });
  }

  // xem chi tiết một user achievement (UUID now)
  async getById(id: string): Promise<UserAchievement | null> {
    return await prisma.userAchievement.findUnique({
      where: { id },
    });
  }

  // kiểm tra user đã unlock achievement chưa (UUID now)
  async isAchievementUnlocked(userId: string, achievementId: string): Promise<boolean> {
    const userAchievement = await prisma.userAchievement.findUnique({
      where: {
        user_id_achievement_id: {
          user_id: userId,
          achievement_id: achievementId,
        },
      },
    });
    return userAchievement !== null;
  }

  // tạo user achievement
  async create(data: Prisma.UserAchievementCreateInput): Promise<UserAchievement> {
    return await prisma.userAchievement.create({
      data,
    });
  }

  // cập nhật user achievement (UUID now)
  async update(id: string, data: Prisma.UserAchievementUpdateInput): Promise<UserAchievement> {
    return await prisma.userAchievement.update({
      where: { id },
      data,
    });
  }

  // xóa user achievement (UUID now)
  async delete(id: string): Promise<UserAchievement> {
    return await prisma.userAchievement.delete({
      where: { id },
    });
  }
}
