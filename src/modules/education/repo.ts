import { prisma } from "@/core/db";
export const EducationRepo = {
  list: () => prisma.educationItem.findMany({ orderBy: { createdAt: "desc" } }),
  byId: (id: number) => prisma.educationItem.findUnique({ where: { id } }),
  bySlug: (slug: string) =>
    prisma.educationItem.findUnique({ where: { slug } }),
};
