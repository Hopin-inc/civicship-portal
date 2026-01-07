import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging";

export async function POST(request: NextRequest) {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT!;
    const apiBase = apiEndpoint.replace(/\/graphql\/?$/, "");

    // Forward the logout request to the backend API
    const res = await fetch(`${apiBase}/sessionLogout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    // Create response and clear session cookies on the frontend side as well
    const response = new NextResponse(
      JSON.stringify({ success: true }),
      { status: 200 }
    );

    // Clear session cookies by setting them to expire immediately
    // This handles both "session" and "__session" cookie names
    const cookieOptions = "Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    response.headers.append("Set-Cookie", `session=; ${cookieOptions}`);
    response.headers.append("Set-Cookie", `__session=; ${cookieOptions}`);

    // Forward any Set-Cookie headers from the backend (which may also clear cookies)
    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      response.headers.append("Set-Cookie", setCookie);
    }

    return response;
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Session logout failed:", { message: error.message, stack: error.stack });
    } else {
      logger.error("Session logout failed:", { error });
    }
    
    // Even if backend call fails, still clear frontend cookies
    const response = new NextResponse(
      JSON.stringify({ success: true, warning: "Backend logout may have failed" }),
      { status: 200 }
    );
    
    const cookieOptions = "Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    response.headers.append("Set-Cookie", `session=; ${cookieOptions}`);
    response.headers.append("Set-Cookie", `__session=; ${cookieOptions}`);
    
    return response;
  }
}
