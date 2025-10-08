import { prisma } from "@/core/db";

export async function writeLedger(userId: number, delta: bigint, reason: string, source: string, txHash?: string) {
  await prisma.pointLedger.create({ data: { userId, delta, reason, source, txHash } });
  await prisma.user.update({ where: { id: userId }, data: { totalPoints: { increment: Number(delta) } } });
}
