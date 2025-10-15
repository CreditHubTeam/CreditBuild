import { prisma } from "@/core/db";
import { FanClub, Prisma } from "@prisma/client";

// Repository for FanClub model (now mapped to 'clubs' table with UUID)
export class fanClubRepository {
    // ...implement methods here
    // xem tất cả fan clubs
    async findAll(): Promise<FanClub[]> {
        return await prisma.fanClub.findMany();
    }
    // xem chi tiết một fan club (UUID now)
    async findById(id: string): Promise<FanClub | null> {
        return await prisma.fanClub.findUnique({
            where: { id },
        });
    }
    // tìm club theo slug
    async findBySlug(slug: string): Promise<FanClub | null> {
        return await prisma.fanClub.findUnique({
            where: { slug },
        });
    }
    // tạo fan club
    async create(data: Prisma.FanClubCreateInput): Promise<FanClub> {
        return await prisma.fanClub.create({
            data,
        });
    }
    // cập nhật fan club (UUID now)
    async update(id: string, data: Prisma.FanClubUpdateInput): Promise<FanClub> {
        return await prisma.fanClub.update({
            where: { id },
            data,
        });
    }
    // xóa fan club (UUID now)
    async delete(id: string): Promise<FanClub> {
        return await prisma.fanClub.delete({
            where: { id },
        });
    }
}
