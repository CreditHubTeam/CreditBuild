import { prisma } from "@/core/db";
import { Achievement } from "@prisma/client";

// Repository for Achievement model
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
    async create(data: Achievement): Promise<Achievement> {
        return await prisma.achievement.create({
            data,
        });
    }
    // cập nhật achievement
    async update(id: string, data: Partial<Achievement>): Promise<Achievement | null> {
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
