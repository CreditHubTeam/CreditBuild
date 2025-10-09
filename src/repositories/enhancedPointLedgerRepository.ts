import { prisma } from "@/core/db";
import { EnhancedPointLedger, Prisma } from "@prisma/client";

// Repository for EnhancedPointLedger model
export class enhancedPointLedgerRepository {
    // xem tất cả enhanced point ledgers
    async findAll(): Promise<EnhancedPointLedger[]> {
        return await prisma.enhancedPointLedger.findMany();
    }

    // xem chi tiết một enhanced point ledger
    async findById(id: number): Promise<EnhancedPointLedger | null> {
        return await prisma.enhancedPointLedger.findUnique({
            where: { id },
        });
    }

    // tạo enhanced point ledger
    async create(data: Prisma.EnhancedPointLedgerCreateInput): Promise<EnhancedPointLedger> {
        return await prisma.enhancedPointLedger.create({
            data,
        });
    }

    // cập nhật enhanced point ledger
    async update(id: number, data: Prisma.EnhancedPointLedgerUpdateInput): Promise<EnhancedPointLedger | null> {
        return await prisma.enhancedPointLedger.update({
            where: { id },
            data,
        });
    }

    // xóa enhanced point ledger
    async delete(id: number): Promise<EnhancedPointLedger | null> {
        return await prisma.enhancedPointLedger.delete({
            where: { id },
        });
    }
}
