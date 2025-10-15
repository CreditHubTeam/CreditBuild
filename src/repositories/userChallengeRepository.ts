import { prisma } from "@/core/db";
import { Prisma, UserChallenge } from "@prisma/client";

// Repository for UserChallenge model (now with UUID)
export class userChallengeRepository {
  // ...implement methods here

  // xem tất cả user challenges
  async getAll(): Promise<UserChallenge[]> {
    return await prisma.userChallenge.findMany();
  }

  // xem chi tiết một user challenge (UUID now)
  async getById(id: string): Promise<UserChallenge | null> {
    return await prisma.userChallenge.findUnique({
      where: { id },
    });
  }

  // tạo user challenge
  async create(data: Prisma.UserChallengeCreateInput): Promise<UserChallenge> {
    return await prisma.userChallenge.create({
      data,
    });
  }

  // cập nhật user challenge (UUID now)
  async update(id: string, data: Prisma.UserChallengeUpdateInput): Promise<UserChallenge> {
    return await prisma.userChallenge.update({
      where: { id },
      data,
    });
  }

  // xóa user challenge (UUID now)
  async delete(id: string): Promise<UserChallenge> {
    return await prisma.userChallenge.delete({
      where: { id },
    });
  }

  // getUserChallengesByUserId (UUID now)
  async getByUserId(userId: string): Promise<UserChallenge[]> {
    return await prisma.userChallenge.findMany({
      where: { user_id: userId },
    });
  }
  
  // getByUserIdAndChallengeId (UUID now)
  async getByUserIdAndChallengeId(userId: string, challengeId: string): Promise<UserChallenge | null> {
    return await prisma.userChallenge.findFirst({
      where: { 
        user_id: userId, 
        challenge_id: challengeId 
      },
    });
  }
  
  // getByChallengeId (UUID now)
  async getByChallengeId(challengeId: string): Promise<UserChallenge[]> {
    return await prisma.userChallenge.findMany({
      where: { challenge_id: challengeId },
    });
  }
  
  // getByStatus - lọc theo status
  async getByStatus(status: string): Promise<UserChallenge[]> {
    return await prisma.userChallenge.findMany({
      where: { status },
    });
  }
}
