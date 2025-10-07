import { prisma } from "@/core/db";
import { writeLedger } from "@/modules/common/ledger";
import { applyCredit } from "@/modules/common/credit";
import { validateRules } from "@/modules/common/rules";
import { ChallengesRepo } from "./repo";
import { operatorClient } from "@/integrations/evm/client";
import { questAbi } from "@/integrations/evm/contracts";
import { env } from "@/core/config";
import { keccak256, toHex } from "viem";
import { RuleSet } from "@/modules/common/rules";

//Example
type Proof =
  | { type: "url"; value: string }
  | { type: "tx"; value: `0x${string}` }
  | { type: "answer"; value: string }
  | { type: "file"; value: string };

export const ChallengesService = {
  list: () => ChallengesRepo.list(),

  submit: async (
    challengeId: number,
    walletAddress: `0x${string}`,
    amount?: number,
    proof?: Proof
  ) => {
    const user = await prisma.user.findUnique({ where: { walletAddress } });
    if (!user) throw new Error("User not found");
    const ch = await ChallengesRepo.byId(challengeId);
    if (!ch) throw new Error("Challenge not found");

    const weeklyCount = await ChallengesRepo.weeklyCount(user.id, challengeId);
    const rules = (ch.rules ?? {}) as RuleSet;
    const vr = validateRules(rules, { amount, proof, weeklyCount });
    if (!vr.ok) throw new Error(vr.msg!);

    const pointsAwarded = ch.points;
    const creditChange = ch.creditImpact;

    const attempt = await ChallengesRepo.createAttempt({
      userId: user.id,
      challengeId,
      amount,
      proof,
      status: "APPROVED",
      pointsAwarded,
      creditChange,
    });

    await applyCredit(user.id, creditChange);
    await writeLedger(
      user.id,
      BigInt(pointsAwarded),
      `challenge:${challengeId}`,
      "challenge"
    );

    const proofHash = keccak256(
      toHex(Buffer.from(JSON.stringify({ id: attempt.id, proof })))
    );
    let txHash: `0x${string}` | undefined;

    if (env.MINT_MODE === "backend") {
      const client = operatorClient();
      txHash = await client.writeContract({
        address: env.QUEST_ADDRESS as `0x${string}`,
        abi: questAbi,
        functionName: "completeQuestForUser",
        args: [
          walletAddress,
          BigInt(challengeId),
          BigInt(pointsAwarded),
          proofHash,
        ],
      });
    }

    await ChallengesRepo.updateAttempt(attempt.id, {
      txHash,
      status: env.MINT_MODE === "backend" ? "CLAIMED" : "APPROVED",
    });
    return { attemptId: attempt.id, pointsAwarded, creditChange, txHash };
  },
};
