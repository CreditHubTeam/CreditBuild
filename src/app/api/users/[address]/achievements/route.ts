import { NextResponse } from "next/server";
import { UsersRepo } from "@/modules/users/repo";
import { AchievementsService } from "@/modules/achievements/service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;
    const user = await UsersRepo.byWallet(address);

    if (!user) {
      return NextResponse.json(
        { ok: false, msg: "User not found" },
        { status: 404 }
      );
    }

    const achievements = await AchievementsService.getUserAchievements(user.id);
    return NextResponse.json({ ok: true, achievements });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, msg: message }, { status: 500 });
  }
}
