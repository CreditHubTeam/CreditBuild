import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const SubmitChallengeInput = z.object({
    walletAddress: z.string().length(42),
    signature: z.string().optional(),
    proof: z.object({}).optional(),
});
export async function POST(req: NextRequest, { params }: { params: { id: string, challengeId: string } }) {
    const { id, challengeId } = await params;
    const body = SubmitChallengeInput.parse(await req.json());
    // Handle the request and return a response
    return NextResponse.json({ ok: true, data: { id, challengeId, ...body } });
}