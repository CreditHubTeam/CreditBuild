import { NextResponse } from "next/server";

export async function GET() {
  try {


    return NextResponse.json({ ok: true, data: "Education API is working!" });
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : String(error ?? "Unknown error");
    return NextResponse.json({ ok: false, msg }, { status: 500 });
  }
}