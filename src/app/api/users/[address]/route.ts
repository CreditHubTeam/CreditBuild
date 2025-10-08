import { NextResponse } from "next/server";
import { UsersService } from "@/modules/users/service";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  const data = await UsersService.profileByAddr(address);
  if (!data)
    return NextResponse.json({ ok: false, msg: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, ...data });
}
