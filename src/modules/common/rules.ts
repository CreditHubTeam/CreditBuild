import { z } from "zod";

export const RuleSet = z.object({
  cooldown: z
    .object({ unit: z.enum(["hour", "day", "week"]), value: z.number().int() })
    .optional(),
  minAmount: z.number().optional(),
  requiresProof: z.boolean().optional(),
  allowedProofTypes: z.array(z.string()).optional(),
  maxClaimsPerWeek: z.number().int().optional(),
});
export type RuleSet = z.infer<typeof RuleSet>;

//Example
type Proof =
  | { type: "url"; value: string }
  | { type: "tx"; value: `0x${string}` }
  | { type: "answer"; value: string }
  | { type: "file"; value: string };

export function validateRules(
  rules: RuleSet,
  input: { amount?: number; proof?: Proof; weeklyCount: number }
) {
  if (rules.minAmount && (input.amount ?? 0) < rules.minAmount)
    return { ok: false, msg: `Amount must be >= ${rules.minAmount}` };
  if (rules.requiresProof && !input.proof)
    return { ok: false, msg: "Proof is required" };
  if (
    rules.allowedProofTypes &&
    input.proof?.type &&
    !rules.allowedProofTypes.includes(input.proof.type)
  )
    return { ok: false, msg: "Invalid proof type" };
  if (rules.maxClaimsPerWeek && input.weeklyCount >= rules.maxClaimsPerWeek)
    return { ok: false, msg: "Weekly limit reached" };
  return { ok: true };
}
