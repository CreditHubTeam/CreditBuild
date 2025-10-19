import { UsersService } from "@/services/UserService";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

//body cua register
const RegisterInput = z
  .object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    signature: z.string().optional(),
    referralCode: z.string().optional(),
  });

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { walletAddress, signature, referralCode } = RegisterInput.parse(json);
  //walletAddress, signature, referralCode

  try {
    const user = await UsersService.register(walletAddress, signature, referralCode);
    return NextResponse.json({ ok: true, data: user });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : typeof err === "string" ? err : JSON.stringify(err);
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
