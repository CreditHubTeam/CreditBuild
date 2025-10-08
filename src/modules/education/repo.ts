import { prisma } from "@/core/db";
export const EducationRepo = {
  list: () => prisma.education.findMany({ orderBy: { createdAt: "desc" } }),
  byId: (id: number) => prisma.education.findUnique({ where: { id } }),
};
