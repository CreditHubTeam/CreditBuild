import { prisma } from "@/core/db";
import { Prisma, UserChallenge } from "@prisma/client";

// Repository for UserChallenge model
export class userChallengeRepository {
  // ...implement methods here

  // xem tất cả user challenges
  async getAll(): Promise<UserChallenge[]> {
    return await prisma.userChallenge.findMany();
  }

  // xem chi tiết một user challenge
  async getById(id: number): Promise<UserChallenge | null> {
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

  // cập nhật user challenge
  async update(id: number, data: Prisma.UserChallengeUpdateInput): Promise<UserChallenge> {
    return await prisma.userChallenge.update({
      where: { id },
      data,
    });
  }

  // xóa user challenge
  async delete(id: number): Promise<UserChallenge> {
    return await prisma.userChallenge.delete({
      where: { id },
    });
  }

  // getUserChallengesByUserId
  async getByUserId(userId: number): Promise<UserChallenge[]> {
    return await prisma.userChallenge.findMany({
      where: { userId },
    });
  }
}
