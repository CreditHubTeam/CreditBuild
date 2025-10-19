import { NextRequest, NextResponse } from "next/server";
// import { ChallengesService } from "@/modules/challenges/service";
import * as z from "zod";

const CompleteChallengeInput = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  challengeId: z.number(),
  amount: z.number().min(0).optional(),
  proof: z.any().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = CompleteChallengeInput.parse(await req.json());

    // const result = await ChallengesService.submit(
    //   body.challengeId,
    //   body.walletAddress as `0x${string}`,
    //   body.amount,
    //   body.proof
    // );

    return NextResponse.json({ ok: true, data: null });
  } catch (error: unknown) {
    const msg =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : "An unexpected error occurred";

    return NextResponse.json({ ok: false, msg }, { status: 400 });
  }
}
