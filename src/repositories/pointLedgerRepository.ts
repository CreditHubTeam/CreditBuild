import { prisma } from "@/core/db";
import { PointLedger, Prisma } from "@prisma/client";

// Repository for PointLedger model (now with UUID and updated schema)
export class pointLedgerRepository {
  // ...implement methods here

  // xem tất cả point ledgers
  async findAll(): Promise<PointLedger[]> {
    return await prisma.pointLedger.findMany();
  }

  // xem chi tiết một point ledger (UUID now)
  async findById(id: string): Promise<PointLedger | null> {
    return await prisma.pointLedger.findUnique({
      where: { id },
    });
  }

  // lấy point ledgers của user (UUID now)
  async findByUserId(userId: string): Promise<PointLedger[]> {
    return await prisma.pointLedger.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  // lấy point ledgers theo category
  async findByCategory(category: string): Promise<PointLedger[]> {
    return await prisma.pointLedger.findMany({
      where: { category },
      orderBy: { created_at: 'desc' },
    });
  }

  // lấy point ledgers của user theo category (UUID now)
  async findByUserIdAndCategory(userId: string, category: string): Promise<PointLedger[]> {
    return await prisma.pointLedger.findMany({
      where: { 
        user_id: userId,
        category 
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // tạo point ledger entry (immutable)
  async create(data: Prisma.PointLedgerCreateInput): Promise<PointLedger> {
    return await prisma.pointLedger.create({
      data,
    });
  }

  // Note: Point ledger is immutable, so no update/delete methods
  // Chỉ tạo mới, không update hay delete
}
