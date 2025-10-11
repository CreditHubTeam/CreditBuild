import { EducationsService } from "@/services/EducationsService";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const CompleteEducationInput = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  //== nữa thêm proof ở đây nếu cần
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = CompleteEducationInput.parse(await req.json());
    const { id: educationId } = params;

    const educationIdNum = parseInt(educationId, 10);
    if (Number.isNaN(educationIdNum)) {
      throw new Error("Invalid education id");
    }

    const result = await EducationsService.completeEducation(
      body.walletAddress,
      educationIdNum
    );

    return NextResponse.json({ ok: true, data: result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error";

    return NextResponse.json(
      { ok: false, msg: message },
      { status: 400 }
    );
  }
}
