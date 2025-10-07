import { z } from "zod";
export const SubmitAttemptInput = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  amount: z.number().optional(),
  proof: z.any().optional(),
});
