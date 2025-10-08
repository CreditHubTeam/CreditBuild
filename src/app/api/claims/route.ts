import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/core/db";
import { AchievementsService } from "@/modules/achievements/service";
import { z } from "zod";

const ClaimSchema = z.object({
  userAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  challengeId: z.number().int().positive(),
  proof: z.object({}).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const { userAddress, challengeId, proof } = ClaimSchema.parse(json);

    // Get user
    const user = await prisma.user.findUnique({
      where: { walletAddress: userAddress },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, msg: "User not found" },
        { status: 404 }
      );
    }

    // Get challenge
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json(
        { ok: false, msg: "Challenge not found" },
        { status: 404 }
      );
    }

    // Check if already claimed
    const existingClaim = await prisma.userChallenge.findFirst({
      where: {
        userId: user.id,
        challengeId: challengeId,
      },
    });

    if (existingClaim) {
      return NextResponse.json(
        { ok: false, msg: "Challenge already claimed" },
        { status: 400 }
      );
    }

    // Create challenge completion
    const completion = await prisma.userChallenge.create({
      data: {
        userId: user.id,
        challengeId: challengeId,
        proof: proof || {},
        pointsAwarded: challenge.points,
        creditChange: challenge.creditImpact,
        completionKey: `${user.id}-${challengeId}-${Date.now()}`,
        status: "CLAIMED",
      },
    });

    // Update user stats
    await prisma.user.update({
      where: { id: user.id },
      data: {
        totalChallenges: { increment: 1 },
        totalPoints: { increment: BigInt(challenge.points) },
        creditScore: { increment: challenge.creditImpact },
      },
    });

    // Check for achievements
    await AchievementsService.checkAndAward(user.id);

    return NextResponse.json({
      ok: true,
      completion: {
        ...completion,
        challenge: challenge,
      },
    });
  } catch (error) {
    console.error("Error processing claim:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, msg: "Invalid input", errors: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { ok: false, msg: "Internal error" },
      { status: 500 }
    );
  }
}
