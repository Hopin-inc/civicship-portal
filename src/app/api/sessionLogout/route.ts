import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logging";

export async function POST(request: NextRequest) {
  const communityId = request.headers.get("x-community-id");

  logger.debug("[sessionLogout] Clearing session cookies", {
    communityId,
    component: "sessionLogout",
  });

  const response = NextResponse.json({ success: true });

  // セッションCookieの削除（path="/" で発行されたCookieを削除）
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
