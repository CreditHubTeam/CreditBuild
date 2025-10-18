

import { FanClubsService } from "@/services/FanClubsService";
import { NextRequest, NextResponse } from "next/server";
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const listMemberships = await FanClubsService.getClubMembers(id);
        return NextResponse.json({ ok: true, data: listMemberships });
    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error ?? "Unknown error");
        return NextResponse.json({ ok: false, msg }, { status: 500 });
    }
}
