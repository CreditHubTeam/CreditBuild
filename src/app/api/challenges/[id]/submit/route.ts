import { ChallengesService } from "@/services/ChallengesService";
import { NextResponse } from "next/server";
import { z } from "zod";

// Proof schema - flexible to accept both string and number for value
const ProofUrl = z.object({
  type: z.literal("url"),
  value: z.union([z.string().url(), z.number().transform(String)]),
});
const ProofTx = z.object({
  type: z.literal("tx"),
  value: z.union([
    z.string().regex(/^0x[a-fA-F0-9]{64}$/),
    z.number().transform(String),
  ]),
});
const ProofAnswer = z.object({
  type: z.literal("answer"),
  value: z.union([z.string(), z.number().transform(String)]),
});
const ProofFile = z.object({
  type: z.literal("file"),
  value: z.union([z.string(), z.number().transform(String)]),
});
const Proof = z.union([ProofUrl, ProofTx, ProofAnswer, ProofFile]);

const SubmitChallengeInput = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amount: z.number().min(0).optional(),
  proof: Proof.optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // MUST await the parsed JSON body
    const body = await request.json();

    // Validate body
    const parsed = SubmitChallengeInput.parse(body);

    const proof = parsed.proof
      ? parsed.proof.type === "tx"
        ? { ...parsed.proof, value: parsed.proof.value as `0x${string}` }
        : parsed.proof
      : undefined;

    const result = await ChallengesService.submitChallenge(
      parseInt(id, 10),
      parsed.walletAddress as `0x${string}`,
      parsed.amount,
      proof
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, msg: message }, { status: 500 });
  }
}
