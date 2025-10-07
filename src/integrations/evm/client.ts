// src/integrations/evm/client.ts
import { http, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { env } from "@/core/config";

/**
 * Tạo EVM client cho operator (backend wallet)
 * Dùng để gọi smart contract trên Creditcoin Testnet
 */
export function operatorClient() {
  const account = privateKeyToAccount(
    env.OPERATOR_PRIVATE_KEY as `0x${string}`
  );
  return createWalletClient({
    account,
    chain: {
      id: env.CHAIN_ID,
      name: "Creditcoin Testnet",
      nativeCurrency: { name: "tCTC", symbol: "tCTC", decimals: 18 },
      rpcUrls: { default: { http: [env.RPC_URL] } },
    },
    transport: http(env.RPC_URL),
  });
}

// How to use:

// const client = operatorClient();

// await client.writeContract({
//   address: env.QUEST_ADDRESS as `0x${string}`,
//   abi: questAbi,
//   functionName: "completeQuestForUser",
//   args: [
//     walletAddress,           // người nhận thưởng
//     BigInt(challengeId),     // ID nhiệm vụ
//     BigInt(pointsAwarded),   // điểm thưởng
//     proofHash,               // hash bằng chứng
//   ],
// });
