import { FanClubsService } from "@/services/FanClubsService";
import { NextResponse } from "next/server";
import { z } from "zod";
//body cua join
const RegisterInput = z
  .object({
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
    fanClubId: z.number(),
  })
  .meta({ id: "RegisterInput" });

export async function POST(req: Request) {
    try{
        const json = await req.json();
        const { walletAddress, fanClubId } = RegisterInput.parse(json);
        //walletAddress, fanClubId
        const data = await FanClubsService.joinFanClub(walletAddress, fanClubId);
        return NextResponse.json({ ok: true, data });
    }
    catch (error: unknown) {
        const msg =
            error instanceof Error ? error.message : String(error ?? "Unknown error");
        return NextResponse.json({ ok: false, msg }, { status: 500 });
    }
}