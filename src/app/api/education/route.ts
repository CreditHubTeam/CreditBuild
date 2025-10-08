import { NextResponse } from "next/server";
import { EducationService } from "@/modules/education/service";

export async function GET() {
  try {
    const content = await EducationService.list();
    return NextResponse.json({ ok: true, content });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : String(error ?? "Unknown error");
    return NextResponse.json({ ok: false, msg }, { status: 500 });
  }
}