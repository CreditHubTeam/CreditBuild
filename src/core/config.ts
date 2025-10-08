import { z } from "zod";

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  RPC_URL: z.string().url(),
  CHAIN_ID: z.coerce.number().int(),
  QUEST_ADDRESS: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  OPERATOR_PRIVATE_KEY: z.string().regex(/^0x[a-fA-F0-9]{64}$/),
  MINT_MODE: z.enum(["backend", "attestation"]).default("backend"),
  NODE_ENV: z.string().default("development"),
});

export const env = EnvSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  RPC_URL: process.env.RPC_URL,
  CHAIN_ID: process.env.CHAIN_ID,
  QUEST_ADDRESS: process.env.QUEST_ADDRESS,
  OPERATOR_PRIVATE_KEY: process.env.OPERATOR_PRIVATE_KEY,
  MINT_MODE: process.env.MINT_MODE,
  NODE_ENV: process.env.NODE_ENV,
});
