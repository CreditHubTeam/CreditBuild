import { FanClubsService } from "@/services/FanClubsService";
import { NextResponse } from "next/server";

    
export async function GET(req: Request) {
    try{
        const allFanClubs = await FanClubsService.getAllFanClubs(); 
        return NextResponse.json({ ok: true, data: {allFanClubs} });
    }
    catch (error: unknown) {
        const msg =
            error instanceof Error ? error.message : String(error ?? "Unknown error");
        return NextResponse.json({ ok: false, msg }, { status: 500 });
    }
}