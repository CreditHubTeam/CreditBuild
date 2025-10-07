import { NextRequest, NextResponse } from "next/server";
import { RegisterInput } from "@/modules/users/schemas";
import { UsersService } from "@/modules/users/service";

export async function POST(req: NextRequest) {
  const json = await req.json();
  const { walletAddress, username } = RegisterInput.parse(json);
  const user = await UsersService.register(walletAddress, username);
  return NextResponse.json({ ok: true, user });
}
