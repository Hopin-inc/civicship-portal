import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear session cookies
  response.cookies.set("session", "", {
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set("__session", "", {
    expires: new Date(0),
    path: "/",
  });
  // Clear LINE idToken cookies set by /api/auth/exchange
  response.cookies.set("auth_line_id_token", "", {
    expires: new Date(0),
    path: "/",
  });
  response.cookies.set("auth_line_token_expires_at", "", {
    expires: new Date(0),
    path: "/",
  });

  return response;
}
