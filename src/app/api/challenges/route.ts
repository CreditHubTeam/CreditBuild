import { NextResponse } from "next/server";
import { ChallengesService } from "@/modules/challenges/service";
export async function GET() {
  return NextResponse.json(await ChallengesService.list());
}
