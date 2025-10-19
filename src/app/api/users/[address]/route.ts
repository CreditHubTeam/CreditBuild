import { UsersService } from "@/services/UserService";
import { NextResponse } from "next/server";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  try{
    const { address } = await params;
    const getUserPro = await UsersService.getUserProfile(address);

    if (!getUserPro)
      return NextResponse.json({
        ok: false,
        data: { msg: "Not found" }
      }, { status: 404 });
    return NextResponse.json({ ok: true, data: getUserPro });


  } catch (error: unknown) {
    return NextResponse.json({ ok: false, data: (error as Error).message }, { status: 500 });
  }
}
