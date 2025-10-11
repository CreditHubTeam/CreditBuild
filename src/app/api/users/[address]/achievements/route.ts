import { UsersService } from "@/services/UserService";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const { address } = await params;
    const top = searchParams.get("top");
    // Lấy danh sách thành tựu của người dùng từ service
    const achievements = await UsersService.getUserAchievements(address, top ? parseInt(top) : undefined);

    return NextResponse.json({ ok: true, data: achievements });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, msg: message }, { status: 500 });
  }
}
