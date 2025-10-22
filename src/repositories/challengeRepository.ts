import { prisma } from "@/core/db";
import { Challenge, Prisma } from "@prisma/client";

// Repository for Challenge model (now with UUID)
export class challengeRepository {
    // xem tất cả challenges
    async findAll(): Promise<Challenge[]> {
        return await prisma.challenge.findMany();
    }
    // xem chi tiết một challenge (UUID now)
    async findById(id: string): Promise<Challenge | null> {
        return await prisma.challenge.findUnique({
            where: { id },
        });
    }
    // tìm challenge theo slug
    async findBySlug(slug: string): Promise<Challenge | null> {
        return await prisma.challenge.findUnique({
            where: { slug },
        });
    }
    // tìm challenges theo club_id (UUID now)
    async findByClubId(clubId: string): Promise<Challenge[]> {
        return await prisma.challenge.findMany({
            where: { club_id: clubId },
        });
    }
    // tạo challenge
    async create(data: Prisma.ChallengeCreateInput): Promise<Challenge> {
        return await prisma.challenge.create({
            data,
        });
    }
    // cập nhật challenge (UUID now)
    async update(id: string, data: Prisma.ChallengeUpdateInput): Promise<Challenge | null> {
        return await prisma.challenge.update({
            where: { id },
            data,
        });
    }
    // xóa challenge (UUID now)
    async delete(id: string): Promise<Challenge | null> {
        return await prisma.challenge.delete({
            where: { id },
        });
    }

    // các challenge common (không thuộc club nào)
    async findCommonChallenges(): Promise<Challenge[]> {
        return await prisma.challenge.findMany({
            where: { club_id: null },
        });
    }
}
