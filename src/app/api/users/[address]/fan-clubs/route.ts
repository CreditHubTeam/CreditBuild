import { UsersService } from "@/services/UserService";
import { NextRequest, NextResponse } from "next/server";

// Handle CORS preflight requests
export async function OPTIONS(_req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:3001",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, x-csrf-token",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  try {
    const { address } = await params;

    // Validate wallet address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { ok: false, message: "Invalid wallet address format" },
        { status: 400 }
      );
    }

    // Get user's fan club memberships - temporary return empty array until service method is implemented
    const userFanClubs = await UsersService.getUserFanClubs(address);

    const response = NextResponse.json({ ok: true, data: userFanClubs });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3001"
    );
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-csrf-token"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  } catch (error) {
    console.error("User fan-clubs API error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";

    const response = NextResponse.json({ ok: false, message }, { status: 500 });
    response.headers.set(
      "Access-Control-Allow-Origin",
      "http://localhost:3001"
    );
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-csrf-token"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  }
}
