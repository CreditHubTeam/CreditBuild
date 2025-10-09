import { prisma } from "@/core/db";
import { KolEarning, Prisma } from "@prisma/client";

// Repository for KolEarning model
export class kolEarningRepository {
  // ...implement methods here

  // xem tất cả kol earnings
  async findAll(): Promise<KolEarning[]> {
    return await prisma.kolEarning.findMany();
  }

  // xem chi tiết một kol earning
  async findById(id: number): Promise<KolEarning | null> {
    return await prisma.kolEarning.findUnique({
      where: { id },
    });
  }

  // tạo kol earning
  async create(data: Prisma.KolEarningCreateInput): Promise<KolEarning> {
    return await prisma.kolEarning.create({
      data,
    });
  }

  // cập nhật kol earning
  async update(id: number, data: Prisma.KolEarningUpdateInput): Promise<KolEarning> {
    return await prisma.kolEarning.update({
      where: { id },
      data,
    });
  }

  // xóa kol earning
  async delete(id: number): Promise<KolEarning> {
    return await prisma.kolEarning.delete({
      where: { id },
    });
  }
}
