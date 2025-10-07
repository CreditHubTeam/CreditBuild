// OPT: (nếu dùng chế độ attestation, trả chữ ký để user tự claim on-chain)

import { NextRequest, NextResponse } from "next/server";
import { env } from "@/core/config";
import { privateKeyToAccount } from "viem/accounts";
import { keccak256, toHex } from "viem";
export async function POST(req: NextRequest) {
  const { to, questId, points, proofHash, deadline } = await req.json();
  const message = keccak256(
    toHex(
      Buffer.from(
        JSON.stringify({
          to,
          questId,
          points,
          proofHash,
          deadline,
          chainId: env.CHAIN_ID,
          contract: env.QUEST_ADDRESS,
        })
      )
    )
  );
  const account = privateKeyToAccount(
    env.OPERATOR_PRIVATE_KEY as `0x${string}`
  );
  const signature = await account.signMessage({ message: { raw: message } });
  return NextResponse.json({ ok: true, signature, message });
}
