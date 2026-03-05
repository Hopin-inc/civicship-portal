import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Clear legacy session cookies
  response.cookies.set("session", "", {
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set("__session", "", {
    expires: new Date(0),
    path: "/",
  });

  // Clear community-scoped session cookie (__session_{communityId})
  const communityId =
    request.headers.get("x-community-id") ||
    request.cookies.get("x-community-id")?.value;
  if (communityId) {
    response.cookies.set(`__session_${communityId}`, "", {
      expires: new Date(0),
      path: "/",
    });
  }

  return response;
}
