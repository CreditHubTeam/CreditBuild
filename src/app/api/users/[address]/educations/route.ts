import { UsersService } from "@/services/UserService";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { address: string } }) {
    try {
        const { address } = await params;

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") as "no_enrollment" | "in_progress" | "completed";

        const userEducations = await UsersService.getUserEducation(address, status);

        return NextResponse.json({ ok: true, data: { userEducations } });
    } catch (error: unknown) {
        const msg =
            error instanceof Error ? error.message : String(error ?? "Unknown error");
        return NextResponse.json({ ok: false, msg }, { status: 500 });
    }
}