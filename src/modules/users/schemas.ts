import { z } from "zod";
export const RegisterInput = z
  .object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    username: z.string().min(2).max(64).optional(),
    
  })
  .meta({ id: "RegisterInput" });
