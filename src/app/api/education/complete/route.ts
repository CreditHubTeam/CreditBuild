import { NextRequest, NextResponse } from "next/server";
import { EducationService } from "@/modules/education/service";
import * as z from "zod";

const CompleteEducationInput = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  educationId: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const body = CompleteEducationInput.parse(await req.json());

    const result = await EducationService.completeEducation(
      body.walletAddress,
      body.educationId
    );

    return NextResponse.json({ ok: true, ...result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error";

    return NextResponse.json(
      { ok: false, msg: message },
      { status: 400 }
    );
  }
}
