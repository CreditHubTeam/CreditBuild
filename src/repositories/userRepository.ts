import { prisma } from "@/core/db";
import { Prisma, User } from "@prisma/client";

// Repository for User model
export class userRepository {
  // ...implement methods here

  // xem tất cả user
  async getAll(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  // xem chi tiết một user
  async getById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // tạo user
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  // cập nhật user
  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // xóa user
  async delete(id: number): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
