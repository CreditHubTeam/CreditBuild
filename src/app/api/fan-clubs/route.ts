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
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    name: z.string().min(1),
    slug: z.string().optional(),
    description: z.string().min(1),
    membershipFee: z.number().min(0),
    maxMembers: z.number().int().positive(),
    image: z.string().url().optional(),
    contractAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
    metadata: z.object({
            twitter: z.string().optional(),
            instagram: z.string().optional(),
            youtube: z.string().optional(),
    }).optional(),
});
export async function POST(req: Request) {

    try {
        const body = FanClubInputSchema.parse(await req.json());

        return NextResponse.json({ ok: true, data: body }, { status: 201 });
    } catch (error: unknown) {
        const msg =
            error instanceof Error ? error.message : String(error ?? "Unknown error");
        return NextResponse.json({ ok: false, msg }, { status: 500 });
    }
}