import { UsersService } from "@/services/UserService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { ok: false, message: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    // Get user's fan club memberships
    const userFanClubs = await UsersService.getUserFanClubs(address);

    return NextResponse.json({ ok: true, data: userFanClubs });
  } catch (error) {
    console.error("User fan-clubs API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
