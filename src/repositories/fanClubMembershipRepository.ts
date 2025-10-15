import { prisma } from "@/core/db";
import { FanClubMembership, Prisma } from "@prisma/client";

// Repository for FanClubMembership model (now mapped to 'club_members' table with UUID)
export class fanClubMembershipRepository {
    // ...implement methods here
    // xem tất cả fan club memberships
    async findAll(): Promise<FanClubMembership[]> {
        return await prisma.fanClubMembership.findMany();
    }
    // findAllByUserId (UUID now)
    async findAllByUserId(userId: string): Promise<FanClubMembership[]> {
        return await prisma.fanClubMembership.findMany({
            where: { user_id: userId },
        });
    }
    // xem chi tiết một fan club membership (UUID now)
    async findById(id: string): Promise<FanClubMembership | null> {
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
    // cập nhật fan club membership (UUID now)
    async update(id: string, data: Prisma.FanClubMembershipUpdateInput): Promise<FanClubMembership | null> {
        return await prisma.fanClubMembership.update({
            where: { id },
            data,
        });
    }
    // xóa fan club membership (UUID now)
    async delete(id: string): Promise<FanClubMembership | null> {
        return await prisma.fanClubMembership.delete({
            where: { id },
        });
    }   

    // isUserInClub (UUID now)
    async isUserInClub(userId: string, clubId: string): Promise<boolean> {
        const membership = await prisma.fanClubMembership.findFirst({
            where: {
                user_id: userId,
                club_id: clubId,
            },
        });
        return membership !== null;
    }
    
    // findByUserAndClub (UUID now)
    async findByUserAndClub(userId: string, clubId: string): Promise<FanClubMembership | null> {
        return await prisma.fanClubMembership.findUnique({
            where: {
                club_id_user_id: {
                    club_id: clubId,
                    user_id: userId,
                },
            },
        });
    }
}
