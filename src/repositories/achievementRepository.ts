import { prisma } from "@/core/db";
import { Achievement, Prisma } from "@prisma/client";

// Repository for Achievement model (id is still String, but structure updated)
export class achievementRepository {
  // ...implement methods here

    // xem tất cả achievements
    async findAll(): Promise<Achievement[]> {
        return await prisma.achievement.findMany();
    }
    
    // xem chi tiết một achievement
    async findById(id: string): Promise<Achievement | null> {
        return await prisma.achievement.findUnique({
            where: { id },
        });
    }
    
    // tạo achievement
    async create(data: Prisma.AchievementCreateInput): Promise<Achievement> {
        return await prisma.achievement.create({
            data,
        });
    }
    
    // cập nhật achievement
    async update(id: string, data: Prisma.AchievementUpdateInput): Promise<Achievement | null> {
        return await prisma.achievement.update({
            where: { id },
            data,
        });
    }
    
    // xóa achievement
    async delete(id: string): Promise<Achievement | null> {
        return await prisma.achievement.delete({
            where: { id },
        });
    }
}
