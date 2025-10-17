import { FanClubsService } from "@/services/FanClubsService";
import { NextResponse } from "next/server";
import * as z from "zod";
    
export async function GET(req: Request) {
    try{
        const allFanClubs = await FanClubsService.getAllFanClubs(); 
        return NextResponse.json({ ok: true, data: allFanClubs });
    }
    catch (error: unknown) {
        const msg =
            error instanceof Error ? error.message : String(error ?? "Unknown error");
        return NextResponse.json({ ok: false, msg }, { status: 500 });
    }
}

const FanClubInputSchema = z.object({
    walletAddress: z.string(),
    name: z.string(),
    description: z.string(),
    membershipType: z.enum(["open", "invite_only"]).optional(),
    tags: z.array(z.string()).optional(),
    logoFile: z.instanceof(File).nullable().optional(),
});
export async function POST(req: Request) {

    try {
        const body = FanClubInputSchema.parse(await req.json());
        const newFanClub = await FanClubsService.createFanClub(
            body.walletAddress,
            body.name,
            body.description,
            body.membershipType!,
            body.tags!,
            body.logoFile!
        );

        return NextResponse.json({ ok: true, data: newFanClub }, { status: 201 });
    } catch (error: unknown) {
        const msg =
            error instanceof Error ? error.message : String(error ?? "Unknown error");
        return NextResponse.json({ ok: false, msg }, { status: 500 });
    }
}