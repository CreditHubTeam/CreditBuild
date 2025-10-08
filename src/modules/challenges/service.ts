/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { UsersRepo } from "../users/repo";
import { AchievementsService } from "../achievements/service";

//Example
type Proof =
  | { type: "url"; value: string }
  | { type: "tx"; value: `0x${string}` }
  | { type: "answer"; value: string }
  | { type: "file"; value: string };

export const ChallengesService = {
  list: () => ChallengesRepo.list(),

  // Get daily challenges for user
  getDailyChallenges: async (walletAddress: `0x${string}`) => {
    const user = await UsersRepo.byWallet(walletAddress);
    if (!user) throw new Error("User not found");

    const challenges = await ChallengesRepo.getDailyChallenges(4);

    // Check xem challenge nào đã completed hôm nay
    const challengesWithStatus = await Promise.all(
      challenges.map(async (challenge: any) => {
        const completed = await ChallengesRepo.hasCompletedToday(
          user.id,
          challenge.id
        );
        return {
          ...challenge,
          completedToday: completed,
        };
      })
    );

    return challengesWithStatus;
  },

  // Submit challenge attempt
  submit: async (
    challengeId: number,
    walletAddress: `0x${string}`,
    amount?: number,
    proof?: Proof
  ) => {
    // validate user and challenge
    const user = await prisma.user.findUnique({ where: { walletAddress } });
    if (!user) throw new Error("User not found");
    const challenge = await ChallengesRepo.byId(challengeId);
    if (!challenge) throw new Error("Challenge not found");

    // Check user completed today
    const hasCompleted = await ChallengesRepo.hasCompletedToday(
      user.id,
      challengeId
    );
    if (hasCompleted) throw new Error("Challenge already completed today");

    // create attempt => auto approved (demo mode)
    const attempt = await ChallengesRepo.createAttempt({
      userId: user.id,
      challengeId,
      amount,
      status: "APPROVED",
    });

    // Update user points và stats
    const newPoints = Number(user.totalPoints) + challenge.points;
    const newCreditScore = user.creditScore + challenge.creditImpact;
    const newTotalChallenges = user.totalChallenges + 1;

    // Check xem đây có phải challenge đầu tiên trong ngày không (để update streak)
    const completedToday = await ChallengesRepo.getDailyCompletedCount(user.id);
    const shouldUpdateStreak = completedToday === 1; // Challenge đầu tiên trong ngày

    await UsersRepo.update(user.id, {
      totalPoints: BigInt(newPoints),
      creditScore: newCreditScore,
      totalChallenges: newTotalChallenges,
      streakDays: shouldUpdateStreak ? user.streakDays + 1 : user.streakDays,
    });

    // Check achievements
    await AchievementsService.checkAndAward(user.id);

    return {
      success: true,
      pointsEarned: challenge.points,
      creditChange: challenge.creditImpact,
      newTotalPoints: newPoints,
      newCreditScore: newCreditScore,
      streakUpdated: shouldUpdateStreak,
    };
  },

  // submit: async (
  //   challengeId: number,
  //   walletAddress: `0x${string}`,
  //   amount?: number,
  //   proof?: Proof
  // ) => {
  //   const user = await prisma.user.findUnique({ where: { walletAddress } });
  //   if (!user) throw new Error("User not found");
  //   const ch = await ChallengesRepo.byId(challengeId);
  //   if (!ch) throw new Error("Challenge not found");

  //   const weeklyCount = await ChallengesRepo.weeklyCount(user.id, challengeId);
  //   const rules = (ch.rules ?? {}) as RuleSet;
  //   const vr = validateRules(rules, { amount, proof, weeklyCount });
  //   if (!vr.ok) throw new Error(vr.msg!);

  //   const pointsAwarded = ch.points;
  //   const creditChange = ch.creditImpact;

  //   const attempt = await ChallengesRepo.createAttempt({
  //     userId: user.id,
  //     challengeId,
  //     amount,
  //     proof,
  //     status: "APPROVED",
  //     pointsAwarded,
  //     creditChange,
  //   });

  //   await applyCredit(user.id, creditChange);
  //   await writeLedger(
  //     user.id,
  //     BigInt(pointsAwarded),
  //     `challenge:${challengeId}`,
  //     "challenge"
  //   );

  //   const proofHash = keccak256(
  //     toHex(Buffer.from(JSON.stringify({ id: attempt.id, proof })))
  //   );
  //   let txHash: `0x${string}` | undefined;

  //   if (env.MINT_MODE === "backend") {
  //     const client = operatorClient();
  //     txHash = await client.writeContract({
  //       address: env.QUEST_ADDRESS as `0x${string}`,
  //       abi: questAbi,
  //       functionName: "completeQuestForUser",
  //       args: [
  //         walletAddress,
  //         BigInt(challengeId),
  //         BigInt(pointsAwarded),
  //         proofHash,
  //       ],
  //     });
  //   }

  //   await ChallengesRepo.updateAttempt(attempt.id, {
  //     txHash,
  //     status: env.MINT_MODE === "backend" ? "CLAIMED" : "APPROVED",
  //   });
  //   return { attemptId: attempt.id, pointsAwarded, creditChange, txHash };
  // },
};
