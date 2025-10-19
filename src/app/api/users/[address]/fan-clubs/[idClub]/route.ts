import { UsersService } from "@/services/UserService";
import { NextResponse } from "next/server";

export async function GET(
    req: Request, 
    { params }: { params: Promise<{ address: string; idClub: string }> }
) {
    try{
        const { address, idClub } = await params;
        
        //call service get details
        const fanClubUserDetails = await UsersService.getUserFanClubDetails(address, idClub);

        return NextResponse.json({ ok: true, data: fanClubUserDetails });
    }
    catch (error: unknown) {
        const msg =
            error instanceof Error ? error.message : String(error ?? "Unknown error");
        return NextResponse.json({ ok: false, msg }, { status: 500 });
    }
}