import { prisma } from "@/core/db";
import { Prisma, UserEducation } from "@prisma/client";

// Repository for UserEducation model (id and userId are UUIDs)
export class userEducationRepository {
  // ...implement methods here

  // xem tất cả user educations
  async getAll(): Promise<UserEducation[]> {
    return await prisma.userEducation.findMany();
  }

  // xem chi tiết một user education (UUID now)
  async getById(id: string): Promise<UserEducation | null> {
    return await prisma.userEducation.findUnique({
      where: { id },
    });
  }
  
  // xem tất cả user education theo userId (UUID now)
  async getByUserId(userId: string): Promise<UserEducation[]> {
    return await prisma.userEducation.findMany({
      where: { userId: userId },
    });
  }
  
  // xem tat ca user education theo userid va educationId (userId is UUID, educationId is Int)
  async getByUserIdAndEducationId(
    userId: string,
    educationId: number
  ): Promise<UserEducation[]> {
    return await prisma.userEducation.findMany({
      where: { userId: userId, educationId: educationId },
    });
  }

  // tạo user education
  async create(data: Prisma.UserEducationCreateInput): Promise<UserEducation> {
    return await prisma.userEducation.create({
      data,
    });
  }

  // cập nhật user education (UUID now)
  async update(
    id: string,
    data: Prisma.UserEducationUpdateInput
  ): Promise<UserEducation> {
    return await prisma.userEducation.update({
      where: { id },
      data,
    });
  }

  // upsert user education
  async upsert(params: {
    where: Prisma.UserEducationWhereUniqueInput;
    update: Prisma.UserEducationUpdateInput;
    create: Prisma.UserEducationCreateInput;
  }): Promise<UserEducation> {
    return await prisma.userEducation.upsert(params);
  }

  // xóa user education (UUID now)
  async delete(id: string): Promise<UserEducation> {
    return await prisma.userEducation.delete({
      where: { id },
    });
  }
  // isExistByUserIdAndEducationId
  async isExistByUserIdAndEducationId(userId: string, educationId: number): Promise<boolean> {
    const userEducation = await prisma.userEducation.findFirst({
      where: {
        userId: userId,
        educationId: educationId,
      },
    });
    return userEducation !== null;
  }
}
