import { UsersService } from "@/services/UserService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: { params: any }
) {
  try {
    const { address } = await params;
    const userChallenges = await UsersService.getUserChallenges(address);

    return NextResponse.json({ ok: true, data: { userChallenges } });
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, msg: message }, { status: 500 });
  }
}