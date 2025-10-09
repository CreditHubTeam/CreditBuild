import { prisma } from "@/core/db";
import { FanClub, Prisma } from "@prisma/client";

// Repository for FanClub model
export class fanClubRepository {
    // ...implement methods here
    // xem tất cả fan clubs
    async findAll(): Promise<FanClub[]> {
        return await prisma.fanClub.findMany();
    }
    // xem chi tiết một fan club
    async findById(id: number): Promise<FanClub | null> {
        return await prisma.fanClub.findUnique({
            where: { id },
        });
    }
    // tạo fan club
    async create(data: Prisma.FanClubCreateInput): Promise<FanClub> {
        return await prisma.fanClub.create({
            data,
        });
    }
    // cập nhật fan club
    async update(id: number, data: Prisma.FanClubUpdateInput): Promise<FanClub> {
        return await prisma.fanClub.update({
            where: { id },
            data,
        });
    }
    // xóa fan club
    async delete(id: number): Promise<FanClub> {
        return await prisma.fanClub.delete({
            where: { id },
        });
    }
}
