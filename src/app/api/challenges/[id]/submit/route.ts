// No action: => Refactor =>src\app\api\challenges\complete\route.ts

// import { NextRequest, NextResponse } from "next/server";
// import { SubmitAttemptInput } from "@/modules/challenges/schemas";
// import { ChallengesService } from "@/modules/challenges/service";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;
//   const body = SubmitAttemptInput.parse(await req.json());
//   const res = await ChallengesService.submit(
//     Number(id),
//     body.walletAddress as `0x${string}`,
//     body.amount,
//     body.proof
//   );
//   return NextResponse.json({ ok: true, ...res });
// }
