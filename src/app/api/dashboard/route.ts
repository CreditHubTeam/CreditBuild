import { NextRequest, NextResponse } from "next/server";
// import { DashboardService } from "@/modules/dashboard/service";
export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get("address");
  if (!address)
    return NextResponse.json(
      { ok: false, msg: "address required" },
      { status: 400 }
    );
    // const data = await DashboardService.overview(address);
    // if (!data)
    //   return NextResponse.json(
    //     { ok: false, msg: "user not found" },
    //     { status: 404 }
    //   );
  return NextResponse.json({ ok: true, data: [] });
}
