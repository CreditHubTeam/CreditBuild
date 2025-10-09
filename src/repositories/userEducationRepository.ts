import { prisma } from "@/core/db";
import { Prisma, UserEducation } from "@prisma/client";

// Repository for UserEducation model
export class userEducationRepository {
  // ...implement methods here

  // xem tất cả user educations
  async getAll(): Promise<UserEducation[]> {
    return await prisma.userEducation.findMany();
  }

  // xem chi tiết một user education
  async getById(id: number): Promise<UserEducation | null> {
    return await prisma.userEducation.findUnique({
      where: { id },
    });
  }

  // tạo user education
  async create(data: Prisma.UserEducationCreateInput): Promise<UserEducation> {
    return await prisma.userEducation.create({
      data,
    });
  }

  // cập nhật user education
  async update(id: number, data: Prisma.UserEducationUpdateInput): Promise<UserEducation> {
    return await prisma.userEducation.update({
      where: { id },
      data,
    });
  }

  // xóa user education
  async delete(id: number): Promise<UserEducation> {
    return await prisma.userEducation.delete({
      where: { id },
    });
  }
}
