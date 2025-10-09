import { prisma } from "@/core/db";
import { ContractConfig, Prisma } from "@prisma/client";

// Repository for ContractConfig model
export class contractConfigRepository {
  
    // xem tất cả contract configs
    async findAll(): Promise<ContractConfig[]> {
        return await prisma.contractConfig.findMany();
    }

    // xem chi tiết một contract config
    async findById(id: number): Promise<ContractConfig | null> {
        return await prisma.contractConfig.findUnique({
            where: { id },
        });
    }

    // tạo contract config
    async create(data: Prisma.ContractConfigCreateInput): Promise<ContractConfig> {
        return await prisma.contractConfig.create({
            data,
        });
    }

    // cập nhật contract config
    async update(id: number, data: Prisma.ContractConfigUpdateInput): Promise<ContractConfig | null> {
        return await prisma.contractConfig.update({
            where: { id },
            data,
        });
    }

    // xóa contract config
    async delete(id: number): Promise<ContractConfig | null> {
        return await prisma.contractConfig.delete({
            where: { id },
        });
    }
}
