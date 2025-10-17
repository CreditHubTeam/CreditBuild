import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const ReviewChallengeInput = z.object({
    walletAddress: z.string().length(42),
    isApproved: z.boolean()
});

export async function POST(req: NextRequest, { params }: { params: { id: string, challengeId: string } }) {
    const { id, challengeId } = await params;
    const body = ReviewChallengeInput.parse(await req.json());

    // Handle the request and return a response
    return NextResponse.json({ ok: true, data: { id, challengeId, ...body } });
}
