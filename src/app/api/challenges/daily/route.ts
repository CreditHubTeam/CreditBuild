import { NextRequest, NextResponse } from "next/server";
import { ChallengesService } from "@/modules/challenges/service";

export async function GET(req: NextRequest) {
  try {
    const walletAddress = req.nextUrl.searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { ok: false, msg: "walletAddress is required" },
        { status: 400 }
      );
    }

    const challenges = await ChallengesService.getDailyChallenges(
      walletAddress as `0x${string}`
    );
    return NextResponse.json({ ok: true, challenges });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : String(error);

    return NextResponse.json(
      { ok: false, msg },
      { status: 500 }
    );
  }
}
