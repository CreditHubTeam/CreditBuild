import { prisma } from "@/core/db";
import { Education } from "@prisma/client";

// Repository for Education model
export class educationRepository {

    // xem tất cả educations
    async findAll(): Promise<Education[]> {
        return await prisma.education.findMany();
    }
    // xem chi tiết một education
    async findById(id: number): Promise<Education | null> {
        return await prisma.education.findUnique({
            where: { id },
        });
    }
    // tạo education
    async create(data: Education): Promise<Education> {
        return await prisma.education.create({
            data,
        });
    }
    // cập nhật education
    async update(id: number, data: Partial<Education>): Promise<Education | null> {
        return await prisma.education.update({
            where: { id },
            data,
        });
    }
    // xóa education
    async delete(id: number): Promise<Education | null> {
        return await prisma.education.delete({
            where: { id },
        });
    }
}
