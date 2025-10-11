import { prisma } from "@/core/db";
import { Prisma, UserAchievement } from "@prisma/client";

// Repository for UserAchievement model
export class userAchievementRepository {
  // ...implement methods here

  // xem tất cả user achievements
  async getAll(): Promise<UserAchievement[]> {
    return await prisma.userAchievement.findMany();
    }
  
  // xem tat ca userachievements theo userid
  async getAllByUserId(userId: number) : Promise<UserAchievement[]> {
    return await prisma.userAchievement.findMany({
      where: { userId }
    });
  }

  // xem chi tiết một user achievement
  async getById(id: number): Promise<UserAchievement | null> {
    return await prisma.userAchievement.findUnique({
      where: { id },
    });
  }

  // 

  // tạo user achievement
  async create(data: Prisma.UserAchievementCreateInput): Promise<UserAchievement> {
    return await prisma.userAchievement.create({
      data,
    });
  }

  // cập nhật user achievement
  async update(id: number, data: Prisma.UserAchievementUpdateInput): Promise<UserAchievement> {
    return await prisma.userAchievement.update({
      where: { id },
      data,
    });
  }

  // xóa user achievement
  async delete(id: number): Promise<UserAchievement> {
    return await prisma.userAchievement.delete({
      where: { id },
    });
  }
}
