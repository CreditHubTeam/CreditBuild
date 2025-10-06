import { NextResponse } from "next/server";
import { openApiDoc } from "@/openapi/doc";

export const dynamic = "force-static";
export async function GET() {
  return NextResponse.json(openApiDoc);
}
