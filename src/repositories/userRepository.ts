import { prisma } from "@/core/db";
import { Prisma, User } from "@prisma/client";

// Repository for User model
export class userRepository {
  // ...implement methods here

  // xem tất cả user
  async getAll(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  // xem chi tiết một user (UUID now)
  async getById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  //xem chi tiet bang wallet_address
  async getByWalletAddress(walletAddress: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { wallet_address: walletAddress },
    });
  }

  // tạo user
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data,
    });
  }

  // cập nhật user (UUID now)
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  // xóa user (UUID now)
  async delete(id: string): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  // kiem tra ton tai voi wallet_address
  async isExistByWalletAddress(walletAddress: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { wallet_address: walletAddress },
    });
    if(user){
      return true;
    }
    else{
      return false;
    }
  }
}
