// import { NextResponse } from "next/server";
// import { openApiDoc } from "@/openapi/doc";

// export const dynamic = "force-static";

// export async function GET() {
//   return NextResponse.json(openApiDoc);
// }

// Temporary placeholder to avoid build errors
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    openapi: "3.1.0",
    info: { title: "CreditGame API", version: "1.0.0" },
    message: "API documentation temporarily unavailable"
  });
}

// Ensure this file is treated as a module by TypeScript
export { };

