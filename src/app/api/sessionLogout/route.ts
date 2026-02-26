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

  return response;
}
