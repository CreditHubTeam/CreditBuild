import { prisma } from "@/core/db";
import { Challenge, Prisma } from "@prisma/client";

// Repository for Challenge model
export class challengeRepository {
    // xem tất cả challenges
    async findAll(): Promise<Challenge[]> {
        return await prisma.challenge.findMany();
    }
    // xem chi tiết một challenge
    async findById(id: number): Promise<Challenge | null> {
        return await prisma.challenge.findUnique({
            where: { id },
        });
    }
    // tạo challenge
    async create(data: Prisma.ChallengeCreateInput): Promise<Challenge> {
        return await prisma.challenge.create({
            data,
        });
    }
    // cập nhật challenge
    async update(id: number, data: Prisma.ChallengeUpdateInput): Promise<Challenge | null> {
        return await prisma.challenge.update({
            where: { id },
            data,
        });
    }
    // xóa challenge
    async delete(id: number): Promise<Challenge | null> {
        return await prisma.challenge.delete({
            where: { id },
        });
    }
}
