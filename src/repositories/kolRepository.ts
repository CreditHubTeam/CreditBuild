import { prisma } from "@/core/db";
import { Kol, Prisma } from "@prisma/client";
// Repository for Kol model
export class kolRepository {
  // Method to find all KOLs
  async findAll(): Promise<Kol[]> {
    return prisma.kol.findMany();
  }
  // Method to find a KOL by ID
  async findById(id: number): Promise<Kol | null> {
    return prisma.kol.findUnique({
      where: { id },
    });
  }
  // Method to create a new KOL
  async create(data: Prisma.KolCreateInput): Promise<Kol> {
    return prisma.kol.create({
      data,
    });
  }
  // Method to update an existing KOL
  async update(id: number, data: Prisma.KolUpdateInput): Promise<Kol> {
    return prisma.kol.update({
      where: { id },
      data,
    });
  }
  // Method to delete a KOL
  async delete(id: number): Promise<Kol> {
    return prisma.kol.delete({
      where: { id },
    });
  }
  
}
