import { FanClubsService } from "@/services/FanClubsService";
import { NextResponse } from "next/server";
import * as z from "zod";

export async function GET(
    req: Request, 
    { params }: { params: Promise<{ id: string }> }
) {
    try{
        const { id: fanClubId } = await params;

        return NextResponse.json({ ok: true, data: {} } );
    }
    catch (error: unknown) {
        const msg =
            error instanceof Error ? error.message : String(error ?? "Unknown error");
        return NextResponse.json({ ok: false, msg }, { status: 500 });
    }
}

const ChallengeInputSchema = z.object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    icon: z.string().optional(),
    title: z.string().min(1),
    description: z.string().min(1).optional(),
    category: z.string().min(1),
    points: z.number().int(),
    creditImpact: z.number(),
    estimatedTimeMinutes: z.number().int().positive().optional(),
    typeProof: z.string().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try{
        const body = ChallengeInputSchema.parse(await req.json());
        const { id: fanClubId } = await params;
        const newChallenge = await FanClubsService.createChallange(fanClubId, body);

        return NextResponse.json({ ok: true, 
            data: newChallenge});
    }
    catch (error: unknown) {
        const msg =
            error instanceof Error ? error.message : String(error ?? "Unknown error");
        return NextResponse.json({ ok: false, msg }, { status: 500 });
    }
}