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
    name: z.string().min(1),
    description: z.string().min(1),
    type: z.enum(["general", "daily", "education", "kol_exclusive", "club"]),
    category: z.string().min(1),
    points: z.number().int().positive(),
    creditImpact: z.number(),
    xp: z.number().int().nonnegative(),
    rule: z.object({}).optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime()
});

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try{
        const body = ChallengeInputSchema.parse(await req.json());
        const { id: fanClubId } = await params;
        return NextResponse.json({ ok: true, 
            data: {}});
    }
    catch (error: unknown) {
        const msg =
            error instanceof Error ? error.message : String(error ?? "Unknown error");
        return NextResponse.json({ ok: false, msg }, { status: 500 });
    }
}