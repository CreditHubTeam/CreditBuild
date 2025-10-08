// detail by id or slug
import { NextResponse } from "next/server";
import { EducationService } from "@/modules/education/service";
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const item = await EducationService.get(id);
  if (!item)
    return NextResponse.json({ ok: false, msg: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}
