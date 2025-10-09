import { NextResponse } from "next/server";
import { prisma } from "@/core/db";

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany();
    return NextResponse.json({ ok: true, achievements });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return NextResponse.json(
      { ok: false, msg: "Internal error" },
      { status: 500 }
    );
  }
}
