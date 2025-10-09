import { prisma } from "@/core/db";
import { FanClubMembership, Prisma } from "@prisma/client";

// Repository for FanClubMembership model
export class fanClubMembershipRepository {
    // ...implement methods here
    // xem tất cả fan club memberships
    async findAll(): Promise<FanClubMembership[]> {
        return await prisma.fanClubMembership.findMany();
    }
    // xem chi tiết một fan club membership
    async findById(id: number): Promise<FanClubMembership | null> {
        return await prisma.fanClubMembership.findUnique({
            where: { id },
        });
    }
    // tạo fan club membership
    async create(data: Prisma.FanClubMembershipCreateInput): Promise<FanClubMembership> {
        return await prisma.fanClubMembership.create({
            data,
        });
    }
    // cập nhật fan club membership
    async update(id: number, data: Prisma.FanClubMembershipUpdateInput): Promise<FanClubMembership | null> {
        return await prisma.fanClubMembership.update({
            where: { id },
            data,
        });
    }
    // xóa fan club membership
    async delete(id: number): Promise<FanClubMembership | null> {
        return await prisma.fanClubMembership.delete({
            where: { id },
        });
    }   
}
