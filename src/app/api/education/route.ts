import { NextResponse } from "next/server";
import { EducationService } from "@/modules/education/service";
export async function GET() {
  return NextResponse.json(await EducationService.list());
}
