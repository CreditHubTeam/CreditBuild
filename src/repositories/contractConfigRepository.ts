import { prisma } from "@/core/db";
import { ContractConfig, Prisma } from "@prisma/client";

// Repository for ContractConfig model (now with UUID and simplified structure)
export class contractConfigRepository {
  
    // xem tất cả contract configs
    async findAll(): Promise<ContractConfig[]> {
        return await prisma.contractConfig.findMany();
    }

    // xem chi tiết một contract config (UUID now)
    async findById(id: string): Promise<ContractConfig | null> {
        return await prisma.contractConfig.findUnique({
            where: { id },
        });
    }

    // tìm contract config theo chain
    async findByChain(chain: string): Promise<ContractConfig[]> {
        return await prisma.contractConfig.findMany({
            where: { chain },
        });
    }

    // tìm contract config theo chain và name
    async findByChainAndName(chain: string, name: string): Promise<ContractConfig | null> {
        return await prisma.contractConfig.findFirst({
            where: { 
                chain,
                name 
            },
        });
    }

    // tạo contract config
    async create(data: Prisma.ContractConfigCreateInput): Promise<ContractConfig> {
        return await prisma.contractConfig.create({
            data,
        });
    }

    // cập nhật contract config (UUID now)
    async update(id: string, data: Prisma.ContractConfigUpdateInput): Promise<ContractConfig | null> {
        return await prisma.contractConfig.update({
            where: { id },
            data,
        });
    }

    // xóa contract config (UUID now)
    async delete(id: string): Promise<ContractConfig | null> {
        return await prisma.contractConfig.delete({
            where: { id },
        });
    }
}
