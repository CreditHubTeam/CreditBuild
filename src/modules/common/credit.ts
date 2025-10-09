import { prisma } from "@/core/db";
export async function applyCredit(userId: number, delta: number) {
  await prisma.user.update({
    where: { id: userId },
    data: { credit_score: { increment: delta } },
  });
}
