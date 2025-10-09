import { prisma } from "@/core/db";
import { Prisma, SocialTask } from "@prisma/client";

// Repository for SocialTask model
export class socialTaskRepository {
  // ...implement methods here
  // xem tất cả social tasks
  async findAll(): Promise<SocialTask[]> {
    return await prisma.socialTask.findMany();
  }

  // xem chi tiết một social task
  async findById(id: number): Promise<SocialTask | null> {
    return await prisma.socialTask.findUnique({
      where: { id },
    });
  }

  // tạo social task
  async create(data: Prisma.SocialTaskCreateInput): Promise<SocialTask> {
    return await prisma.socialTask.create({
      data,
    });
  }

  // cập nhật social task
  async update(id: number, data: Prisma.SocialTaskUpdateInput): Promise<SocialTask> {
    return await prisma.socialTask.update({
      where: { id },
      data,
    });
  }

  // xóa social task
  async delete(id: number): Promise<SocialTask> {
    return await prisma.socialTask.delete({
      where: { id },
    });
  }
}
